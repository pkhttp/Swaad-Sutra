import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { pool, testDb } from "./db.js";
import { notifyOwner } from "./whatsapp.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",").map(s => s.trim()) || "http://localhost:5173"
}));
app.use(express.json({ limit: "100kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 250, standardHeaders: "draft-7", legacyHeaders: false }));

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

const money = value => Number(value || 0);
const clean = value => String(value ?? "").trim();
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));

app.get("/api/health", async (_req, res) => {
  try {
    await testDb();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check DB error:", error.code || error.message);
    res.status(503).json({ status: "degraded", database: "unavailable" });
  }
});

app.get("/api/config/payment", (_req, res) => {
  res.json({ razorpayEnabled: Boolean(razorpay), razorpayKeyId: razorpay ? process.env.RAZORPAY_KEY_ID : null });
});

app.get("/api/products", async (req, res) => {
  try {
    const { category, q, sort } = req.query;
    const clauses = ["is_active = 1"];
    const params = [];
    if (category && category !== "All") { clauses.push("category = ?"); params.push(clean(category)); }
    if (q) { clauses.push("(name LIKE ? OR description LIKE ? OR category LIKE ?)"); const term = `%${clean(q)}%`; params.push(term, term, term); }
    const orderBy = sort === "price-low" ? "price ASC" : sort === "price-high" ? "price DESC" : sort === "popular" ? "is_featured DESC, name ASC" : "is_featured DESC, name ASC";
    const [rows] = await pool.execute(
      `SELECT id, slug, name, category, short_description, description, price, compare_at_price, image_url, pack_size, rating, review_count, is_featured, stock_quantity FROM products WHERE ${clauses.join(" AND ")} ORDER BY ${orderBy}`,
      params
    );
    res.json({ success: true, products: rows });
  } catch (error) {
    console.error("Products query failed:", error.code || error.message);
    res.status(500).json({ success: false, message: "Unable to fetch products" });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, slug, name, category, short_description, description, price, compare_at_price, image_url, pack_size, rating, review_count, is_featured, stock_quantity FROM products WHERE slug = ? AND is_active = 1 LIMIT 1",
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product: rows[0] });
  } catch (error) {
    console.error("Product query failed:", error.code || error.message);
    res.status(500).json({ success: false, message: "Unable to fetch product" });
  }
});

