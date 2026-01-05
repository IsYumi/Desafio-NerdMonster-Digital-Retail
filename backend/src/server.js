import "dotenv/config";
import app from "./app.js";
import { migrar } from "./db/sql.js";

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await migrar();
    app.listen(PORT, () => {
      console.log(`Backend rodando: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
}

start();
