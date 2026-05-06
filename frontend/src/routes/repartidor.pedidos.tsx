import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { pedidosRepartidor } from "@/services/pedidos.service";
import { fmtMoney, fmtDate } from "@/lib/format";
import { EstadoBadge } from "@/components/estado-badge";

export const Route = createFileRoute("/repartidor/pedidos")({
  component: RepPedidos,
});

function RepPedidos() {
  const { user } = useAuth();
  const { data = [] } = useQuery({
    queryKey: ["pedidos-rep", user?.repartidor_id],
    queryFn: () => pedidosRepartidor(user!.repartidor_id!),
    enabled: !!user?.repartidor_id,
    refetchInterval: 5000,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Mis entregas</h1>
      <p className="text-sm text-muted-foreground">Pedidos asignados a vos.</p>
      <ul className="mt-4 space-y-3">
        {data.map((p) => (
          <Link
            key={p.id}
            to="/repartidor/pedidos/$id"
            params={{ id: p.id }}
            className="block rounded-2xl border bg-card p-4 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">#{p.id.slice(-4)} · {fmtMoney(p.total)}</p>
              <EstadoBadge estado={p.estado} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{fmtDate(p.fecha)} · {p.direccion_entrega}</p>
          </Link>
        ))}
        {data.length === 0 && (
          <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Sin entregas asignadas. El admin/cliente debe asignarte un pedido desde la vista de pedido.
          </p>
        )}
      </ul>
    </div>
  );
}
