import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getRestaurante } from "@/services/restaurantes.service";
import { platosPorRestaurante } from "@/services/platos.service";
import { useCart } from "@/lib/cart-context";
import { fmtMoney } from "@/lib/format";
import { Plus, Minus, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cliente/restaurantes/$id")({
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { data: rest } = useQuery({ queryKey: ["restaurante", id], queryFn: () => getRestaurante(id) });
  const { data: platos = [] } = useQuery({ queryKey: ["platos-disp", id], queryFn: () => platosPorRestaurante(id, true) });
  const { items, add, setQty } = useCart();
  const qtyOf = (pid: string) => items.find((i) => i.plato.id === pid)?.cantidad ?? 0;

  if (!rest) return <p className="text-sm text-muted-foreground">Cargando...</p>;

  return (
    <div>
      <Link to="/cliente/buscar" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <header className="mt-3 rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">{rest.nombre}</h1>
        <p className="text-sm opacity-90 capitalize">{rest.categoria} · ★ {rest.calificacion_promedio.toFixed(1)}</p>
        <p className="text-xs opacity-80">{rest.direccion}</p>
      </header>

      <ul className="mt-5 divide-y">
        {platos.map((p) => {
          const q = qtyOf(p.id);
          return (
            <li key={p.id} className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.nombre}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{p.descripcion}</p>
                <p className="mt-1 font-semibold text-primary">{fmtMoney(p.precio)}</p>
              </div>
              {q === 0 ? (
                <button onClick={() => add(p)} className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                  + Agregar
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-full border px-2 py-1">
                  <button onClick={() => setQty(p.id, q - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-medium">{q}</span>
                  <button onClick={() => setQty(p.id, q + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </li>
          );
        })}
        {platos.length === 0 && <p className="text-sm text-muted-foreground">Este restaurante aún no tiene platos disponibles.</p>}
      </ul>

      {items.length > 0 && (
        <button
          onClick={() => nav({ to: "/cliente/checkout" })}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
        >
          Ver carrito ({items.reduce((s, x) => s + x.cantidad, 0)})
        </button>
      )}
    </div>
  );
}
