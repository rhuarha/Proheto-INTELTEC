--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cliente_produto_preco; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente_produto_preco (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    produto_id integer NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    data_inicial_validade date NOT NULL,
    usa_papel text DEFAULT 'B'::text NOT NULL,
    observacoes text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_produto_preco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cliente_produto_preco_id_seq OWNED BY public.cliente_produto_preco.id;


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome_razao_social text NOT NULL,
    nome_fantasia text,
    nome_interno text,
    juridica boolean DEFAULT true NOT NULL,
    cnpj_cpf text,
    inscr_estadual text,
    inscr_municipal text,
    telefone text,
    logradouro text,
    numero text,
    complemento text,
    bairro text,
    cidade text,
    cep text,
    uf character varying(2),
    email_nfse text,
    nome_contato text,
    email_contato text,
    email_aprova_demonstrativo text,
    email_informa_produto_embalado text,
    email_produto_finalizado text,
    tipo_faturamento text,
    emite_boleto boolean DEFAULT true NOT NULL,
    exige_demonstrativo boolean DEFAULT true NOT NULL,
    pedido_compra boolean DEFAULT false NOT NULL,
    diretorio_producao text,
    diretorio_demonstrativo text,
    prazo_pagamento integer,
    tipo_fechamento text,
    valor_alvo numeric(10,2),
    valor_minimo numeric(10,2),
    prazo_maximo_dias integer,
    dia_fechamento character varying(50),
    fechar_ao_disponibilizar boolean DEFAULT false NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    user_id integer,
    acao text NOT NULL,
    entidade text NOT NULL,
    entidade_id integer,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: producao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.producao (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    data_recebimento date NOT NULL,
    hora_recebimento text,
    observacoes text,
    status text DEFAULT 'recebida'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: producao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.producao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: producao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.producao_id_seq OWNED BY public.producao.id;


--
-- Name: producao_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.producao_item (
    id integer NOT NULL,
    producao_id integer NOT NULL,
    produto_id integer NOT NULL,
    item_numero integer NOT NULL,
    quantidade integer NOT NULL,
    multiplicador integer DEFAULT 1 NOT NULL,
    impresso boolean DEFAULT false NOT NULL,
    envelopado boolean DEFAULT false NOT NULL,
    embalado boolean DEFAULT false NOT NULL,
    retirado boolean DEFAULT false NOT NULL,
    data_ultimo_status timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: producao_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.producao_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: producao_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.producao_item_id_seq OWNED BY public.producao_item.id;


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    descricao text NOT NULL,
    exige_processamento boolean DEFAULT true NOT NULL,
    impresso boolean DEFAULT true NOT NULL,
    envelopado boolean DEFAULT true NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'apontador'::text NOT NULL,
    cliente_id integer,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cliente_produto_preco id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_produto_preco ALTER COLUMN id SET DEFAULT nextval('public.cliente_produto_preco_id_seq'::regclass);


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: producao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao ALTER COLUMN id SET DEFAULT nextval('public.producao_id_seq'::regclass);


--
-- Name: producao_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao_item ALTER COLUMN id SET DEFAULT nextval('public.producao_item_id_seq'::regclass);


--
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cliente_produto_preco; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cliente_produto_preco (id, cliente_id, produto_id, descricao, preco, data_inicial_validade, usa_papel, observacoes, ativo, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clientes (id, nome_razao_social, nome_fantasia, nome_interno, juridica, cnpj_cpf, inscr_estadual, inscr_municipal, telefone, logradouro, numero, complemento, bairro, cidade, cep, uf, email_nfse, nome_contato, email_contato, email_aprova_demonstrativo, email_informa_produto_embalado, email_produto_finalizado, tipo_faturamento, emite_boleto, exige_demonstrativo, pedido_compra, diretorio_producao, diretorio_demonstrativo, prazo_pagamento, tipo_fechamento, valor_alvo, valor_minimo, prazo_maximo_dias, dia_fechamento, fechar_ao_disponibilizar, ativo, created_at, updated_at, deleted_at) FROM stdin;
1	Empresa Alfa Ltda	Alfa Soluções	ALFA	t	12.345.678/0001-90	123.456.789.012	1234567	(11) 3456-7890	Rua das Flores	123	Sala 4	Centro	São Paulo	01310-100	SP	fiscal@alfa.com.br	João Silva	joao@alfa.com.br	financeiro@alfa.com.br	logistica@alfa.com.br	\N	N	t	t	f	/producao/alfa	/demonstrativos/alfa	30	MENSAL_FIXO	5000.00	1000.00	45	30	f	t	2026-05-20 14:13:08.480253-03	2026-05-20 14:13:08.480253-03	\N
2	Beta Comércio e Distribuição S.A.	Beta Distribuidora	BETA	t	98.765.432/0001-10	987.654.321.098	9876543	(21) 4567-8901	Avenida Brasil	500	Andar 10	Copacabana	Rio de Janeiro	22020-000	RJ	nfse@beta.com.br	Maria Oliveira	maria@beta.com.br	aprovacao@beta.com.br	expedicao@beta.com.br	\N	N	t	f	t	/producao/beta	/demonstrativos/beta	15	POR_VALOR	8000.00	2000.00	30	15	t	t	2026-05-20 14:13:08.483056-03	2026-05-20 14:13:08.483056-03	\N
3	Carlos Eduardo Mendes	\N	CARLOS	f	123.456.789-00	\N	\N	(31) 98765-4321	Rua Minas Gerais	77	\N	Savassi	Belo Horizonte	30130-110	MG	carlos@email.com.br	Carlos Mendes	carlos@email.com.br	\N	\N	\N	R	f	f	f	\N	\N	0	IMEDIATO	\N	\N	\N	\N	f	t	2026-05-20 14:13:08.484704-03	2026-05-20 14:13:08.484704-03	\N
4	Gama Tecnologia Ltda	GamaTech	GAMA	t	55.444.333/0001-22	554.443.330.012	\N	(51) 3456-2222	Rua dos Andradas	S/N	Bloco B	Centro Histórico	Porto Alegre	90020-000	RS	fiscal@gamatech.com.br	Ana Souza	ana@gamatech.com.br	aprovacao@gamatech.com.br	producao@gamatech.com.br	\N	N	t	t	t	/producao/gama	/demonstrativos/gama	30	POR_VALOR_OU_PRAZO	3000.00	500.00	60	Último	f	t	2026-05-20 14:13:08.48633-03	2026-05-20 14:13:08.48633-03	\N
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.logs (id, user_id, acao, entidade, entidade_id, descricao, created_at) FROM stdin;
1	1	CREATE	users	2	Usuário criado: Produção	2026-05-19 14:52:12.543636-03
2	1	CREATE	producao	1	Ordem de produção criada para Beta Comércio e Distribuição S.A.	2026-05-20 14:31:19.296305-03
\.


--
-- Data for Name: producao; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.producao (id, cliente_id, data_recebimento, hora_recebimento, observacoes, status, created_at, updated_at, deleted_at) FROM stdin;
1	2	2026-05-19	14:31	Teste 01	recebida	2026-05-20 14:31:19.294696-03	2026-05-20 14:31:19.294696-03	\N
\.


--
-- Data for Name: producao_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.producao_item (id, producao_id, produto_id, item_numero, quantidade, multiplicador, impresso, envelopado, embalado, retirado, data_ultimo_status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.produtos (id, descricao, exige_processamento, impresso, envelopado, ativo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, role, cliente_id, ativo, created_at, updated_at) FROM stdin;
1	Rhuarha	rhuarha@inteltec.com.br	$2b$10$TI4bewGMN5hXs4yIMVEXZ.VCmBsxV2bXcttd5ko3GlDlycnvL5waa	admin	\N	t	2026-05-19 14:09:49.159395-03	2026-05-19 14:09:49.159395-03
2	Produção	producao@inteltec.com.br	$2b$10$Pp4keEaJig7rJsbW.95Brua8xkfYJhE3T3vD6FjfEyUvlrOQWZ91G	apontador	\N	t	2026-05-19 14:52:12.542111-03	2026-05-19 14:52:12.542111-03
\.


--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cliente_produto_preco_id_seq', 1, false);


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clientes_id_seq', 4, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.logs_id_seq', 2, true);


--
-- Name: producao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.producao_id_seq', 1, true);


--
-- Name: producao_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.producao_item_id_seq', 1, false);


--
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.produtos_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: cliente_produto_preco cliente_produto_preco_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: producao_item producao_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_pkey PRIMARY KEY (id);


--
-- Name: producao producao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao
    ADD CONSTRAINT producao_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cliente_produto_preco cliente_produto_preco_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: cliente_produto_preco cliente_produto_preco_produto_id_produtos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_produto_id_produtos_id_fk FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- Name: producao producao_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao
    ADD CONSTRAINT producao_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: producao_item producao_item_producao_id_producao_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_producao_id_producao_id_fk FOREIGN KEY (producao_id) REFERENCES public.producao(id);


--
-- Name: producao_item producao_item_produto_id_produtos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_produto_id_produtos_id_fk FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- Name: users users_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- PostgreSQL database dump complete
--

