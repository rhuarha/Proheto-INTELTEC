import { db, municipiosTable } from "../index.js";
import { sql } from "drizzle-orm";

const MUNICIPIOS = [
  { nome: "Caxias do Sul", uf: "RS", codigoIbge: "4305108" },
  { nome: "Porto Alegre", uf: "RS", codigoIbge: "4314902" },
  { nome: "Bento Gonçalves", uf: "RS", codigoIbge: "4302303" },
  { nome: "Farroupilha", uf: "RS", codigoIbge: "4307906" },
  { nome: "Garibaldi", uf: "RS", codigoIbge: "4308508" },
  { nome: "Carlos Barbosa", uf: "RS", codigoIbge: "4304606" },
  { nome: "Flores da Cunha", uf: "RS", codigoIbge: "4308052" },
  { nome: "Nova Prata", uf: "RS", codigoIbge: "4313300" },
  { nome: "Vacaria", uf: "RS", codigoIbge: "4322400" },
  { nome: "São Marcos", uf: "RS", codigoIbge: "4318408" },
];

async function seed() {
  for (const m of MUNICIPIOS) {
    await db
      .insert(municipiosTable)
      .values(m)
      .onConflictDoUpdate({
        target: municipiosTable.codigoIbge,
        set: { nome: sql`excluded.nome`, uf: sql`excluded.uf` },
      });
    console.log(`Upserted: ${m.nome}/${m.uf}`);
  }
  console.log("Seed de municípios concluído.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
