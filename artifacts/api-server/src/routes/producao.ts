import { Router } from "express";
import { db, producaoTable, producaoItemsTable, produtosTable, clientesTable, logsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  CreateProducaoBody,
  UpdateProducaoBody,
  AddProducaoItemBody,
  UpdateProducaoItemBody,
  MarcarImpressoBody,
  MarcarEnvelopadoBody,
  MarcarEmbaladoBody,
  MarcarDespachadoBody,
  ListProducaoQueryParams,
} from "@workspace/api-zod";

const router = Router();

async function getClienteById(id: number) {
  const results = await db.select().from(clientesTable).where(eq(clientesTable.id, id)).limit(1);
  return results[0] ?? null;
}

async function getProdutoById(id: number) {
  const results = await db.select().from(produtosTable).where(eq(produtosTable.id, id)).limit(1);
  return results[0] ?? null;
}

async function getItemWithProdutoAndProducao(itemId: number) {
  const items = await db
    .select({
      item: producaoItemsTable,
      produto: produtosTable,
      producao: producaoTable,
      cliente: clientesTable,
    })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoItemsTable.id, itemId))
    .limit(1);

  if (!items[0]) return null;
  const { item, produto, producao, cliente } = items[0];
  return {
    ...item,
    produto,
    producao: { ...producao, cliente },
  };
}

// ============ PRODUCAO CRUD ============

router.get("/producao", requireAuth, async (req, res) => {
  const parsed = ListProducaoQueryParams.safeParse(req.query);
  const filters = parsed.data;

  let query = db
    .select({
      producao: producaoTable,
      cliente: clientesTable,
    })
    .from(producaoTable)
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id));

  const conditions = [];

  // Clientes só veem suas próprias ordens
  if (req.user!.role === "cliente" && req.user!.clienteId) {
    conditions.push(eq(producaoTable.clienteId, req.user!.clienteId));
  } else if (filters?.clienteId) {
    conditions.push(eq(producaoTable.clienteId, filters.clienteId));
  }

  if (filters?.status) {
    conditions.push(eq(producaoTable.status, filters.status));
  }

  const results = conditions.length > 0
    ? await db
        .select({ producao: producaoTable, cliente: clientesTable })
        .from(producaoTable)
        .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(sql`${producaoTable.createdAt} desc`)
    : await db
        .select({ producao: producaoTable, cliente: clientesTable })
        .from(producaoTable)
        .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
        .orderBy(sql`${producaoTable.createdAt} desc`);

  res.json(results.map(({ producao, cliente }) => ({ ...producao, cliente })));
});

router.post("/producao", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = CreateProducaoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }

  const cliente = await getClienteById(parsed.data.clienteId);
  if (!cliente) {
    res.status(400).json({ error: "Bad Request", message: "Cliente não encontrado" });
    return;
  }

  const inserted = await db.insert(producaoTable).values({
    clienteId: parsed.data.clienteId,
    dataRecebimento: parsed.data.dataRecebimento,
    observacoes: parsed.data.observacoes ?? null,
    status: "RECEBIDA",
  }).returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "producao",
    entidadeId: inserted[0].id,
    descricao: `Ordem de produção criada para ${cliente.nomeRazaoSocial}`,
  });

  res.status(201).json({ ...inserted[0], cliente });
});

router.get("/producao/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const results = await db
    .select({ producao: producaoTable, cliente: clientesTable })
    .from(producaoTable)
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoTable.id, id))
    .limit(1);

  if (!results[0]) { res.status(404).json({ error: "Not Found" }); return; }

  // Check client access
  if (req.user!.role === "cliente" && results[0].producao.clienteId !== req.user!.clienteId) {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .where(eq(producaoItemsTable.producaoId, id))
    .orderBy(producaoItemsTable.itemNumero);

  const { producao, cliente } = results[0];
  res.json({
    ...producao,
    cliente,
    items: items.map(({ item, produto }) => ({
      ...item,
      produto,
      producao: { ...producao, cliente },
    })),
  });
});

