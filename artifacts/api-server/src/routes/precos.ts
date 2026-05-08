import { Router } from "express";
import { db, clienteProdutoPrecoTable, clientesTable, produtosTable, logsTable } from "@workspace/db";
import { eq, and, lte, desc, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { CreatePrecoBody, UpdatePrecoBody, GetPrecoVigenteQueryParams } from "@workspace/api-zod";

const router = Router();

async function getPrecoWithRelations(id: number) {
  const results = await db
    .select({
      preco: clienteProdutoPrecoTable,
      cliente: clientesTable,
      produto: produtosTable,
    })
    .from(clienteProdutoPrecoTable)
    .innerJoin(clientesTable, eq(clienteProdutoPrecoTable.clienteId, clientesTable.id))
    .innerJoin(produtosTable, eq(clienteProdutoPrecoTable.produtoId, produtosTable.id))
    .where(eq(clienteProdutoPrecoTable.id, id))
    .limit(1);

  if (!results[0]) return null;
  const { preco, cliente, produto } = results[0];
  return { ...preco, cliente, produto };
}

router.get("/precos", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const clienteId = req.query.clienteId ? parseInt(req.query.clienteId as string) : undefined;
  const produtoId = req.query.produtoId ? parseInt(req.query.produtoId as string) : undefined;

  const conditions = [];
  if (clienteId) conditions.push(eq(clienteProdutoPrecoTable.clienteId, clienteId));
  if (produtoId) conditions.push(eq(clienteProdutoPrecoTable.produtoId, produtoId));

  const precos = await db
    .select({
      preco: clienteProdutoPrecoTable,
      cliente: clientesTable,
      produto: produtosTable,
    })
    .from(clienteProdutoPrecoTable)
    .innerJoin(clientesTable, eq(clienteProdutoPrecoTable.clienteId, clientesTable.id))
    .innerJoin(produtosTable, eq(clienteProdutoPrecoTable.produtoId, produtosTable.id))
    .where(conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined)
    .orderBy(desc(clienteProdutoPrecoTable.dataInicialValidade));

  res.json(precos.map(({ preco, cliente, produto }) => ({ ...preco, cliente, produto })));
});

// Must be before /precos/:id to avoid route conflict
router.get("/precos/vigente", requireAuth, async (req, res) => {
  const rawQuery = {
    ...req.query,
    data: req.query.data ? new Date(req.query.data as string) : undefined,
    clienteId: req.query.clienteId ? Number(req.query.clienteId) : undefined,
    produtoId: req.query.produtoId ? Number(req.query.produtoId) : undefined,
  };
  const parsed = GetPrecoVigenteQueryParams.safeParse(rawQuery);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "clienteId, produtoId e data são obrigatórios" });
    return;
  }

  const { clienteId, produtoId, data } = parsed.data;

  const results = await db
    .select({
      preco: clienteProdutoPrecoTable,
      cliente: clientesTable,
      produto: produtosTable,
    })
    .from(clienteProdutoPrecoTable)
    .innerJoin(clientesTable, eq(clienteProdutoPrecoTable.clienteId, clientesTable.id))
    .innerJoin(produtosTable, eq(clienteProdutoPrecoTable.produtoId, produtosTable.id))
    .where(and(
      eq(clienteProdutoPrecoTable.clienteId, clienteId),
      eq(clienteProdutoPrecoTable.produtoId, produtoId),
      eq(clienteProdutoPrecoTable.ativo, true),
      lte(clienteProdutoPrecoTable.dataInicialValidade, data),
    ))
    .orderBy(desc(clienteProdutoPrecoTable.dataInicialValidade))
    .limit(1);

  if (!results[0]) {
    res.status(404).json({ error: "Not Found", message: `Não existe preço válido para este cliente/produto na data ${data}` });
    return;
  }

  const { preco, cliente, produto } = results[0];
  res.json({ ...preco, cliente, produto });
});

router.post("/precos", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const parsed = CreatePrecoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }

  // Check for duplicate: same cliente, produto, data_inicial_validade
  const existing = await db.select()
    .from(clienteProdutoPrecoTable)
    .where(and(
      eq(clienteProdutoPrecoTable.clienteId, parsed.data.clienteId),
      eq(clienteProdutoPrecoTable.produtoId, parsed.data.produtoId),
      eq(clienteProdutoPrecoTable.dataInicialValidade, parsed.data.dataInicialValidade),
      eq(clienteProdutoPrecoTable.ativo, true),
    ))
    .limit(1);

  if (existing[0]) {
    res.status(400).json({ error: "Bad Request", message: "Já existe um preço ativo para este cliente/produto na mesma data de vigência" });
    return;
  }

  const inserted = await db.insert(clienteProdutoPrecoTable).values({
    clienteId: parsed.data.clienteId,
    produtoId: parsed.data.produtoId,
    descricao: parsed.data.descricao ?? null,
    preco: parsed.data.preco,
    dataInicialValidade: parsed.data.dataInicialValidade,
    usaPapel: (parsed.data.usaPapel as "B" | "I") ?? "B",
    observacoes: parsed.data.observacoes ?? null,
    ativo: parsed.data.ativo ?? true,
  }).returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "cliente_produto_preco",
    entidadeId: inserted[0].id,
    descricao: `Preço cadastrado: cliente ${parsed.data.clienteId}, produto ${parsed.data.produtoId}, R$ ${parsed.data.preco}`,
  });

  const result = await getPrecoWithRelations(inserted[0].id);
  res.status(201).json(result);
});

router.put("/precos/:id", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdatePrecoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const updates: Partial<typeof clienteProdutoPrecoTable.$inferInsert> = {};
  if (parsed.data.descricao !== undefined) updates.descricao = parsed.data.descricao;
  if (parsed.data.preco !== undefined) updates.preco = parsed.data.preco;
  if (parsed.data.dataInicialValidade !== undefined) updates.dataInicialValidade = parsed.data.dataInicialValidade;
  if (parsed.data.usaPapel !== undefined) updates.usaPapel = parsed.data.usaPapel as "B" | "I";
  if (parsed.data.observacoes !== undefined) updates.observacoes = parsed.data.observacoes;
  if (parsed.data.ativo !== undefined) updates.ativo = parsed.data.ativo;

  const updated = await db.update(clienteProdutoPrecoTable).set(updates)
    .where(eq(clienteProdutoPrecoTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "cliente_produto_preco",
    entidadeId: id,
    descricao: `Preço #${id} atualizado`,
  });

  const result = await getPrecoWithRelations(id);
  res.status(200).json(result);
});

export default router;
