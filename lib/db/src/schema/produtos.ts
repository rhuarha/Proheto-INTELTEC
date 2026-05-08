import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const produtosTable = pgTable("produtos", {
  id: serial("id").primaryKey(),
  descricao: text("descricao").notNull(),
  exigeProcessamento: boolean("exige_processamento").notNull().default(true),
  impresso: boolean("impresso").notNull().default(true),
  envelopado: boolean("envelopado").notNull().default(true),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProdutoSchema = createInsertSchema(produtosTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type Produto = typeof produtosTable.$inferSelect;
