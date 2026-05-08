import { useState } from "react";
import {
  useListPrecos,
  useCreatePreco,
  useListClientes,
  useListProdutos,
  getListPrecosQueryKey,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, DollarSign } from "lucide-react";
import { formatLocalDate, nomeCliente } from "@/lib/date";

const precoSchema = z.object({
  clienteId: z.coerce.number().min(1, "Selecione um cliente"),
  produtoId: z.coerce.number().min(1, "Selecione um produto"),
  preco: z.string().min(1, "Preço é obrigatório"),
  dataInicialValidade: z.string().min(1, "Data de validade é obrigatória"),
  usaPapel: z.nativeEnum(CreatePrecoBodyUsaPapel).optional(),
});

type PrecoFormValues = z.infer<typeof precoSchema>;

function usaPapelLabel(val: string | null | undefined): string {
  if (val === "B") return "Branco";
  if (val === "I") return "Impresso próprio";
  return "Não";
}

export default function PrecosPage() {
  const { data: precos, isLoading } = useListPrecos({});
  const { data: clientes } = useListClientes();
  const { data: produtos } = useListProdutos();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preços por Cliente/Produto</h1>
          <p className="text-muted-foreground">Tabela de preços vigentes por cliente e produto.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Preço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Preço</DialogTitle>
              <DialogDescription>
                Defina o preço de um produto para um cliente a partir de uma data.
              </DialogDescription>
            </DialogHeader>
            <PrecoForm
              clientes={clientes || []}
              produtos={produtos || []}
              onSuccess={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            Tabela de Preços
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Preço (R$)</TableHead>
                  <TableHead>Validade Desde</TableHead>
                  <TableHead>Usa Papel</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {precos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum preço cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  precos?.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {nomeCliente(p.cliente as any)}
                      </TableCell>
                      <TableCell>{p.produto?.descricao}</TableCell>
                      <TableCell className="text-right font-mono">
                        {Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell>{formatLocalDate(p.dataInicialValidade)}</TableCell>
                      <TableCell>{usaPapelLabel(p.usaPapel)}</TableCell>
                      <TableCell>
                        <Badge variant={p.ativo ? "default" : "secondary"}>
                          {p.ativo ? "Ativo" : "Inativo"}
                        </Badge>
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

function PrecoForm({
  clientes,
  produtos,
  onSuccess,
}: {
  clientes: { id: number; nomeRazaoSocial: string; nomeInterno?: string | null; nomeFantasia?: string | null }[];
  produtos: { id: number; descricao: string }[];
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createPreco = useCreatePreco();

  const form = useForm<PrecoFormValues>({
    resolver: zodResolver(precoSchema),
    defaultValues: {
      clienteId: 0,
      produtoId: 0,
      preco: "",
      dataInicialValidade: new Date().toISOString().split("T")[0],
      usaPapel: undefined,
    },
  });

  function onSubmit(values: PrecoFormValues) {
    createPreco.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Preço cadastrado com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListPrecosQueryKey({}) });
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao cadastrar preço",
            description: error?.data?.message || "Verifique os dados e tente novamente.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={v => field.onChange(Number(v))} value={field.value ? String(field.value) : ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {nomeCliente(c)}
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
          name="produtoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <Select onValueChange={v => field.onChange(Number(v))} value={field.value ? String(field.value) : ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {produtos.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
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
          name="preco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" value={field.value} onChange={e => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataInicialValidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Válido a partir de</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usaPapel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Papel</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="B">Branco</SelectItem>
                  <SelectItem value="I">Impresso próprio</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Tipo de papel utilizado neste produto para este cliente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={createPreco.isPending}>
            {createPreco.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
