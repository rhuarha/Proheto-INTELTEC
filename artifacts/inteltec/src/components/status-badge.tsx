import { Badge } from "@/components/ui/badge";

type StatusKey = "recebida" | "processada" | "impressa" | "envelopada" | "embalada" | "retirada" | "cancelada";

const statusConfig: Record<StatusKey, { label: string; colorClass: string }> = {
  recebida:   { label: "Recebida",   colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200" },
  processada: { label: "Processada", colorClass: "bg-orange-100 text-orange-800 hover:bg-orange-100/80 border-orange-200" },
  impressa:   { label: "Impressa",   colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-100/80 border-purple-200" },
  envelopada: { label: "Envelopada", colorClass: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80 border-indigo-200" },
  embalada:   { label: "Embalada",   colorClass: "bg-teal-100 text-teal-800 hover:bg-teal-100/80 border-teal-200" },
  retirada:   { label: "Retirada",   colorClass: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200" },
  cancelada:  { label: "Cancelada",  colorClass: "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as StatusKey];
  if (!config) return <Badge variant="outline">{status}</Badge>;
  return (
    <Badge className={`font-medium rounded-sm border ${config.colorClass}`}>
      {config.label}
    </Badge>
  );
}
