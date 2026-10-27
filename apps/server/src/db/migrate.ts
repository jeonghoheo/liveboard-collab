import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const migrationsDir = fileURLToPath(new URL("./migrations/", import.meta.url));

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function applyMigration(name: string) {
  const sql = await readFile(new URL(`./migrations/${name}`, import.meta.url), "utf8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
    await client.query("COMMIT");
    console.log(`Applied migration ${name}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  await ensureMigrationsTable();

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const { rows } = await pool.query<{ name: string }>(
    "SELECT name FROM schema_migrations",
  );
  const applied = new Set(rows.map((row) => row.name));

  for (const file of files) {
    if (!applied.has(file)) {
      await applyMigration(file);
    }
  }
}

migrate()
  .then(async () => {
    await pool.end();
    console.log("Migrations complete");
  })
  .catch(async (error) => {
    console.error("Migration failed", error);
    await pool.end();
    process.exitCode = 1;
  });
