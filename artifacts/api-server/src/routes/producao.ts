import { Router } from "express";
import { db, producaoTable, producaoItemsTable, produtosTable, clientesTable, logsTable } from "@workspace/db";
import { eq, and, sql, inArray, asc } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import {
  CreateProducaoBody,
  UpdateProducaoBody,
  AddProducaoItemBody,
  UpdateProducaoItemBody,
  MarcarImpressoBody,
  MarcarEnvelopadoBody,
  MarcarEmbaladoBody,
  MarcarRetiradoBody,
  ListProducaoQueryParams,
} from "@workspace/api-zod";

const router = Router();

// ============ HELPERS ============

async function getClienteById(id: number) {
  const results = await db.select().from(clientesTable).where(eq(clientesTable.id, id)).limit(1);
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
  return { ...item, produto, producao: { ...producao, cliente } };
}

// Centralized function to recalculate and update the status of a production order
async function recalcularStatusProducao(producaoId: number): Promise<void> {
  const orderResult = await db
    .select({ status: producaoTable.status })
    .from(producaoTable)
    .where(eq(producaoTable.id, producaoId))
    .limit(1);

  if (!orderResult[0] || orderResult[0].status === "cancelada") return;

  const items = await db
    .select({ item: producaoItemsTable, produto: produtosTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .where(eq(producaoItemsTable.producaoId, producaoId));

  if (items.length === 0) return;

  let newStatus: string;

  // 7. All items retirado
  if (items.every(({ item }) => item.retirado)) {
    newStatus = "retirada";
  }
  // 6. All items embalado
  else if (items.every(({ item }) => item.embalado)) {
    newStatus = "embalada";
  }
  else {
    const needEnvelop = items.filter(({ produto }) => produto.envelopado);
    const needPrint = items.filter(({ produto }) => produto.impresso);

    const allEnveloped = needEnvelop.length === 0 || needEnvelop.every(({ item }) => item.envelopado);
    const allPrinted = needPrint.length === 0 || needPrint.every(({ item }) => item.impresso);

    // 5. All that need envelopamento are envelopado (and at least one needs it)
    if (allEnveloped && needEnvelop.length > 0) {
      newStatus = "envelopada";
    }
    // 4. All that need impressao are impresso (and at least one needs it)
    else if (allPrinted && needPrint.length > 0) {
      newStatus = "impressa";
    }
    // 3. Order has items but stages not finished - stay processada
    else {
      return;
    }
  }

  await db.update(producaoTable)
    .set({ status: newStatus as typeof producaoTable.$inferSelect.status })
    .where(eq(producaoTable.id, producaoId));
}

// ============ PRODUCAO CRUD ============

router.get("/producao", requireAuth, async (req, res) => {
  const parsed = ListProducaoQueryParams.safeParse(req.query);
  const filters = parsed.data;

  const conditions = [];

  if (req.user!.role === "cliente" && req.user!.clienteId) {
    conditions.push(eq(producaoTable.clienteId, req.user!.clienteId));
  } else if (filters?.clienteId) {
    conditions.push(eq(producaoTable.clienteId, filters.clienteId));
  }

  if (filters?.status) {
    // Support comma-separated status filter
    const statuses = filters.status.split(",").map((s: string) => s.trim());
    if (statuses.length === 1) {
      conditions.push(eq(producaoTable.status, statuses[0] as typeof producaoTable.$inferSelect.status));
    } else if (statuses.length > 1) {
      conditions.push(inArray(producaoTable.status, statuses as Array<typeof producaoTable.$inferSelect.status>));
    }
  }

  const whereClause = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;
  const baseQuery = db
    .select({ producao: producaoTable, cliente: clientesTable })
    .from(producaoTable)
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(whereClause);

  const results = filters?.status === "recebida"
    ? await baseQuery.orderBy(asc(producaoTable.dataRecebimento), asc(producaoTable.horaRecebimento), asc(producaoTable.id))
    : await baseQuery.orderBy(sql`${producaoTable.createdAt} desc`);

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
    horaRecebimento: parsed.data.horaRecebimento ?? null,
    observacoes: parsed.data.observacoes ?? null,
    status: "recebida",
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
  if (parsed.data.horaRecebimento !== undefined) updates.horaRecebimento = parsed.data.horaRecebimento;
  if (parsed.data.observacoes !== undefined) updates.observacoes = parsed.data.observacoes;
  if (parsed.data.status !== undefined) updates.status = parsed.data.status as typeof producaoTable.$inferSelect.status;

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

  const itemCount = await db.select({ count: sql<number>`count(*)` })
    .from(producaoItemsTable)
    .where(eq(producaoItemsTable.producaoId, id));

  if (Number(itemCount[0].count) === 0) {
    res.status(400).json({ error: "Bad Request", message: "A ordem deve ter pelo menos um item antes de concluir o processamento" });
    return;
  }

  const updated = await db.update(producaoTable)
    .set({ status: "processada" })
    .where(and(eq(producaoTable.id, id), eq(producaoTable.status, "recebida")))
    .returning();

  if (!updated[0]) { res.status(400).json({ error: "Bad Request", message: "Ordem não encontrada ou já processada" }); return; }

  const cliente = await getClienteById(updated[0].clienteId);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CONCLUIR_PROCESSAMENTO",
    entidade: "producao",
    entidadeId: id,
    descricao: `Processamento da ordem #${id} concluído`,
  });

  res.json({ ...updated[0], cliente });
});

