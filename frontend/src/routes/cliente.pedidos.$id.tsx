import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPedido, asignarRepartidor, calificarPedido } from "@/services/pedidos.service";
import { fmtMoney, fmtDate } from "@/lib/format";
import { EstadoBadge } from "@/components/estado-badge";
import { Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cliente/pedidos/$id")({
  component: PedidoDetail,
});

function PedidoDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: p } = useQuery({ queryKey: ["pedido", id], queryFn: () => getPedido(id) });

  const asignar = useMutation({
    mutationFn: () => asignarRepartidor(id),
    onSuccess: (r) => {
      toast.success(r.estado === "sin_repartidor" ? "No hay repartidores disponibles" : "Repartidor asignado");
      qc.invalidateQueries({ queryKey: ["pedido", id] });
    },
  });

  if (!p) return <p className="text-sm text-muted-foreground">Cargando...</p>;

  return (
    <div>
      <Link to="/cliente/pedidos" className="text-sm text-muted-foreground">← Mis pedidos</Link>
      <div className="mt-3 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pedido #{p.id.slice(-4)}</h1>
          <EstadoBadge estado={p.estado} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{fmtDate(p.fecha)}</p>
        <p className="text-sm">📍 {p.direccion_entrega} (CP {p.codigo_postal})</p>
      </div>

      <div className="mt-4 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Detalle</h2>
        <ul className="mt-2 divide-y text-sm">
          {p.items.map((it) => (
            <li key={it.plato_id} className="flex justify-between py-2">
              <span>{it.cantidad} × {it.nombre}</span>
              <span className="font-medium">{fmtMoney(it.cantidad * it.precio_unitario)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 text-sm">
          <Row label="Subtotal" value={fmtMoney(p.subtotal)} />
          {p.descuento > 0 && <Row label={`Cupón ${p.cupon_codigo}`} value={`- ${fmtMoney(p.descuento)}`} />}
          <Row label="Total" value={fmtMoney(p.total)} bold />
        </div>
      </div>

      {(p.estado === "pendiente" || p.estado === "sin_repartidor") && (
        <button
          onClick={() => asignar.mutate()}
          className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
        >
          Asignar repartidor
        </button>
      )}

      {p.estado === "entregado" && !p.calificado && <Calificar id={id} />}
      {p.calificado && (
        <p className="mt-4 rounded-xl bg-success/10 p-3 text-center text-sm text-success">¡Gracias por tu calificación!</p>
      )}
    </div>
  );
}

function Calificar({ id }: { id: string }) {
  const [stars, setStars] = useState(5);
  const [comentario, setComentario] = useState("");
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: () => calificarPedido(id, stars, comentario),
    onSuccess: () => {
      toast.success("¡Calificación enviada!");
      qc.invalidateQueries({ queryKey: ["pedido", id] });
      qc.invalidateQueries({ queryKey: ["restaurantes"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div className="mt-4 rounded-2xl border bg-card p-5">
      <h2 className="font-semibold">¿Cómo estuvo?</h2>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setStars(n)}>
            <Star className={`h-7 w-7 ${n <= stars ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Dejá un comentario (opcional)"
        className="mt-3 w-full rounded-lg border bg-background p-2 text-sm outline-none"
        rows={3}
      />
      <button onClick={() => m.mutate()} className="mt-3 w-full rounded-lg bg-primary py-2 font-semibold text-primary-foreground">
        Enviar calificación
      </button>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
