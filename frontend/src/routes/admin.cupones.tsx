import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listarCupones, crearCupon } from "@/services/extras.service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cupones")({
  component: Cupones,
});

function Cupones() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["cupones"], queryFn: listarCupones });
  const [f, setF] = useState({ codigo: "", porcentaje: 10, vencimiento: "", usos_maximos: 100 });
  const m = useMutation({
    mutationFn: () =>
      crearCupon({
        codigo: f.codigo.toUpperCase(),
        porcentaje: Number(f.porcentaje),
        vencimiento: f.vencimiento,
        usos_maximos: Number(f.usos_maximos),
      }),
    onSuccess: () => {
      toast.success("Cupón creado");
      qc.invalidateQueries({ queryKey: ["cupones"] });
      setF({ codigo: "", porcentaje: 10, vencimiento: "", usos_maximos: 100 });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Cupones</h1>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-4 grid gap-2 sm:grid-cols-5 rounded-2xl border bg-card p-4">
        <input className="input" placeholder="CÓDIGO" required value={f.codigo} onChange={(e) => setF({ ...f, codigo: e.target.value })} />
        <input className="input" type="number" min={1} max={100} required value={f.porcentaje} onChange={(e) => setF({ ...f, porcentaje: Number(e.target.value) })} />
        <input className="input" type="date" required value={f.vencimiento} onChange={(e) => setF({ ...f, vencimiento: e.target.value })} />
        <input className="input" type="number" min={1} required value={f.usos_maximos} onChange={(e) => setF({ ...f, usos_maximos: Number(e.target.value) })} />
        <button className="rounded-lg bg-primary text-sm font-semibold text-primary-foreground">+ Crear</button>
      </form>
      <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Código</th><th className="p-3">%</th><th className="p-3">Vence</th><th className="p-3">Usos</th></tr></thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-mono font-semibold text-primary">{c.codigo}</td>
                <td className="p-3">{c.porcentaje}%</td>
                <td className="p-3">{c.vencimiento}</td>
                <td className="p-3">{c.usos_actuales} / {c.usos_maximos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}`}</style>
    </div>
  );
}
