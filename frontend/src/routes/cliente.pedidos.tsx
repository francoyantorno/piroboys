import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { pedidosCliente } from "@/services/pedidos.service";
import { fmtMoney, fmtDate } from "@/lib/format";
import { EstadoBadge } from "@/components/estado-badge";

export const Route = createFileRoute("/cliente/pedidos")({
  component: HistorialCliente,
});

const FILTROS = ["", "pendiente", "confirmado", "en_preparacion", "en_camino", "entregado", "cancelado"];

function HistorialCliente() {
  const { user } = useAuth();
  const [estado, setEstado] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["pedidos-cliente", user?.cliente_id, estado],
    queryFn: () => pedidosCliente(user!.cliente_id!, estado || undefined),
    enabled: !!user?.cliente_id,
  });
  const totalGastado = data.filter((p) => p.estado === "entregado").reduce((s, p) => s + p.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      <p className="text-sm text-muted-foreground">Total gastado (entregados): <b>{fmtMoney(totalGastado)}</b></p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setEstado(f)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              estado === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f.replace("_", " ") || "Todos"}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((p) => (
          <Link
            key={p.id}
            to="/cliente/pedidos/$id"
            params={{ id: p.id }}
            className="block rounded-2xl border bg-card p-4 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">Pedido #{p.id.slice(-4)}</p>
              <EstadoBadge estado={p.estado} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{fmtDate(p.fecha)} · {p.items.length} ítems</p>
            <p className="mt-1 font-semibold text-primary">{fmtMoney(p.total)}</p>
          </Link>
        ))}
        {data.length === 0 && (
          <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">No hay pedidos.</p>
        )}
      </ul>
    </div>
  );
}
