import { ESTADO_COLOR, ESTADO_LABEL } from "@/lib/estado-pedido";
import type { EstadoPedido } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EstadoBadge({ estado, className }: { estado: EstadoPedido; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", ESTADO_COLOR[estado], className)}>
      {ESTADO_LABEL[estado]}
    </span>
  );
}
