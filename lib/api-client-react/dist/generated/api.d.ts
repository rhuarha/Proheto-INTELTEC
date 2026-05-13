import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Cliente, ClienteProdutoPreco, CreateClienteBody, CreatePrecoBody, CreateProducaoBody, CreateProducaoItemBody, CreateProdutoBody, CreateUserBody, DashboardResumo, ErrorResponse, GetPrecoVigenteParams, HealthStatus, ListPrecosParams, ListProducaoParams, LoginBody, LoginResponse, MarcarItemsBody, PendentesPorEtapa, ProducaoDetail, ProducaoItemWithProduto, ProducaoWithCliente, Produto, SuccessResponse, UpdateClienteBody, UpdatePrecoBody, UpdateProducaoBody, UpdateProducaoItemBody, UpdateProdutoBody, UpdateUserBody, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Login with email and password
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<LoginResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Login with email and password
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Get current authenticated user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current authenticated user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all users (admin only)
 */
export declare const getListUsersUrl: () => string;
export declare const listUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (admin only)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new user (admin only)
 */
export declare const getCreateUserUrl: () => string;
export declare const createUser: (createUserBody: CreateUserBody, options?: RequestInit) => Promise<User>;
export declare const getCreateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserBody>;
}, TContext>;
export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
export type CreateUserMutationBody = BodyType<CreateUserBody>;
export type CreateUserMutationError = ErrorType<unknown>;
/**
 * @summary Create a new user (admin only)
 */
export declare const useCreateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserBody>;
}, TContext>;
/**
 * @summary Get a user by ID
 */
