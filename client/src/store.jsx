import { createContext, useContext, useEffect, useMemo, useState } from "react";
const StoreContext = createContext(null);
export const API = import.meta.env.VITE_API_BASE_URL || "/api";
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("swaad-sutra-cart-v2") || "[]"); } catch { return []; }
  });
  useEffect(() => localStorage.setItem("swaad-sutra-cart-v2", JSON.stringify(cart)), [cart]);
  const addToCart = (product, quantity = 1) => setCart(old => {
    const found = old.find(i => i.id === product.id);
    if (found) return old.map(i => i.id === product.id ? { ...i, quantity: Math.min(20, i.quantity + quantity) } : i);
    return [...old, { id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image_url: product.image_url, pack_size: product.pack_size, quantity }];
  });
  const setQuantity = (id, quantity) => setCart(old => quantity < 1 ? old.filter(i => i.id !== id) : old.map(i => i.id === id ? { ...i, quantity: Math.min(20, quantity) } : i));
  const remove = id => setCart(old => old.filter(i => i.id !== id));
  const clear = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const value = useMemo(() => ({ cart, addToCart, setQuantity, remove, clear, total, count }), [cart, total, count]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
export const money = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n || 0));