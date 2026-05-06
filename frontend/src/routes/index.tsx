import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  if (loading) return <FullSplash />;
  if (!user) return <Landing />;
  if (user.rol === "admin") return <Navigate to="/admin/dashboard" />;
  if (user.rol === "cliente") return <Navigate to="/cliente/buscar" />;
  return <Navigate to="/repartidor/pedidos" />;
}

function FullSplash() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function Landing() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/30" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Delivery
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pedí lo que quieras, <span className="text-primary">cuando quieras</span>.
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Cientos de restaurantes cerca tuyo. Hecho para clientes, restaurantes y repartidores en una sola app.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/login" className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                Iniciar sesión
              </a>
              <a href="/register" className="rounded-lg border px-5 py-3 font-semibold hover:bg-muted">
                Crear cuenta
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <Stat n="500+" l="Restaurantes" />
              <Stat n="20k+" l="Pedidos/día" />
              <Stat n="4.8★" l="Rating" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square w-full max-w-md rounded-3xl bg-gradient-to-br from-primary to-primary/60 p-8 text-primary-foreground shadow-2xl">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm opacity-80">Pedido #1042</p>
                  <p className="text-2xl font-bold">Sushi Zen</p>
                </div>
                <div className="space-y-2 text-sm">
                  <Row label="Roll Philadelphia x2" value="$9.000" />
                  <Row label="Roll California x1" value="$3.800" />
                  <div className="my-2 h-px bg-primary-foreground/20" />
                  <Row label="Total" value="$12.800" bold />
                </div>
                <div className="rounded-xl bg-primary-foreground/15 p-3 text-sm">
                  📦 En camino · 8 min
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Usuarios demo:</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-3">
            <li><b>admin@rappi.com</b> · admin</li>
            <li><b>lucia@mail.com</b> · 1234</li>
            <li><b>mateo@mail.com</b> · 1234</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
