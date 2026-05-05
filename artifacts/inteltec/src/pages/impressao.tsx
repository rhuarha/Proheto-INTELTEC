import { useState } from "react";
import { 
  useListImpressaoItems, 
  useMarcarImpresso,
  getListImpressaoItemsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Printer, CheckSquare } from "lucide-react";

export default function ImpressaoPage() {
  const { data: items, isLoading } = useListImpressaoItems();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const marcarMutation = useMarcarImpresso();

  const toggleSelectAll = () => {
    if (selectedIds.length === items?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items?.map(i => i.id) || []);
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMarcar = () => {
    if (selectedIds.length === 0) return;
    
    marcarMutation.mutate({ data: { itemIds: selectedIds } }, {
      onSuccess: () => {
        toast({ title: `${selectedIds.length} itens marcados como impressos` });
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: getListImpressaoItemsQueryKey() });
      },
      onError: () => {
        toast({ title: "Erro ao atualizar", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impressão</h1>
          <p className="text-muted-foreground">Gerencie os itens aguardando impressão.</p>
        </div>
        <Button 
          onClick={handleMarcar} 
          disabled={selectedIds.length === 0 || marcarMutation.isPending}
          className="gap-2"
        >
          <CheckSquare className="h-4 w-4" />
          Marcar {selectedIds.length > 0 && `(${selectedIds.length})`} como Impresso
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Printer className="h-5 w-5 text-muted-foreground" />
            Fila de Impressão
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox 
                      checked={items?.length > 0 && selectedIds.length === items.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum item na fila de impressão.
                    </TableCell>
                  </TableRow>
                ) : (
                  items?.map((item) => (
                    <TableRow key={item.id} className={selectedIds.includes(item.id) ? "bg-muted/50" : ""}>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => toggleSelect(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        #{item.producaoId}-{item.itemNumero}
                      </TableCell>
                      <TableCell>{item.producao.cliente.nomeRazaoSocial}</TableCell>
                      <TableCell>{item.produto.descricao}</TableCell>
                      <TableCell className="text-right font-medium">
                        {item.quantidade * item.multiplicador}
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