router.post("/producao/:id/cancelar", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const updated = await db.update(producaoTable)
    .set({ status: "cancelada" })
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

  // Only allow adding items to recebida orders
  const ordem = await db.select({ status: producaoTable.status }).from(producaoTable).where(eq(producaoTable.id, producaoId)).limit(1);
  if (!ordem[0] || ordem[0].status !== "recebida") {
    res.status(400).json({ error: "Bad Request", message: "Itens só podem ser adicionados a ordens com status 'recebida'" });
    return;
  }

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

  const result = await getItemWithProdutoAndProducao(inserted[0].id);

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "ADD_ITEM",
    entidade: "producao_item",
    entidadeId: inserted[0].id,
    descricao: `Item ${nextItemNum} adicionado à ordem #${producaoId}`,
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

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE_ITEM",
    entidade: "producao_item",
    entidadeId: itemId,
    descricao: `Item #${itemId} da ordem #${producaoId} atualizado`,
  });

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

// ============ ETAPAS ============

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
      eq(producaoTable.status, "processada"),
    ));

  res.json(items.map(({ item, produto, producao, cliente }) => ({
    ...item, produto, producao: { ...producao, cliente },
  })));
});

router.post("/impressao/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarImpressoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  const affectedProducaoIds = new Set<number>();

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ impresso: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));

    const item = await db.select({ producaoId: producaoItemsTable.producaoId })
      .from(producaoItemsTable).where(eq(producaoItemsTable.id, itemId)).limit(1);
    if (item[0]) affectedProducaoIds.add(item[0].producaoId);
  }

  for (const producaoId of affectedProducaoIds) {
    await recalcularStatusProducao(producaoId);
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
      inArray(producaoTable.status, ["processada", "impressa"]),
    ));

  // If product requires printing, it must be printed first
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

  const affectedProducaoIds = new Set<number>();

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ envelopado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));

    const item = await db.select({ producaoId: producaoItemsTable.producaoId })
      .from(producaoItemsTable).where(eq(producaoItemsTable.id, itemId)).limit(1);
    if (item[0]) affectedProducaoIds.add(item[0].producaoId);
  }

  for (const producaoId of affectedProducaoIds) {
    await recalcularStatusProducao(producaoId);
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
    .where(and(
      eq(producaoItemsTable.embalado, false),
      inArray(producaoTable.status, ["processada", "impressa", "envelopada"]),
    ));

  // Item is ready for packing only if all required prior steps are done
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

  const affectedProducaoIds = new Set<number>();

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ embalado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));

    const item = await db.select({ producaoId: producaoItemsTable.producaoId })
      .from(producaoItemsTable).where(eq(producaoItemsTable.id, itemId)).limit(1);
    if (item[0]) affectedProducaoIds.add(item[0].producaoId);
  }

  for (const producaoId of affectedProducaoIds) {
    await recalcularStatusProducao(producaoId);
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_EMBALADO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como embalado`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como embalado` });
});

// Retirada - list orders ready for pickup (embalada)
router.get("/retirada/ordens", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const ordens = await db
    .select({ producao: producaoTable, cliente: clientesTable })
    .from(producaoTable)
    .innerJoin(clientesTable, eq(producaoTable.clienteId, clientesTable.id))
    .where(eq(producaoTable.status, "embalada"))
    .orderBy(sql`${producaoTable.updatedAt} desc`);

  const result = [];
  for (const { producao, cliente } of ordens) {
    const items = await db
      .select({ item: producaoItemsTable, produto: produtosTable })
      .from(producaoItemsTable)
      .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
      .where(eq(producaoItemsTable.producaoId, producao.id))
      .orderBy(producaoItemsTable.itemNumero);

    result.push({
      ...producao,
      cliente,
      items: items.map(({ item, produto }) => ({
        ...item,
        produto,
        producao: { ...producao, cliente },
      })),
    });
  }

  res.json(result);
});

router.post("/retirada/marcar", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = MarcarRetiradoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request" }); return; }

  const affectedProducaoIds = new Set<number>();

  for (const itemId of parsed.data.itemIds) {
    await db.update(producaoItemsTable)
      .set({ retirado: true, dataUltimoStatus: new Date() })
      .where(eq(producaoItemsTable.id, itemId));

    const item = await db.select({ producaoId: producaoItemsTable.producaoId })
      .from(producaoItemsTable).where(eq(producaoItemsTable.id, itemId)).limit(1);
    if (item[0]) affectedProducaoIds.add(item[0].producaoId);
  }

  for (const producaoId of affectedProducaoIds) {
    await recalcularStatusProducao(producaoId);
  }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "MARCAR_RETIRADO",
    entidade: "producao_item",
    descricao: `${parsed.data.itemIds.length} item(s) marcado(s) como retirado`,
  });

  res.json({ success: true, message: `${parsed.data.itemIds.length} item(s) marcado(s) como retirado` });
});

export default router;
