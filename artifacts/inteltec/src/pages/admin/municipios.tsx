import { useState } from "react";
import {
  useListMunicipios,
  useCreateMunicipio,
  useUpdateMunicipio,
  useDeleteMunicipio,
  getMunicipiosQueryKey,
  type Municipio,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";

const municipioSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  uf: z.string().length(2, "UF deve ter 2 letras").toUpperCase(),
  codigoIbge: z.string().min(1, "Código IBGE é obrigatório").max(10),
  ativo: z.boolean().default(true),
});

type FormValues = z.infer<typeof municipioSchema>;

export default function MunicipiosPage() {
  const { data: municipios, isLoading } = useListMunicipios();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Municipio | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Municípios</h1>
          <p className="text-muted-foreground">Tabela normalizada de municípios para o cadastro de clientes.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Município
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Município" : "Novo Município"}</DialogTitle>
            </DialogHeader>
            <MunicipioForm
              editing={editing}
              onSuccess={() => { setIsOpen(false); setEditing(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Lista de Municípios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Código IBGE</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!municipios?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum município cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  municipios.map((m) => (
                    <MunicipioRow
                      key={m.id}
                      municipio={m}
                      onEdit={() => { setEditing(m); setIsOpen(true); }}
                    />
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

function MunicipioRow({ municipio, onEdit }: { municipio: Municipio; onEdit: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteMunicipio = useDeleteMunicipio();

  function handleDelete() {
    if (!confirm(`Remover "${municipio.nome}/${municipio.uf}"?`)) return;
    deleteMunicipio.mutate(municipio.id, {
      onSuccess: () => {
        toast({ title: "Município removido." });
        queryClient.invalidateQueries({ queryKey: getMunicipiosQueryKey() });
      },
      onError: () => {
        toast({ title: "Erro ao remover município.", variant: "destructive" });
      },
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{municipio.nome}</TableCell>
      <TableCell>{municipio.uf}</TableCell>
      <TableCell className="font-mono text-sm">{municipio.codigoIbge}</TableCell>
      <TableCell>
        <Badge variant={municipio.ativo ? "default" : "secondary"}>
          {municipio.ativo ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-1">
        <Button variant="ghost" size="icon" title="Editar" onClick={onEdit}>
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Remover"
          onClick={handleDelete}
          disabled={deleteMunicipio.isPending}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function MunicipioForm({ editing, onSuccess }: { editing: Municipio | null; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMunicipio = useCreateMunicipio();
  const updateMunicipio = useUpdateMunicipio();

  const form = useForm<FormValues>({
    resolver: zodResolver(municipioSchema),
    defaultValues: editing
      ? { nome: editing.nome, uf: editing.uf, codigoIbge: editing.codigoIbge, ativo: editing.ativo }
      : { nome: "", uf: "", codigoIbge: "", ativo: true },
  });

  function onSubmit(values: FormValues) {
    const invalidate = () => queryClient.invalidateQueries({ queryKey: getMunicipiosQueryKey() });

    if (editing) {
      updateMunicipio.mutate(
        { id: editing.id, body: values },
        {
          onSuccess: () => { toast({ title: "Município atualizado!" }); invalidate(); onSuccess(); },
          onError: () => toast({ title: "Erro ao atualizar município.", variant: "destructive" }),
        }
      );
    } else {
      createMunicipio.mutate(values, {
        onSuccess: () => { toast({ title: "Município criado!" }); invalidate(); onSuccess(); },
        onError: () => toast({ title: "Erro ao criar município.", variant: "destructive" }),
      });
    }
  }

  const isPending = createMunicipio.isPending || updateMunicipio.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Caxias do Sul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="RS"
                    maxLength={2}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigoIbge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código IBGE</FormLabel>
                <FormControl>
                  <Input placeholder="4305108" maxLength={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">Ativo</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Município"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