router.put("/producao/:id", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdateProducaoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const updates: Partial<typeof producaoTable.$inferInsert> = {};
  if (parsed.data.clienteId !== undefined) updates.clienteId = parsed.data.clienteId;
  if (parsed.data.dataRecebimento !== undefined) updates.dataRecebimento = parsed.data.dataRecebimento;
  if (parsed.data.observacoes !== undefined) updates.observacoes = parsed.data.observacoes;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;

  const updated = await db.update(producaoTable).set(updates).where(eq(producaoTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  const cliente = await getClienteById(updated[0].clienteId);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "producao",
    entidadeId: id,
    descricao: `Ordem de produção #${id} atualizada`,
  });

  res.json({ ...updated[0], cliente });
});

router.post("/producao/:id/concluir-processamento", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  // Check has at least one item
  const itemCount = await db.select({ count: sql<number>`count(*)` })
    .from(producaoItemsTable)
    .where(eq(producaoItemsTable.producaoId, id));

  if (Number(itemCount[0].count) === 0) {
    res.status(400).json({ error: "Bad Request", message: "A ordem deve ter pelo menos um item antes de concluir o processamento" });
    return;
  }

  const updated = await db.update(producaoTable)
    .set({ status: "PROCESSADA" })
    .where(and(eq(producaoTable.id, id), eq(producaoTable.status, "EM_PROCESSAMENTO")))
    .returning();

  // Also handle RECEBIDA -> PROCESSADA
  const updated2 = updated.length === 0
    ? await db.update(producaoTable)
        .set({ status: "PROCESSADA" })
        .where(and(eq(producaoTable.id, id), eq(producaoTable.status, "RECEBIDA")))
        .returning()
    : updated;

  const final = updated2.length > 0 ? updated2 : updated;
  if (!final[0]) { res.status(404).json({ error: "Not Found or invalid status" }); return; }

  const cliente = await getClienteById(final[0].clienteId);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CONCLUIR_PROCESSAMENTO",
    entidade: "producao",
    entidadeId: id,
    descricao: `Processamento da ordem #${id} concluído`,
  });

  res.json({ ...final[0], cliente });
});

router.post("/producao/:id/cancelar", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const updated = await db.update(producaoTable)
    .set({ status: "CANCELADA" })
    .where(eq(producaoTable.id, id))
    .returning();

  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  const cliente = await getClienteById(updated[0].clienteId);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CANCELAR",
    entidade: "producao",
    entidadeId: id,
    descricao: `Ordem de produção #${id} cancelada`,
  });

  res.json({ ...updated[0], cliente });
});

// ============ ITEMS ============

router.get("/producao/:id/items", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable, cliente: clientesTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoItemsTable.producaoId, id))
    .orderBy(producaoItemsTable.itemNumero);

  res.json(items.map(({ item, produto, producao, cliente }) => ({
    ...item,
    produto,
    producao: { ...producao, cliente },
  })));
});

router.post("/producao/:id/items", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const producaoId = parseInt(req.params.id);
  if (isNaN(producaoId)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = AddProducaoItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }

  // Get next item number
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(producaoItemsTable)
    .where(eq(producaoItemsTable.producaoId, producaoId));
  const nextItemNum = Number(countResult[0].count) + 1;

  const inserted = await db.insert(producaoItemsTable).values({
    producaoId,
    produtoId: parsed.data.produtoId,
    quantidade: parsed.data.quantidade,
    multiplicador: parsed.data.multiplicador ?? 1,
    itemNumero: nextItemNum,
  }).returning();

  // Set order to EM_PROCESSAMENTO if RECEBIDA
  await db.update(producaoTable)
    .set({ status: "EM_PROCESSAMENTO" })
    .where(and(eq(producaoTable.id, producaoId), eq(producaoTable.status, "RECEBIDA")));

  const result = await getItemWithProdutoAndProducao(inserted[0].id);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "ADD_ITEM",
    entidade: "producao_item",
    entidadeId: inserted[0].id,
    descricao: `Item adicionado à ordem #${producaoId}`,
  });

  res.status(201).json(result);
});

