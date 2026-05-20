import { db, clientesTable } from "../index.js";
import { eq } from "drizzle-orm";

const clientes = [
  {
    nomeRazaoSocial: "Empresa Alfa Ltda",
    nomeFantasia: "Alfa Soluções",
    nomeInterno: "ALFA",
    juridica: true,
    cnpjCpf: "12.345.678/0001-90",
    inscrEstadual: "123.456.789.012",
    inscrMunicipal: "1234567",
    telefone: "(11) 3456-7890",
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Sala 4",
    bairro: "Centro",
    cidade: "São Paulo",
    cep: "01310-100",
    uf: "SP",
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
  },
  {
    nomeRazaoSocial: "Beta Comércio e Distribuição S.A.",
    nomeFantasia: "Beta Distribuidora",
    nomeInterno: "BETA",
    juridica: true,
    cnpjCpf: "98.765.432/0001-10",
    inscrEstadual: "987.654.321.098",
    inscrMunicipal: "9876543",
    telefone: "(21) 4567-8901",
    logradouro: "Avenida Brasil",
    numero: "500",
    complemento: "Andar 10",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    cep: "22020-000",
    uf: "RJ",
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
  },
  {
    nomeRazaoSocial: "Carlos Eduardo Mendes",
    nomeFantasia: null,
    nomeInterno: "CARLOS",
    juridica: false,
    cnpjCpf: "123.456.789-00",
    inscrEstadual: null,
    inscrMunicipal: null,
    telefone: "(31) 98765-4321",
    logradouro: "Rua Minas Gerais",
    numero: "77",
    complemento: null,
    bairro: "Savassi",
    cidade: "Belo Horizonte",
    cep: "30130-110",
    uf: "MG",
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
    cidade: "Porto Alegre",
    cep: "90020-000",
    uf: "RS",
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
  },
];

for (const cliente of clientes) {
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
    await db.update(clientesTable).set(cliente).where(eq(clientesTable.id, existing.id));
    console.log(`Atualizado: ${cliente.nomeRazaoSocial} (id=${existing.id})`);
  } else {
    const [inserted] = await db
      .insert(clientesTable)
      .values(cliente)
      .returning({ id: clientesTable.id });
    console.log(`Inserido: ${cliente.nomeRazaoSocial} (id=${inserted.id})`);
  }
}

console.log("Seed de clientes concluído.");
process.exit(0);
