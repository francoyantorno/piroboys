import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPedido, cambiarEstado } from "@/services/pedidos.service";
import { TRANSICIONES, ESTADO_LABEL } from "@/lib/estado-pedido";
import { EstadoBadge } from "@/components/estado-badge";
import { fmtMoney, fmtDate } from "@/lib/format";
import { toast } from "sonner";
import type { EstadoPedido } from "@/lib/types";

export const Route = createFileRoute("/repartidor/pedidos/$id")({
  component: RepPedido,
});

function RepPedido() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: p } = useQuery({ queryKey: ["pedido", id], queryFn: () => getPedido(id) });
  const m = useMutation({
    mutationFn: (e: EstadoPedido) => cambiarEstado(id, e),
    onSuccess: () => {
      toast.success("Estado actualizado");
      qc.invalidateQueries({ queryKey: ["pedido", id] });
      qc.invalidateQueries({ queryKey: ["pedidos-rep"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  if (!p) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  const validas = TRANSICIONES[p.estado];

  return (
    <div>
      <Link to="/repartidor/pedidos" className="text-sm text-muted-foreground">← Volver</Link>
      <div className="mt-3 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pedido #{p.id.slice(-4)}</h1>
          <EstadoBadge estado={p.estado} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{fmtDate(p.fecha)}</p>
        <p className="mt-2 text-sm">📍 {p.direccion_entrega} (CP {p.codigo_postal})</p>
        <p className="mt-1 text-sm font-semibold text-primary">Total: {fmtMoney(p.total)}</p>
      </div>

      <div className="mt-4 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-2 divide-y text-sm">
          {p.items.map((it) => (
            <li key={it.plato_id} className="flex justify-between py-2">
              <span>{it.cantidad} × {it.nombre}</span>
              <span>{fmtMoney(it.cantidad * it.precio_unitario)}</span>
            </li>
          ))}
        </ul>
      </div>

      {validas.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {validas.map((e) => (
            <button
              key={e}
              onClick={() => m.mutate(e)}
              disabled={m.isPending}
              className={`rounded-xl py-3 font-semibold ${
                e === "cancelado" ? "border border-destructive text-destructive" : "bg-primary text-primary-foreground"
              }`}
            >
              {ESTADO_LABEL[e]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
          Pedido finalizado, no se puede modificar.
        </p>
      )}
    </div>
  );
}
