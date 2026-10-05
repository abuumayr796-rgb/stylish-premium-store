import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  key: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (product: Product, size: string, color: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);
    return {
      items,
      count,
      total,
      open,
      setOpen,
      add: (product, size, color) => {
        const key = `${product.id}-${size}-${color}`;
        setItems((prev) => {
          const found = prev.find((i) => i.key === key);
          if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
          return [...prev, { key, product, size, color, qty: 1 }];
        });
      },
      setQty: (key, qty) =>
        setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)))),
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
