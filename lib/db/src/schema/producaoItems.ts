import { pgTable, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { producaoTable } from "./producao";
import { produtosTable } from "./produtos";

export const producaoItemsTable = pgTable("producao_item", {
  id: serial("id").primaryKey(),
  producaoId: integer("producao_id").notNull().references(() => producaoTable.id),
  produtoId: integer("produto_id").notNull().references(() => produtosTable.id),
  itemNumero: integer("item_numero").notNull(),
  quantidade: integer("quantidade").notNull(),
  multiplicador: real("multiplicador").notNull().default(1),
  impresso: boolean("impresso").notNull().default(false),
  envelopado: boolean("envelopado").notNull().default(false),
  embalado: boolean("embalado").notNull().default(false),
  despachado: boolean("despachado").notNull().default(false),
  dataUltimoStatus: timestamp("data_ultimo_status", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProducaoItemSchema = createInsertSchema(producaoItemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProducaoItem = z.infer<typeof insertProducaoItemSchema>;
export type ProducaoItem = typeof producaoItemsTable.$inferSelect;
