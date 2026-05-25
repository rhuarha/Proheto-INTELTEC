import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
import type { ErrorType } from "./custom-fetch";
import type {
  CreateRecebimentoLoteBody,
  CreateRecebimentoLoteResponse,
  RecebimentoLoteDetail,
} from "./generated/api.schemas";

export const createRecebimentoLote = async (
  body: CreateRecebimentoLoteBody,
): Promise<CreateRecebimentoLoteResponse> =>
  customFetch<CreateRecebimentoLoteResponse>("/api/recebimento-lotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getRecebimentoLote = async (id: number): Promise<RecebimentoLoteDetail> =>
  customFetch<RecebimentoLoteDetail>(`/api/recebimento-lotes/${id}`);

export const getRecebimentoLoteQueryKey = (id: number) =>
  [`/api/recebimento-lotes/${id}`] as const;

export function useGetRecebimentoLote(
  id: number,
  options?: UseQueryOptions<RecebimentoLoteDetail, ErrorType<unknown>>,
) {
  return useQuery<RecebimentoLoteDetail, ErrorType<unknown>>({
    queryKey: getRecebimentoLoteQueryKey(id),
    queryFn: () => getRecebimentoLote(id),
    enabled: id > 0,
    ...options,
  });
}

export function useCreateRecebimentoLote(
  options?: UseMutationOptions<
    CreateRecebimentoLoteResponse,
    ErrorType<unknown>,
    CreateRecebimentoLoteBody
  >,
) {
  return useMutation<
    CreateRecebimentoLoteResponse,
    ErrorType<unknown>,
    CreateRecebimentoLoteBody
  >({
    mutationFn: (body) => createRecebimentoLote(body),
    ...options,
  });
}
