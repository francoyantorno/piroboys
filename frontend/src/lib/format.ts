export function fmtMoney(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}
export function fmtDate(d: string) {
  return new Date(d).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}
