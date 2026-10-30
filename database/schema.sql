CREATE DATABASE IF NOT EXISTS swaad_sutra CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE swaad_sutra;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2) NULL,
  image_url VARCHAR(700) NOT NULL,
  pack_size VARCHAR(30) NOT NULL DEFAULT '100 g',
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.8,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 100,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_category_active (category, is_active),
  INDEX idx_products_featured (is_featured)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(80) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(190) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method ENUM('COD','RAZORPAY') NOT NULL,
  payment_status ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  order_status ENUM('PENDING_PAYMENT','PLACED','PAYMENT_FAILED','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  gateway_order_id VARCHAR(100) NULL,
  gateway_payment_id VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME NULL,
  INDEX idx_orders_status_date (order_status, created_at)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  product_name VARCHAR(180) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NULL,
  subject VARCHAR(160) NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_created (created_at)
);

INSERT INTO products
(slug, name, category, short_description, description, price, compare_at_price, image_url, pack_size, rating, review_count, is_featured, stock_quantity)
VALUES
('godha-garam-masala', 'Godha Garam Masala', 'Blended Masala', 'A warming Maharashtrian blend for everyday comfort.', 'Aromatic, deeply warming and made for the meals that bring everyone to the table. Add a little to usal, amti, vegetables and festive gravies.', 149.00, 179.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.9, 128, 1, 100),
('kolhapuri-masala', 'Kolhapuri Masala', 'Regional Special', 'Bold heat and unmistakable Kolhapuri character.', 'A robust regional blend for tambda rassa, pandhra rassa-inspired gravies, misal and hearty curries. Start with a little and build the heat to your taste.', 169.00, 199.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.8, 94, 1, 100),
('kanda-lasun-masala', 'Kanda Lasun Masala', 'Blended Masala', 'The savoury backbone of a Maharashtrian kitchen.', 'A rich onion-garlic style masala for bhaji, amti, usal and everyday meals. Designed to bring depth and a homestyle finish.', 159.00, 189.00, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f8?auto=format&fit=crop&w=1000&q=85', '100 g', 4.9, 103, 1, 100),
('misal-masala', 'Misal Masala', 'Regional Special', 'Street-food energy for your homemade misal.', 'Bring the lively flavour of a favourite Maharashtrian snack to your kitchen. Use for usal, misal tari and spicy bean curries.', 139.00, 169.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.7, 76, 1, 100),
('pav-bhaji-masala', 'Pav Bhaji Masala', 'Blended Masala', 'A balanced blend for buttery, tangy bhaji.', 'A versatile blend for pav bhaji, tawa pulao and quick vegetable dishes. Finish with coriander, lemon and a little butter if you like.', 129.00, 159.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.8, 62, 0, 100),
('chai-masala', 'Chai Masala', 'Everyday Essentials', 'A fragrant cup with a little extra warmth.', 'A comforting aromatic blend for masala chai. Add a pinch while simmering tea with milk for a warming everyday ritual.', 119.00, 149.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '50 g', 4.8, 49, 0, 100),
('turmeric-powder', 'Haldi Powder', 'Everyday Essentials', 'Golden colour for everyday cooking.', 'A kitchen essential for dals, vegetables and curries. Store in a cool, dry place and use a dry spoon.', 99.00, 119.00, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f8?auto=format&fit=crop&w=1000&q=85', '100 g', 4.7, 88, 0, 100),
('red-chilli-powder', 'Lal Mirchi Powder', 'Everyday Essentials', 'Colour and heat to suit your cooking.', 'A versatile chilli powder for curries, marinades and tadka. Adjust quantity to your preferred heat level.', 109.00, 129.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.8, 80, 0, 100),
('coriander-cumin', 'Dhana Jeera Powder', 'Everyday Essentials', 'A dependable everyday flavour foundation.', 'A classic coriander-cumin blend for vegetables, dal, kadhi and homemade curries.', 89.00, 109.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.7, 54, 0, 100),
('biryani-masala', 'Biryani Masala', 'Blended Masala', 'Layered aroma for special rice dishes.', 'A fragrant blend for vegetable biryani, pulao and festive rice dishes. Bloom briefly in oil to release the aroma.', 149.00, 179.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.8, 66, 0, 100),
('sambar-masala', 'Sambar Masala', 'Regional Special', 'A homestyle blend for comforting sambar.', 'Use with lentils, tamarind and vegetables for a comforting South Indian-inspired sambar.', 119.00, 139.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.7, 43, 0, 100),
('chole-masala', 'Chole Masala', 'Regional Special', 'A bold blend for chickpea favourites.', 'A savoury, warming blend for chole, chickpea bowls and hearty gravies.', 129.00, 149.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85', '100 g', 4.8, 52, 0, 100)
ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category), short_description=VALUES(short_description), description=VALUES(description), price=VALUES(price), compare_at_price=VALUES(compare_at_price), image_url=VALUES(image_url), pack_size=VALUES(pack_size), rating=VALUES(rating), review_count=VALUES(review_count), is_featured=VALUES(is_featured), stock_quantity=VALUES(stock_quantity), is_active=1;
