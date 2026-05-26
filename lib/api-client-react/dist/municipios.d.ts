import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type { ErrorType } from "./custom-fetch";
export interface Municipio {
    id: number;
    nome: string;
    uf: string;
    codigoIbge: string;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
export interface ListMunicipiosParams {
    q?: string;
    uf?: string;
}
export interface CreateMunicipioBody {
    nome: string;
    uf: string;
    codigoIbge: string;
    ativo?: boolean;
}
export interface UpdateMunicipioBody {
    nome?: string;
    uf?: string;
    codigoIbge?: string;
    ativo?: boolean;
}
export declare const listMunicipios: (params?: ListMunicipiosParams) => Promise<Municipio[]>;
export declare const getMunicipio: (id: number) => Promise<Municipio>;
export declare const createMunicipio: (body: CreateMunicipioBody) => Promise<Municipio>;
export declare const updateMunicipio: (id: number, body: UpdateMunicipioBody) => Promise<Municipio>;
export declare const deleteMunicipio: (id: number) => Promise<void>;
export declare const getMunicipiosQueryKey: (params?: ListMunicipiosParams) => readonly ["/api/municipios", ListMunicipiosParams | undefined];
export declare function useListMunicipios(params?: ListMunicipiosParams, options?: UseQueryOptions<Municipio[], ErrorType<unknown>>): import("@tanstack/react-query").UseQueryResult<Municipio[], ErrorType<unknown>>;
export declare function useCreateMunicipio(options?: UseMutationOptions<Municipio, ErrorType<unknown>, CreateMunicipioBody>): import("@tanstack/react-query").UseMutationResult<Municipio, ErrorType<unknown>, CreateMunicipioBody, unknown>;
export declare function useUpdateMunicipio(options?: UseMutationOptions<Municipio, ErrorType<unknown>, {
    id: number;
    body: UpdateMunicipioBody;
}>): import("@tanstack/react-query").UseMutationResult<Municipio, ErrorType<unknown>, {
    id: number;
    body: UpdateMunicipioBody;
}, unknown>;
export declare function useDeleteMunicipio(options?: UseMutationOptions<void, ErrorType<unknown>, number>): import("@tanstack/react-query").UseMutationResult<void, ErrorType<unknown>, number, unknown>;
//# sourceMappingURL=municipios.d.ts.map