import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { RequireRole } from "@/components/require-role";
import {
  LayoutDashboard,
  Store,
  Users,
  Bike,
  Ticket,
  Trophy,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RequireRole rol="admin">
      <AdminLayout />
    </RequireRole>
  ),
});

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/restaurantes", label: "Restaurantes", icon: Store },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/repartidores", label: "Repartidores", icon: Bike },
  { to: "/admin/cupones", label: "Cupones", icon: Ticket },
  { to: "/admin/rankings", label: "Rankings", icon: Trophy },
  { to: "/admin/reportes", label: "Reportes", icon: BarChart3 },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-20 space-y-1">
          {items.map((it) => {
            const active = path.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
          {items.map((it) => {
            const active = path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
