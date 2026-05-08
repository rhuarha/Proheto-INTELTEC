import { Router } from "express";
import { db, producaoTable, producaoItemsTable, produtosTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.get("/dashboard/resumo", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const allOrdens = await db.select({ status: producaoTable.status }).from(producaoTable);
  const totalOrdens = allOrdens.length;

  const porStatus: Record<string, number> = {};
  for (const o of allOrdens) {
    porStatus[o.status] = (porStatus[o.status] ?? 0) + 1;
  }

  const today = new Date().toISOString().split("T")[0];
  const ordensHojeResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(producaoTable)
    .where(sql`DATE(${producaoTable.createdAt}) = ${today}`);

  const ordensRetiradasHojeResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(producaoTable)
    .where(and(
      sql`DATE(${producaoTable.updatedAt}) = ${today}`,
      eq(producaoTable.status, "retirada"),
    ));

  res.json({
    totalOrdens,
    porStatus,
    ordensHoje: Number(ordensHojeResult[0]?.count ?? 0),
    ordensRetiradasHoje: Number(ordensRetiradasHojeResult[0]?.count ?? 0),
  });
});

router.get("/dashboard/pendentes", requireAuth, requireRole("admin", "apontador"), async (req, res) => {
  const allItems = await db
    .select({ item: producaoItemsTable, produto: produtosTable, producao: producaoTable })
    .from(producaoItemsTable)
    .innerJoin(produtosTable, eq(producaoItemsTable.produtoId, produtosTable.id))
    .innerJoin(producaoTable, eq(producaoItemsTable.producaoId, producaoTable.id));

  let impressao = 0;
  let envelopamento = 0;
  let embalagem = 0;
  let retirada = 0;

  const processamentoResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(producaoTable)
    .where(eq(producaoTable.status, "recebida"));
  const processamento = Number(processamentoResult[0]?.count ?? 0);

  for (const { item, produto, producao } of allItems) {
    if (producao.status === "cancelada") continue;
    if (produto.impresso && !item.impresso && producao.status === "processada") impressao++;
    if (produto.envelopado && !item.envelopado && (!produto.impresso || item.impresso) && ["processada", "impressa"].includes(producao.status)) envelopamento++;
    if (!item.embalado && (!produto.impresso || item.impresso) && (!produto.envelopado || item.envelopado) && ["processada", "impressa", "envelopada"].includes(producao.status)) embalagem++;
    if (item.embalado && !item.retirado && producao.status === "embalada") retirada++;
  }

  res.json({ processamento, impressao, envelopamento, embalagem, retirada });
});

export default router;
