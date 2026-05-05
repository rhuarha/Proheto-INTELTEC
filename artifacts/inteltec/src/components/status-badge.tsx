import { Badge } from "@/components/ui/badge";
import { ProducaoStatus } from "@workspace/api-client-react";

const statusConfig: Record<ProducaoStatus, { label: string, colorClass: string }> = {
  RECEBIDA: { label: "Recebida", colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200" },
  EM_PROCESSAMENTO: { label: "Em Processamento", colorClass: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200" },
  PROCESSADA: { label: "Processada", colorClass: "bg-orange-100 text-orange-800 hover:bg-orange-100/80 border-orange-200" },
  EM_PRODUCAO: { label: "Em Produção", colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-100/80 border-purple-200" },
  EMBALADA: { label: "Embalada", colorClass: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80 border-indigo-200" },
  FINALIZADA: { label: "Finalizada", colorClass: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-emerald-200" },
  CANCELADA: { label: "Cancelada", colorClass: "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200" },
};

export function StatusBadge({ status }: { status: ProducaoStatus | string }) {
  const config = statusConfig[status as ProducaoStatus];
  
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <Badge className={`font-medium rounded-sm border ${config.colorClass}`}>
      {config.label}
    </Badge>
  );
}
