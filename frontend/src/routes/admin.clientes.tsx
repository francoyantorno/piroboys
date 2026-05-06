import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listarClientes } from "@/services/personas.service";

export const Route = createFileRoute("/admin/clientes")({
  component: () => {
    const { data = [] } = useQuery({ queryKey: ["clientes"], queryFn: listarClientes });
    return (
      <div>
        <h1 className="text-2xl font-bold">Clientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Los clientes se registran desde la app pública.</p>
        <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Dirección</th><th className="p-3">Tel</th></tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 font-medium">{c.nombre}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.direccion}</td>
                  <td className="p-3">{c.telefono}</td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Sin clientes</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
