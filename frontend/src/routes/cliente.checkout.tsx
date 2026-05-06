import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { fmtMoney } from "@/lib/format";
import { crearPedido } from "@/services/pedidos.service";
import { validarCupon } from "@/services/extras.service";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { db } from "@/services/mocks/db";

export const Route = createFileRoute("/cliente/checkout")({
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const { items, restauranteId, setQty, remove, clear, subtotal } = useCart();
  const nav = useNavigate();
  const cliente = db.clientes.find((c) => c.id === user?.cliente_id);
  const [direccion, setDireccion] = useState(cliente?.direccion ?? "");
  const [cp, setCp] = useState("1414");
  const [cupon, setCupon] = useState("");
  const [descuento, setDescuento] = useState(0);

  const validar = useMutation({
    mutationFn: () => validarCupon(cupon.toUpperCase(), subtotal),
    onSuccess: (r) => {
      setDescuento(r.descuento);
      toast.success(`Cupón aplicado: ${r.cupon.porcentaje}% de descuento`);
    },
    onError: (e) => {
      setDescuento(0);
      toast.error((e as Error).message);
    },
  });

  const total = subtotal - descuento;

  const enviar = useMutation({
    mutationFn: () =>
      crearPedido({
        cliente_id: user!.cliente_id!,
        restaurante_id: restauranteId!,
        items: items.map((i) => ({ plato_id: i.plato.id, cantidad: i.cantidad })),
        direccion_entrega: direccion,
        codigo_postal: cp,
        cupon_codigo: descuento > 0 ? cupon.toUpperCase() : undefined,
      }),
    onSuccess: (p) => {
      toast.success("Pedido creado");
      clear();
      nav({ to: "/cliente/pedidos/$id", params: { id: p.id } });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link to="/cliente/buscar" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Explorar restaurantes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Tu pedido</h1>
      <ul className="mt-4 divide-y rounded-2xl border bg-card">
        {items.map((it) => (
          <li key={it.plato.id} className="flex items-center justify-between gap-3 p-4">
            <div className="flex-1">
              <p className="font-medium">{it.plato.nombre}</p>
              <p className="text-xs text-muted-foreground">{fmtMoney(it.plato.precio)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(it.plato.id, it.cantidad - 1)} className="h-7 w-7 rounded-full border">−</button>
              <span className="w-6 text-center">{it.cantidad}</span>
              <button onClick={() => setQty(it.plato.id, it.cantidad + 1)} className="h-7 w-7 rounded-full bg-primary text-primary-foreground">+</button>
              <button onClick={() => remove(it.plato.id)} className="ml-2 text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-3 rounded-2xl border bg-card p-4">
        <h2 className="font-semibold">Entrega</h2>
        <input className="input w-full" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <input className="input w-full" placeholder="Código postal" value={cp} onChange={(e) => setCp(e.target.value)} />
      </div>

      <div className="mt-5 rounded-2xl border bg-card p-4">
        <h2 className="font-semibold">Cupón</h2>
        <div className="mt-2 flex gap-2">
          <input className="input flex-1" placeholder="Código" value={cupon} onChange={(e) => setCupon(e.target.value)} />
          <button onClick={() => validar.mutate()} className="rounded-lg border px-3 text-sm font-semibold">Aplicar</button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Probá: BIENVENIDA10 o SUSHI20</p>
      </div>

      <div className="mt-5 space-y-1 rounded-2xl border bg-card p-4 text-sm">
        <Row label="Subtotal" value={fmtMoney(subtotal)} />
        {descuento > 0 && <Row label="Descuento" value={`- ${fmtMoney(descuento)}`} />}
        <div className="my-2 h-px bg-border" />
        <Row label="Total" value={fmtMoney(total)} bold />
      </div>

      <button
        onClick={() => enviar.mutate()}
        disabled={enviar.isPending}
        className="mt-5 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {enviar.isPending ? "Creando pedido..." : `Confirmar pedido · ${fmtMoney(total)}`}
      </button>
      <style>{`.input{border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}`}</style>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
