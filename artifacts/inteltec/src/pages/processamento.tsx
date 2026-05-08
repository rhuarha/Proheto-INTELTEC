import { useState } from "react";
import {
  useListProducao,
  useGetProducao,
  useListProducaoItems,
  useAddProducaoItem,
  useDeleteProducaoItem,
  useConcluirProcessamento,
  useListProdutos,
  useCreatePreco,
  getListProducaoQueryKey,
  getListProducaoItemsQueryKey,
  getGetProducaoQueryKey,
  getListPrecosQueryKey,
  getPrecoVigente,
  CreatePrecoBodyUsaPapel,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Plus, Trash2, CheckCircle2, AlertTriangle, DollarSign } from "lucide-react";
import { formatLocalDate, nomeCliente } from "@/lib/date";

export default function ProcessamentoPage() {
  const { data: ordens, isLoading } = useListProducao({ status: "recebida" });
  const [selectedProducaoId, setSelectedProducaoId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Processamento</h1>
        <p className="text-muted-foreground">Adicione itens às ordens recebidas e conclua o processamento.</p>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Ordens Aguardando Processamento
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
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordens?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma ordem pendente de processamento.
                    </TableCell>
                  </TableRow>
                ) : (
                  ordens?.map(ordem => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-medium">#{ordem.id}</TableCell>
                      <TableCell>{nomeCliente(ordem.cliente as any)}</TableCell>
                      <TableCell>
                        {formatLocalDate(ordem.dataRecebimento)}
                        {(ordem as any).horaRecebimento ? ` ${(ordem as any).horaRecebimento}` : ""}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ordem.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedProducaoId(ordem.id)}
                        >
                          Processar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProcessamentoDialog
        producaoId={selectedProducaoId}
        open={selectedProducaoId !== null}
        onOpenChange={open => !open && setSelectedProducaoId(null)}
      />
    </div>
  );
}

const itemSchema = z.object({
  produtoId: z.coerce.number().min(1, "Selecione um produto"),
  quantidade: z.coerce.number().min(1, "Quantidade deve ser maior que 0"),
  multiplicador: z.coerce.number().int().min(1).default(1),
});

const precoSchema = z.object({
  preco: z.string().min(1, "Preço é obrigatório"),
  dataInicialValidade: z.string().min(1, "Data obrigatória"),
  usaPapel: z.nativeEnum(CreatePrecoBodyUsaPapel).optional(),
});

