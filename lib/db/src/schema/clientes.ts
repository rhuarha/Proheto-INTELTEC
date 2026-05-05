import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const clientesTable = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nomeRazaoSocial: text("nome_razao_social").notNull(),
  nomeFantasia: text("nome_fantasia"),
  nomeInterno: text("nome_interno"),
  emailContato: text("email_contato"),
  emailProdutoFinalizado: text("email_produto_finalizado"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertClienteSchema = createInsertSchema(clientesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientesTable.$inferSelect;
