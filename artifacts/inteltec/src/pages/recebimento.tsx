import { useState } from "react";
import { useListClientes, useCreateProducao, getListProducaoQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

const recebimentoSchema = z.object({
  clienteId: z.coerce.number().min(1, "Selecione um cliente"),
  dataRecebimento: z.string().min(1, "Data é obrigatória"),
  horaRecebimento: z.string().optional(),
  observacoes: z.string().optional(),
});

export default function RecebimentoPage() {
  const { data: clientes, isLoading: loadingClientes } = useListClientes();
  const createProducao = useCreateProducao();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const now = new Date();
  const form = useForm<z.infer<typeof recebimentoSchema>>({
    resolver: zodResolver(recebimentoSchema),
    defaultValues: {
      dataRecebimento: format(now, "yyyy-MM-dd"),
      horaRecebimento: format(now, "HH:mm"),
      observacoes: "",
    },
  });

  function onSubmit(values: z.infer<typeof recebimentoSchema>) {
    createProducao.mutate(
      {
        data: {
          ...values,
          dataRecebimento: new Date(values.dataRecebimento).toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Ordem de Produção criada!" });
          queryClient.invalidateQueries({ queryKey: getListProducaoQueryKey() });
          setLocation("/processamento");
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao criar",
            description: error?.data?.message || "Ocorreu um erro.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recebimento</h1>
        <p className="text-muted-foreground">Registre uma nova entrada de materiais.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Nova Ordem de Produção
          </CardTitle>
          <CardDescription>Preencha os dados básicos para iniciar o controle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={val => field.onChange(parseInt(val))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={loadingClientes ? "Carregando..." : "Selecione o cliente"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes?.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.nomeRazaoSocial}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataRecebimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Recebimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="horaRecebimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Recebimento</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes adicionais sobre o material recebido..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" size="lg" disabled={createProducao.isPending}>
                  {createProducao.isPending ? "Criando..." : "Criar Ordem"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
