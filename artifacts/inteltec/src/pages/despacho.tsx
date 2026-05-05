import { useState } from "react";
import { 
  useListDespachoItems, 
  useMarcarDespachado,
  getListDespachoItemsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Truck, Send } from "lucide-react";

export default function DespachoPage() {
  const { data: items, isLoading } = useListDespachoItems();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const marcarMutation = useMarcarDespachado();

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
        toast({ title: `${selectedIds.length} itens despachados com sucesso!` });
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: getListDespachoItemsQueryKey() });
      },
      onError: () => {
        toast({ title: "Erro ao despachar", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despacho</h1>
          <p className="text-muted-foreground">Itens prontos para envio ao cliente.</p>
        </div>
        <Button 
          onClick={handleMarcar} 
          disabled={selectedIds.length === 0 || marcarMutation.isPending}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Despachar {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            Fila de Despacho
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
                      Nenhum item na fila de despacho.
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
