import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { RequireRole } from "@/components/require-role";
import { Search, ShoppingCart, Receipt, Bell } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/cliente")({
  component: () => (
    <RequireRole rol="cliente">
      <ClienteLayout />
    </RequireRole>
  ),
});

const tabs = [
  { to: "/cliente/buscar", label: "Buscar", icon: Search },
  { to: "/cliente/checkout", label: "Carrito", icon: ShoppingCart },
  { to: "/cliente/pedidos", label: "Pedidos", icon: Receipt },
  { to: "/cliente/notificaciones", label: "Avisos", icon: Bell },
] as const;

function ClienteLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { items } = useCart();
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-4">
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-4">
          {tabs.map((t) => {
            const active = path.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-xs ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t.label}
                {t.to === "/cliente/checkout" && items.length > 0 && (
                  <span className="absolute right-1/4 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {items.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
