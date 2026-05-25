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
-- Name: cliente_produto_preco; Type: TABLE; Schema: public; Owner: producao
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


ALTER TABLE public.cliente_produto_preco OWNER TO producao;

--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.cliente_produto_preco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cliente_produto_preco_id_seq OWNER TO producao;

--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.cliente_produto_preco_id_seq OWNED BY public.cliente_produto_preco.id;


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: producao
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
    deleted_at timestamp with time zone,
    municipio_id integer
);


ALTER TABLE public.clientes OWNER TO producao;

--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clientes_id_seq OWNER TO producao;

--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: logs; Type: TABLE; Schema: public; Owner: producao
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


ALTER TABLE public.logs OWNER TO producao;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.logs_id_seq OWNER TO producao;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- Name: municipios; Type: TABLE; Schema: public; Owner: producao
--

CREATE TABLE public.municipios (
    id integer NOT NULL,
    nome text NOT NULL,
    uf character varying(2) NOT NULL,
    codigo_ibge character varying(10) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.municipios OWNER TO producao;

--
-- Name: municipios_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.municipios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.municipios_id_seq OWNER TO producao;

--
-- Name: municipios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.municipios_id_seq OWNED BY public.municipios.id;


--
-- Name: producao; Type: TABLE; Schema: public; Owner: producao
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
    deleted_at timestamp with time zone,
    recebimento_lote_id integer
);


ALTER TABLE public.producao OWNER TO producao;

--
-- Name: producao_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.producao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.producao_id_seq OWNER TO producao;

--
-- Name: producao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.producao_id_seq OWNED BY public.producao.id;


--
-- Name: producao_item; Type: TABLE; Schema: public; Owner: producao
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


ALTER TABLE public.producao_item OWNER TO producao;

--
-- Name: producao_item_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.producao_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.producao_item_id_seq OWNER TO producao;

--
-- Name: producao_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.producao_item_id_seq OWNED BY public.producao_item.id;


--
-- Name: produtos; Type: TABLE; Schema: public; Owner: producao
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


ALTER TABLE public.produtos OWNER TO producao;

--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produtos_id_seq OWNER TO producao;

--
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- Name: recebimento_lote; Type: TABLE; Schema: public; Owner: producao
--

