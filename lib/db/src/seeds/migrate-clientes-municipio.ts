import { db, clientesTable, municipiosTable } from "../index.js";
import { eq, and, isNull } from "drizzle-orm";

async function migrate() {
  const clientes = await db
    .select({ id: clientesTable.id, cidade: clientesTable.cidade, uf: clientesTable.uf })
    .from(clientesTable)
    .where(isNull(clientesTable.municipioId));

  console.log(`${clientes.length} cliente(s) sem municipioId.`);

  let matched = 0;
  let fallback = 0;

  const caxias = await db
    .select()
    .from(municipiosTable)
    .where(eq(municipiosTable.codigoIbge, "4305108"))
    .limit(1);

  const caxiasId = caxias[0]?.id;
  if (!caxiasId) {
    console.error("Município de Caxias do Sul (4305108) não encontrado. Execute seed:municipios primeiro.");
    process.exit(1);
  }

  for (const c of clientes) {
    let municipioId: number | null = null;

    if (c.cidade && c.uf) {
      const found = await db
        .select({ id: municipiosTable.id })
        .from(municipiosTable)
        .where(and(eq(municipiosTable.nome, c.cidade), eq(municipiosTable.uf, c.uf)))
        .limit(1);

      if (found[0]) {
        municipioId = found[0].id;
        matched++;
      }
    }

    if (!municipioId) {
      municipioId = caxiasId;
      fallback++;
    }

    await db
      .update(clientesTable)
      .set({ municipioId })
      .where(eq(clientesTable.id, c.id));
  }

  console.log(`Migrados: ${matched} por cidade/UF, ${fallback} com fallback Caxias do Sul.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