function ProcessamentoDialog({
  producaoId,
  open,
  onOpenChange,
}: {
  producaoId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [missingPreco, setMissingPreco] = useState<{ clienteId: number; produtoId: number; produtoDesc: string } | null>(null);

  const { data: producao } = useGetProducao(producaoId as number, {
    query: { enabled: !!producaoId, queryKey: getGetProducaoQueryKey(producaoId as number) },
  });

  const { data: items, isLoading: loadingItems } = useListProducaoItems(producaoId as number, {
    query: { enabled: !!producaoId, queryKey: getListProducaoItemsQueryKey(producaoId as number) },
  });

  const { data: produtos } = useListProdutos();
  const addItem = useAddProducaoItem();
  const deleteItem = useDeleteProducaoItem();
  const concluir = useConcluirProcessamento();
  const createPreco = useCreatePreco();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { quantidade: 1, multiplicador: 1 },
  });

  const precoForm = useForm<z.infer<typeof precoSchema>>({
    resolver: zodResolver(precoSchema),
    defaultValues: {
      preco: "",
      dataInicialValidade: new Date().toISOString().split("T")[0],
      usaPapel: undefined,
    },
  });

  async function onAddItem(values: z.infer<typeof itemSchema>) {
    if (!producaoId || !producao) return;

    addItem.mutate(
      { id: producaoId, data: values },
      {
        onSuccess: async () => {
          form.reset({ quantidade: 1, multiplicador: 1 });
          queryClient.invalidateQueries({ queryKey: getListProducaoItemsQueryKey(producaoId) });

          try {
            const today = new Date().toISOString().split("T")[0];
            await getPrecoVigente({
              clienteId: producao.clienteId,
              produtoId: values.produtoId,
              data: today,
            });
          } catch {
            const produto = produtos?.find(p => p.id === values.produtoId);
            setMissingPreco({
              clienteId: producao.clienteId,
              produtoId: values.produtoId,
              produtoDesc: produto?.descricao || `Produto #${values.produtoId}`,
            });
          }
        },
        onError: (err: any) => {
          toast({ title: "Erro", description: err?.data?.message, variant: "destructive" });
        },
      }
    );
  }

  function onDeleteItem(itemId: number) {
    if (!producaoId) return;
    deleteItem.mutate(
      { id: producaoId, itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProducaoItemsQueryKey(producaoId) });
        },
      }
    );
  }

  function handleConcluir() {
    if (!producaoId || !items || items.length === 0) return;
    concluir.mutate(
      { id: producaoId },
      {
        onSuccess: () => {
          toast({ title: "Processamento Concluído!" });
          queryClient.invalidateQueries({ queryKey: getListProducaoQueryKey() });
          onOpenChange(false);
        },
      }
    );
  }

  function onSavePreco(values: z.infer<typeof precoSchema>) {
    if (!missingPreco) return;
    createPreco.mutate(
      {
        data: {
          clienteId: missingPreco.clienteId,
          produtoId: missingPreco.produtoId,
          ...values,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Preço cadastrado com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListPrecosQueryKey({}) });
          setMissingPreco(null);
        },
        onError: (err: any) => {
          toast({ title: "Erro ao salvar preço", description: err?.data?.message, variant: "destructive" });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Processamento de Ordem #{producaoId}</DialogTitle>
          <DialogDescription>{nomeCliente(producao?.cliente as any)}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Price missing alert */}
          {missingPreco && (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Preço não cadastrado</AlertTitle>
              <AlertDescription className="text-amber-700 space-y-3">
                <p>
                  Não há preço vigente para <strong>{missingPreco.produtoDesc}</strong> com este cliente.
                  Cadastre um preço agora ou o item ficará sem valor definido.
                </p>
                <Form {...precoForm}>
                  <form onSubmit={precoForm.handleSubmit(onSavePreco)} className="grid grid-cols-3 gap-3 items-end">
                    <FormField
                      control={precoForm.control}
                      name="preco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800">Preço (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={precoForm.control}
                      name="dataInicialValidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800">Válido desde</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={precoForm.control}
                      name="usaPapel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-800">Papel</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="B">Branco</SelectItem>
                              <SelectItem value="I">Impresso próprio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-3 flex gap-2 justify-end">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setMissingPreco(null)}>
                        Ignorar
                      </Button>
                      <Button type="submit" size="sm" disabled={createPreco.isPending} className="gap-2 bg-amber-600 hover:bg-amber-700">
                        <DollarSign className="h-3 w-3" />
                        Salvar Preço
                      </Button>
                    </div>
                  </form>
                </Form>
              </AlertDescription>
            </Alert>
          )}

          {/* Add Item Form */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddItem)} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="produtoId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Produto</FormLabel>
                        <Select
                          onValueChange={val => field.onChange(parseInt(val))}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {produtos?.map(p => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Qtd</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="multiplicador"
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Mult.</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={addItem.isPending}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Items List */}
          <div>
            <h4 className="text-sm font-medium mb-3">Itens da Ordem</h4>
            {loadingItems ? (
              <Skeleton className="h-24 w-full" />
            ) : items?.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground border rounded-md border-dashed">
                Nenhum item adicionado ainda.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Mult.</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items?.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemNumero}</TableCell>
                      <TableCell>{item.produto.descricao}</TableCell>
                      <TableCell className="text-right">{item.quantidade}</TableCell>
                      <TableCell className="text-right">{item.multiplicador}x</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => onDeleteItem(item.id)}
                          disabled={deleteItem.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button
              onClick={handleConcluir}
              disabled={!items?.length || concluir.isPending}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Concluir Processamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