export declare const getGetUserUrl: (id: number) => string;
export declare const getUser: (id: number, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (id: number) => readonly [`/api/users/${number}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<unknown>;
/**
 * @summary Get a user by ID
 */
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a user (admin only)
 */
export declare const getUpdateUserUrl: (id: number) => string;
export declare const updateUser: (id: number, updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserBody>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
 * @summary Update a user (admin only)
 */
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserBody>;
}, TContext>;
/**
 * @summary List all clients
 */
export declare const getListClientesUrl: () => string;
export declare const listClientes: (options?: RequestInit) => Promise<Cliente[]>;
export declare const getListClientesQueryKey: () => readonly ["/api/clientes"];
export declare const getListClientesQueryOptions: <TData = Awaited<ReturnType<typeof listClientes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClientes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listClientes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListClientesQueryResult = NonNullable<Awaited<ReturnType<typeof listClientes>>>;
export type ListClientesQueryError = ErrorType<unknown>;
/**
 * @summary List all clients
 */
export declare function useListClientes<TData = Awaited<ReturnType<typeof listClientes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listClientes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new client (admin only)
 */
export declare const getCreateClienteUrl: () => string;
export declare const createCliente: (createClienteBody: CreateClienteBody, options?: RequestInit) => Promise<Cliente>;
export declare const getCreateClienteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCliente>>, TError, {
        data: BodyType<CreateClienteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCliente>>, TError, {
    data: BodyType<CreateClienteBody>;
}, TContext>;
export type CreateClienteMutationResult = NonNullable<Awaited<ReturnType<typeof createCliente>>>;
export type CreateClienteMutationBody = BodyType<CreateClienteBody>;
export type CreateClienteMutationError = ErrorType<unknown>;
/**
 * @summary Create a new client (admin only)
 */
export declare const useCreateCliente: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCliente>>, TError, {
        data: BodyType<CreateClienteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCliente>>, TError, {
    data: BodyType<CreateClienteBody>;
}, TContext>;
/**
 * @summary Get a client by ID
 */
export declare const getGetClienteUrl: (id: number) => string;
export declare const getCliente: (id: number, options?: RequestInit) => Promise<Cliente>;
export declare const getGetClienteQueryKey: (id: number) => readonly [`/api/clientes/${number}`];
export declare const getGetClienteQueryOptions: <TData = Awaited<ReturnType<typeof getCliente>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCliente>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCliente>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClienteQueryResult = NonNullable<Awaited<ReturnType<typeof getCliente>>>;
export type GetClienteQueryError = ErrorType<unknown>;
/**
 * @summary Get a client by ID
 */
export declare function useGetCliente<TData = Awaited<ReturnType<typeof getCliente>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCliente>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a client (admin only)
 */
export declare const getUpdateClienteUrl: (id: number) => string;
export declare const updateCliente: (id: number, updateClienteBody: UpdateClienteBody, options?: RequestInit) => Promise<Cliente>;
export declare const getUpdateClienteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCliente>>, TError, {
        id: number;
        data: BodyType<UpdateClienteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCliente>>, TError, {
    id: number;
    data: BodyType<UpdateClienteBody>;
}, TContext>;
export type UpdateClienteMutationResult = NonNullable<Awaited<ReturnType<typeof updateCliente>>>;
export type UpdateClienteMutationBody = BodyType<UpdateClienteBody>;
export type UpdateClienteMutationError = ErrorType<unknown>;
/**
 * @summary Update a client (admin only)
 */
export declare const useUpdateCliente: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCliente>>, TError, {
        id: number;
        data: BodyType<UpdateClienteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCliente>>, TError, {
    id: number;
    data: BodyType<UpdateClienteBody>;
}, TContext>;
/**
 * @summary List all products
 */
export declare const getListProdutosUrl: () => string;
export declare const listProdutos: (options?: RequestInit) => Promise<Produto[]>;
export declare const getListProdutosQueryKey: () => readonly ["/api/produtos"];
export declare const getListProdutosQueryOptions: <TData = Awaited<ReturnType<typeof listProdutos>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProdutos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProdutos>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProdutosQueryResult = NonNullable<Awaited<ReturnType<typeof listProdutos>>>;
export type ListProdutosQueryError = ErrorType<unknown>;
/**
 * @summary List all products
 */
export declare function useListProdutos<TData = Awaited<ReturnType<typeof listProdutos>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProdutos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new product (admin only)
 */
export declare const getCreateProdutoUrl: () => string;
export declare const createProduto: (createProdutoBody: CreateProdutoBody, options?: RequestInit) => Promise<Produto>;
export declare const getCreateProdutoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduto>>, TError, {
        data: BodyType<CreateProdutoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProduto>>, TError, {
    data: BodyType<CreateProdutoBody>;
}, TContext>;
export type CreateProdutoMutationResult = NonNullable<Awaited<ReturnType<typeof createProduto>>>;
export type CreateProdutoMutationBody = BodyType<CreateProdutoBody>;
export type CreateProdutoMutationError = ErrorType<unknown>;
/**
 * @summary Create a new product (admin only)
 */
export declare const useCreateProduto: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProduto>>, TError, {
        data: BodyType<CreateProdutoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProduto>>, TError, {
    data: BodyType<CreateProdutoBody>;
}, TContext>;
/**
 * @summary Get a product by ID
 */
export declare const getGetProdutoUrl: (id: number) => string;
export declare const getProduto: (id: number, options?: RequestInit) => Promise<Produto>;
export declare const getGetProdutoQueryKey: (id: number) => readonly [`/api/produtos/${number}`];
export declare const getGetProdutoQueryOptions: <TData = Awaited<ReturnType<typeof getProduto>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduto>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduto>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProdutoQueryResult = NonNullable<Awaited<ReturnType<typeof getProduto>>>;
export type GetProdutoQueryError = ErrorType<unknown>;
/**
 * @summary Get a product by ID
 */
export declare function useGetProduto<TData = Awaited<ReturnType<typeof getProduto>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduto>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a product (admin only)
 */
export declare const getUpdateProdutoUrl: (id: number) => string;
export declare const updateProduto: (id: number, updateProdutoBody: UpdateProdutoBody, options?: RequestInit) => Promise<Produto>;
export declare const getUpdateProdutoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduto>>, TError, {
        id: number;
        data: BodyType<UpdateProdutoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProduto>>, TError, {
    id: number;
    data: BodyType<UpdateProdutoBody>;
}, TContext>;
export type UpdateProdutoMutationResult = NonNullable<Awaited<ReturnType<typeof updateProduto>>>;
export type UpdateProdutoMutationBody = BodyType<UpdateProdutoBody>;
export type UpdateProdutoMutationError = ErrorType<unknown>;
/**
 * @summary Update a product (admin only)
 */
export declare const useUpdateProduto: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProduto>>, TError, {
        id: number;
        data: BodyType<UpdateProdutoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProduto>>, TError, {
    id: number;
    data: BodyType<UpdateProdutoBody>;
}, TContext>;
/**
 * @summary List production orders with filters
 */
export declare const getListProducaoUrl: (params?: ListProducaoParams) => string;
export declare const listProducao: (params?: ListProducaoParams, options?: RequestInit) => Promise<ProducaoWithCliente[]>;
export declare const getListProducaoQueryKey: (params?: ListProducaoParams) => readonly ["/api/producao", ...ListProducaoParams[]];
export declare const getListProducaoQueryOptions: <TData = Awaited<ReturnType<typeof listProducao>>, TError = ErrorType<unknown>>(params?: ListProducaoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducao>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProducaoQueryResult = NonNullable<Awaited<ReturnType<typeof listProducao>>>;
export type ListProducaoQueryError = ErrorType<unknown>;
/**
 * @summary List production orders with filters
 */
export declare function useListProducao<TData = Awaited<ReturnType<typeof listProducao>>, TError = ErrorType<unknown>>(params?: ListProducaoParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new production order (Recebimento)
 */
export declare const getCreateProducaoUrl: () => string;
export declare const createProducao: (createProducaoBody: CreateProducaoBody, options?: RequestInit) => Promise<ProducaoWithCliente>;
export declare const getCreateProducaoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProducao>>, TError, {
        data: BodyType<CreateProducaoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProducao>>, TError, {
    data: BodyType<CreateProducaoBody>;
}, TContext>;
export type CreateProducaoMutationResult = NonNullable<Awaited<ReturnType<typeof createProducao>>>;
export type CreateProducaoMutationBody = BodyType<CreateProducaoBody>;
export type CreateProducaoMutationError = ErrorType<unknown>;
/**
 * @summary Create a new production order (Recebimento)
 */
export declare const useCreateProducao: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProducao>>, TError, {
        data: BodyType<CreateProducaoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProducao>>, TError, {
    data: BodyType<CreateProducaoBody>;
}, TContext>;
/**
 * @summary Get a production order with all items
 */
export declare const getGetProducaoUrl: (id: number) => string;
export declare const getProducao: (id: number, options?: RequestInit) => Promise<ProducaoDetail>;
export declare const getGetProducaoQueryKey: (id: number) => readonly [`/api/producao/${number}`];
export declare const getGetProducaoQueryOptions: <TData = Awaited<ReturnType<typeof getProducao>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProducao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProducao>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProducaoQueryResult = NonNullable<Awaited<ReturnType<typeof getProducao>>>;
export type GetProducaoQueryError = ErrorType<unknown>;
/**
 * @summary Get a production order with all items
 */
export declare function useGetProducao<TData = Awaited<ReturnType<typeof getProducao>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProducao>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update production order status or info
 */
export declare const getUpdateProducaoUrl: (id: number) => string;
export declare const updateProducao: (id: number, updateProducaoBody: UpdateProducaoBody, options?: RequestInit) => Promise<ProducaoWithCliente>;
export declare const getUpdateProducaoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProducao>>, TError, {
        id: number;
        data: BodyType<UpdateProducaoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProducao>>, TError, {
    id: number;
    data: BodyType<UpdateProducaoBody>;
}, TContext>;
export type UpdateProducaoMutationResult = NonNullable<Awaited<ReturnType<typeof updateProducao>>>;
export type UpdateProducaoMutationBody = BodyType<UpdateProducaoBody>;
export type UpdateProducaoMutationError = ErrorType<unknown>;
/**
 * @summary Update production order status or info
 */
export declare const useUpdateProducao: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProducao>>, TError, {
        id: number;
        data: BodyType<UpdateProducaoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProducao>>, TError, {
    id: number;
    data: BodyType<UpdateProducaoBody>;
}, TContext>;
/**
 * @summary Conclude processing stage and advance order status to processada
 */
export declare const getConcluirProcessamentoUrl: (id: number) => string;
export declare const concluirProcessamento: (id: number, options?: RequestInit) => Promise<ProducaoWithCliente>;
export declare const getConcluirProcessamentoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof concluirProcessamento>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof concluirProcessamento>>, TError, {
    id: number;
}, TContext>;
export type ConcluirProcessamentoMutationResult = NonNullable<Awaited<ReturnType<typeof concluirProcessamento>>>;
export type ConcluirProcessamentoMutationError = ErrorType<unknown>;
/**
 * @summary Conclude processing stage and advance order status to processada
 */
export declare const useConcluirProcessamento: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof concluirProcessamento>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof concluirProcessamento>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Cancel a production order
 */
export declare const getCancelarProducaoUrl: (id: number) => string;
export declare const cancelarProducao: (id: number, options?: RequestInit) => Promise<ProducaoWithCliente>;
export declare const getCancelarProducaoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof cancelarProducao>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof cancelarProducao>>, TError, {
    id: number;
}, TContext>;
export type CancelarProducaoMutationResult = NonNullable<Awaited<ReturnType<typeof cancelarProducao>>>;
export type CancelarProducaoMutationError = ErrorType<unknown>;
/**
 * @summary Cancel a production order
 */
export declare const useCancelarProducao: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof cancelarProducao>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof cancelarProducao>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List items of a production order
 */
export declare const getListProducaoItemsUrl: (id: number) => string;
export declare const listProducaoItems: (id: number, options?: RequestInit) => Promise<ProducaoItemWithProduto[]>;
export declare const getListProducaoItemsQueryKey: (id: number) => readonly [`/api/producao/${number}/items`];
export declare const getListProducaoItemsQueryOptions: <TData = Awaited<ReturnType<typeof listProducaoItems>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducaoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducaoItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProducaoItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducaoItems>>>;
export type ListProducaoItemsQueryError = ErrorType<unknown>;
/**
 * @summary List items of a production order
 */
export declare function useListProducaoItems<TData = Awaited<ReturnType<typeof listProducaoItems>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducaoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add an item to a production order (Processamento)
 */
export declare const getAddProducaoItemUrl: (id: number) => string;
export declare const addProducaoItem: (id: number, createProducaoItemBody: CreateProducaoItemBody, options?: RequestInit) => Promise<ProducaoItemWithProduto>;
export declare const getAddProducaoItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addProducaoItem>>, TError, {
        id: number;
        data: BodyType<CreateProducaoItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addProducaoItem>>, TError, {
    id: number;
    data: BodyType<CreateProducaoItemBody>;
}, TContext>;
export type AddProducaoItemMutationResult = NonNullable<Awaited<ReturnType<typeof addProducaoItem>>>;
export type AddProducaoItemMutationBody = BodyType<CreateProducaoItemBody>;
export type AddProducaoItemMutationError = ErrorType<unknown>;
/**
 * @summary Add an item to a production order (Processamento)
 */
export declare const useAddProducaoItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addProducaoItem>>, TError, {
        id: number;
        data: BodyType<CreateProducaoItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addProducaoItem>>, TError, {
    id: number;
    data: BodyType<CreateProducaoItemBody>;
}, TContext>;
/**
 * @summary Update a production item
 */
export declare const getUpdateProducaoItemUrl: (id: number, itemId: number) => string;
export declare const updateProducaoItem: (id: number, itemId: number, updateProducaoItemBody: UpdateProducaoItemBody, options?: RequestInit) => Promise<ProducaoItemWithProduto>;
export declare const getUpdateProducaoItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProducaoItem>>, TError, {
        id: number;
        itemId: number;
        data: BodyType<UpdateProducaoItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProducaoItem>>, TError, {
    id: number;
    itemId: number;
    data: BodyType<UpdateProducaoItemBody>;
}, TContext>;
export type UpdateProducaoItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateProducaoItem>>>;
export type UpdateProducaoItemMutationBody = BodyType<UpdateProducaoItemBody>;
export type UpdateProducaoItemMutationError = ErrorType<unknown>;
/**
 * @summary Update a production item
 */
export declare const useUpdateProducaoItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProducaoItem>>, TError, {
        id: number;
        itemId: number;
        data: BodyType<UpdateProducaoItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProducaoItem>>, TError, {
    id: number;
    itemId: number;
    data: BodyType<UpdateProducaoItemBody>;
}, TContext>;
/**
 * @summary Remove an item from a production order
 */
export declare const getDeleteProducaoItemUrl: (id: number, itemId: number) => string;
export declare const deleteProducaoItem: (id: number, itemId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteProducaoItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProducaoItem>>, TError, {
        id: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProducaoItem>>, TError, {
    id: number;
    itemId: number;
}, TContext>;
export type DeleteProducaoItemMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProducaoItem>>>;
export type DeleteProducaoItemMutationError = ErrorType<unknown>;
/**
 * @summary Remove an item from a production order
 */
export declare const useDeleteProducaoItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProducaoItem>>, TError, {
        id: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteProducaoItem>>, TError, {
    id: number;
    itemId: number;
}, TContext>;
/**
 * @summary List items pending printing (produto.impresso=true, not yet printed, order is processada)
 */
export declare const getListImpressaoItemsUrl: () => string;
export declare const listImpressaoItems: (options?: RequestInit) => Promise<ProducaoItemWithProduto[]>;
export declare const getListImpressaoItemsQueryKey: () => readonly ["/api/impressao/items"];
export declare const getListImpressaoItemsQueryOptions: <TData = Awaited<ReturnType<typeof listImpressaoItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listImpressaoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listImpressaoItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListImpressaoItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listImpressaoItems>>>;
export type ListImpressaoItemsQueryError = ErrorType<unknown>;
/**
 * @summary List items pending printing (produto.impresso=true, not yet printed, order is processada)
 */
export declare function useListImpressaoItems<TData = Awaited<ReturnType<typeof listImpressaoItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listImpressaoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark items as printed
 */
export declare const getMarcarImpressoUrl: () => string;
export declare const marcarImpresso: (marcarItemsBody: MarcarItemsBody, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getMarcarImpressoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarImpresso>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof marcarImpresso>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
export type MarcarImpressoMutationResult = NonNullable<Awaited<ReturnType<typeof marcarImpresso>>>;
export type MarcarImpressoMutationBody = BodyType<MarcarItemsBody>;
export type MarcarImpressoMutationError = ErrorType<unknown>;
/**
 * @summary Mark items as printed
 */
export declare const useMarcarImpresso: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarImpresso>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof marcarImpresso>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
/**
 * @summary List items pending enveloping
 */
export declare const getListEnvelopamentoItemsUrl: () => string;
export declare const listEnvelopamentoItems: (options?: RequestInit) => Promise<ProducaoItemWithProduto[]>;
export declare const getListEnvelopamentoItemsQueryKey: () => readonly ["/api/envelopamento/items"];
export declare const getListEnvelopamentoItemsQueryOptions: <TData = Awaited<ReturnType<typeof listEnvelopamentoItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEnvelopamentoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEnvelopamentoItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEnvelopamentoItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listEnvelopamentoItems>>>;
export type ListEnvelopamentoItemsQueryError = ErrorType<unknown>;
/**
 * @summary List items pending enveloping
 */
export declare function useListEnvelopamentoItems<TData = Awaited<ReturnType<typeof listEnvelopamentoItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEnvelopamentoItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark items as enveloped
 */
export declare const getMarcarEnvelopadoUrl: () => string;
export declare const marcarEnvelopado: (marcarItemsBody: MarcarItemsBody, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getMarcarEnvelopadoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarEnvelopado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof marcarEnvelopado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
export type MarcarEnvelopadoMutationResult = NonNullable<Awaited<ReturnType<typeof marcarEnvelopado>>>;
export type MarcarEnvelopadoMutationBody = BodyType<MarcarItemsBody>;
export type MarcarEnvelopadoMutationError = ErrorType<unknown>;
/**
 * @summary Mark items as enveloped
 */
export declare const useMarcarEnvelopado: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarEnvelopado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof marcarEnvelopado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
/**
 * @summary List items ready for packing
 */
export declare const getListEmbalagemItemsUrl: () => string;
export declare const listEmbalagemItems: (options?: RequestInit) => Promise<ProducaoItemWithProduto[]>;
export declare const getListEmbalagemItemsQueryKey: () => readonly ["/api/embalagem/items"];
export declare const getListEmbalagemItemsQueryOptions: <TData = Awaited<ReturnType<typeof listEmbalagemItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEmbalagemItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEmbalagemItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEmbalagemItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listEmbalagemItems>>>;
export type ListEmbalagemItemsQueryError = ErrorType<unknown>;
/**
 * @summary List items ready for packing
 */
export declare function useListEmbalagemItems<TData = Awaited<ReturnType<typeof listEmbalagemItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEmbalagemItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark items as packed
 */
export declare const getMarcarEmbaladoUrl: () => string;
export declare const marcarEmbalado: (marcarItemsBody: MarcarItemsBody, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getMarcarEmbaladoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarEmbalado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof marcarEmbalado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
export type MarcarEmbaladoMutationResult = NonNullable<Awaited<ReturnType<typeof marcarEmbalado>>>;
export type MarcarEmbaladoMutationBody = BodyType<MarcarItemsBody>;
export type MarcarEmbaladoMutationError = ErrorType<unknown>;
/**
 * @summary Mark items as packed
 */
export declare const useMarcarEmbalado: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarEmbalado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof marcarEmbalado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
/**
 * @summary List orders with status embalada (ready for pickup)
 */
export declare const getListRetiradaOrdensUrl: () => string;
export declare const listRetiradaOrdens: (options?: RequestInit) => Promise<ProducaoDetail[]>;
export declare const getListRetiradaOrdensQueryKey: () => readonly ["/api/retirada/ordens"];
export declare const getListRetiradaOrdensQueryOptions: <TData = Awaited<ReturnType<typeof listRetiradaOrdens>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRetiradaOrdens>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listRetiradaOrdens>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListRetiradaOrdensQueryResult = NonNullable<Awaited<ReturnType<typeof listRetiradaOrdens>>>;
export type ListRetiradaOrdensQueryError = ErrorType<unknown>;
/**
 * @summary List orders with status embalada (ready for pickup)
 */
export declare function useListRetiradaOrdens<TData = Awaited<ReturnType<typeof listRetiradaOrdens>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRetiradaOrdens>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark items as picked up (retirado)
 */
export declare const getMarcarRetiradoUrl: () => string;
export declare const marcarRetirado: (marcarItemsBody: MarcarItemsBody, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getMarcarRetiradoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarRetirado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof marcarRetirado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
export type MarcarRetiradoMutationResult = NonNullable<Awaited<ReturnType<typeof marcarRetirado>>>;
export type MarcarRetiradoMutationBody = BodyType<MarcarItemsBody>;
export type MarcarRetiradoMutationError = ErrorType<unknown>;
/**
 * @summary Mark items as picked up (retirado)
 */
export declare const useMarcarRetirado: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof marcarRetirado>>, TError, {
        data: BodyType<MarcarItemsBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof marcarRetirado>>, TError, {
    data: BodyType<MarcarItemsBody>;
}, TContext>;
/**
 * @summary List client/product prices
 */
export declare const getListPrecosUrl: (params?: ListPrecosParams) => string;
export declare const listPrecos: (params?: ListPrecosParams, options?: RequestInit) => Promise<ClienteProdutoPreco[]>;
export declare const getListPrecosQueryKey: (params?: ListPrecosParams) => readonly ["/api/precos", ...ListPrecosParams[]];
export declare const getListPrecosQueryOptions: <TData = Awaited<ReturnType<typeof listPrecos>>, TError = ErrorType<unknown>>(params?: ListPrecosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPrecos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPrecos>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPrecosQueryResult = NonNullable<Awaited<ReturnType<typeof listPrecos>>>;
export type ListPrecosQueryError = ErrorType<unknown>;
/**
 * @summary List client/product prices
 */
export declare function useListPrecos<TData = Awaited<ReturnType<typeof listPrecos>>, TError = ErrorType<unknown>>(params?: ListPrecosParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPrecos>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new price entry
 */
export declare const getCreatePrecoUrl: () => string;
export declare const createPreco: (createPrecoBody: CreatePrecoBody, options?: RequestInit) => Promise<ClienteProdutoPreco>;
export declare const getCreatePrecoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPreco>>, TError, {
        data: BodyType<CreatePrecoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPreco>>, TError, {
    data: BodyType<CreatePrecoBody>;
}, TContext>;
export type CreatePrecoMutationResult = NonNullable<Awaited<ReturnType<typeof createPreco>>>;
export type CreatePrecoMutationBody = BodyType<CreatePrecoBody>;
export type CreatePrecoMutationError = ErrorType<unknown>;
/**
 * @summary Create a new price entry
 */
export declare const useCreatePreco: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPreco>>, TError, {
        data: BodyType<CreatePrecoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPreco>>, TError, {
    data: BodyType<CreatePrecoBody>;
}, TContext>;
/**
 * @summary Update a price entry
 */
export declare const getUpdatePrecoUrl: (id: number) => string;
export declare const updatePreco: (id: number, updatePrecoBody: UpdatePrecoBody, options?: RequestInit) => Promise<ClienteProdutoPreco>;
export declare const getUpdatePrecoMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePreco>>, TError, {
        id: number;
        data: BodyType<UpdatePrecoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePreco>>, TError, {
    id: number;
    data: BodyType<UpdatePrecoBody>;
}, TContext>;
export type UpdatePrecoMutationResult = NonNullable<Awaited<ReturnType<typeof updatePreco>>>;
export type UpdatePrecoMutationBody = BodyType<UpdatePrecoBody>;
export type UpdatePrecoMutationError = ErrorType<unknown>;
/**
 * @summary Update a price entry
 */
export declare const useUpdatePreco: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePreco>>, TError, {
        id: number;
        data: BodyType<UpdatePrecoBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePreco>>, TError, {
    id: number;
    data: BodyType<UpdatePrecoBody>;
}, TContext>;
/**
 * @summary Get the currently valid price for a client/product on a given date
 */
export declare const getGetPrecoVigenteUrl: (params: GetPrecoVigenteParams) => string;
export declare const getPrecoVigente: (params: GetPrecoVigenteParams, options?: RequestInit) => Promise<ClienteProdutoPreco>;
export declare const getGetPrecoVigenteQueryKey: (params?: GetPrecoVigenteParams) => readonly ["/api/precos/vigente", ...GetPrecoVigenteParams[]];
export declare const getGetPrecoVigenteQueryOptions: <TData = Awaited<ReturnType<typeof getPrecoVigente>>, TError = ErrorType<ErrorResponse>>(params: GetPrecoVigenteParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrecoVigente>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPrecoVigente>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPrecoVigenteQueryResult = NonNullable<Awaited<ReturnType<typeof getPrecoVigente>>>;
export type GetPrecoVigenteQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get the currently valid price for a client/product on a given date
 */
export declare function useGetPrecoVigente<TData = Awaited<ReturnType<typeof getPrecoVigente>>, TError = ErrorType<ErrorResponse>>(params: GetPrecoVigenteParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPrecoVigente>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard summary with order counts by status
 */
export declare const getGetDashboardResumoUrl: () => string;
export declare const getDashboardResumo: (options?: RequestInit) => Promise<DashboardResumo>;
export declare const getGetDashboardResumoQueryKey: () => readonly ["/api/dashboard/resumo"];
export declare const getGetDashboardResumoQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardResumo>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardResumo>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardResumo>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardResumoQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardResumo>>>;
export type GetDashboardResumoQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary with order counts by status
 */
export declare function useGetDashboardResumo<TData = Awaited<ReturnType<typeof getDashboardResumo>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardResumo>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get count of pending items per production stage
 */
export declare const getGetDashboardPendentesUrl: () => string;
export declare const getDashboardPendentes: (options?: RequestInit) => Promise<PendentesPorEtapa>;
export declare const getGetDashboardPendentesQueryKey: () => readonly ["/api/dashboard/pendentes"];
export declare const getGetDashboardPendentesQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardPendentes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardPendentes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardPendentes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardPendentesQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardPendentes>>>;
export type GetDashboardPendentesQueryError = ErrorType<unknown>;
/**
 * @summary Get count of pending items per production stage
 */
export declare function useGetDashboardPendentes<TData = Awaited<ReturnType<typeof getDashboardPendentes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardPendentes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map