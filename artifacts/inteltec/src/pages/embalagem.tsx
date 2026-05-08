import { useState } from "react";
import {
  useListEmbalagemItems,
  useMarcarEmbalado,
  getListEmbalagemItemsQueryKey,
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
import { Box, CheckSquare } from "lucide-react";
import { formatLocalDate, nomeCliente } from "@/lib/date";

export default function EmbalagemPage() {
  const { data: items, isLoading } = useListEmbalagemItems();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const marcarMutation = useMarcarEmbalado();

  const toggleSelectAll = () => {
    if (selectedIds.length === items?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items?.map(i => i.id) || []);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMarcar = () => {
    if (selectedIds.length === 0) return;
    marcarMutation.mutate(
      { data: { itemIds: selectedIds } },
      {
        onSuccess: () => {
          toast({ title: `${selectedIds.length} item(ns) marcado(s) como embalado(s)` });
          setSelectedIds([]);
          queryClient.invalidateQueries({ queryKey: getListEmbalagemItemsQueryKey() });
        },
        onError: () => {
          toast({ title: "Erro ao atualizar", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Embalagem</h1>
          <p className="text-muted-foreground">Itens prontos para embalagem.</p>
        </div>
        <Button
          onClick={handleMarcar}
          disabled={selectedIds.length === 0 || marcarMutation.isPending}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckSquare className="h-4 w-4" />
          Marcar {selectedIds.length > 0 && `(${selectedIds.length})`} como Embalado
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5 text-muted-foreground" />
            Fila de Embalagem
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
                      checked={!!(items && items.length > 0 && selectedIds.length === items.length)}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Mult.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum item na fila de embalagem.
                    </TableCell>
                  </TableRow>
                ) : (
                  items?.map(item => (
                    <TableRow
                      key={item.id}
                      className={selectedIds.includes(item.id) ? "bg-muted/50" : ""}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => toggleSelect(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        #{item.producaoId}-{item.itemNumero}
                      </TableCell>
                      <TableCell>{nomeCliente(item.producao.cliente as any)}</TableCell>
                      <TableCell>{item.produto.descricao}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatLocalDate(item.producao.dataRecebimento)}
                        {(item.producao as any).horaRecebimento
                          ? ` ${(item.producao as any).horaRecebimento}`
                          : ""}
                      </TableCell>
                      <TableCell className="text-right">{item.quantidade}</TableCell>
                      <TableCell className="text-right">{item.multiplicador}</TableCell>
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
