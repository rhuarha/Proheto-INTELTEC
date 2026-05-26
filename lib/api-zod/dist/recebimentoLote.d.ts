import * as zod from "zod";
export declare const CreateRecebimentoLoteBody: zod.ZodObject<{
    data_recebimento: zod.ZodString;
    hora_recebimento: zod.ZodString;
    origem: zod.ZodEnum<["EMAIL", "FTP", "MANUAL", "OUTRO"]>;
    remetente: zod.ZodOptional<zod.ZodString>;
    assunto: zod.ZodOptional<zod.ZodString>;
    observacoes: zod.ZodOptional<zod.ZodString>;
    clientes: zod.ZodArray<zod.ZodObject<{
        cliente_id: zod.ZodNumber;
        observacoes: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        cliente_id: number;
        observacoes?: string | undefined;
    }, {
        cliente_id: number;
        observacoes?: string | undefined;
    }>, "many">;
}, "strip", zod.ZodTypeAny, {
    data_recebimento: string;
    hora_recebimento: string;
    origem: "EMAIL" | "FTP" | "MANUAL" | "OUTRO";
    clientes: {
        cliente_id: number;
        observacoes?: string | undefined;
    }[];
    observacoes?: string | undefined;
    remetente?: string | undefined;
    assunto?: string | undefined;
}, {
    data_recebimento: string;
    hora_recebimento: string;
    origem: "EMAIL" | "FTP" | "MANUAL" | "OUTRO";
    clientes: {
        cliente_id: number;
        observacoes?: string | undefined;
    }[];
    observacoes?: string | undefined;
    remetente?: string | undefined;
    assunto?: string | undefined;
}>;
export type CreateRecebimentoLoteBodyType = zod.infer<typeof CreateRecebimentoLoteBody>;
//# sourceMappingURL=recebimentoLote.d.ts.map