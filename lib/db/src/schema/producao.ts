import { pgTable, text, serial, timestamp, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientesTable } from "./clientes";

export const producaoTable = pgTable("producao", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull().references(() => clientesTable.id),
  dataRecebimento: date("data_recebimento").notNull(),
  observacoes: text("observacoes"),
  status: text("status", {
    enum: ["RECEBIDA", "EM_PROCESSAMENTO", "PROCESSADA", "EM_PRODUCAO", "EMBALADA", "FINALIZADA", "CANCELADA"],
  }).notNull().default("RECEBIDA"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProducaoSchema = createInsertSchema(producaoTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProducao = z.infer<typeof insertProducaoSchema>;
export type Producao = typeof producaoTable.$inferSelect;
