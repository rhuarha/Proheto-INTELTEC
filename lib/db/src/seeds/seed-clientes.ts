import { db, clientesTable, municipiosTable } from "../index.js";
import { eq, and } from "drizzle-orm";

async function getMunicipioId(nome: string, uf: string): Promise<number | null> {
  const result = await db
    .select({ id: municipiosTable.id })
    .from(municipiosTable)
    .where(and(eq(municipiosTable.nome, nome), eq(municipiosTable.uf, uf)))
    .limit(1);
  return result[0]?.id ?? null;
}

const clientes = [
  {
    nomeRazaoSocial: "Empresa Alfa Ltda",
    nomeFantasia: "Alfa Soluções",
    nomeInterno: "ALFA",
    juridica: true,
    cnpjCpf: "12.345.678/0001-90",
    inscrEstadual: "123.456.789.012",
    inscrMunicipal: "1234567",
    telefone: "(54) 3456-7890",
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Sala 4",
    bairro: "Centro",
    cep: "95020-360",
    emailNfse: "fiscal@alfa.com.br",
    nomeContato: "João Silva",
    emailContato: "joao@alfa.com.br",
    emailAprovaDemonstrativo: "financeiro@alfa.com.br",
    emailInformaProdutoEmbalado: "logistica@alfa.com.br",
    tipoFaturamento: "N" as const,
    emiteBoleto: true,
    exigeDemonstrativo: true,
    pedidoCompra: false,
    diretorioProducao: "/producao/alfa",
    diretorioDemonstrativo: "/demonstrativos/alfa",
    prazoPagamento: 30,
    tipoFechamento: "MENSAL_FIXO" as const,
    valorAlvo: "5000.00",
    valorMinimo: "1000.00",
    prazoMaximoDias: 45,
    diaFechamento: "30",
    fecharAoDisponibilizar: false,
    ativo: true,
    municipioNome: "Caxias do Sul",
    municipioUf: "RS",
  },
  {
    nomeRazaoSocial: "Beta Comércio e Distribuição S.A.",
    nomeFantasia: "Beta Distribuidora",
    nomeInterno: "BETA",
    juridica: true,
    cnpjCpf: "98.765.432/0001-10",
    inscrEstadual: "987.654.321.098",
    inscrMunicipal: "9876543",
    telefone: "(54) 4567-8901",
    logradouro: "Rua Ernesto Alves",
    numero: "500",
    complemento: "Andar 10",
    bairro: "Centro",
    cep: "95700-000",
    emailNfse: "nfse@beta.com.br",
    nomeContato: "Maria Oliveira",
    emailContato: "maria@beta.com.br",
    emailAprovaDemonstrativo: "aprovacao@beta.com.br",
    emailInformaProdutoEmbalado: "expedicao@beta.com.br",
    tipoFaturamento: "N" as const,
    emiteBoleto: true,
    exigeDemonstrativo: false,
    pedidoCompra: true,
    diretorioProducao: "/producao/beta",
    diretorioDemonstrativo: "/demonstrativos/beta",
    prazoPagamento: 15,
    tipoFechamento: "POR_VALOR" as const,
    valorAlvo: "8000.00",
    valorMinimo: "2000.00",
    prazoMaximoDias: 30,
    diaFechamento: "15",
    fecharAoDisponibilizar: true,
    ativo: true,
    municipioNome: "Bento Gonçalves",
    municipioUf: "RS",
  },
  {
    nomeRazaoSocial: "Carlos Eduardo Mendes",
    nomeFantasia: null,
    nomeInterno: "CARLOS",
    juridica: false,
    cnpjCpf: "123.456.789-00",
    inscrEstadual: null,
    inscrMunicipal: null,
    telefone: "(54) 98765-4321",
    logradouro: "Rua Garibaldi",
    numero: "77",
    complemento: null,
    bairro: "Centro",
    cep: "95180-000",
    emailNfse: "carlos@email.com.br",
    nomeContato: "Carlos Mendes",
    emailContato: "carlos@email.com.br",
    emailAprovaDemonstrativo: null,
    emailInformaProdutoEmbalado: null,
    tipoFaturamento: "R" as const,
    emiteBoleto: false,
    exigeDemonstrativo: false,
    pedidoCompra: false,
    diretorioProducao: null,
    diretorioDemonstrativo: null,
    prazoPagamento: 0,
    tipoFechamento: "IMEDIATO" as const,
    valorAlvo: null,
    valorMinimo: null,
    prazoMaximoDias: null,
    diaFechamento: null,
    fecharAoDisponibilizar: false,
    ativo: true,
    municipioNome: "Garibaldi",
    municipioUf: "RS",
  },
  {
    nomeRazaoSocial: "Gama Tecnologia Ltda",
    nomeFantasia: "GamaTech",
    nomeInterno: "GAMA",
    juridica: true,
    cnpjCpf: "55.444.333/0001-22",
    inscrEstadual: "554.443.330.012",
    inscrMunicipal: null,
    telefone: "(51) 3456-2222",
    logradouro: "Rua dos Andradas",
    numero: "S/N",
    complemento: "Bloco B",
    bairro: "Centro Histórico",
    cep: "90020-000",
    emailNfse: "fiscal@gamatech.com.br",
    nomeContato: "Ana Souza",
    emailContato: "ana@gamatech.com.br",
    emailAprovaDemonstrativo: "aprovacao@gamatech.com.br",
    emailInformaProdutoEmbalado: "producao@gamatech.com.br",
    tipoFaturamento: "N" as const,
    emiteBoleto: true,
    exigeDemonstrativo: true,
    pedidoCompra: true,
    diretorioProducao: "/producao/gama",
    diretorioDemonstrativo: "/demonstrativos/gama",
    prazoPagamento: 30,
    tipoFechamento: "POR_VALOR_OU_PRAZO" as const,
    valorAlvo: "3000.00",
    valorMinimo: "500.00",
    prazoMaximoDias: 60,
    diaFechamento: "Último",
    fecharAoDisponibilizar: false,
    ativo: true,
    municipioNome: "Porto Alegre",
    municipioUf: "RS",
  },
];

async function seed() {
  for (const { municipioNome, municipioUf, ...cliente } of clientes) {
    const municipioId = await getMunicipioId(municipioNome, municipioUf);
    if (!municipioId) {
      console.warn(`Município não encontrado: ${municipioNome}/${municipioUf}. Execute seed:municipios primeiro.`);
    }

    const data = { ...cliente, municipioId };

    const keyClause = cliente.cnpjCpf
      ? eq(clientesTable.cnpjCpf, cliente.cnpjCpf)
      : cliente.nomeInterno
        ? eq(clientesTable.nomeInterno, cliente.nomeInterno)
        : null;

    if (!keyClause) {
      console.log(`Ignorado (sem chave única): ${cliente.nomeRazaoSocial}`);
      continue;
    }

    const [existing] = await db
      .select({ id: clientesTable.id })
      .from(clientesTable)
      .where(keyClause)
      .limit(1);

    if (existing) {
      await db.update(clientesTable).set(data).where(eq(clientesTable.id, existing.id));
      console.log(`Atualizado: ${cliente.nomeRazaoSocial} (id=${existing.id})`);
    } else {
      const [inserted] = await db
        .insert(clientesTable)
        .values(data)
        .returning({ id: clientesTable.id });
      console.log(`Inserido: ${cliente.nomeRazaoSocial} (id=${inserted.id})`);
    }
  }

  console.log("Seed de clientes concluído.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
