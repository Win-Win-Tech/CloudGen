import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
let pool: pg.Pool | undefined;
let local: Promise<PGlite> | undefined;
let migrationsReady: Promise<void> | undefined;

export async function sql<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureMigrations();
  if (databaseUrl !== "") {
    pool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    return (await pool.query(text, params)).rows as T[];
  }
  local ??= startLocal().catch((error: unknown) => {
    local = undefined;
    throw error;
  });
  return (await (await local).query<T>(text, params)).rows;
}

async function migrationFiles() {
  const dir = path.join(process.cwd(), "migrations");
  return (await readdir(dir).catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

async function ensureMigrations() {
  migrationsReady ??= runMigrations().catch((error: unknown) => {
    migrationsReady = undefined;
    throw error;
  });
  await migrationsReady;
}

async function runMigrations() {
  const files = await migrationFiles();
  if (!files.length) return;

  if (databaseUrl !== "") {
    pool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const applied = await pool.query<{ id: string }>(
      `SELECT id FROM schema_migrations`,
    );
    const done = new Set(applied.rows.map((r) => r.id));
    for (const file of files) {
      if (done.has(file)) continue;
      const sqlText = await readFile(
        path.join(process.cwd(), "migrations", file),
        "utf8",
      );
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sqlText);
        await client.query(
          `INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`,
          [file],
        );
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    }
    return;
  }

  // PGlite path is handled in startLocal (fresh DB each process).
}

async function startLocal(): Promise<PGlite> {
  const db = new PGlite();
  const files = await migrationFiles();
  for (const file of files) {
    await db.exec(
      await readFile(path.join(process.cwd(), "migrations", file), "utf8"),
    );
  }
  return db;
}
