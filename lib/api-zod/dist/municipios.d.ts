import * as zod from "zod";
export declare const MunicipioItem: zod.ZodObject<{
    id: zod.ZodNumber;
    nome: zod.ZodString;
    uf: zod.ZodString;
    codigoIbge: zod.ZodString;
    ativo: zod.ZodBoolean;
    createdAt: zod.ZodDate;
    updatedAt: zod.ZodDate;
    deletedAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
}, "strip", zod.ZodTypeAny, {
    id: number;
    ativo: boolean;
    createdAt: Date;
    uf: string;
    updatedAt: Date;
    nome: string;
    codigoIbge: string;
    deletedAt?: Date | null | undefined;
}, {
    id: number;
    ativo: boolean;
    createdAt: Date;
    uf: string;
    updatedAt: Date;
    nome: string;
    codigoIbge: string;
    deletedAt?: Date | null | undefined;
}>;
export declare const ListMunicipiosResponse: zod.ZodArray<zod.ZodObject<{
    id: zod.ZodNumber;
    nome: zod.ZodString;
    uf: zod.ZodString;
    codigoIbge: zod.ZodString;
    ativo: zod.ZodBoolean;
    createdAt: zod.ZodDate;
    updatedAt: zod.ZodDate;
    deletedAt: zod.ZodOptional<zod.ZodNullable<zod.ZodDate>>;
}, "strip", zod.ZodTypeAny, {
    id: number;
    ativo: boolean;
    createdAt: Date;
    uf: string;
    updatedAt: Date;
    nome: string;
    codigoIbge: string;
    deletedAt?: Date | null | undefined;
}, {
    id: number;
    ativo: boolean;
    createdAt: Date;
    uf: string;
    updatedAt: Date;
    nome: string;
    codigoIbge: string;
    deletedAt?: Date | null | undefined;
}>, "many">;
export declare const CreateMunicipioBody: zod.ZodObject<{
    nome: zod.ZodString;
    uf: zod.ZodString;
    codigoIbge: zod.ZodString;
    ativo: zod.ZodOptional<zod.ZodBoolean>;
}, "strip", zod.ZodTypeAny, {
    uf: string;
    nome: string;
    codigoIbge: string;
    ativo?: boolean | undefined;
}, {
    uf: string;
    nome: string;
    codigoIbge: string;
    ativo?: boolean | undefined;
}>;
export declare const UpdateMunicipioBody: zod.ZodObject<{
    nome: zod.ZodOptional<zod.ZodString>;
    uf: zod.ZodOptional<zod.ZodString>;
    codigoIbge: zod.ZodOptional<zod.ZodString>;
    ativo: zod.ZodOptional<zod.ZodBoolean>;
}, "strip", zod.ZodTypeAny, {
    ativo?: boolean | undefined;
    uf?: string | undefined;
    nome?: string | undefined;
    codigoIbge?: string | undefined;
}, {
    ativo?: boolean | undefined;
    uf?: string | undefined;
    nome?: string | undefined;
    codigoIbge?: string | undefined;
}>;
export type MunicipioItemType = zod.infer<typeof MunicipioItem>;
export type CreateMunicipioBodyType = zod.infer<typeof CreateMunicipioBody>;
export type UpdateMunicipioBodyType = zod.infer<typeof UpdateMunicipioBody>;
//# sourceMappingURL=municipios.d.ts.map