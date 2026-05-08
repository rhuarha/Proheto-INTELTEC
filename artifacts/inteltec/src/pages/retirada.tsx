import { useState } from "react";
import {
  useListRetiradaOrdens,
  useMarcarRetirado,
  getListRetiradaOrdensQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PackageCheck, ChevronDown, ChevronRight } from "lucide-react";

export default function RetiradaPage() {
  const { data: ordens, isLoading } = useListRetiradaOrdens();
  const [expandedOrdens, setExpandedOrdens] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Record<number, number[]>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const marcarMutation = useMarcarRetirado();

  const toggleOrdem = (ordemId: number) => {
    setExpandedOrdens(prev => {
      const next = new Set(prev);
      if (next.has(ordemId)) next.delete(ordemId);
      else next.add(ordemId);
      return next;
    });
  };

  const toggleItem = (ordemId: number, itemId: number) => {
    setSelectedItems(prev => {
      const current = prev[ordemId] || [];
      const has = current.includes(itemId);
      return {
        ...prev,
        [ordemId]: has ? current.filter(i => i !== itemId) : [...current, itemId],
      };
    });
  };

  const toggleAllItems = (ordemId: number, itemIds: number[]) => {
    setSelectedItems(prev => {
      const current = prev[ordemId] || [];
      const allSelected = itemIds.every(id => current.includes(id));
      return { ...prev, [ordemId]: allSelected ? [] : itemIds };
    });
  };

  const handleConfirmar = (ordemId: number) => {
    const ids = selectedItems[ordemId] || [];
    if (ids.length === 0) return;
    marcarMutation.mutate(
      { data: { itemIds: ids } },
      {
        onSuccess: () => {
          toast({ title: `${ids.length} item(ns) marcado(s) como retirado(s)!` });
          setSelectedItems(prev => ({ ...prev, [ordemId]: [] }));
          queryClient.invalidateQueries({ queryKey: getListRetiradaOrdensQueryKey() });
        },
        onError: () => {
          toast({ title: "Erro ao confirmar retirada", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retirada</h1>
        <p className="text-muted-foreground">Confirme a retirada dos itens embalados pelo cliente.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : ordens?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <PackageCheck className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p>Nenhuma ordem aguardando retirada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ordens?.map(ordem => {
            const isExpanded = expandedOrdens.has(ordem.id);
            const retiradaItems = (ordem.items ?? []).filter(i => !i.retirado);
            const itemIds = retiradaItems.map(i => i.id);
            const selected = selectedItems[ordem.id] || [];
            const allSelected = itemIds.length > 0 && itemIds.every(id => selected.includes(id));

            return (
              <Card key={ordem.id}>
                <CardHeader
                  className="py-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
                  onClick={() => toggleOrdem(ordem.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <CardTitle className="text-base">
                        Ordem #{ordem.id} — {ordem.cliente?.nomeRazaoSocial}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(ordem.dataRecebimento), "dd/MM/yyyy")}
                        {ordem.horaRecebimento ? ` ${ordem.horaRecebimento}` : ""}
                      </Badge>
                    </div>
                    <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                      {retiradaItems.length} pendente(s)
                    </Badge>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={() => toggleAllItems(ordem.id, itemIds)}
                            />
                          </TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-right">Qtd</TableHead>
                          <TableHead className="text-right">Mult.</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {retiradaItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              Todos os itens já foram retirados.
                            </TableCell>
                          </TableRow>
                        ) : (
                          retiradaItems.map(item => (
                            <TableRow
                              key={item.id}
                              className={selected.includes(item.id) ? "bg-muted/50" : ""}
                            >
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={selected.includes(item.id)}
                                  onCheckedChange={() => toggleItem(ordem.id, item.id)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                #{ordem.id}-{item.itemNumero}
                              </TableCell>
                              <TableCell>{item.produto?.descricao}</TableCell>
                              <TableCell className="text-right">{item.quantidade}</TableCell>
                              <TableCell className="text-right">{item.multiplicador}</TableCell>
                              <TableCell className="text-right font-medium">
                                {item.quantidade * item.multiplicador}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    {retiradaItems.length > 0 && (
                      <div className="flex justify-end mt-3">
                        <Button
                          onClick={() => handleConfirmar(ordem.id)}
                          disabled={selected.length === 0 || marcarMutation.isPending}
                          className="gap-2"
                        >
                          <PackageCheck className="h-4 w-4" />
                          Confirmar Retirada {selected.length > 0 && `(${selected.length})`}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
