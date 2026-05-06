import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listarRepartidores, crearRepartidor, toggleDisponibleRepartidor } from "@/services/personas.service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/repartidores")({
  component: AdminReps,
});

function AdminReps() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["repartidores"], queryFn: listarRepartidores });
  const [f, setF] = useState({ nombre: "", vehiculo: "Moto" });
  const m = useMutation({
    mutationFn: () => crearRepartidor({ ...f, disponible: true }),
    onSuccess: () => {
      toast.success("Repartidor creado");
      qc.invalidateQueries({ queryKey: ["repartidores"] });
      setF({ nombre: "", vehiculo: "Moto" });
    },
  });
  const t = useMutation({
    mutationFn: ({ id, d }: { id: string; d: boolean }) => toggleDisponibleRepartidor(id, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["repartidores"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Repartidores</h1>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-4 grid gap-2 sm:grid-cols-3 rounded-2xl border bg-card p-4">
        <input className="input" placeholder="Nombre" required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
        <select className="input" value={f.vehiculo} onChange={(e) => setF({ ...f, vehiculo: e.target.value })}>
          <option>Moto</option><option>Bici</option><option>Auto</option>
        </select>
        <button className="rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">+ Agregar</button>
      </form>
      <ul className="mt-6 divide-y rounded-2xl border bg-card">
        {data.map((r) => (
          <li key={r.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{r.nombre}</p>
              <p className="text-xs text-muted-foreground">{r.vehiculo}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className={r.disponible ? "text-success" : "text-muted-foreground"}>
                {r.disponible ? "Disponible" : "Ocupado"}
              </span>
              <input type="checkbox" checked={r.disponible} onChange={(e) => t.mutate({ id: r.id, d: e.target.checked })} />
            </label>
          </li>
        ))}
      </ul>
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}`}</style>
    </div>
  );
}
