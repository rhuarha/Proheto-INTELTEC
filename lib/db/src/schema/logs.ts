import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const logsTable = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  acao: text("acao").notNull(),
  entidade: text("entidade").notNull(),
  entidadeId: integer("entidade_id"),
  descricao: text("descricao"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLogSchema = createInsertSchema(logsTable).omit({ id: true, createdAt: true });
export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof logsTable.$inferSelect;
