import { useState } from "react";
import { format } from "date-fns";
import { useListClientes, useCreateRecebimentoLote, getListProducaoQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { nomeCliente } from "@/lib/date";

interface ClienteLinha {
  clienteId: string;
  observacoes: string;
}

interface RecebimentoLoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ORIGENS = [
  { value: "EMAIL", label: "E-mail" },
  { value: "FTP", label: "FTP" },
  { value: "MANUAL", label: "Manual" },
  { value: "OUTRO", label: "Outro" },
] as const;

export function RecebimentoLoteModal({ open, onOpenChange }: RecebimentoLoteModalProps) {
  const { data: clientes, isLoading: loadingClientes } = useListClientes();
  const createLote = useCreateRecebimentoLote();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const now = new Date();
  const [dataRecebimento, setDataRecebimento] = useState(format(now, "yyyy-MM-dd"));
  const [horaRecebimento, setHoraRecebimento] = useState(format(now, "HH:mm"));
  const [origem, setOrigem] = useState<string>("EMAIL");
  const [remetente, setRemetente] = useState("");
  const [assunto, setAssunto] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [linhas, setLinhas] = useState<ClienteLinha[]>([{ clienteId: "", observacoes: "" }]);
  const [erros, setErros] = useState<string[]>([]);

  function resetForm() {
    const n = new Date();
    setDataRecebimento(format(n, "yyyy-MM-dd"));
    setHoraRecebimento(format(n, "HH:mm"));
    setOrigem("EMAIL");
    setRemetente("");
    setAssunto("");
    setObservacoes("");
    setLinhas([{ clienteId: "", observacoes: "" }]);
    setErros([]);
  }

  function handleClose(open: boolean) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  function adicionarLinha() {
    setLinhas((prev) => [...prev, { clienteId: "", observacoes: "" }]);
  }

  function removerLinha(idx: number) {
    setLinhas((prev) => prev.filter((_, i) => i !== idx));
  }

  function atualizarLinha(idx: number, campo: keyof ClienteLinha, valor: string) {
    setLinhas((prev) => prev.map((l, i) => (i === idx ? { ...l, [campo]: valor } : l)));
  }

  function validar(): string[] {
    const msgs: string[] = [];
    if (!dataRecebimento) msgs.push("Data de recebimento é obrigatória.");
    if (!horaRecebimento) msgs.push("Hora de recebimento é obrigatória.");
    if (!origem) msgs.push("Origem é obrigatória.");

    const linhasPreenchidas = linhas.filter((l) => l.clienteId !== "");
    if (linhasPreenchidas.length === 0) msgs.push("Selecione ao menos um cliente.");

    const ids = linhasPreenchidas.map((l) => l.clienteId);
    const uniq = new Set(ids);
    if (uniq.size !== ids.length) msgs.push("Há clientes duplicados no lote.");

    return msgs;
  }

  function handleSalvar() {
    const msgs = validar();
    if (msgs.length > 0) {
      setErros(msgs);
      return;
    }
    setErros([]);

    const clientesPayload = linhas
      .filter((l) => l.clienteId !== "")
      .map((l) => ({
        cliente_id: parseInt(l.clienteId),
        observacoes: l.observacoes || undefined,
      }));

    createLote.mutate(
      {
        data_recebimento: dataRecebimento,
        hora_recebimento: horaRecebimento,
        origem: origem as "EMAIL" | "FTP" | "MANUAL" | "OUTRO",
        remetente: remetente || undefined,
        assunto: assunto || undefined,
        observacoes: observacoes || undefined,
        clientes: clientesPayload,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Lote criado com sucesso!",
            description: `${data.total_ordens} Ordem(ns) de Produção criada(s) — Lote #${data.lote_id}`,
          });
          queryClient.invalidateQueries({ queryKey: getListProducaoQueryKey() });
          handleClose(false);
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao criar lote",
            description: error?.data?.message || "Ocorreu um erro.",
            variant: "destructive",
          });
        },
      }
    );
  }

  const clientesAtivos = clientes?.filter((c) => c.ativo) ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Novo Recebimento em Lote
          </DialogTitle>
          <DialogDescription>
            Registre um recebimento que gera Ordens de Produção para múltiplos clientes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Dados gerais do lote */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dataRecebimento">Data de Recebimento *</Label>
              <Input
                id="dataRecebimento"
                type="date"
                value={dataRecebimento}
                onChange={(e) => setDataRecebimento(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horaRecebimento">Hora de Recebimento *</Label>
              <Input
                id="horaRecebimento"
                type="time"
                value={horaRecebimento}
                onChange={(e) => setHoraRecebimento(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="origem">Origem *</Label>
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger id="origem">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                {ORIGENS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="remetente">Remetente</Label>
              <Input
                id="remetente"
                placeholder="ex: fornecedor@empresa.com.br"
                value={remetente}
                onChange={(e) => setRemetente(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                placeholder="ex: Arquivos para produção"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Detalhes sobre este lote..."
              className="resize-none"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          {/* Grade de clientes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Clientes do Lote *</Label>
              <Button type="button" variant="outline" size="sm" onClick={adicionarLinha}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar cliente
              </Button>
            </div>

            <div className="space-y-2">
              {linhas.map((linha, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select
                      value={linha.clienteId}
                      onValueChange={(val) => atualizarLinha(idx, "clienteId", val)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingClientes ? "Carregando..." : "Selecione o cliente"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {clientesAtivos.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {nomeCliente(c as any)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Observação desta ordem (opcional)"
                      value={linha.observacoes}
                      onChange={(e) => atualizarLinha(idx, "observacoes", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removerLinha(idx)}
                    disabled={linhas.length === 1}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Erros de validação */}
          {erros.length > 0 && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 space-y-1">
              {erros.map((msg, i) => (
                <p key={i} className="text-sm text-destructive">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={createLote.isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={createLote.isPending}>
            {createLote.isPending ? "Salvando..." : "Salvar Lote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
