import { pgTable, text, serial, timestamp, boolean, integer, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { municipiosTable } from "./municipios";

export const TIPO_FATURAMENTO = ["N", "R"] as const;
export const TIPO_FECHAMENTO = ["IMEDIATO", "POR_VALOR", "POR_VALOR_OU_PRAZO", "POR_PRAZO", "MENSAL_FIXO"] as const;

export const clientesTable = pgTable("clientes", {
  id: serial("id").primaryKey(),

  nomeRazaoSocial: text("nome_razao_social").notNull(),
  nomeFantasia: text("nome_fantasia"),
  nomeInterno: text("nome_interno"),
  juridica: boolean("juridica").notNull().default(true),
  cnpjCpf: text("cnpj_cpf"),
  inscrEstadual: text("inscr_estadual"),
  inscrMunicipal: text("inscr_municipal"),

  telefone: text("telefone"),
  logradouro: text("logradouro"),
  numero: text("numero"),
  complemento: text("complemento"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  cep: text("cep"),
  uf: varchar("uf", { length: 2 }),
  municipioId: integer("municipio_id").references(() => municipiosTable.id),

  emailNfse: text("email_nfse"),
  nomeContato: text("nome_contato"),
  emailContato: text("email_contato"),
  emailAprovaDemonstrativo: text("email_aprova_demonstrativo"),
  emailInformaProdutoEmbalado: text("email_informa_produto_embalado"),
  emailProdutoFinalizado: text("email_produto_finalizado"),

  tipoFaturamento: text("tipo_faturamento", { enum: TIPO_FATURAMENTO }),
  emiteBoleto: boolean("emite_boleto").notNull().default(true),
  exigeDemonstrativo: boolean("exige_demonstrativo").notNull().default(true),
  pedidoCompra: boolean("pedido_compra").notNull().default(false),

  diretorioProducao: text("diretorio_producao"),
  diretorioDemonstrativo: text("diretorio_demonstrativo"),

  prazoPagamento: integer("prazo_pagamento"),
  tipoFechamento: text("tipo_fechamento", { enum: TIPO_FECHAMENTO }),
  valorAlvo: numeric("valor_alvo", { precision: 10, scale: 2 }),
  valorMinimo: numeric("valor_minimo", { precision: 10, scale: 2 }),
  prazoMaximoDias: integer("prazo_maximo_dias"),
  diaFechamento: varchar("dia_fechamento", { length: 50 }),
  fecharAoDisponibilizar: boolean("fechar_ao_disponibilizar").notNull().default(false),

  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const insertClienteSchema = createInsertSchema(clientesTable).omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true });
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientesTable.$inferSelect;
