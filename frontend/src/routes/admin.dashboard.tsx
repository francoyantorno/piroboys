import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pedidosTodos } from "@/services/pedidos.service";
import { listarRestaurantes } from "@/services/restaurantes.service";
import { listarRepartidores } from "@/services/personas.service";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const pedidos = useQuery({ queryKey: ["pedidos"], queryFn: pedidosTodos });
  const rests = useQuery({ queryKey: ["restaurantes"], queryFn: () => listarRestaurantes() });
  const reps = useQuery({ queryKey: ["repartidores"], queryFn: listarRepartidores });

  const ps = pedidos.data ?? [];
  const entregados = ps.filter((p) => p.estado === "entregado");
  const pendientes = ps.filter((p) => !["entregado", "cancelado"].includes(p.estado));
  const facturacion = entregados.reduce((s, p) => s + p.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Resumen general del negocio.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Restaurantes" value={String(rests.data?.length ?? 0)} />
        <Stat label="Repartidores" value={`${reps.data?.filter((r) => r.disponible).length ?? 0} / ${reps.data?.length ?? 0}`} sub="disponibles" />
        <Stat label="Pedidos en curso" value={String(pendientes.length)} />
        <Stat label="Facturado (entregados)" value={fmtMoney(facturacion)} />
      </div>
      <div className="mt-8 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Últimos pedidos</h2>
        {ps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Aún no hay pedidos. Pedí desde la cuenta de cliente para verlos aparecer.</p>
        ) : (
          <ul className="mt-3 divide-y text-sm">
            {ps.slice(0, 8).map((p) => (
              <li key={p.id} className="flex justify-between py-2">
                <span>#{p.id.slice(-4)} · {p.items.length} ítems</span>
                <span className="font-medium">{fmtMoney(p.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