router.put("/producao/:id/items/:itemId", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const producaoId = parseInt(req.params.id);
  const itemId = parseInt(req.params.itemId);
  if (isNaN(producaoId) || isNaN(itemId)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdateProducaoItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const updates: Partial<typeof producaoItemsTable.$inferInsert> = {};
  if (parsed.data.produtoId !== undefined) updates.produtoId = parsed.data.produtoId;
  if (parsed.data.quantidade !== undefined) updates.quantidade = parsed.data.quantidade;
  if (parsed.data.multiplicador !== undefined) updates.multiplicador = parsed.data.multiplicador;

  await db.update(producaoItemsTable).set(updates)
    .where(and(eq(producaoItemsTable.id, itemId), eq(producaoItemsTable.producaoId, producaoId)));

  const result = await getItemWithProdutoAndProducao(itemId);
  if (!result) { res.status(404).json({ error: "Not Found" }); return; }

  res.json(result);
});

router.delete("/producao/:id/items/:itemId", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const producaoId = parseInt(req.params.id);
  const itemId = parseInt(req.params.itemId);
  if (isNaN(producaoId) || isNaN(itemId)) { res.status(400).json({ error: "Bad Request" }); return; }

  await db.delete(producaoItemsTable)
    .where(and(eq(producaoItemsTable.id, itemId), eq(producaoItemsTable.producaoId, producaoId)));

  res.json({ success: true, message: "Item removido com sucesso" });
});

// ============ ETAPAS (Impressão, Envelopamento, Embalagem, Despacho) ============

router.get("/impressao/items", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable, cliente: clientesTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(and(
      eq(produtosTable.impresso, true),
      eq(producaoItemsTable.impresso, false),
    ));

  res.json(items.map(({ item, produto, producao, cliente }) => ({
    ...item, produto, producao: { ...producao, cliente },
  })));
});

router.post("/impressao/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarImpressoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ impresso: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_IMPRESSO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como impresso`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como impresso` });
});

router.get("/envelopamento/items", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable, cliente: clientesTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(and(
      eq(produtosTable.envelopado, true),
      eq(producaoItemsTable.envelopado, false),
    ));

  // Filter: if product requires printing, item must be printed first
  const filtered = items.filter(({ item, produto }) => {
    if (produto.impresso && !item.impresso) return false;
    return true;
  });

  res.json(filtered.map(({ item, produto, producao, cliente }) => ({
    ...item, produto, producao: { ...producao, cliente },
  })));
});

router.post("/envelopamento/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarEnvelopadoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ envelopado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_ENVELOPADO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como envelopado`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como envelopado` });
});

router.get("/embalagem/items", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable, cliente: clientesTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoItemsTable.embalado, false));

  // Filter: item is ready for packing only if all required prior steps are done
  const filtered = items.filter(({ item, produto }) => {
    if (produto.impresso && !item.impresso) return false;
    if (produto.envelopado && !item.envelopado) return false;
    return true;
  });

  res.json(filtered.map(({ item, produto, producao, cliente }) => ({
    ...item, produto, producao: { ...producao, cliente },
  })));
});

router.post("/embalagem/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarEmbaladoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ embalado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_EMBALADO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como embalado`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como embalado` });
});

router.get("/despacho/items", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable, cliente: clientesTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id))
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(and(
      eq(producaoItemsTable.embalado, true),
      eq(producaoItemsTable.despachado, false),
    ));

  res.json(items.map(({ item, produto, producao, cliente }) => ({
    ...item, produto, producao: { ...producao, cliente },
  })));
});

router.post("/despacho/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarDespachadoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ despachado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));
  }

  // Check if each affected order is now fully dispatched
  const affectedItems = await db.select()
    .from(producaoItemsTable)
    .where(
      // Check for items in affected orders
      sql`${producaoItemsTable.id} = ANY(${parsed.data.itemIds})`
    );

  const producaoIds = [...new Set(affectedItems.map(i => i.producaoId))];
  for (const producaoId of producaoIds) {
    const remaining = await db.select({ count: sql<number>`count(*)` })
      .from(producaoItemsTable)
      .where(and(
        eq(producaoItemsTable.producaoId, producaoId),
        eq(producaoItemsTable.despachado, false),
      ));
    if (Number(remaining[0].count) === 0) {
      await db.update(producaoTable)
        .set({ status: "FINALIZADA" })
        .where(eq(producaoTable.id, producaoId));
    }
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_DESPACHADO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como despachado`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como despachado` });
});

export default router;
