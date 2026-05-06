import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getRestaurante } from "@/services/restaurantes.service";
import { platosPorRestaurante, crearPlato, actualizarPlato } from "@/services/platos.service";
import { zonasPorRestaurante, crearZona, eliminarZona } from "@/services/extras.service";
import { fmtMoney } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/restaurantes/$id")({
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: rest } = useQuery({ queryKey: ["restaurante", id], queryFn: () => getRestaurante(id) });
  const { data: platos = [] } = useQuery({ queryKey: ["platos", id], queryFn: () => platosPorRestaurante(id) });
  const { data: zonas = [] } = useQuery({ queryKey: ["zonas", id], queryFn: () => zonasPorRestaurante(id) });

  const [pf, setPf] = useState({ nombre: "", descripcion: "", precio: 0 });
  const crearP = useMutation({
    mutationFn: () => crearPlato({ ...pf, precio: Number(pf.precio), disponible: true, restaurante_id: id }),
    onSuccess: () => {
      toast.success("Plato creado");
      qc.invalidateQueries({ queryKey: ["platos", id] });
      setPf({ nombre: "", descripcion: "", precio: 0 });
    },
    onError: (e) => toast.error((e as Error).message),
  });
  const togglePlato = useMutation({
    mutationFn: ({ pid, disponible }: { pid: string; disponible: boolean }) =>
      actualizarPlato(pid, { disponible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platos", id] }),
  });

  const [zf, setZf] = useState({ nombre: "", codigo_postal: "" });
  const crearZ = useMutation({
    mutationFn: () => crearZona({ ...zf, restaurante_id: id }),
    onSuccess: () => {
      toast.success("Zona agregada");
      qc.invalidateQueries({ queryKey: ["zonas", id] });
      setZf({ nombre: "", codigo_postal: "" });
    },
  });
  const elimZ = useMutation({
    mutationFn: (zid: string) => eliminarZona(zid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zonas", id] }),
  });

  if (!rest) return <p className="text-sm text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <Link to="/admin/restaurantes" className="text-sm text-muted-foreground hover:text-foreground">← Volver</Link>
      <div className="rounded-2xl border bg-card p-5">
        <h1 className="text-2xl font-bold">{rest.nombre}</h1>
        <p className="text-sm text-muted-foreground capitalize">{rest.categoria} · {rest.direccion}</p>
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Menú</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crearP.mutate();
          }}
          className="mt-3 grid gap-2 sm:grid-cols-4"
        >
          <input className="input sm:col-span-1" placeholder="Nombre" required value={pf.nombre} onChange={(e) => setPf({ ...pf, nombre: e.target.value })} />
          <input className="input sm:col-span-2" placeholder="Descripción" value={pf.descripcion} onChange={(e) => setPf({ ...pf, descripcion: e.target.value })} />
          <input className="input" type="number" placeholder="Precio" min={1} required value={pf.precio || ""} onChange={(e) => setPf({ ...pf, precio: Number(e.target.value) })} />
          <button className="sm:col-span-4 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">+ Agregar plato</button>
        </form>
        <ul className="mt-4 divide-y">
          {platos.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{p.nombre} · <span className="text-primary">{fmtMoney(p.precio)}</span></p>
                <p className="text-xs text-muted-foreground">{p.descripcion}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={p.disponible} onChange={(e) => togglePlato.mutate({ pid: p.id, disponible: e.target.checked })} />
                Disponible
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Zonas de cobertura</h2>
        <form onSubmit={(e) => { e.preventDefault(); crearZ.mutate(); }} className="mt-3 grid gap-2 sm:grid-cols-3">
          <input className="input" placeholder="Nombre zona" required value={zf.nombre} onChange={(e) => setZf({ ...zf, nombre: e.target.value })} />
          <input className="input" placeholder="Código postal" required value={zf.codigo_postal} onChange={(e) => setZf({ ...zf, codigo_postal: e.target.value })} />
          <button className="rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground">+ Agregar</button>
        </form>
        <ul className="mt-3 flex flex-wrap gap-2">
          {zonas.map((z) => (
            <li key={z.id} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
              {z.nombre} · CP {z.codigo_postal}
              <button onClick={() => elimZ.mutate(z.id)} className="text-destructive">×</button>
            </li>
          ))}
        </ul>
      </section>
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}.input:focus{border-color:var(--color-ring)}`}</style>
    </div>
  );
}
