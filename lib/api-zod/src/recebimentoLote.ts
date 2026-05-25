import * as zod from "zod";

export const CreateRecebimentoLoteBody = zod.object({
  data_recebimento: zod.string().min(1, "Data é obrigatória"),
  hora_recebimento: zod.string().min(1, "Hora é obrigatória"),
  origem: zod.enum(["EMAIL", "FTP", "MANUAL", "OUTRO"]),
  remetente: zod.string().optional(),
  assunto: zod.string().optional(),
  observacoes: zod.string().optional(),
  clientes: zod
    .array(
      zod.object({
        cliente_id: zod.number().int().positive("ID de cliente inválido"),
        observacoes: zod.string().optional(),
      })
    )
    .min(1, "Selecione ao menos um cliente"),
});

export type CreateRecebimentoLoteBodyType = zod.infer<typeof CreateRecebimentoLoteBody>;
