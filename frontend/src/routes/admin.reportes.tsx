import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listarRestaurantes, reporteRestaurante } from "@/services/restaurantes.service";
import { fmtMoney } from "@/lib/format";

export const Route = createFileRoute("/admin/reportes")({
  component: Reportes,
});

function Reportes() {
  const { data: rests = [] } = useQuery({ queryKey: ["restaurantes"], queryFn: () => listarRestaurantes() });
  const [restId, setRestId] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const rep = useQuery({
    queryKey: ["reporte", restId, desde, hasta],
    queryFn: () => reporteRestaurante(restId, desde || undefined, hasta || undefined),
    enabled: !!restId,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Reportes de ventas</h1>
      <div className="mt-4 grid gap-2 sm:grid-cols-4 rounded-2xl border bg-card p-4">
        <select className="input" value={restId} onChange={(e) => setRestId(e.target.value)}>
          <option value="">— Elegir restaurante —</option>
          {rests.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
        <input type="date" className="input" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <input type="date" className="input" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </div>
      {restId && rep.data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Pedidos entregados" value={String(rep.data.cantidad)} />
          <Stat label="Facturación" value={fmtMoney(rep.data.facturacion)} />
          <Stat label="Ticket promedio" value={fmtMoney(rep.data.ticket_promedio)} />
          <div className="sm:col-span-3 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Top 5 platos del rango</h2>
            {rep.data.top_platos.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Sin ventas en el rango.</p>
            ) : (
              <ul className="mt-3 divide-y text-sm">
                {rep.data.top_platos.map((p, i) => (
                  <li key={p.plato_id} className="flex justify-between py-2">
                    <span>{i + 1}. {p.nombre}</span><span className="font-medium">{p.cantidad}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}`}</style>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
