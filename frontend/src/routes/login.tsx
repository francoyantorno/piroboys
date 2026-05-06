import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("lucia@mail.com");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bienvenido");
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ingresá con tu cuenta para pedir o gestionar.</p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input" />
        </Field>
        <Field label="Contraseña">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input" />
        </Field>
        <button disabled={loading} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tenés cuenta? <Link to="/register" className="font-medium text-primary">Registrate</Link>
        </p>
      </form>
      <div className="rounded-xl bg-muted p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Demo:</p>
        <ul className="mt-1 space-y-0.5">
          <li>admin@rappi.com / admin</li>
          <li>lucia@mail.com / 1234 (cliente)</li>
          <li>mateo@mail.com / 1234 (repartidor)</li>
        </ul>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--color-input);border-radius:.5rem;padding:.5rem .75rem;background:var(--color-background);font-size:.875rem;outline:none;transition:border-color .15s}.input:focus{border-color:var(--color-ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--color-ring) 20%,transparent)}`}</style>
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
