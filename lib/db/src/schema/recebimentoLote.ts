import { pgTable, text, serial, timestamp, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const RECEBIMENTO_LOTE_ORIGEM = ["EMAIL", "FTP", "MANUAL", "OUTRO"] as const;
export type RecebimentoLoteOrigem = typeof RECEBIMENTO_LOTE_ORIGEM[number];

export const recebimentoLoteTable = pgTable("recebimento_lote", {
  id: serial("id").primaryKey(),
  dataRecebimento: date("data_recebimento").notNull(),
  horaRecebimento: text("hora_recebimento").notNull(),
  origem: text("origem", { enum: RECEBIMENTO_LOTE_ORIGEM }).notNull(),
  remetente: varchar("remetente", { length: 255 }),
  assunto: varchar("assunto", { length: 500 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const insertRecebimentoLoteSchema = createInsertSchema(recebimentoLoteTable).omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });
export type InsertRecebimentoLote = z.infer<typeof insertRecebimentoLoteSchema>;
export type RecebimentoLote = typeof recebimentoLoteTable.$inferSelect;
