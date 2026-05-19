import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";

const name = "Rhuarha";
const email = "rhuarah@inteltec.com.br";
const password = "14881497";
const role = "admin" as const;

const passwordHash = await bcrypt.hash(password, 10);

const [user] = await db
  .insert(usersTable)
  .values({ name, email, passwordHash, role })
  .returning({ id: usersTable.id, email: usersTable.email, role: usersTable.role });

console.log("Usuário criado com sucesso:", user);
process.exit(0);
