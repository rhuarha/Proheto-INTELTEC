import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, clientesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";
import { requireAuth, signToken } from "../middlewares/auth";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad Request", message: "Invalid email or password format" });
    return;
  }
  const { email, password } = parsed.data;

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  const user = users[0];
  if (!user || !user.ativo) {
    res.status(401).json({ error: "Unauthorized", message: "E-mail ou senha inválidos" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Unauthorized", message: "E-mail ou senha inválidos" });
    return;
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    clienteId: user.clienteId ?? null,
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clienteId: user.clienteId ?? null,
      ativo: user.ativo,
      createdAt: user.createdAt,
    },
  });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.userId))
    .limit(1);

  const user = users[0];
  if (!user) {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clienteId: user.clienteId ?? null,
    ativo: user.ativo,
    createdAt: user.createdAt,
  });
});

export default router;
