import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { crearCliente } from "@/services/personas.service";
import { db } from "@/services/mocks/db";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", direccion: "", telefono: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cliente = await crearCliente({
        nombre: form.nombre,
        email: form.email,
        direccion: form.direccion,
        telefono: form.telefono,
      });
      // crear usuario mock
      const u = { id: `u${Date.now()}`, nombre: form.nombre, email: form.email, rol: "cliente" as const, cliente_id: cliente.id };
      db.usuarios.push(u);
      db.passwords[form.email] = form.password;
      await login(form.email, form.password);
      toast.success("Cuenta creada");
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Registrate como cliente y empezá a pedir.</p>
      </div>
      <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
        <Field label="Nombre"><input className="input" required value={form.nombre} onChange={set("nombre")} /></Field>
        <Field label="Email"><input className="input" type="email" required value={form.email} onChange={set("email")} /></Field>
        <Field label="Contraseña"><input className="input" type="password" required minLength={4} value={form.password} onChange={set("password")} /></Field>
        <Field label="Dirección"><input className="input" required value={form.direccion} onChange={set("direccion")} /></Field>
        <Field label="Teléfono"><input className="input" required value={form.telefono} onChange={set("telefono")} /></Field>
        <button disabled={loading} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50">
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta? <Link to="/login" className="font-medium text-primary">Iniciar sesión</Link>
        </p>
      </form>
      <style>{`.input{width:100%;border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none}.input:focus{border-color:var(--color-ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--color-ring) 20%,transparent)}`}</style>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
