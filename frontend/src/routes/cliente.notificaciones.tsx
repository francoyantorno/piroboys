import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { notificacionesCliente, marcarLeida } from "@/services/extras.service";
import { ESTADO_LABEL } from "@/lib/estado-pedido";
import { fmtDate } from "@/lib/format";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/cliente/notificaciones")({
  component: Notif,
});

function Notif() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["notif", user?.cliente_id],
    queryFn: () => notificacionesCliente(user!.cliente_id!),
    enabled: !!user?.cliente_id,
    refetchInterval: 5000,
  });
  const m = useMutation({
    mutationFn: (id: string) => marcarLeida(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notif", user?.cliente_id] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      <ul className="mt-4 space-y-2">
        {data.map((n) => (
          <li
            key={n.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
              n.leida ? "bg-card text-muted-foreground" : "bg-primary/5 border-primary/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <Bell className={`mt-0.5 h-5 w-5 ${n.leida ? "text-muted-foreground" : "text-primary"}`} />
              <div>
                <p className="text-sm font-medium">Pedido #{n.pedido_id.slice(-4)} · {ESTADO_LABEL[n.estado_nuevo]}</p>
                <p className="text-xs">{fmtDate(n.fecha)}</p>
              </div>
            </div>
            {!n.leida && (
              <button onClick={() => m.mutate(n.id)} className="text-xs font-medium text-primary">
                Marcar leída
              </button>
            )}
          </li>
        ))}
        {data.length === 0 && (
          <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">Sin notificaciones</p>
        )}
      </ul>
    </div>
  );
}
