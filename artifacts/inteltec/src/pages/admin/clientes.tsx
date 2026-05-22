import { useState } from "react";
import {
  useListClientes,
  useCreateCliente,
  useUpdateCliente,
  getListClientesQueryKey,
  useListMunicipios,
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
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Users } from "lucide-react";
import { nomeCliente } from "@/lib/date";

const clienteSchema = z.object({
  nomeRazaoSocial: z.string().min(1, "Campo obrigatório"),
  nomeFantasia: z.string().optional(),
  nomeInterno: z.string().optional(),
  juridica: z.boolean().default(true),
  cnpjCpf: z.string().optional(),
  inscrEstadual: z.string().optional(),
  inscrMunicipal: z.string().optional(),
  telefone: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cep: z.string().optional(),
  municipioId: z.coerce.number().optional().nullable(),
  emailNfse: z.string().optional(),
  nomeContato: z.string().optional(),
  emailContato: z.string().optional(),
  emailAprovaDemonstrativo: z.string().optional(),
  emailInformaProdutoEmbalado: z.string().optional(),
  tipoFaturamento: z.enum(["N", "R"]).optional(),
  emiteBoleto: z.boolean().default(true),
  exigeDemonstrativo: z.boolean().default(true),
  pedidoCompra: z.boolean().default(false),
  diretorioProducao: z.string().optional(),
  diretorioDemonstrativo: z.string().optional(),
  prazoPagamento: z.coerce.number().int().optional().nullable(),
  tipoFechamento: z.enum(["IMEDIATO", "POR_VALOR", "POR_VALOR_OU_PRAZO", "POR_PRAZO", "MENSAL_FIXO"]).optional(),
  valorAlvo: z.string().optional(),
  valorMinimo: z.string().optional(),
  prazoMaximoDias: z.coerce.number().int().optional().nullable(),
  diaFechamento: z.string().optional(),
  fecharAoDisponibilizar: z.boolean().default(false),
  ativo: z.boolean().default(true),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

const defaultValues: ClienteFormValues = {
  nomeRazaoSocial: "",
  nomeFantasia: "",
  nomeInterno: "",
  juridica: true,
  cnpjCpf: "",
  inscrEstadual: "",
  inscrMunicipal: "",
  telefone: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cep: "",
  municipioId: null,
  emailNfse: "",
  nomeContato: "",
  emailContato: "",
  emailAprovaDemonstrativo: "",
  emailInformaProdutoEmbalado: "",
  tipoFaturamento: undefined,
  emiteBoleto: true,
  exigeDemonstrativo: true,
  pedidoCompra: false,
  diretorioProducao: "",
  diretorioDemonstrativo: "",
  prazoPagamento: null,
  tipoFechamento: undefined,
  valorAlvo: "",
  valorMinimo: "",
  prazoMaximoDias: null,
  diaFechamento: "",
  fecharAoDisponibilizar: false,
  ativo: true,
};

type ClienteRow = {
  id: number;
  nomeRazaoSocial: string;
  nomeFantasia?: string | null;
  nomeInterno?: string | null;
  juridica: boolean;
  cnpjCpf?: string | null;
  inscrEstadual?: string | null;
  inscrMunicipal?: string | null;
  telefone?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  municipioId?: number | null;
  municipioNome?: string | null;
  municipioUf?: string | null;
  emailNfse?: string | null;
  nomeContato?: string | null;
  emailContato?: string | null;
  emailAprovaDemonstrativo?: string | null;
  emailInformaProdutoEmbalado?: string | null;
  tipoFaturamento?: string | null;
  emiteBoleto: boolean;
  exigeDemonstrativo: boolean;
  pedidoCompra: boolean;
  diretorioProducao?: string | null;
  diretorioDemonstrativo?: string | null;
  prazoPagamento?: number | null;
  tipoFechamento?: string | null;
  valorAlvo?: string | null;
  valorMinimo?: string | null;
  prazoMaximoDias?: number | null;
  diaFechamento?: string | null;
  fecharAoDisponibilizar: boolean;
  ativo: boolean;
};

export default function ClientesPage() {
  const { data: clientes, isLoading } = useListClientes();
  const [editingCliente, setEditingCliente] = useState<ClienteRow | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie o cadastro de clientes.</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Lista de Clientes
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
                  <TableHead>Nome / Razão Social</TableHead>
                  <TableHead>Nome Interno</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>CNPJ/CPF</TableHead>
                  <TableHead>Município/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(clientes as ClienteRow[] | undefined)?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  (clientes as ClienteRow[] | undefined)?.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        <div>{c.nomeRazaoSocial}</div>
                        {c.nomeFantasia && (
                          <div className="text-xs text-muted-foreground">{c.nomeFantasia}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.nomeInterno || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.juridica ? "PJ" : "PF"}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{c.cnpjCpf || "—"}</TableCell>
                      <TableCell>
                        {c.municipioNome ? `${c.municipioNome}${c.municipioUf ? `/${c.municipioUf}` : ""}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.ativo ? "default" : "secondary"}>
                          {c.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCliente(c)}
                        >
                          <Pencil className="h-4 w-4" />
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

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Preencha os dados do novo cliente.</DialogDescription>
          </DialogHeader>
          <ClienteForm initialValues={defaultValues} onSuccess={() => setIsNewOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCliente} onOpenChange={open => !open && setEditingCliente(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>{editingCliente ? nomeCliente(editingCliente) : ""}</DialogDescription>
          </DialogHeader>
          {editingCliente && (
            <ClienteForm
              clienteId={editingCliente.id}
              initialValues={{
                nomeRazaoSocial: editingCliente.nomeRazaoSocial,
                nomeFantasia: editingCliente.nomeFantasia ?? "",
                nomeInterno: editingCliente.nomeInterno ?? "",
                juridica: editingCliente.juridica,
                cnpjCpf: editingCliente.cnpjCpf ?? "",
                inscrEstadual: editingCliente.inscrEstadual ?? "",
                inscrMunicipal: editingCliente.inscrMunicipal ?? "",
                telefone: editingCliente.telefone ?? "",
                logradouro: editingCliente.logradouro ?? "",
                numero: editingCliente.numero ?? "",
                complemento: editingCliente.complemento ?? "",
                bairro: editingCliente.bairro ?? "",
                cep: editingCliente.cep ?? "",
                municipioId: editingCliente.municipioId ?? null,
                emailNfse: editingCliente.emailNfse ?? "",
                nomeContato: editingCliente.nomeContato ?? "",
                emailContato: editingCliente.emailContato ?? "",
                emailAprovaDemonstrativo: editingCliente.emailAprovaDemonstrativo ?? "",
                emailInformaProdutoEmbalado: editingCliente.emailInformaProdutoEmbalado ?? "",
                tipoFaturamento: (editingCliente.tipoFaturamento as "N" | "R" | undefined) ?? undefined,
                emiteBoleto: editingCliente.emiteBoleto,
                exigeDemonstrativo: editingCliente.exigeDemonstrativo,
                pedidoCompra: editingCliente.pedidoCompra,
                diretorioProducao: editingCliente.diretorioProducao ?? "",
                diretorioDemonstrativo: editingCliente.diretorioDemonstrativo ?? "",
                prazoPagamento: editingCliente.prazoPagamento ?? null,
                tipoFechamento: (editingCliente.tipoFechamento as ClienteFormValues["tipoFechamento"]) ?? undefined,
                valorAlvo: editingCliente.valorAlvo ?? "",
                valorMinimo: editingCliente.valorMinimo ?? "",
                prazoMaximoDias: editingCliente.prazoMaximoDias ?? null,
                diaFechamento: editingCliente.diaFechamento ?? "",
                fecharAoDisponibilizar: editingCliente.fecharAoDisponibilizar,
                ativo: editingCliente.ativo,
              }}
              onSuccess={() => setEditingCliente(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MunicipioSelectField({ control }: { control: any }) {
  const { data: municipios = [] } = useListMunicipios();
  return (
    <FormField
      control={control}
      name="municipioId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Município</FormLabel>
          <Select
            onValueChange={(v) => field.onChange(v ? Number(v) : null)}
            value={field.value != null ? String(field.value) : ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o município..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {municipios.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nome}/{m.uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="space-y-1 pt-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      <Separator />
    </div>
  );
}

function SwitchField({
  control,
  name,
  label,
  description,
}: {
  control: any;
  name: string;
  label: string;
  description?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between gap-4 rounded-lg border p-3">
          <div>
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription className="text-xs">{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function ClienteForm({
  clienteId,
  initialValues,
  onSuccess,
}: {
  clienteId?: number;
  initialValues: ClienteFormValues;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialValues,
  });

  function onSubmit(values: ClienteFormValues) {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      clean[k] = v === "" ? undefined : v;
    }

    if (clienteId) {
      updateCliente.mutate(
        { id: clienteId, data: clean as any },
        {
          onSuccess: () => {
            toast({ title: "Cliente atualizado com sucesso!" });
            queryClient.invalidateQueries({ queryKey: getListClientesQueryKey() });
            onSuccess();
          },
          onError: (err: any) => {
            toast({ title: "Erro ao atualizar", description: err?.data?.message, variant: "destructive" });
          },
        }
      );
    } else {
      createCliente.mutate(
        { data: clean as any },
        {
          onSuccess: () => {
            toast({ title: "Cliente criado com sucesso!" });
            queryClient.invalidateQueries({ queryKey: getListClientesQueryKey() });
            onSuccess();
          },
          onError: (err: any) => {
            toast({ title: "Erro ao criar", description: err?.data?.message, variant: "destructive" });
          },
        }
      );
    }
  }

  const isPending = createCliente.isPending || updateCliente.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* 1. Identificação */}
        <SectionHeader title="Identificação" />
        <FormField
          control={form.control}
          name="nomeRazaoSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social / Nome *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomeFantasia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomeInterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Interno</FormLabel>
                <FormControl><Input placeholder="Aparece nas telas de produção" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="juridica"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Pessoa</FormLabel>
                <Select
                  onValueChange={v => field.onChange(v === "true")}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Pessoa Jurídica (PJ)</SelectItem>
                    <SelectItem value="false">Pessoa Física (PF)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpjCpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ / CPF</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inscrEstadual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição Estadual</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inscrMunicipal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição Municipal</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SwitchField
          control={form.control}
          name="ativo"
          label="Cliente Ativo"
          description="Clientes inativos não aparecem nas listagens de produção."
        />

        {/* 2. Contato */}
        <SectionHeader title="Contato" />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomeContato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Contato</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emailContato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail de Contato</FormLabel>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailNfse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail para NFS-e</FormLabel>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emailAprovaDemonstrativo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail Aprovação Demonstrativo</FormLabel>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailInformaProdutoEmbalado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail Produto Embalado</FormLabel>
                <FormDescription className="text-xs">
                  Notificado quando o produto estiver embalado e pronto para retirada.
                </FormDescription>
                <FormControl><Input type="text" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 3. Endereço */}
        <SectionHeader title="Endereço" />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl><Input placeholder="S/N" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <MunicipioSelectField control={form.control} />

        {/* 4. Faturamento e Fechamento */}
        <SectionHeader title="Faturamento" />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipoFaturamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Faturamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="N">Nota Fiscal / NFSe</SelectItem>
                    <SelectItem value="R">Recibo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prazoPagamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo de Pagamento (dias)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SwitchField control={form.control} name="emiteBoleto" label="Emite Boleto" />
          <SwitchField control={form.control} name="exigeDemonstrativo" label="Exige Demonstrativo" />
          <SwitchField control={form.control} name="pedidoCompra" label="Exige Pedido de Compra" />
        </div>

        {/* Fechamento — dentro de Faturamento */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipoFechamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Fechamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="IMEDIATO">Imediato</SelectItem>
                    <SelectItem value="POR_VALOR">Por Valor</SelectItem>
                    <SelectItem value="POR_VALOR_OU_PRAZO">Por Valor ou Prazo</SelectItem>
                    <SelectItem value="POR_PRAZO">Por Prazo</SelectItem>
                    <SelectItem value="MENSAL_FIXO">Mensal Fixo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diaFechamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de Fechamento</FormLabel>
                <FormControl><Input placeholder="Ex: 30, Último" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="valorAlvo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Alvo (R$)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valorMinimo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Mínimo (R$)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prazoMaximoDias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo Máximo (dias)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SwitchField
          control={form.control}
          name="fecharAoDisponibilizar"
          label="Fechar ao Disponibilizar"
          description="Fecha automaticamente ao disponibilizar os itens."
        />

        {/* 5. Diretórios */}
        <SectionHeader title="Diretórios" />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="diretorioProducao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diretório de Produção</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diretorioDemonstrativo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diretório de Demonstrativo</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : clienteId ? "Salvar Alterações" : "Criar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