CREATE TABLE public.recebimento_lote (
    id integer NOT NULL,
    data_recebimento date NOT NULL,
    hora_recebimento text NOT NULL,
    origem text NOT NULL,
    remetente character varying(255),
    assunto character varying(500),
    observacoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.recebimento_lote OWNER TO producao;

--
-- Name: recebimento_lote_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.recebimento_lote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recebimento_lote_id_seq OWNER TO producao;

--
-- Name: recebimento_lote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.recebimento_lote_id_seq OWNED BY public.recebimento_lote.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: producao
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


ALTER TABLE public.users OWNER TO producao;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: producao
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO producao;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: producao
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cliente_produto_preco id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.cliente_produto_preco ALTER COLUMN id SET DEFAULT nextval('public.cliente_produto_preco_id_seq'::regclass);


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: municipios id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.municipios ALTER COLUMN id SET DEFAULT nextval('public.municipios_id_seq'::regclass);


--
-- Name: producao id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao ALTER COLUMN id SET DEFAULT nextval('public.producao_id_seq'::regclass);


--
-- Name: producao_item id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao_item ALTER COLUMN id SET DEFAULT nextval('public.producao_item_id_seq'::regclass);


--
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- Name: recebimento_lote id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.recebimento_lote ALTER COLUMN id SET DEFAULT nextval('public.recebimento_lote_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cliente_produto_preco; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.cliente_produto_preco (id, cliente_id, produto_id, descricao, preco, data_inicial_validade, usa_papel, observacoes, ativo, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.clientes (id, nome_razao_social, nome_fantasia, nome_interno, juridica, cnpj_cpf, inscr_estadual, inscr_municipal, telefone, logradouro, numero, complemento, bairro, cidade, cep, uf, email_nfse, nome_contato, email_contato, email_aprova_demonstrativo, email_informa_produto_embalado, email_produto_finalizado, tipo_faturamento, emite_boleto, exige_demonstrativo, pedido_compra, diretorio_producao, diretorio_demonstrativo, prazo_pagamento, tipo_fechamento, valor_alvo, valor_minimo, prazo_maximo_dias, dia_fechamento, fechar_ao_disponibilizar, ativo, created_at, updated_at, deleted_at, municipio_id) FROM stdin;
1	Empresa Alfa Ltda	Alfa Soluções	ALFA	t	12.345.678/0001-90	123.456.789.012	1234567	(11) 3456-7890	Rua das Flores	123	Sala 4	Centro	São Paulo	01310-100	SP	fiscal@alfa.com.br	João Silva	joao@alfa.com.br	financeiro@alfa.com.br	logistica@alfa.com.br	\N	N	t	t	f	/producao/alfa	/demonstrativos/alfa	30	MENSAL_FIXO	5000.00	1000.00	45	30	f	t	2026-05-20 14:13:08.480253-03	2026-05-21 11:45:00.858-03	\N	1
2	Beta Comércio e Distribuição S.A.	Beta Distribuidora	BETA	t	98.765.432/0001-10	987.654.321.098	9876543	(21) 4567-8901	Avenida Brasil	500	Andar 10	Copacabana	Rio de Janeiro	22020-000	RJ	nfse@beta.com.br	Maria Oliveira	maria@beta.com.br	aprovacao@beta.com.br	expedicao@beta.com.br	\N	N	t	f	t	/producao/beta	/demonstrativos/beta	15	POR_VALOR	8000.00	2000.00	30	15	t	t	2026-05-20 14:13:08.483056-03	2026-05-21 11:45:00.86-03	\N	1
3	Carlos Eduardo Mendes	\N	CARLOS	f	123.456.789-00	\N	\N	(31) 98765-4321	Rua Minas Gerais	77	\N	Savassi	Belo Horizonte	30130-110	MG	carlos@email.com.br	Carlos Mendes	carlos@email.com.br	\N	\N	\N	R	f	f	f	\N	\N	0	IMEDIATO	\N	\N	\N	\N	f	t	2026-05-20 14:13:08.484704-03	2026-05-21 11:45:00.861-03	\N	1
4	Gama Tecnologia Ltda	GamaTech	GAMA	t	55.444.333/0001-22	554.443.330.012	\N	(51) 3456-2222	Rua dos Andradas	S/N	Bloco B	Centro Histórico	Porto Alegre	90020-000	RS	fiscal@gamatech.com.br	Ana Souza	ana@gamatech.com.br	aprovacao@gamatech.com.br	producao@gamatech.com.br	\N	N	t	t	t	/producao/gama	/demonstrativos/gama	30	POR_VALOR_OU_PRAZO	3000.00	500.00	60	Último	f	t	2026-05-20 14:13:08.48633-03	2026-05-21 11:45:00.863-03	\N	2
5	Grafica Agetra Ltda	Agetra	Agetra	t	72330772000100	0850022541	42.085/004-2	(54)3242-1679	Rua Buarque de Macedo	2120	Nulo	Sao Cristovao	\N	95320-000	\N	orcamento@agetra.com.br;orcamento3@agetra.com.br		orcamento@agetra.com.br;orcamento3@agetra.com.br	orcamento@agetra.com.br;orcamento3@agetra.com.br	orcamento@agetra.com.br;orcamento3@agetra.com.br	\N	N	t	t	f	/GraficaAgetra	/Demostrativo/GraficaAgetra	14	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.134895-03	2026-05-22 16:42:47.134895-03	\N	8
6	Imobiliaria Bassanesi Ltda	Bassanesi	Bassanesi	t	89278683000157	Nulo	15014	(54)3220-1951	Av. Julio de Castilhos	1399	Nulo	Centro	\N	95010-003	\N	luciana@bassanesi.com.br		luciana@bassanesi.com.br	luciana@bassanesi.com.br	luciana@bassanesi.com.br	\N	N	t	t	f	/Bassanesi	/Demostrativo/Bassanesi	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.137898-03	2026-05-22 16:42:47.137898-03	\N	1
7	Imobiliaria Bento Alves Ltda	Bento Alves	Bento Alves	t	88659206000179	Nulo	37616	(54)3209-6400	Av. Julio de Castilhos	1494	Nulo	Centro	\N	95010-000	\N	financeiro@bentoalves.com.br		financeiro@bentoalves.com.br	financeiro@bentoalves.com.br	financeiro@bentoalves.com.br	\N	N	t	t	f	/BentoAlves	/Demostrativo/BentoAlves	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.140124-03	2026-05-22 16:42:47.140124-03	\N	1
8	JD Comercio, Importacao, Representacoes e Transportes Ltda	Boccati	Boccati	t	89371561000100	0290114012	38395	(54)3224-9900	Rua Antonio Ribeiro Mendes	2043	Nulo	Santa Catarina	\N	95032-600	\N	nf@boccati.com.br;tatiana@boccati.com.br		nf@boccati.com.br;tatiana@boccati.com.br	nf@boccati.com.br;tatiana@boccati.com.br	nf@boccati.com.br;tatiana@boccati.com.br	\N	N	t	t	f	/Boccati	/Demostrativo/Boccati	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.142337-03	2026-05-22 16:42:47.142337-03	\N	1
9	Imobiliaria Cadore Ltda	Cadore	Cadore	t	03744757000188	Nulo	Nulo	(54)3028-0390	Rua Os Dezoito do Forte	1622	Nulo	SaoPelegrino	\N	95020-472	\N	alugueis@imobiliariacadore.com.br		alugueis@imobiliariacadore.com.br	alugueis@imobiliariacadore.com.br	alugueis@imobiliariacadore.com.br	\N	R	t	t	f	/Cadore	/Demostrativo/Cadore	7	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.147389-03	2026-05-22 16:42:47.147389-03	\N	1
10	Castertech Fundicao e Tecnologia Ltda	Castertech	Castertech	t	08304706000159	0290458889	94026	(54)3239-3600	Avenida Abramo Randon	770	Nulo	Interlagos	\N	95055-010	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Folha	/Demostrativo/Randon/Folha	7	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.15172-03	2026-05-22 16:42:47.15172-03	\N	1
11	Camara de Dirigentes Lojistas de Caxias do Sul	CDL - Caxias	CDL - Caxias	t	88639281000178	Nulo	Nulo	(54)3209-9977	Rua Sinimbu	1415	Nulo	Centro	\N	95020-001	\N	financeiro@cdlcaxias.com.br;taina.pradella@cdlcaxias.com.br		financeiro@cdlcaxias.com.br;taina.pradella@cdlcaxias.com.br	financeiro@cdlcaxias.com.br;taina.pradella@cdlcaxias.com.br	financeiro@cdlcaxias.com.br;taina.pradella@cdlcaxias.com.br	\N	N	t	t	f	/CDL-Caxias/Boleto	/Demostrativo/CDL-Caxias/Boleto	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.15527-03	2026-05-22 16:42:47.15527-03	\N	1
12	Cirna Industria de Plasticos e Moldes Ltda	Cirna	Cirna	t	87826202000175	0290039843	Nulo	(54)3212-1644	Rua Padre Raul Accorsi	900	Nulo	De Zorzi	\N	95074-300	\N	nfe@cirna.com.br;andressa@cirna.com.br		nfe@cirna.com.br;andressa@cirna.com.br	nfe@cirna.com.br;andressa@cirna.com.br	nfe@cirna.com.br;andressa@cirna.com.br	\N	N	t	t	f	/Cirna	/Demostrativo/Cirna	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.158467-03	2026-05-22 16:42:47.158467-03	\N	1
13	Cooperativa de Economia e Credito Mutuo dos Empregados das Empresas Randon	Cooperando	Cooperando	t	89280960000166	Nulo	73977	(54)3239-4496	Avenida Abramo Randon	770	Nulo	Interlagos	\N	95055-010	\N	poliana.zini@randon.com.br		poliana.zini@randon.com.br	poliana.zini@randon.com.br	poliana.zini@randon.com.br	\N	N	t	t	f	/Randon/Cooperando	/Demostrativo/Randon/Cooperando	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.161756-03	2026-05-22 16:42:47.161756-03	\N	1
14	Dzainer Produtos Plasticos Ltda	Dzainer	Dzainer	t	73960874000164	0290252741	32019	(54)2992-8700	Rua dos Tangaras	1637	Caixa Postal 8034	Santa Fe	\N	95047-570	\N	recebimento.nfe@dzainer.com.br		recebimento.nfe@dzainer.com.br	recebimento.nfe@dzainer.com.br	recebimento.nfe@dzainer.com.br	\N	N	t	t	f	/Dzainer	/Demostrativo/Dzainer	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.165364-03	2026-05-22 16:42:47.165364-03	\N	1
15	Farina S.A. Componentes Automotivos	Farina	Farina	t	87546636000111	0100000770	Nulo	(54)2102-8622	Rua Cavalheiro Jose Farina	215	Nulo	Licorsul	\N	95703-006	\N	clarisse@farina.com.br;grasiela.rodighero@farina.com.br		clarisse@farina.com.br;grasiela.rodighero@farina.com.br	clarisse@farina.com.br;grasiela.rodighero@farina.com.br	clarisse@farina.com.br;grasiela.rodighero@farina.com.br	\N	N	t	t	f	/Farina	/Demostrativo/Farina	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.168989-03	2026-05-22 16:42:47.168989-03	\N	\N
16	Federacao dos Hospitais e Estabelecimentos Servicos Saude do RS	Fehosul	Fehosul	t	93246940000146	Nulo	Nulo	(51)3234-1100	Rua Corte Real	133	Nulo	PetrOpolis	\N	90630-080	\N	financeiro@fehosul.gov.br		financeiro@fehosul.gov.br	financeiro@fehosul.gov.br	financeiro@fehosul.gov.br	\N	N	t	t	f	/FEHOSUL	/Demostrativo/FEHOSUL	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.172079-03	2026-05-22 16:42:47.172079-03	\N	2
17	Fox Administradora de Condominios Ltda	Fox	Fox	t	07272047000153	Nulo	86431	(54)3027-4020	Rua Pedro Tomasi	937	Nulo	Centro	\N	95084-320	\N	atendimento@foxcondominios.com.br		atendimento@foxcondominios.com.br	atendimento@foxcondominios.com.br	atendimento@foxcondominios.com.br	\N	R	t	t	f	/FoxAdmCond	/Demostrativo/FoxAdmCond	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.175379-03	2026-05-22 16:42:47.175379-03	\N	1
18	Fras-Le S/A	Fras-Le	Fras-Le	t	88610126000129	0290014735	17007	(54)3239-1809	Rodovia RS 122 Km 66,1	10945	Nulo	Forqueta	\N	95115-550	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Fras-le	/Demostrativo/Randon/Fras-le	7	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.178582-03	2026-05-22 16:42:47.178582-03	\N	1
19	Administradora de Imoveis Fulcher Ltda	Fulcher	Fulcher	t	93640480000136	Nulo	13177	(54)3214-2727	Avenida Julio de Castilhos	1183	Nulo	Centro	\N	95010-003	\N	financeiro@fulcherimoveis.com.br		financeiro@fulcherimoveis.com.br	financeiro@fulcherimoveis.com.br	financeiro@fulcherimoveis.com.br	\N	N	t	t	f	/Fulcher	/Demostrativo/Fulcher	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.181657-03	2026-05-22 16:42:47.181657-03	\N	1
20	G Paniz Ind de Equip P/ Alimentacao Ltda	G Paniz	G Paniz	t	90771833000149	0290084474	12462	(54)2101-2400	Rua Adolfo Randazzo	2010	Caixa Postal 8012	Vila Maestra	\N	95046-800	\N	fiscal01@gpaniz.com.br;eliamara.lazzaretti@gpaniz.com.br		fiscal01@gpaniz.com.br;eliamara.lazzaretti@gpaniz.com.br	fiscal01@gpaniz.com.br;eliamara.lazzaretti@gpaniz.com.br	fiscal01@gpaniz.com.br;eliamara.lazzaretti@gpaniz.com.br	\N	N	t	t	f	/Gpaniz	/Demostrativo/Gpaniz	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.184577-03	2026-05-22 16:42:47.184577-03	\N	1
21	Grazziotin Negocios Imobiliarios Ltda	Grazziotin	Grazziotin	t	92514801000193	Nulo	4572	(54)3028-1515	Rua Ernesto Alves	1545	Nulo	Centro	\N	95020-360	\N	tania@imobiliariagrazziotin.com.br		tania@imobiliariagrazziotin.com.br	tania@imobiliariagrazziotin.com.br	tania@imobiliariagrazziotin.com.br	\N	N	t	t	f	/Grazziotin	/Demostrativo/Grazziotin	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.187445-03	2026-05-22 16:42:47.187445-03	\N	1
22	Hidro Jet Equipamentos Hidraulicos Ltda	Hidrojet	Hidrojet	t	90952052000150	0470018640	42105002	(51)3637-4000	RS 452 Km 2	3101	Nulo	Bom Fim	\N	95770-000	\N	aline.carneiro@hidrojet.ind.br;financeiro@hidrojet.ind.br		aline.carneiro@hidrojet.ind.br;financeiro@hidrojet.ind.br	aline.carneiro@hidrojet.ind.br;financeiro@hidrojet.ind.br	aline.carneiro@hidrojet.ind.br;financeiro@hidrojet.ind.br	\N	N	t	t	f	/Hidrojet	/Demostrativo/Hidrojet	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.190605-03	2026-05-22 16:42:47.190605-03	\N	14
23	Hospital Beneficente Sao Carlos	HBSC	HBSC	t	89847370000172	Nulo	Nulo	(54)3261-8787	Rua da Republica	51	Nulo	Centro	\N	95170-476	\N	luciane@hbsc.com.br		luciane@hbsc.com.br	luciane@hbsc.com.br	luciane@hbsc.com.br	\N	N	t	t	f	/HBSC	/Demostrativo/HBSC	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.193638-03	2026-05-22 16:42:47.193638-03	\N	4
24	Jost Brasil Sistemas Automotivos Ltda	Jost	Jost	t	00843966000190	0290282713	Nulo	(54)3239-2000	Avenida Abramo Randon	1200	Nulo	Interlagos	\N	95055-010	\N	nfeser_jost@randon.com.br		nfeser_jost@randon.com.br	nfeser_jost@randon.com.br	nfeser_jost@randon.com.br	\N	N	t	t	f	/Randon/Jost	/Demostrativo/Randon/Jost	7	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.196625-03	2026-05-22 16:42:47.196625-03	\N	1
25	Clube Juvenil	Juvenil	Juvenil	t	88664305000149	Nulo	Nulo	(54)3223-5866	Avenida Julio de Castilhos	1677	Nulo	Interlagos	\N	95010-002	\N	gerenciadm@clubejuvenilcaxias.com.br;financeiro@clubejuvenilcaxias.com.br		gerenciadm@clubejuvenilcaxias.com.br;financeiro@clubejuvenilcaxias.com.br	gerenciadm@clubejuvenilcaxias.com.br;financeiro@clubejuvenilcaxias.com.br	gerenciadm@clubejuvenilcaxias.com.br;financeiro@clubejuvenilcaxias.com.br	\N	N	t	t	f	/Juvenil	/Demostrativo/Juvenil	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.200017-03	2026-05-22 16:42:47.200017-03	\N	1
26	Lupatech S.A.	Lupatech	Lupatech	t	89463822000112	0290011526	Nulo	(11)3309-9000	Rua Dalton Lahm dos Reis	201	Nulo	Distrito Industrial	\N	95112-090	\N	luciana.parise@lupatech.com.br		luciana.parise@lupatech.com.br	luciana.parise@lupatech.com.br	luciana.parise@lupatech.com.br	\N	N	t	t	f	/LUPATECH	/Demostrativo/LUPATECH	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.203314-03	2026-05-22 16:42:47.203314-03	\N	1
27	Mipel Industria e Comercio de Valvulas Ltda	Mipel Sul	Mipel Sul	t	07743815000100	1570042010	Nulo	(54)2992-7000	Rua Casemiro Ecco	417	Nulo	Vila Azul	\N	95330-000	\N	luciana.parise@lupatech.com.br		luciana.parise@lupatech.com.br	luciana.parise@lupatech.com.br	luciana.parise@lupatech.com.br	\N	N	t	t	f	/LUPATECH	/Demostrativo/LUPATECH	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.206373-03	2026-05-22 16:42:47.206373-03	\N	18
28	Mipel Industria e Comercio de Valvulas Ltda	Microfusao	Microfusao	t	07743815000290	1570045370	Nulo	(54)2992-7000	Rua Casemiro Ecco	421	Nulo	Vila Azul	\N	95330-000	\N	nfe.veranopolis@lupatech.com.br;markele.remor@lupatech.com.br		nfe.veranopolis@lupatech.com.br;markele.remor@lupatech.com.br	nfe.veranopolis@lupatech.com.br;markele.remor@lupatech.com.br	nfe.veranopolis@lupatech.com.br;markele.remor@lupatech.com.br	\N	N	t	t	f	/LUPATECH	/Demostrativo/LUPATECH	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.209347-03	2026-05-22 16:42:47.209347-03	\N	18
29	Lupatech S.A.	Valmicro	Valmicro	t	89463822001003	1570047674	Nulo	(54)2992-7000	Rua Casemiro Ecco	415	Nulo	Industrial	\N	95330-000	\N	nfe.veranopolis@lupatech.com.br;nfe@lupatech.com.br;markele.remor@lupatech.com.br		nfe.veranopolis@lupatech.com.br;nfe@lupatech.com.br;markele.remor@lupatech.com.br	nfe.veranopolis@lupatech.com.br;nfe@lupatech.com.br;markele.remor@lupatech.com.br	nfe.veranopolis@lupatech.com.br;nfe@lupatech.com.br;markele.remor@lupatech.com.br	\N	N	t	t	f	/LUPATECH	/Demostrativo/LUPATECH	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.212264-03	2026-05-22 16:42:47.212264-03	\N	18
30	Marcopolo S.A	Marcopolo	Marcopolo	t	88611835000803	0290086299	Nulo	(54)2101-4221	Avenida Rio Branco	4889	Nulo	Ana Rech	\N	95060-650	\N	juliana.souza@marcopolo.com.br;bruno.santo@marcopolo.com.br;leandro.cavalin@marcopolo.com.br		juliana.souza@marcopolo.com.br;bruno.santo@marcopolo.com.br;leandro.cavalin@marcopolo.com.br	juliana.souza@marcopolo.com.br;bruno.santo@marcopolo.com.br;leandro.cavalin@marcopolo.com.br	juliana.souza@marcopolo.com.br;bruno.santo@marcopolo.com.br;leandro.cavalin@marcopolo.com.br	\N	N	t	t	f	/Marcopolo	/Demostrativo/Marcopolo	30	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.215326-03	2026-05-22 16:42:47.215326-03	\N	1
31	Master Sistemas Automotivos Ltda	Master	Master	t	90852914000173	0290137551	Nulo	(54)3239-2000	Rua Atilio Andreazza	3520	Nulo	Interlagos	\N	95052-070	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Master	/Demostrativo/Randon/Master	7	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.218334-03	2026-05-22 16:42:47.218334-03	\N	1
32	Microinox - Fundicao de Precisao e Usinagem Ltda	Microinox	Microinox	t	13785854000172	0290542677	Nulo	(54)3022-2590	Rua Gerson Andreis	892	Nulo	Distrito Industrial	\N	95112-130	\N	nfe.microinox@microinox.com.br		nfe.microinox@microinox.com.br	nfe.microinox@microinox.com.br	nfe.microinox@microinox.com.br	\N	N	t	t	f	/Hidrojet	/Demostrativo/Hidrojet	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.221511-03	2026-05-22 16:42:47.221511-03	\N	1
33	Imobiliaria Nichele Ltda	Nichele	Nichele	t	88655113000176	Nulo	29422	(54)3289-2900	Rua Visconde de Pelotas	381	Nulo	Centro	\N	95020-180	\N	marta@nicheleimoveis.com.br		marta@nicheleimoveis.com.br	marta@nicheleimoveis.com.br	marta@nicheleimoveis.com.br	\N	N	t	t	f	/Nichele	/Demostrativo/Nichele	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.224369-03	2026-05-22 16:42:47.224369-03	\N	1
34	Opusadmin Administradora de Condominios Ltda	Opus	Opus	t	07062800000186	Nulo	85382	(54)3228-6619	Rua Os Dezoito do Forte	422	Sala 408	Nossa Senhora de Lourdes	\N	95020-472	\N	opus@opusadmin.com.br		opus@opusadmin.com.br	opus@opusadmin.com.br	opus@opusadmin.com.br	\N	N	t	t	f	/Opus	/Demostrativo/Opus	14	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.22753-03	2026-05-22 16:42:47.22753-03	\N	1
35	Panaser S.A. Beneficiamento de Acos	Panaser	Panaser	t	15511094000130	0450097374	16901	(54)3906-8900	Estrada RST 453, Km 114+960	6605	Nulo	Linha Vicentina	\N	95172-090	\N	nfe@panaser.com.br		nfe@panaser.com.br	nfe@panaser.com.br	nfe@panaser.com.br	\N	N	t	t	f	/Panatlantica	/Demostrativo/Panatlantica	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.231019-03	2026-05-22 16:42:47.231019-03	\N	4
36	Panatlantica Industria e Comercio de Tubos S.A.	Panatlantica	Panatlantica	t	03684007000168	0290423937	84531	(54)3211-8525	Rodovia RST 453, Km 80	32973	Nulo	Nossa Senhora da Saude	\N	95042-190	\N	nfservico@panatlanticatubos.com.br;recursos@panatlanticatubos.com.br		nfservico@panatlanticatubos.com.br;recursos@panatlanticatubos.com.br	nfservico@panatlanticatubos.com.br;recursos@panatlanticatubos.com.br	nfservico@panatlanticatubos.com.br;recursos@panatlanticatubos.com.br	\N	N	t	t	f	/Panatlantica	/Demostrativo/Panatlantica	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.234286-03	2026-05-22 16:42:47.234286-03	\N	1
37	Municipio de Caxias do Sul	PM Caxias	PM Caxias	t	88830609000139	Nulo	71469	(54)3218-6000	Rua Alfredo Chaves	1333	Nulo	Centro	\N	95020-460	\N	Nulo		Nulo	Nulo	Nulo	\N	N	t	t	f	/PrefCaxias	/Demostrativo/PrefCaxias	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.237367-03	2026-05-22 16:42:47.237367-03	\N	1
38	Prolar Imoveis Administracao e Corretagem Ltda	Prolar	Prolar	t	87506283000126	Nulo	10501	(54)3026-8999	Avenida Julio de Castilhos	657	Nulo	Nossa Senhora de Lourdes	\N	95010-003	\N	liliana@prolar.imb.br;evandro@prolar.imb.br		liliana@prolar.imb.br;evandro@prolar.imb.br	liliana@prolar.imb.br;evandro@prolar.imb.br	liliana@prolar.imb.br;evandro@prolar.imb.br	\N	N	t	t	f	/PROLAR	/Demostrativo/PROLAR	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.240659-03	2026-05-22 16:42:47.240659-03	\N	1
39	Randon S/A Implementos e Participacoes	Brantech	Brantech	t	89086144001007	257313087	Nulo	(54)3239-2000	Rodovia SC 459, km 143,7	Nulo	Nulo	Trecho Chapeco, Guatambu	\N	89809-970	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Brantech	/Demostrativo/Brantech	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.243952-03	2026-05-22 16:42:47.243952-03	\N	13
40	Randon S/A Implementos e Participacoes	Randon Cx - Implem	Randon Cx - Implem	t	89086144000116	0290400465	Nulo	(54)3239-2000	Avenida Abramo Randon	770	Nulo	Interlagos	\N	95055-010	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Folha	/Demostrativo/Randon/Folha	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.246989-03	2026-05-22 16:42:47.246989-03	\N	1
41	Randon S/A Implementos e Participacoes	Randon Cx - Holding	Randon Cx - Holding	t	89086144001198	0290400465	Nulo	(54)3239-2000	Avenida Abramo Randon	770	Nulo	Interlagos	\N	95055-010	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Folha	/Demostrativo/Randon/Folha	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.2498-03	2026-05-22 16:42:47.2498-03	\N	1
42	Randon Administradora de Consorcios Ltda	Racon	Racon	t	91108027000158	Nulo	Nulo	(54)3239-2738	Rua Atilio Andreazza	3480	Nulo	Interlagos	\N	95052-070	\N	Nulo		Nulo	Nulo	Nulo	\N	N	t	t	f	/Randon/Folha	/Demostrativo/Randon/Folha	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.252549-03	2026-05-22 16:42:47.252549-03	\N	1
43	Real Center Materiais e Equipamentos Eletricos Ltda	Real Center	Real Center	t	93364974000135	0290195535	10402	(54)3534-4400	Avenida Rubem Bento Alves	3167	Nulo	Santa Catarina	\N	95032-440	\N	fiscal@realcenter.com.br		fiscal@realcenter.com.br	fiscal@realcenter.com.br	fiscal@realcenter.com.br	\N	N	t	t	f	/RealCenter	/Demostrativo/RealCenter	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.255495-03	2026-05-22 16:42:47.255495-03	\N	1
44	Resulthado Solucoes A Condominios Ltda	Resulthado	Resulthado	t	09549273000164	Nulo	101650	(54)3028-8616	Rua Bento Goncalves	1282	Sala 05	Centro	\N	95020-412	\N	resulthado@resulthado.com.br		resulthado@resulthado.com.br	resulthado@resulthado.com.br	resulthado@resulthado.com.br	\N	N	t	t	f	/Resulthado	/Demostrativo/Resulthado	14	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.258372-03	2026-05-22 16:42:47.258372-03	\N	1
45	Associacao dos Moradores do Jardim Da Lagoa	AMJL	AMJL	t	90256579000140	Nulo	Nulo	(51)3592-2646	Rua da Margem	Nulo	S/N	Jardim da Lagoa	\N	95520-000	\N	sindisys.sle@gmail.com;guilha01@hotmail.com		sindisys.sle@gmail.com;guilha01@hotmail.com	sindisys.sle@gmail.com;guilha01@hotmail.com	sindisys.sle@gmail.com;guilha01@hotmail.com	\N	N	t	t	f	/SindiLojas-SLeo/Condominio	/Demostrativo/SindiLojas-SLeo/Condominio	7	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.261337-03	2026-05-22 16:42:47.261337-03	\N	15
46	Sindicato do Comercio Varejista de SaoLeopoldo	Sindilojas - Sao Leo	Sindilojas - Sao Leo	t	91100339000115	Nulo	Nulo	(51)3592-2646	Rua Jose Bonifacio	1009	Nulo	Centro	\N	93010-180	\N	sindileo@sindileo.com.br		sindileo@sindileo.com.br	sindileo@sindileo.com.br	sindileo@sindileo.com.br	\N	N	t	t	f	/SindiLojas-Sleo	/Demostrativo/SindiLojas-Sleo	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.26463-03	2026-05-22 16:42:47.26463-03	\N	16
47	Sind. dos Odontologistas de Caxias do Sul	Sindiodonto	Sindiodonto	t	90773326000144	Nulo	Nulo	(54)3223-5300	Av. Julio de Castilhos	1188	Sala 42	Nossa Senhora de Lourdes	\N	95010-003	\N	contato@sindiodontoserra.com.br		contato@sindiodontoserra.com.br	contato@sindiodontoserra.com.br	contato@sindiodontoserra.com.br	\N	N	t	t	f	/SindioOdonto-CX	/Demostrativo/SindioOdonto-CX	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.267842-03	2026-05-22 16:42:47.267842-03	\N	1
48	So Condominios Administradora Ltda	So Condominios	So Condominios	t	03286644000186	Nulo	68272	(54)3221-5566	Rua Os Dezoito do Forte	1344	Sala 21 e 22	SaoPelegrino	\N	95020-472	\N	financeiro@socondominios.srv.br		financeiro@socondominios.srv.br	financeiro@socondominios.srv.br	financeiro@socondominios.srv.br	\N	R	t	t	f	/SoCondominios	/Demostrativo/SoCondominios	4	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.270915-03	2026-05-22 16:42:47.270915-03	\N	1
49	Solucao Servicos para Condominios Ltda Me	Solucao	Solucao	t	03728366000170	Nulo	71831	(54)3222-6377	Rua Tronca	1959	Sala 2 - terreo	Rio Branco	\N	95010-100	\N	rafael@solucaoadm.com		rafael@solucaoadm.com	rafael@solucaoadm.com	rafael@solucaoadm.com	\N	N	t	t	f	/Solucao	/Demostrativo/Solucao	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.273926-03	2026-05-22 16:42:47.273926-03	\N	1
50	Randon S/A Implementos e Participacoes	Suspensys	Suspensys	t	89086144000620	0290580064	Nulo	(54)3239-3093	Av Abramo Randon	1262	Anexo B	Interlagos	\N	95055-010	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Suspensys	/Demostrativo/Randon/Suspensys	7	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.276948-03	2026-05-22 16:42:47.276948-03	\N	1
51	Tabone Industria e Comercio de Plasticos Ltda	Tabone - Filial	Tabone - Filial	t	90102609000911	Nulo	Nulo	(54)3026-9559	Rua Evaristo De Antoni	3033	Nulo	SaoJose	\N	95041-000	\N	Nulo		Nulo	Nulo	Nulo	\N	N	t	t	f	/Tabone	/Demostrativo/Tabone	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.279913-03	2026-05-22 16:42:47.279913-03	\N	1
52	Tabone Industria e Comercio de Plasticos Ltda	Tabone - Matriz	Tabone - Matriz	t	90102609000164	0290166489	49694	(54)3026-9404	Rua Gerson Andreis	1110	Nulo	Cidade Nova	\N	95112-130	\N	nfe@tabone.com.br;carla.rosa@tabone.com.br;deise.schamrek@tabone.com.br		nfe@tabone.com.br;carla.rosa@tabone.com.br;deise.schamrek@tabone.com.br	nfe@tabone.com.br;carla.rosa@tabone.com.br;deise.schamrek@tabone.com.br	nfe@tabone.com.br;carla.rosa@tabone.com.br;deise.schamrek@tabone.com.br	\N	N	t	t	f	/Tabone	/Demostrativo/Tabone	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.2829-03	2026-05-22 16:42:47.2829-03	\N	1
53	Imobiliaria Terra e Lar Ltda	Terra E Lar	Terra E Lar	t	89087894000102	Nulo	23803	(54)3214-1300	Rua Alfredo Chaves	548	Nulo	Centro	\N	95020-460	\N	claudia.caixa@terraelar.com.br		claudia.caixa@terraelar.com.br	claudia.caixa@terraelar.com.br	claudia.caixa@terraelar.com.br	\N	N	t	t	f	/TerraeLar	/Demostrativo/TerraeLar	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.285904-03	2026-05-22 16:42:47.285904-03	\N	1
54	Fundacao Universidade de Caxias do Sul	UCS - Fin	UCS - Fin	t	88648761000103	0290089530	Nulo	(54)3218-2100	Rua Francisco Getulio Vargas	1130	Nulo	PetrOpolis	\N	95070-560	\N	gcdtelli@ucs.br		gcdtelli@ucs.br	gcdtelli@ucs.br	gcdtelli@ucs.br	\N	N	t	t	f	/UCS	/Demostrativo/UCS	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.288908-03	2026-05-22 16:42:47.288908-03	\N	1
55	Fundacao Universidade de Caxias do Sul	UCS - HG	UCS - HG	t	88648761001843	Nulo	62316	(54)3218-2100	Rua Francisco Getulio Vargas	1130	Nulo	PetrOpolis	\N	95070-560	\N	Nulo		Nulo	Nulo	Nulo	\N	N	t	t	f	/UCS	/Demostrativo/UCS	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.291937-03	2026-05-22 16:42:47.291937-03	\N	1
56	Unimed Nordeste RS Soc. Coop. de Serv. Medicos Ltda	Unimed - Medicina	Unimed - Medicina	t	87827689002588	Nulo	82103	(54)3289-9308	Rua Sinimbu	1183	Terreo - Loja B	Centro	\N	95020-001	\N	nicolle.stecanella@unimednordesters.com.br		nicolle.stecanella@unimednordesters.com.br	nicolle.stecanella@unimednordesters.com.br	nicolle.stecanella@unimednordesters.com.br	\N	N	t	t	f	/UNIMED	/Demostrativo/UNIMED	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.29515-03	2026-05-22 16:42:47.29515-03	\N	1
57	Unimed Nordeste RS Soc. Coop. de Serv. Medicos Ltda	Unimed	Unimed	t	87827689000100	0290331773	16759	(54)3220-2000	Rua Moreira Cesar	2400	Nulo	Pio X	\N	95034-000	\N	nfe@unimednordesters.com.br;cartoes@unimednordesters.com.br;caroline.mello@unimednordesters.com.br		nfe@unimednordesters.com.br;cartoes@unimednordesters.com.br;caroline.mello@unimednordesters.com.br	nfe@unimednordesters.com.br;cartoes@unimednordesters.com.br;caroline.mello@unimednordesters.com.br	nfe@unimednordesters.com.br;cartoes@unimednordesters.com.br;caroline.mello@unimednordesters.com.br	\N	N	t	t	f	/UNIMED	/Demostrativo/UNIMED	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.298275-03	2026-05-22 16:42:47.298275-03	\N	1
58	Viezzer Eng. e Neg. Imobiliarios Ltda	Viezzer	Viezzer	t	89824239000190	0290360609	Nulo	(54)3220-6933	Rua Ruben Bento Alves	1419	Sala 2	Interlagos	\N	95041-410	\N	nfeletronica@viezzerengenharia.com.br;ivanice@viezzerengenharia.com.br		nfeletronica@viezzerengenharia.com.br;ivanice@viezzerengenharia.com.br	nfeletronica@viezzerengenharia.com.br;ivanice@viezzerengenharia.com.br	nfeletronica@viezzerengenharia.com.br;ivanice@viezzerengenharia.com.br	\N	N	t	t	f	/Viezzer	/Demostrativo/Viezzer	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.301239-03	2026-05-22 16:42:47.301239-03	\N	1
59	Hidrover Equipamentos Hidraulicos Ltda	Hidrover-Weber	Hidrover-Weber	t	88818125000174	0480047596	10995	(54)2992-8812	Rod. RS 122 - KM 95	Nulo	Nulo	Travessao Garibaldi	\N	95034-500	\N	Joice.Badio@hidrover.com.br;financeiro.brc@hidrover.com.br;nfein@hidrover.com.br		Joice.Badio@hidrover.com.br;financeiro.brc@hidrover.com.br;nfein@hidrover.com.br	Joice.Badio@hidrover.com.br;financeiro.brc@hidrover.com.br;nfein@hidrover.com.br	Joice.Badio@hidrover.com.br;financeiro.brc@hidrover.com.br;nfein@hidrover.com.br	\N	N	t	t	f	/Hidrover	/Demostrativo/Hidrover	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.304269-03	2026-05-22 16:42:47.304269-03	\N	7
60	Metalurgica Weloze Ltda	Weloze	Weloze	t	87007910000184	0290082919	Nulo	(54)3026-1500	Rua Padre AmbrOsio Pieratelli	454	Nulo	Kayser	\N	95098-380	\N	nfe@weloze.com.br		nfe@weloze.com.br	nfe@weloze.com.br	nfe@weloze.com.br	\N	N	t	t	f	/Weloze	/Demostrativo/Weloze	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.307096-03	2026-05-22 16:42:47.307096-03	\N	1
61	Wiretec Ind. de Componentes Eletroeletronicos Ltda	Wiretec	Wiretec	t	05319866000183	0290399270	79387	(54)3534-3000	Rua Gen. Jacinto Maria de Godoi	2522	Nulo	Santa Catarina	\N	95032-140	\N	nfe@wiretec.com.br;rh1@wiretec.com.br		nfe@wiretec.com.br;rh1@wiretec.com.br	nfe@wiretec.com.br;rh1@wiretec.com.br	nfe@wiretec.com.br;rh1@wiretec.com.br	\N	N	t	t	f	/Wiretec	/Demostrativo/Wiretec	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.310028-03	2026-05-22 16:42:47.310028-03	\N	1
62	Perfilisa Industria de Plasticos de Engenharia Ltda	Perfilisa	Perfilisa	t	92097997000168	0290165822	49573	(54)3028-1700	Rua Gerson Andreis	636	Distrito Industrial	Desvio Rizzo	\N	95112-130	\N	cintiaz@perfilisa.com.br		cintiaz@perfilisa.com.br	cintiaz@perfilisa.com.br	cintiaz@perfilisa.com.br	\N	N	t	t	f	/Perfilisa	/Demostrativo/Perfilisa	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.312725-03	2026-05-22 16:42:47.312725-03	\N	1
63	Sindicato dos Hospitais e Clinicas de Porto Alegre	Sindihospa	Sindihospa	t	92963792000118	Nulo	Nulo	(51)3330-3990	Rua Coronel Corte Real	58	Nulo	PetrOpolis	\N	90630-080	\N	andreia@sindihospa.com.br		andreia@sindihospa.com.br	andreia@sindihospa.com.br	andreia@sindihospa.com.br	\N	N	t	t	f	/Sindihospa	/Demostrativo/Sindihospa	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.315491-03	2026-05-22 16:42:47.315491-03	\N	2
64	Hospital Saude Ltda	Hospital Saude	Hospital Saude	t	88575394000157	Nulo	Nulo	(54)3026-2699	Rua Vinte De Setembro	2311	Predio	Centro	\N	95020-450	\N	saudefin@hospitalsaude.com.br;jmsilva@hospitalsaude.com.br		saudefin@hospitalsaude.com.br;jmsilva@hospitalsaude.com.br	saudefin@hospitalsaude.com.br;jmsilva@hospitalsaude.com.br	saudefin@hospitalsaude.com.br;jmsilva@hospitalsaude.com.br	\N	N	t	t	f	/HospSaude	/Demostrativo/HospSaude	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.318232-03	2026-05-22 16:42:47.318232-03	\N	1
65	Cia. de Impressao Digital - CTD	CTD	CTD	t	93445484000163	0240293800	Nulo	(51)3415-3400	Rua Berto Cirio	1450	Nulo	SaoLuis	\N	92420-030	\N	acricha@ctd.com.br		acricha@ctd.com.br	acricha@ctd.com.br	acricha@ctd.com.br	\N	N	t	t	f	/CTD	/Demostrativo/CTD	14	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.320738-03	2026-05-22 16:42:47.320738-03	\N	12
66	Inovacao Negocios Imobiliarios Ltda - ME	Inovacao	Inovacao	t	01734687000151	Nulo	59526	(54)3028-6088	Rua Alfredo Chaves	1010	Nulo	Centro	\N	95020-460	\N	laura@imobiliariainovacao.com.br;financeiro@imobiliariainovacao.com.br		laura@imobiliariainovacao.com.br;financeiro@imobiliariainovacao.com.br	laura@imobiliariainovacao.com.br;financeiro@imobiliariainovacao.com.br	laura@imobiliariainovacao.com.br;financeiro@imobiliariainovacao.com.br	\N	N	t	t	f	/Inovacao	/Demostrativo/Inovacao	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.323381-03	2026-05-22 16:42:47.323381-03	\N	1
67	Petry Empreendimentos Imobiliarios Ltda - ME	SOS	SOS	t	09358728000164	Nulo	100387	(54)3025-1628	Rua Os Dezoito do Forte	422	sala 306	Lourdes	\N	95020-472	\N	Nulo		Nulo	Nulo	Nulo	\N	R	t	t	f	/SOS	/Demostrativo/SOS	7	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.326261-03	2026-05-22 16:42:47.326261-03	\N	1
68	Lorigraf Grafica e Editora Ltda	Lorigraf	Lorigraf	t	93532968000140	0290200652	11821	(54)3021-8400	Travessa Sao Marcos	545	Nulo	Kayser	\N	95098-490	\N	lorigraf@lorigraf.com.br		lorigraf@lorigraf.com.br	lorigraf@lorigraf.com.br	lorigraf@lorigraf.com.br	\N	N	t	t	f	/GraficaLorigraf	/Demostrativo/GraficaLorigraf	21	IMEDIATO	0.00	0.00	0	15	f	t	2026-05-22 16:42:47.329178-03	2026-05-22 16:42:47.329178-03	\N	1
69	Novo Conceito Administradora de Condominios Ltda	Novo Conceito	Novo Conceito	t	13868156000130	Nulo	 NULL	(54)3039-2908	Rua Pinheiro Machado	2569	Sala 44	SaoPelegrino	\N	95020-172	\N	Nulo		Nulo	Nulo	Nulo	\N	R	t	t	f	/NovoConceito	/Demostrativo/NovoConceito	7	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.331861-03	2026-05-22 16:42:47.331861-03	\N	1
70	America de Antoni Comercio de Confeccoes Ltda	Lojas America	Lojas America	t	19020073000769	0290	4305108	(54)3025-2030	Av. General Flores Da Cunha	1313	Nulo	Vila Imbui	\N	94910-002	\N	Nulo		Nulo	Nulo	Nulo	\N	N	t	t	f	/LojasAmerica	/Demostrativo/LojasAmerica	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.3345-03	2026-05-22 16:42:47.3345-03	\N	19
71	Foca Controles de Acessos Ltda	Foca	Foca	t	02451712000152	0290322685	63163	(54)2108-8000	Rua Magdalena Aver Fadanelli	1140	Pavilhao	Centenario	\N	95045-178	\N	rh@focabraun.com.br		rh@focabraun.com.br	rh@focabraun.com.br	rh@focabraun.com.br	\N	N	t	t	f	/Foca	/Demostrativo/Foca	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.33714-03	2026-05-22 16:42:47.33714-03	\N	1
72	Intermach Pecas Automotivas Ltda	Intermach	Intermach	t	91956755000110	0290500443	Nulo	(54)3013-6400	Rua Joao Meneghini	428	Nulo	Interlagos	\N	95055-330	\N	nfe@intermach.ind.br;rh02@intermach.ind.br		nfe@intermach.ind.br;rh02@intermach.ind.br	nfe@intermach.ind.br;rh02@intermach.ind.br	nfe@intermach.ind.br;rh02@intermach.ind.br	\N	N	t	t	f	/Intermach	/Demostrativo/Intermach	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.339871-03	2026-05-22 16:42:47.339871-03	\N	1
73	Jobel Engenharia Ltda	Jobel	Jobel	t	88584511000149	0290354919	20163	(54)3536-4600	Rua Marechal Floriano	1567	Nulo	Centro	\N	95020-372	\N	nfe@jobel.com.br;daniele@jobel.com.br;rosalba@jobel.com.br		nfe@jobel.com.br;daniele@jobel.com.br;rosalba@jobel.com.br	nfe@jobel.com.br;daniele@jobel.com.br;rosalba@jobel.com.br	nfe@jobel.com.br;daniele@jobel.com.br;rosalba@jobel.com.br	\N	N	t	t	f	/Jobel	/Demostrativo/Jobel	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.342688-03	2026-05-22 16:42:47.342688-03	\N	1
74	PERMUNDY - Gestao de Condominios Ltda	Imperia	Imperia	t	17261092000166	Nulo	130276	(54)3025-8665	Rua Sinimbu	2091	Salas 116 e 118	Centro	\N	95020-002	\N	financeiro@imperiacondominios.com.br		financeiro@imperiacondominios.com.br	financeiro@imperiacondominios.com.br	financeiro@imperiacondominios.com.br	\N	N	t	t	f	/Imperia	/Demostrativo/Imperia	14	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.345313-03	2026-05-22 16:42:47.345313-03	\N	1
75	Avivra Administradora de Condominios Ltda	Avivra	Avivra	t	20486885000198	Nulo	Nulo	(54)3268-7741	Rua Ruy Barbosa	20	A - Sala 706	Centro	\N	95170-440	\N	contato@avivra.com.br;marcos@avivra.com.br		contato@avivra.com.br;marcos@avivra.com.br	contato@avivra.com.br;marcos@avivra.com.br	contato@avivra.com.br;marcos@avivra.com.br	\N	N	t	t	f	/Avivra	/Demostrativo/Avivra	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.347903-03	2026-05-22 16:42:47.347903-03	\N	1
76	Mercosul Indústria de Motores Ltda	EBERLE	EBERLE	t	15568388000107	0290557321	Nulo	(54)3026-3400	Estrada Federal BR-116 - Km 145	5000	Nulo	Sao Cristovao	\N	95059-520	\N	maiara.souza@mercosulmotores.com.br;kamila.rosa@mercosulmotores.com.br		maiara.souza@mercosulmotores.com.br;kamila.rosa@mercosulmotores.com.br	maiara.souza@mercosulmotores.com.br;kamila.rosa@mercosulmotores.com.br	maiara.souza@mercosulmotores.com.br;kamila.rosa@mercosulmotores.com.br	\N	N	t	t	f	/Eberle	/Demostrativo/Eberle	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.350615-03	2026-05-22 16:42:47.350615-03	\N	1
77	Habil Condominios LTDA	Habil	Habil	t	24107215000174	Nulo	Nulo	(54)3536-6718	Rua Vinte de Setembro	1675	Sala 302	Centro	\N	95020-450	\N	habilcondominios@habilcondominios.com.br		habilcondominios@habilcondominios.com.br	habilcondominios@habilcondominios.com.br	habilcondominios@habilcondominios.com.br	\N	R	t	t	f	/Habil	/Demostrativo/Habil	7	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.353643-03	2026-05-22 16:42:47.353643-03	\N	1
78	Frost Frio Refrigeracao Industrial SA	Frost Frio	Frost Frio	t	02210803000104	0290318645	114477	(54)3220-8149	Rua Hermes Fontes	365	Nulo	Santa Fe	\N	95045-180	\N	natalise.zanin@guentner.com;nfef@guentner.com		natalise.zanin@guentner.com;nfef@guentner.com	natalise.zanin@guentner.com;nfef@guentner.com	natalise.zanin@guentner.com;nfef@guentner.com	\N	N	t	t	f	/Frost	/Demostrativo/Frost	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.356606-03	2026-05-22 16:42:47.356606-03	\N	1
79	Guntner do Brasil Representacoes Ltda	Guntner	Guntner	t	10417549000130	0290498376	Nulo	(54)3220-8149	Rua Hermes Fontes	365	Sala 2	Santa Fe	\N	95045-180	\N	clarice.rech@guentner.com		clarice.rech@guentner.com	clarice.rech@guentner.com	clarice.rech@guentner.com	\N	N	t	t	f	/Frost	/Demostrativo/Frost	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.359542-03	2026-05-22 16:42:47.359542-03	\N	1
80	CeA Comercio de Alimentos Ltda	SUPER CRISAN	SUPER CRISAN	t	06348488000129	0290424712	84287	(54)3217-7119	Professora Nely Veronese Macia	714	Nulo	Esplanada	\N	95095-281	\N	lucianecrisan@yahoo.com.br		lucianecrisan@yahoo.com.br	lucianecrisan@yahoo.com.br	lucianecrisan@yahoo.com.br	\N	N	t	t	f	/CRISAN	/Demostrativo/CRISAN	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.362252-03	2026-05-22 16:42:47.362252-03	\N	1
81	Lamina Industria Plastica Ltda	Lamina	Lamina	t	05853030000164	0290412285	Nulo	(54)3217-9099	Rod RSC 453	16401	Setor F	Santa Fé	\N	95045-630	\N	nfe.lamina@lamina.ind.br;rh2@lamina.ind.br;rh@lamina.ind.br		nfe.lamina@lamina.ind.br;rh2@lamina.ind.br;rh@lamina.ind.br	nfe.lamina@lamina.ind.br;rh2@lamina.ind.br;rh@lamina.ind.br	nfe.lamina@lamina.ind.br;rh2@lamina.ind.br;rh@lamina.ind.br	\N	N	t	t	f	/Lamina	/Demostrativo/Lamina	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.365039-03	2026-05-22 16:42:47.365039-03	\N	1
82	Espumatec Industria e Comercio de Componentes em Poliuretano Ltda	Espumatc	Espumatc	t	17340782000100	0290621836	130002	(54)3209-6500	Rua Honorato Bazei	150	Nulo	Cidade Nova	\N	95112-140	\N	rh1@espumatec.com.br;compras2@espumatec.com.br		rh1@espumatec.com.br;compras2@espumatec.com.br	rh1@espumatec.com.br;compras2@espumatec.com.br	rh1@espumatec.com.br;compras2@espumatec.com.br	\N	N	t	t	f	/Espumatec	/Demostrativo/Espumatec	14	POR_VALOR_OU_PRAZO	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.367616-03	2026-05-22 16:42:47.367616-03	\N	1
83	AGROSUL Agroavicola Industrial S/A	Agrosul	Agrosul	t	88369889000634	1280044087	Nulo	(51)3635-6700	Rua Waldomiro Freiberger	1000	Nulo	Camprestre	\N	95760-000	\N	financeiro@agrosul.com.br;nf-e@agrosul.com.br;grupo.contabilidade@agrosul.com.br;dione.junges@agrosul.com.br		financeiro@agrosul.com.br;nf-e@agrosul.com.br;grupo.contabilidade@agrosul.com.br;dione.junges@agrosul.com.br	financeiro@agrosul.com.br;nf-e@agrosul.com.br;grupo.contabilidade@agrosul.com.br;dione.junges@agrosul.com.br	financeiro@agrosul.com.br;nf-e@agrosul.com.br;grupo.contabilidade@agrosul.com.br;dione.junges@agrosul.com.br	\N	N	t	t	f	/Agrosul	/Demostrativo/Agrosul	14	MENSAL_FIXO	0.00	0.00	0	Último	f	t	2026-05-22 16:42:47.370294-03	2026-05-22 16:42:47.370294-03	\N	17
84	America De Antoni Comercio de Confeccoes Ltda	Lojas America MTZ	Lojas America MTZ	t	19020073000173	0290580439	Nulo	(51)3393-2800	Rua Bento Goncalves	950	Sala 02 - B	Centro	\N	95020-411	\N	aline@lojasamerica.com.br		aline@lojasamerica.com.br	aline@lojasamerica.com.br	aline@lojasamerica.com.br	\N	N	t	t	f	/LojasAmerica	/Demostrativo/LojasAmerica	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.372956-03	2026-05-22 16:42:47.372956-03	\N	1
85	Randon TRIEL HT Implementos Rod.	TRIELHT	TRIELHT	t	33204183000116	0390182214	Nulo	(54)3520-1100	ÁREA RURAL	600	Nulo	Nulo	\N	99714-899	\N	fiscal.nfservicos@empresasrandon.com.br		fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	fiscal.nfservicos@empresasrandon.com.br	\N	N	t	t	f	/Randon/Triel	/Demostrativo/Randon/Triel	14	POR_VALOR	100.00	50.00	60	7	f	t	2026-05-22 16:42:47.375579-03	2026-05-22 16:46:39.835-03	\N	20
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.logs (id, user_id, acao, entidade, entidade_id, descricao, created_at) FROM stdin;
1	1	CREATE	users	2	Usuário criado: Produção	2026-05-19 14:52:12.543636-03
2	1	CREATE	producao	1	Ordem de produção criada para Beta Comércio e Distribuição S.A.	2026-05-20 14:31:19.296305-03
3	1	UPDATE	municipios	6	Município atualizado: Carlos Barbosa/RS	2026-05-22 11:40:44.319897-03
4	1	CREATE	municipios	12	Município criado: Canoas/RS	2026-05-22 11:41:42.263765-03
5	1	CREATE	municipios	13	Município criado: Chapecó/SC	2026-05-22 11:47:44.721793-03
6	1	CREATE	municipios	14	Município criado: Feliz/RS	2026-05-22 11:48:24.308102-03
7	1	CREATE	municipios	15	Município criado: Osório/RS	2026-05-22 11:49:02.530895-03
8	1	CREATE	municipios	16	Município criado: São Leopoldo/RS	2026-05-22 11:49:53.171152-03
9	1	CREATE	municipios	17	Município criado: São Sebastião do Caí/RS	2026-05-22 11:50:22.8834-03
10	1	CREATE	municipios	18	Município criado: Veranópolis/RS	2026-05-22 11:50:57.906918-03
11	1	CREATE	municipios	19	Município criado: Cachoeirinha/RS	2026-05-22 11:54:04.449846-03
12	1	CREATE	municipios	20	Município criado: Erechin/RS	2026-05-22 11:54:26.577809-03
13	1	UPDATE	clientes	85	Cliente atualizado: Randon TRIEL HT Implementos Rod.	2026-05-22 16:46:39.839844-03
14	1	CREATE	recebimento_lote	1	Criado recebimento em lote #1 com origem EMAIL	2026-05-25 17:11:35.004304-03
15	1	CREATE	producao	2	Criada Ordem de Produção #2 a partir do lote #1	2026-05-25 17:11:35.004304-03
16	1	CREATE	producao	3	Criada Ordem de Produção #3 a partir do lote #1	2026-05-25 17:11:35.004304-03
17	1	CREATE	producao	4	Criada Ordem de Produção #4 a partir do lote #1	2026-05-25 17:11:35.004304-03
18	1	CREATE	producao	5	Criada Ordem de Produção #5 a partir do lote #1	2026-05-25 17:11:35.004304-03
19	1	CREATE	producao	6	Criada Ordem de Produção #6 a partir do lote #1	2026-05-25 17:11:35.004304-03
20	1	CREATE	producao	7	Criada Ordem de Produção #7 a partir do lote #1	2026-05-25 17:11:35.004304-03
21	1	CREATE	producao	8	Criada Ordem de Produção #8 a partir do lote #1	2026-05-25 17:11:35.004304-03
22	1	CREATE	producao	9	Ordem de produção criada para Randon S/A Implementos e Participacoes	2026-05-25 17:11:55.564666-03
\.


--
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.municipios (id, nome, uf, codigo_ibge, ativo, created_at, updated_at, deleted_at) FROM stdin;
1	Caxias do Sul	RS	4305108	t	2026-05-21 11:44:31.039887-03	2026-05-21 11:44:31.039887-03	\N
2	Porto Alegre	RS	4314902	t	2026-05-21 11:44:31.046443-03	2026-05-21 11:44:31.046443-03	\N
3	Bento Gonçalves	RS	4302303	t	2026-05-21 11:44:31.04883-03	2026-05-21 11:44:31.04883-03	\N
4	Farroupilha	RS	4307906	t	2026-05-21 11:44:31.050711-03	2026-05-21 11:44:31.050711-03	\N
5	Garibaldi	RS	4308508	t	2026-05-21 11:44:31.052411-03	2026-05-21 11:44:31.052411-03	\N
7	Flores da Cunha	RS	4308052	t	2026-05-21 11:44:31.055469-03	2026-05-21 11:44:31.055469-03	\N
8	Nova Prata	RS	4313300	t	2026-05-21 11:44:31.057012-03	2026-05-21 11:44:31.057012-03	\N
9	Vacaria	RS	4322400	t	2026-05-21 11:44:31.058548-03	2026-05-21 11:44:31.058548-03	\N
10	São Marcos	RS	4318408	t	2026-05-21 11:44:31.060145-03	2026-05-21 11:44:31.060145-03	\N
6	Carlos Barbosa	RS	4303905	t	2026-05-21 11:44:31.053951-03	2026-05-22 11:40:44.314-03	\N
12	Canoas	RS	4304606	t	2026-05-22 11:41:42.262193-03	2026-05-22 11:41:42.262193-03	\N
13	Chapecó	SC	4204202	t	2026-05-22 11:47:44.717234-03	2026-05-22 11:47:44.717234-03	\N
14	Feliz	RS	4308102	t	2026-05-22 11:48:24.30678-03	2026-05-22 11:48:24.30678-03	\N
15	Osório	RS	4313508	t	2026-05-22 11:49:02.529127-03	2026-05-22 11:49:02.529127-03	\N
16	São Leopoldo	RS	4318705	t	2026-05-22 11:49:53.169798-03	2026-05-22 11:49:53.169798-03	\N
17	São Sebastião do Caí	RS	4319505	t	2026-05-22 11:50:22.882018-03	2026-05-22 11:50:22.882018-03	\N
18	Veranópolis	RS	4322806	t	2026-05-22 11:50:57.905627-03	2026-05-22 11:50:57.905627-03	\N
19	Cachoeirinha	RS	4303103	t	2026-05-22 11:54:04.448444-03	2026-05-22 11:54:04.448444-03	\N
20	Erechin	RS	4307005	t	2026-05-22 11:54:26.57651-03	2026-05-22 11:54:26.57651-03	\N
\.


--
-- Data for Name: producao; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.producao (id, cliente_id, data_recebimento, hora_recebimento, observacoes, status, created_at, updated_at, deleted_at, recebimento_lote_id) FROM stdin;
1	2	2026-05-19	14:31	Teste 01	recebida	2026-05-20 14:31:19.294696-03	2026-05-20 14:31:19.294696-03	\N	\N
2	40	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
3	39	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
4	85	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
5	18	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
6	31	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
7	24	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
8	10	2026-05-29	12:16	\N	recebida	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N	1
9	40	2026-04-28	12:16		recebida	2026-05-25 17:11:55.563552-03	2026-05-25 17:11:55.563552-03	\N	\N
\.


--
-- Data for Name: producao_item; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.producao_item (id, producao_id, produto_id, item_numero, quantidade, multiplicador, impresso, envelopado, embalado, retirado, data_ultimo_status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.produtos (id, descricao, exige_processamento, impresso, envelopado, ativo, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: recebimento_lote; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.recebimento_lote (id, data_recebimento, hora_recebimento, origem, remetente, assunto, observacoes, created_at, updated_at, deleted_at) FROM stdin;
1	2026-05-29	12:16	EMAIL	erika.parise@randoncorp.com	Folhas de Pagamento 04.2026	\N	2026-05-25 17:11:35.004304-03	2026-05-25 17:11:35.004304-03	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: producao
--

COPY public.users (id, name, email, password_hash, role, cliente_id, ativo, created_at, updated_at) FROM stdin;
1	Rhuarha	rhuarha@inteltec.com.br	$2b$10$TI4bewGMN5hXs4yIMVEXZ.VCmBsxV2bXcttd5ko3GlDlycnvL5waa	admin	\N	t	2026-05-19 14:09:49.159395-03	2026-05-19 14:09:49.159395-03
2	Produção	producao@inteltec.com.br	$2b$10$Pp4keEaJig7rJsbW.95Brua8xkfYJhE3T3vD6FjfEyUvlrOQWZ91G	apontador	\N	t	2026-05-19 14:52:12.542111-03	2026-05-19 14:52:12.542111-03
\.


--
-- Name: cliente_produto_preco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.cliente_produto_preco_id_seq', 1, false);


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.clientes_id_seq', 85, true);


--
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.logs_id_seq', 22, true);


--
-- Name: municipios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.municipios_id_seq', 20, true);


--
-- Name: producao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.producao_id_seq', 9, true);


--
-- Name: producao_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.producao_item_id_seq', 1, false);


--
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.produtos_id_seq', 1, false);


--
-- Name: recebimento_lote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.recebimento_lote_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: producao
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: cliente_produto_preco cliente_produto_preco_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: municipios municipios_codigo_ibge_unique; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_codigo_ibge_unique UNIQUE (codigo_ibge);


--
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);


--
-- Name: producao_item producao_item_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_pkey PRIMARY KEY (id);


--
-- Name: producao producao_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao
    ADD CONSTRAINT producao_pkey PRIMARY KEY (id);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- Name: recebimento_lote recebimento_lote_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.recebimento_lote
    ADD CONSTRAINT recebimento_lote_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: municipios_nome_idx; Type: INDEX; Schema: public; Owner: producao
--

CREATE INDEX municipios_nome_idx ON public.municipios USING btree (nome);


--
-- Name: municipios_nome_uf_idx; Type: INDEX; Schema: public; Owner: producao
--

CREATE INDEX municipios_nome_uf_idx ON public.municipios USING btree (nome, uf);


--
-- Name: municipios_uf_idx; Type: INDEX; Schema: public; Owner: producao
--

CREATE INDEX municipios_uf_idx ON public.municipios USING btree (uf);


--
-- Name: cliente_produto_preco cliente_produto_preco_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: cliente_produto_preco cliente_produto_preco_produto_id_produtos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.cliente_produto_preco
    ADD CONSTRAINT cliente_produto_preco_produto_id_produtos_id_fk FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- Name: clientes clientes_municipio_id_municipios_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_municipio_id_municipios_id_fk FOREIGN KEY (municipio_id) REFERENCES public.municipios(id);


--
-- Name: producao producao_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao
    ADD CONSTRAINT producao_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: producao_item producao_item_producao_id_producao_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_producao_id_producao_id_fk FOREIGN KEY (producao_id) REFERENCES public.producao(id);


--
-- Name: producao_item producao_item_produto_id_produtos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao_item
    ADD CONSTRAINT producao_item_produto_id_produtos_id_fk FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- Name: producao producao_recebimento_lote_id_recebimento_lote_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.producao
    ADD CONSTRAINT producao_recebimento_lote_id_recebimento_lote_id_fk FOREIGN KEY (recebimento_lote_id) REFERENCES public.recebimento_lote(id);


--
-- Name: users users_cliente_id_clientes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: producao
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cliente_id_clientes_id_fk FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- PostgreSQL database dump complete
--

