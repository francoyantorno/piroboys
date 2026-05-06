import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listarRestaurantes, crearRestaurante } from "@/services/restaurantes.service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/restaurantes")({
  component: AdminRestaurantes,
});

function AdminRestaurantes() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["restaurantes"], queryFn: () => listarRestaurantes() });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ nombre: "", categoria: "", direccion: "" });
  const m = useMutation({
    mutationFn: () => crearRestaurante(f),
    onSuccess: () => {
      toast.success("Restaurante creado");
      qc.invalidateQueries({ queryKey: ["restaurantes"] });
      setOpen(false);
      setF({ nombre: "", categoria: "", direccion: "" });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Restaurantes</h1>
        <button onClick={() => setOpen((v) => !v)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {open ? "Cancelar" : "+ Nuevo"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
          className="mt-4 grid gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-3"
        >
          <input className="input" placeholder="Nombre" required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
          <input className="input" placeholder="Categoría" required value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value })} />
          <input className="input" placeholder="Dirección" required value={f.direccion} onChange={(e) => setF({ ...f, direccion: e.target.value })} />
          <button className="sm:col-span-3 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground" disabled={m.isPending}>
            Crear
          </button>
        </form>
      )}

      <div className="mt-6 grid gap-3">
        {data.map((r) => (
          <Link
            key={r.id}
            to="/admin/restaurantes/$id"
            params={{ id: r.id }}
            className="flex items-center justify-between rounded-xl border bg-card p-4 hover:border-primary"
          >
            <div>
              <p className="font-semibold">{r.nombre}</p>
              <p className="text-xs text-muted-foreground capitalize">{r.categoria} · {r.direccion}</p>
            </div>
            <span className="text-sm font-medium text-primary">★ {r.calificacion_promedio.toFixed(1)}</span>
          </Link>
        ))}
      </div>
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}.input:focus{border-color:var(--color-ring)}`}</style>
    </div>
  );
}
