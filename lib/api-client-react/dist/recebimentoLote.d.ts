import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type { ErrorType } from "./custom-fetch";
import type { CreateRecebimentoLoteBody, CreateRecebimentoLoteResponse, RecebimentoLoteDetail } from "./generated/api.schemas";
export declare const createRecebimentoLote: (body: CreateRecebimentoLoteBody) => Promise<CreateRecebimentoLoteResponse>;
export declare const getRecebimentoLote: (id: number) => Promise<RecebimentoLoteDetail>;
export declare const getRecebimentoLoteQueryKey: (id: number) => readonly [`/api/recebimento-lotes/${number}`];
export declare function useGetRecebimentoLote(id: number, options?: UseQueryOptions<RecebimentoLoteDetail, ErrorType<unknown>>): import("@tanstack/react-query").UseQueryResult<RecebimentoLoteDetail, ErrorType<unknown>>;
export declare function useCreateRecebimentoLote(options?: UseMutationOptions<CreateRecebimentoLoteResponse, ErrorType<unknown>, CreateRecebimentoLoteBody>): import("@tanstack/react-query").UseMutationResult<CreateRecebimentoLoteResponse, ErrorType<unknown>, CreateRecebimentoLoteBody, unknown>;
//# sourceMappingURL=recebimentoLote.d.ts.map