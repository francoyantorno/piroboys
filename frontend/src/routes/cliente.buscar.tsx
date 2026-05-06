import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listarRestaurantes } from "@/services/restaurantes.service";
import { Search, Star } from "lucide-react";

export const Route = createFileRoute("/cliente/buscar")({
  component: Buscar,
});

const CATS = ["", "sushi", "pizza", "hamburguesas", "saludable"];

function Buscar() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [cp, setCp] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["restaurantes", q, cat, cp],
    queryFn: () => listarRestaurantes({ q, categoria: cat || undefined, codigo_postal: cp || undefined }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">¿Qué pedís hoy?</h1>
      <div className="mt-3 flex items-center gap-2 rounded-xl border bg-card p-2">
        <Search className="ml-1 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar restaurante..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <input
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          placeholder="CP"
          className="w-20 rounded-md bg-muted px-2 py-1 text-sm outline-none"
        />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {c || "Todos"}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
        {data.map((r) => (
          <Link
            key={r.id}
            to="/cliente/restaurantes/$id"
            params={{ id: r.id }}
            className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary"
          >
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-2xl font-bold text-primary-foreground">
              {r.nombre[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{r.nombre}</p>
              <p className="text-xs capitalize text-muted-foreground">{r.categoria} · {r.direccion}</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary">
              <Star className="h-4 w-4 fill-current" /> {r.calificacion_promedio.toFixed(1)}
            </span>
          </Link>
        ))}
        {!isLoading && data.length === 0 && (
          <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No se encontraron restaurantes con esos filtros.
          </p>
        )}
      </div>
    </div>
  );
}