app.post("/api/contact", async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const subject = clean(req.body.subject);
  const message = clean(req.body.message);
  if (name.length < 2 || !validEmail(email) || message.length < 10) {
    return res.status(400).json({ success: false, message: "Please provide a name, valid email and message of at least 10 characters." });
  }
  try {
    const [result] = await pool.execute(
      "INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name.slice(0, 100), email.slice(0, 190), phone.slice(0, 40), subject.slice(0, 160), message.slice(0, 4000)]
    );
    const notice = `Swaad Sutra — new website enquiry\\nName: ${name}\\nEmail: ${email}\\nPhone: ${phone || "Not provided"}\\nSubject: ${subject || "General enquiry"}\\nMessage: ${message}`;
    const wa = await notifyOwner(notice);
    res.status(201).json({ success: true, message: "Thank you! Your message has been received.", whatsappSent: wa.sent, reference: result.insertId });
  } catch (error) {
    console.error("Contact form failed:", error.code || error.message);
    res.status(500).json({ success: false, message: "We couldn't send your message right now. Please try again." });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customer = {}, items = [], paymentMethod = "COD" } = req.body || {};
  const name = clean(customer.name), email = clean(customer.email), phone = clean(customer.phone);
  const address = clean(customer.address), city = clean(customer.city), postalCode = clean(customer.postalCode);
  if (name.length < 2 || !validEmail(email) || phone.length < 8 || address.length < 8 || city.length < 2 || postalCode.length < 4) {
    return res.status(400).json({ success: false, message: "Please complete all required delivery details." });
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
    return res.status(400).json({ success: false, message: "Your cart is empty or contains too many items." });
  }
  if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: "Unsupported payment method." });
  }
  if (paymentMethod === "RAZORPAY" && !razorpay) {
    return res.status(503).json({ success: false, message: "Online payment is not configured yet. Choose Cash on Delivery or contact the store." });
  }

  const connection = await pool.getConnection();
  let orderId, orderNumber, total = 0, itemRows = [];
  try {
    await connection.beginTransaction();
    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        throw Object.assign(new Error("Invalid product or quantity."), { status: 400 });
      }
      const [products] = await connection.execute(
        "SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = 1 FOR UPDATE",
        [productId]
      );
      if (!products.length) throw Object.assign(new Error("A product in your cart is no longer available."), { status: 409 });
      const product = products[0];
      if (Number(product.stock_quantity) < quantity) throw Object.assign(new Error(`${product.name} does not have enough stock.`), { status: 409 });
      total += money(product.price) * quantity;
      itemRows.push({ productId, name: product.name, unitPrice: money(product.price), quantity });
    }
    const shipping = total >= 799 ? 0 : 49;
    const grandTotal = Math.round((total + shipping) * 100) / 100;
    orderNumber = `SS-${Date.now().toString().slice(-8)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
    const status = paymentMethod === "COD" ? "PLACED" : "PENDING_PAYMENT";
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, address, city, postal_code, subtotal, shipping_fee, total, payment_method, payment_status, order_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [orderNumber, name, email, phone, address, city, postalCode, total, shipping, grandTotal, paymentMethod, "PENDING", status]
    );
    orderId = orderResult.insertId;
    for (const item of itemRows) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.productId, item.name, item.unitPrice, item.quantity, item.unitPrice * item.quantity]
      );
    }
    await connection.commit();

    if (paymentMethod === "COD") {
      await notifyOwner(`Swaad Sutra — new COD order\\nOrder: ${orderNumber}\\nCustomer: ${name}\\nPhone: ${phone}\\nTotal: ₹${grandTotal.toFixed(2)}\\nItems: ${itemRows.map(i => `${i.name} x ${i.quantity}`).join(", ")}\\nShip to: ${address}, ${city} - ${postalCode}`);
      return res.status(201).json({ success: true, orderId, orderNumber, total: grandTotal, paymentMethod: "COD", message: "Order placed successfully." });
    }

    try {
      const rpOrder = await razorpay.orders.create({
        amount: Math.round(grandTotal * 100),
        currency: "INR",
        receipt: orderNumber,
        notes: { localOrderId: String(orderId), orderNumber }
      });
      await pool.execute("UPDATE orders SET gateway_order_id = ? WHERE id = ?", [rpOrder.id, orderId]);
      return res.status(201).json({
        success: true, orderId, orderNumber, total: grandTotal,
        razorpay: { orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, keyId: process.env.RAZORPAY_KEY_ID }
      });
    } catch (error) {
      console.error("Razorpay order creation failed:", error.message);
      await pool.execute("UPDATE orders SET order_status = 'PAYMENT_FAILED' WHERE id = ?", [orderId]);
      return res.status(502).json({ success: false, message: "Could not start online payment. Please retry or choose Cash on Delivery." });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Order creation failed:", error.code || error.message);
    res.status(error.status || 500).json({ success: false, message: error.status ? error.message : "Unable to place your order." });
  } finally {
    connection.release();
  }
});

app.post("/api/orders/:id/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment details." });
  }
  try {
    const [orders] = await pool.execute("SELECT id, order_number, total, gateway_order_id, payment_status, customer_name, customer_phone, customer_email FROM orders WHERE id = ? LIMIT 1", [Number(req.params.id)]);
    if (!orders.length) return res.status(404).json({ success: false, message: "Order not found." });
    const order = orders[0];
    if (order.gateway_order_id !== razorpay_order_id) return res.status(400).json({ success: false, message: "Payment order does not match." });
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(razorpay_signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).json({ success: false, message: "Payment signature verification failed." });
    if (order.payment_status !== "PAID") {
      await pool.execute("UPDATE orders SET payment_status = 'PAID', order_status = 'PLACED', gateway_payment_id = ?, paid_at = NOW() WHERE id = ?", [razorpay_payment_id, order.id]);
      const [items] = await pool.execute("SELECT product_name, quantity FROM order_items WHERE order_id = ?", [order.id]);
      await notifyOwner(`Swaad Sutra — payment received\\nOrder: ${order.order_number}\\nCustomer: ${order.customer_name}\\nPhone: ${order.customer_phone}\\nTotal: ₹${Number(order.total).toFixed(2)}\\nItems: ${items.map(i => `${i.product_name} x ${i.quantity}`).join(", ")}`);
    }
    res.json({ success: true, orderId: order.id, orderNumber: order.order_number, message: "Payment verified successfully." });
  } catch (error) {
    console.error("Payment verification failed:", error.code || error.message);
    res.status(500).json({ success: false, message: "Unable to verify payment." });
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled API error:", err.message);
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

app.listen(PORT, () => console.log(`Swaad Sutra API listening on port ${PORT}`));
