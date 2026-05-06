import { createContext, useContext, useState, type ReactNode } from "react";
import type { Plato } from "@/lib/types";

export interface CartItem {
  plato: Plato;
  cantidad: number;
}

interface CartCtx {
  restauranteId: string | null;
  items: CartItem[];
  add: (plato: Plato) => void;
  remove: (platoId: string) => void;
  setQty: (platoId: string, cantidad: number) => void;
  clear: () => void;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [restauranteId, setRest] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (plato: Plato) => {
    if (restauranteId && restauranteId !== plato.restaurante_id) {
      if (!confirm("Tu carrito tiene platos de otro restaurante. ¿Vaciar y empezar uno nuevo?")) return;
      setItems([{ plato, cantidad: 1 }]);
      setRest(plato.restaurante_id);
      return;
    }
    setRest(plato.restaurante_id);
    setItems((prev) => {
      const i = prev.findIndex((x) => x.plato.id === plato.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], cantidad: copy[i].cantidad + 1 };
        return copy;
      }
      return [...prev, { plato, cantidad: 1 }];
    });
  };
  const remove = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.plato.id !== id);
      if (!next.length) setRest(null);
      return next;
    });
  };
  const setQty = (id: string, cantidad: number) => {
    if (cantidad <= 0) return remove(id);
    setItems((prev) => prev.map((x) => (x.plato.id === id ? { ...x, cantidad } : x)));
  };
  const clear = () => {
    setItems([]);
    setRest(null);
  };
  const subtotal = items.reduce((s, it) => s + it.cantidad * it.plato.precio, 0);

  return <Ctx.Provider value={{ restauranteId, items, add, remove, setQty, clear, subtotal }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart fuera de CartProvider");
  return v;
}
