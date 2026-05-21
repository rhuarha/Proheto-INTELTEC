import { db, clientesTable } from "../index.js";
import { like, or, inArray } from "drizzle-orm";

const TEST_CNPJS = ["00.000.000/0001-00", "11.111.111/0001-11", "22.222.222/0001-22", "33.333.333/0001-33"];

async function cleanup() {
  const result = await db
    .delete(clientesTable)
    .where(
      or(
        like(clientesTable.nomeInterno, "%TESTE%"),
        like(clientesTable.nomeInterno, "%Teste%"),
        like(clientesTable.nomeRazaoSocial, "%Cliente Teste%"),
        inArray(clientesTable.cnpjCpf, TEST_CNPJS),
      ),
    )
    .returning({ id: clientesTable.id, nome: clientesTable.nomeRazaoSocial });

  console.log(`Removidos ${result.length} cliente(s) de teste:`);
  result.forEach((r) => console.log(`  #${r.id} — ${r.nome}`));
  process.exit(0);
}

cleanup().catch((err) => {
  console.error(err);
  process.exit(1);
});
