import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { topRestaurantes } from "@/services/restaurantes.service";
import { topPlatos } from "@/services/platos.service";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/admin/rankings")({
  component: Rankings,
});

function Rankings() {
  const r = useQuery({ queryKey: ["top-rest"], queryFn: topRestaurantes });
  const p = useQuery({ queryKey: ["top-platos"], queryFn: topPlatos });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rankings</h1>
      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Top 5 restaurantes (entregados)</h2>
        <ul className="mt-3 divide-y">
          {(r.data ?? []).map((x, i) => (
            <li key={x.id} className="flex justify-between py-2 text-sm">
              <span>{i + 1}. {x.nombre}</span>
              <span className="font-medium">{x.pedidos_entregados} pedidos</span>
            </li>
          ))}
          {(r.data ?? []).every((x) => x.pedidos_entregados === 0) && <p className="text-sm text-muted-foreground">Sin entregas aún.</p>}
        </ul>
      </section>
      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Top 10 platos vendidos</h2>
        <ul className="mt-3 divide-y">
          {(p.data ?? []).map((x, i) => (
            <li key={x.id} className="flex justify-between py-2 text-sm">
              <span>{i + 1}. {x.nombre} <span className="text-muted-foreground">({fmtMoney(x.precio)})</span></span>
              <span className="font-medium">{x.vendidos}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
