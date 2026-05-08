import { pgTable, text, serial, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientesTable } from "./clientes";

export const PRODUCAO_STATUS = ["recebida", "processada", "impressa", "envelopada", "embalada", "retirada", "cancelada"] as const;
export type ProducaoStatus = typeof PRODUCAO_STATUS[number];

export const producaoTable = pgTable("producao", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull().references(() => clientesTable.id),
  dataRecebimento: date("data_recebimento").notNull(),
  horaRecebimento: text("hora_recebimento"),
  observacoes: text("observacoes"),
  status: text("status", { enum: PRODUCAO_STATUS }).notNull().default("recebida"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const insertProducaoSchema = createInsertSchema(producaoTable).omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });
export type InsertProducao = z.infer<typeof insertProducaoSchema>;
export type Producao = typeof producaoTable.$inferSelect;
