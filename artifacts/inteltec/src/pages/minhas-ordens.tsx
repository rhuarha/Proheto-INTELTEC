import { useListProducao } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Package } from "lucide-react";

export default function MinhasOrdensPage() {
  const { user } = useAuth();
  
  // Se o usuário for cliente e tiver clienteId, filtramos as ordens dele.
  // Se for admin/apontador, o hook buscaria tudo (mas essa rota é focada no cliente, 
  // embora admin possa acessá-la também).
  const { data: ordens, isLoading } = useListProducao(
    user?.clienteId ? { clienteId: user.clienteId } : undefined
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Ordens</h1>
        <p className="text-muted-foreground">Acompanhe o status dos seus pedidos.</p>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Histórico de Ordens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem #</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordens?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground/50" />
                        <p>Nenhuma ordem de produção encontrada.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ordens?.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-medium">#{ordem.id}</TableCell>
                      <TableCell>{format(new Date(ordem.dataRecebimento), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {/* We don't have items array directly in the list endpoint unless expanded,
                            but we display simple status for now */}
                        Ver detalhes (em breve)
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ordem.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
