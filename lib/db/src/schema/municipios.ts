import { pgTable, text, serial, timestamp, boolean, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const municipiosTable = pgTable(
  "municipios",
  {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    uf: varchar("uf", { length: 2 }).notNull(),
    codigoIbge: varchar("codigo_ibge", { length: 10 }).notNull().unique(),
    ativo: boolean("ativo").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("municipios_nome_idx").on(table.nome),
    index("municipios_uf_idx").on(table.uf),
    index("municipios_nome_uf_idx").on(table.nome, table.uf),
  ],
);

export const insertMunicipioSchema = createInsertSchema(municipiosTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type InsertMunicipio = z.infer<typeof insertMunicipioSchema>;
export type Municipio = typeof municipiosTable.$inferSelect;
