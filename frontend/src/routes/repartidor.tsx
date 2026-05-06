import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/require-role";

export const Route = createFileRoute("/repartidor")({
  component: () => (
    <RequireRole rol="repartidor">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </div>
    </RequireRole>
  ),
});
