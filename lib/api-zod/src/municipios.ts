import * as zod from "zod";

export const MunicipioItem = zod.object({
  id: zod.number(),
  nome: zod.string(),
  uf: zod.string(),
  codigoIbge: zod.string(),
  ativo: zod.boolean(),
  createdAt: zod.coerce.date(),
  updatedAt: zod.coerce.date(),
  deletedAt: zod.coerce.date().nullish(),
});

export const ListMunicipiosResponse = zod.array(MunicipioItem);

export const CreateMunicipioBody = zod.object({
  nome: zod.string(),
  uf: zod.string().max(2),
  codigoIbge: zod.string().max(10),
  ativo: zod.boolean().optional(),
});

export const UpdateMunicipioBody = zod.object({
  nome: zod.string().optional(),
  uf: zod.string().max(2).optional(),
  codigoIbge: zod.string().max(10).optional(),
  ativo: zod.boolean().optional(),
});

export type MunicipioItemType = zod.infer<typeof MunicipioItem>;
export type CreateMunicipioBodyType = zod.infer<typeof CreateMunicipioBody>;
export type UpdateMunicipioBodyType = zod.infer<typeof UpdateMunicipioBody>;
