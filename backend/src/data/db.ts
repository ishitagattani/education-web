import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 8,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  log: ["query", "error"],
});
