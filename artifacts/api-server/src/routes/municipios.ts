import { Router } from "express";
import { db, municipiosTable, logsTable } from "@workspace/db";
import { eq, ilike, and, isNull } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/municipios", requireAuth, async (req, res) => {
  const { q, uf } = req.query as { q?: string; uf?: string };

  const conditions = [isNull(municipiosTable.deletedAt)];
  if (q) conditions.push(ilike(municipiosTable.nome, `%${q}%`));
  if (uf) conditions.push(eq(municipiosTable.uf, uf.toUpperCase()));

  const results = await db
    .select()
    .from(municipiosTable)
    .where(and(...conditions))
    .orderBy(municipiosTable.uf, municipiosTable.nome);

  res.json(results);
});

router.post("/municipios", requireAuth, requireRole("admin"), async (req, res) => {
  const { nome, uf, codigoIbge, ativo } = req.body;
  if (!nome || !uf || !codigoIbge) {
    res.status(400).json({ error: "Bad Request", message: "nome, uf e codigoIbge são obrigatórios" });
    return;
  }

  const inserted = await db
    .insert(municipiosTable)
    .values({ nome, uf: uf.toUpperCase(), codigoIbge, ativo: ativo ?? true })
    .returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "municipios",
    entidadeId: inserted[0].id,
    descricao: `Município criado: ${inserted[0].nome}/${inserted[0].uf}`,
  });

  res.status(201).json(inserted[0]);
});

router.get("/municipios/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const result = await db
    .select()
    .from(municipiosTable)
    .where(and(eq(municipiosTable.id, id), isNull(municipiosTable.deletedAt)))
    .limit(1);

  if (!result[0]) { res.status(404).json({ error: "Not Found" }); return; }
  res.json(result[0]);
});

router.put("/municipios/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const { nome, uf, codigoIbge, ativo } = req.body;
  const data: Record<string, unknown> = {};
  if (nome !== undefined) data.nome = nome;
  if (uf !== undefined) data.uf = uf.toUpperCase();
  if (codigoIbge !== undefined) data.codigoIbge = codigoIbge;
  if (ativo !== undefined) data.ativo = ativo;

  const updated = await db
    .update(municipiosTable)
    .set(data)
    .where(and(eq(municipiosTable.id, id), isNull(municipiosTable.deletedAt)))
    .returning();

  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "municipios",
    entidadeId: id,
    descricao: `Município atualizado: ${updated[0].nome}/${updated[0].uf}`,
  });

  res.json(updated[0]);
});

router.delete("/municipios/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const updated = await db
    .update(municipiosTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(municipiosTable.id, id), isNull(municipiosTable.deletedAt)))
    .returning();

  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "DELETE",
    entidade: "municipios",
    entidadeId: id,
    descricao: `Município removido: ${updated[0].nome}/${updated[0].uf}`,
  });

  res.status(204).send();
});

export default router;
