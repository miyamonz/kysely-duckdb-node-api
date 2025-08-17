import { test, expect } from "vitest";
import { DuckDBDialect } from "./dialect";
import { DuckDBInstance } from "@duckdb/node-api";
import { Kysely } from "kysely";

test("DuckDBDialect", async () => {
  const instance = await DuckDBInstance.create();
  const dialect = new DuckDBDialect({ database: instance });

  const kysely = new Kysely({
    dialect,
  });
  expect(kysely).toBeDefined();
});
