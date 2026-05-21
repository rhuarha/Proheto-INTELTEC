import { Router } from "express";
import { db, clientesTable, municipiosTable, logsTable } from "@workspace/db";
import { eq, getTableColumns } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { CreateClienteBody, UpdateClienteBody } from "@workspace/api-zod";

const router = Router();

const clienteWithMunicipio = () =>
  db
    .select({
      ...getTableColumns(clientesTable),
      municipioNome: municipiosTable.nome,
      municipioUf: municipiosTable.uf,
      municipioCodigoIbge: municipiosTable.codigoIbge,
    })
    .from(clientesTable)
    .leftJoin(municipiosTable, eq(clientesTable.municipioId, municipiosTable.id));

router.get("/clientes", requireAuth, async (req, res) => {
  const clientes = await clienteWithMunicipio().orderBy(clientesTable.nomeRazaoSocial);
  res.json(clientes);
});

router.post("/clientes", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = CreateClienteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }
  const inserted = await db.insert(clientesTable).values({
    ...parsed.data,
    ativo: parsed.data.ativo ?? true,
  }).returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "clientes",
    entidadeId: inserted[0].id,
    descricao: `Cliente criado: ${inserted[0].nomeRazaoSocial}`,
  });

  res.status(201).json(inserted[0]);
});

router.get("/clientes/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const results = await clienteWithMunicipio().where(eq(clientesTable.id, id)).limit(1);
  if (!results[0]) { res.status(404).json({ error: "Not Found" }); return; }

  res.json(results[0]);
});

router.put("/clientes/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdateClienteBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const updated = await db.update(clientesTable).set(parsed.data).where(eq(clientesTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "clientes",
    entidadeId: id,
    descricao: `Cliente atualizado: ${updated[0].nomeRazaoSocial}`,
  });

  res.json(updated[0]);
});

export default router;
