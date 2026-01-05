import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { run } from "./connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQL_DIR = path.join(__dirname, "sql");

export async function migrar() {
  if (!fs.existsSync(SQL_DIR)) {
    throw new Error(`Pasta SQL não encontrada: ${SQL_DIR}`);
  }

  const arquivos = fs
    .readdirSync(SQL_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (arquivos.length === 0) {
    console.log("Nenhum arquivo .sql encontrado em:", SQL_DIR);
    return;
  }

  await run("PRAGMA foreign_keys = ON;");

  for (const arquivo of arquivos) {
    const caminho = path.join(SQL_DIR, arquivo);
    const sql = fs.readFileSync(caminho, "utf8");

    const comandos = sql
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean);

    for (const cmd of comandos) {
      await run(cmd + ";");
    }

    console.log(`Status: database.db criado!`);
  }
}
