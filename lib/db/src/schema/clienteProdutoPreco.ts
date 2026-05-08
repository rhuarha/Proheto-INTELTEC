import { pgTable, serial, timestamp, integer, boolean, text, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientesTable } from "./clientes";
import { produtosTable } from "./produtos";

export const clienteProdutoPrecoTable = pgTable("cliente_produto_preco", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull().references(() => clientesTable.id),
  produtoId: integer("produto_id").notNull().references(() => produtosTable.id),
  descricao: text("descricao"),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  dataInicialValidade: date("data_inicial_validade").notNull(),
  usaPapel: text("usa_papel", { enum: ["B", "I"] }).notNull().default("B"),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const insertClienteProdutoPrecoSchema = createInsertSchema(clienteProdutoPrecoTable).omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });
export type InsertClienteProdutoPreco = z.infer<typeof insertClienteProdutoPrecoSchema>;
export type ClienteProdutoPreco = typeof clienteProdutoPrecoTable.$inferSelect;
