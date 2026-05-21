import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
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

export const listMunicipios = async (params?: ListMunicipiosParams): Promise<Municipio[]> => {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.uf) query.set("uf", params.uf);
  const qs = query.toString();
  return customFetch<Municipio[]>(`/api/municipios${qs ? `?${qs}` : ""}`);
};

export const getMunicipio = async (id: number): Promise<Municipio> =>
  customFetch<Municipio>(`/api/municipios/${id}`);

export const createMunicipio = async (body: CreateMunicipioBody): Promise<Municipio> =>
  customFetch<Municipio>("/api/municipios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const updateMunicipio = async (id: number, body: UpdateMunicipioBody): Promise<Municipio> =>
  customFetch<Municipio>(`/api/municipios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const deleteMunicipio = async (id: number): Promise<void> =>
  customFetch<void>(`/api/municipios/${id}`, { method: "DELETE" });

export const getMunicipiosQueryKey = (params?: ListMunicipiosParams) =>
  ["/api/municipios", params] as const;

export function useListMunicipios(
  params?: ListMunicipiosParams,
  options?: UseQueryOptions<Municipio[], ErrorType<unknown>>,
) {
  return useQuery<Municipio[], ErrorType<unknown>>({
    queryKey: getMunicipiosQueryKey(params),
    queryFn: () => listMunicipios(params),
    ...options,
  });
}

export function useCreateMunicipio(
  options?: UseMutationOptions<Municipio, ErrorType<unknown>, CreateMunicipioBody>,
) {
  return useMutation<Municipio, ErrorType<unknown>, CreateMunicipioBody>({
    mutationFn: (body) => createMunicipio(body),
    ...options,
  });
}

export function useUpdateMunicipio(
  options?: UseMutationOptions<Municipio, ErrorType<unknown>, { id: number; body: UpdateMunicipioBody }>,
) {
  return useMutation<Municipio, ErrorType<unknown>, { id: number; body: UpdateMunicipioBody }>({
    mutationFn: ({ id, body }) => updateMunicipio(id, body),
    ...options,
  });
}

export function useDeleteMunicipio(
  options?: UseMutationOptions<void, ErrorType<unknown>, number>,
) {
  return useMutation<void, ErrorType<unknown>, number>({
    mutationFn: (id) => deleteMunicipio(id),
    ...options,
  });
}
