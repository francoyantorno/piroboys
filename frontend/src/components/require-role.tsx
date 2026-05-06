import { Navigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Rol } from "@/lib/types";

export function RequireRole({ rol, children }: { rol: Rol; children: ReactNode }) {
  const { user, loading } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" search={{ redirect: path } as never} />;
  if (user.rol !== rol)
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-2xl font-bold">Acceso restringido</h1>
        <p className="mt-2 text-sm text-muted-foreground">Esta sección es solo para usuarios con rol "{rol}".</p>
      </div>
    );
  return <>{children}</>;
}
