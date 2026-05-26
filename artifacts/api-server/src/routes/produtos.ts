import { Router } from "express";
import { db, produtosTable, logsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { CreateProdutoBody, UpdateProdutoBody } from "@workspace/api-zod";

const router = Router();

router.get("/produtos", requireAuth, async (req, res) => {
  const all = req.query.all === "true";
  const query = db.select().from(produtosTable);
  if (!all) {
    const produtos = await db.select().from(produtosTable)
      .where(eq(produtosTable.ativo, true))
      .orderBy(produtosTable.descricao);
    res.json(produtos);
    return;
  }
  const produtos = await query.orderBy(produtosTable.descricao);
  res.json(produtos);
});

router.post("/produtos", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = CreateProdutoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }
  const inserted = await db.insert(produtosTable).values({
    descricao: parsed.data.descricao,
    exigeProcessamento: parsed.data.exigeProcessamento ?? true,
    impresso: parsed.data.impresso ?? true,
    envelopado: parsed.data.envelopado ?? true,
    ativo: parsed.data.ativo ?? true,
  }).returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "produtos",
    entidadeId: inserted[0].id,
    descricao: `Produto criado: ${inserted[0].descricao}`,
  });

  res.status(201).json(inserted[0]);
});

router.get("/produtos/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const results = await db.select().from(produtosTable).where(eq(produtosTable.id, id)).limit(1);
  if (!results[0]) { res.status(404).json({ error: "Not Found" }); return; }

  res.json(results[0]);
});

router.put("/produtos/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdateProdutoBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const updated = await db.update(produtosTable).set(parsed.data).where(eq(produtosTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "produtos",
    entidadeId: id,
    descricao: `Produto atualizado: ${updated[0].descricao}`,
  });

  res.json(updated[0]);
});

export default router;
