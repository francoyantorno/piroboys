import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

import appCss from "../styles.css?url";

interface RouterCtx {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterCtx>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rappi — Pedí lo que quieras" },
      { name: "description", content: "App de delivery: clientes, restaurantes, repartidores y pedidos en tiempo real." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppShell />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const onAuth = path === "/login" || path === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!onAuth && (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-primary">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">R</span>
              Rappi
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <span className="hidden sm:inline text-muted-foreground">
                    {user.nombre} · <span className="font-medium text-foreground capitalize">{user.rol}</span>
                  </span>
                  <button
                    onClick={logout}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-muted-foreground hover:text-foreground">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
