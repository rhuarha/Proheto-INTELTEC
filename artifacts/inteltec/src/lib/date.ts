export function formatLocalDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const s = String(dateStr).split("T")[0];
  const parts = s.split("-");
  if (parts.length !== 3) return s;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function nomeCliente(
  cliente: { nomeInterno?: string | null; nomeFantasia?: string | null; nomeRazaoSocial: string } | null | undefined
): string {
  if (!cliente) return "";
  return cliente.nomeInterno || cliente.nomeFantasia || cliente.nomeRazaoSocial;
}
