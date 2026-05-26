import { Router } from "express";
import { db, recebimentoLoteTable, producaoTable, clientesTable, logsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { CreateRecebimentoLoteBody } from "@workspace/api-zod";

const router = Router();

router.post("/recebimento-lotes", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = CreateRecebimentoLoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }

  const { clientes: clientesPayload, ...loteData } = parsed.data;

  // Validar que todos os clientes existem e estão ativos (usando IDs únicos para a query)
  const uniqueClienteIds = [...new Set(clientesPayload.map((c) => c.cliente_id))];
  const clientesDb = await db
    .select()
    .from(clientesTable)
    .where(inArray(clientesTable.id, uniqueClienteIds));

  if (clientesDb.length !== uniqueClienteIds.length) {
    res.status(400).json({ error: "Bad Request", message: "Um ou mais clientes não encontrados" });
    return;
  }

  const inativo = clientesDb.find((c) => !c.ativo);
  if (inativo) {
    res.status(400).json({
      error: "Bad Request",
      message: `Cliente "${inativo.nomeRazaoSocial}" está inativo`,
    });
    return;
  }

  const result = await db.transaction(async (tx) => {
    const [lote] = await tx
      .insert(recebimentoLoteTable)
      .values({
        dataRecebimento: loteData.data_recebimento,
        horaRecebimento: loteData.hora_recebimento,
        origem: loteData.origem,
        remetente: loteData.remetente ?? null,
        assunto: loteData.assunto ?? null,
        observacoes: loteData.observacoes ?? null,
      })
      .returning();

    await tx.insert(logsTable).values({
      userId: req.user!.userId,
      acao: "CREATE",
      entidade: "recebimento_lote",
      entidadeId: lote.id,
      descricao: `Criado recebimento em lote #${lote.id} com origem ${lote.origem}`,
    });

    const ordensIds: number[] = [];

    for (const entry of clientesPayload) {
      const [ordem] = await tx
        .insert(producaoTable)
        .values({
          clienteId: entry.cliente_id,
          dataRecebimento: loteData.data_recebimento,
          horaRecebimento: loteData.hora_recebimento,
          observacoes: entry.observacoes ?? null,
          status: "recebida",
          recebimentoLoteId: lote.id,
        })
        .returning();

      ordensIds.push(ordem.id);

      await tx.insert(logsTable).values({
        userId: req.user!.userId,
        acao: "CREATE",
        entidade: "producao",
        entidadeId: ordem.id,
        descricao: `Criada Ordem de Produção #${ordem.id} a partir do lote #${lote.id}`,
      });
    }

    return { loteId: lote.id, ordensIds };
  });

  res.status(201).json({
    lote_id: result.loteId,
    ordens_criadas: result.ordensIds,
    total_ordens: result.ordensIds.length,
  });
});

router.get("/recebimento-lotes/:id", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const loteResult = await db
    .select()
    .from(recebimentoLoteTable)
    .where(eq(recebimentoLoteTable.id, id))
    .limit(1);

  if (!loteResult[0]) { res.status(404).json({ error: "Not Found" }); return; }

  const ordens = await db
    .select({ producao: producaoTable, cliente: clientesTable })
    .from(producaoTable)
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoTable.recebimentoLoteId, id));

  res.json({
    ...loteResult[0],
    ordens: ordens.map(({ producao, cliente }) => ({ ...producao, cliente })),
  });
});

export default router;
