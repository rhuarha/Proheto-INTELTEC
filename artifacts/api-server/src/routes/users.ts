import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, logsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { CreateUserBody, UpdateUserBody } from "@workspace/api-zod";

const router = Router();

function sanitizeUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clienteId: user.clienteId ?? null,
    ativo: user.ativo,
    createdAt: user.createdAt,
  };
}

router.get("/users", requireAuth, requireRole("admin"), async (req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.name);
  res.json(users.map(sanitizeUser));
});

router.post("/users", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Dados inválidos" });
    return;
  }
  const { name, email, password, role, clienteId, ativo } = parsed.data;

  const hash = await bcrypt.hash(password, 10);
  const inserted = await db.insert(usersTable).values({
    name,
    email: email.toLowerCase(),
    passwordHash: hash,
    role,
    clienteId: clienteId ?? null,
    ativo: ativo ?? true,
  }).returning();

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "CREATE",
    entidade: "users",
    entidadeId: inserted[0].id,
    descricao: `Usuário criado: ${name}`,
  });

  res.status(201).json(sanitizeUser(inserted[0]));
});

router.get("/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const users = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!users[0]) { res.status(404).json({ error: "Not Found" }); return; }

  res.json(sanitizeUser(users[0]));
});

router.put("/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Bad Request" }); return; }

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Bad Request", message: "Dados inválidos" }); return; }

  const { name, email, role, clienteId, ativo, password } = parsed.data;
  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email.toLowerCase();
  if (role !== undefined) updates.role = role;
  if (clienteId !== undefined) updates.clienteId = clienteId ?? null;
  if (ativo !== undefined) updates.ativo = ativo;
  if (password) updates.passwordHash = await bcrypt.hash(password, 10);

  const updated = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  if (!updated[0]) { res.status(404).json({ error: "Not Found" }); return; }

  await db.insert(logsTable).values({
    userId: req.user!.userId,
    acao: "UPDATE",
    entidade: "users",
    entidadeId: id,
    descricao: `Usuário atualizado: ${updated[0].name}`,
  });

  res.json(sanitizeUser(updated[0]));
});

export default router;
