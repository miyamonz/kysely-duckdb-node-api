import { test, expect } from "vitest";

import { Kysely, type ColumnType, type Generated } from "kysely";
import { DuckDBInstance } from "@duckdb/node-api";
import { DuckDBDialect } from "../dialect.js";

interface Database {
  person: PersonTable;
}
interface PersonTable {
  id: Generated<number>;
  first_name: string;
  age: number;
  gender: "man" | "woman" | "other";
  last_name: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

test("select from json file", async () => {
  const database = await DuckDBInstance.create();
  const kysely = new Kysely<Database>({
    dialect: new DuckDBDialect({ database }),
  });
  await kysely.schema
    .createTable("person")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("first_name", "varchar", (b) => b.notNull())
    .addColumn("age", "integer", (b) => b.defaultTo(20))
    .addColumn("gender", "varchar", (b) => b.notNull())
    .addColumn("last_name", "varchar", (b) => b.notNull())
    .addColumn("created_at", "timestamp(3)", (b) => b.notNull())
    .execute();

  await kysely
    .insertInto("person")
    .values({
      id: 1,
      first_name: "John",
      age: 20,
      gender: "man",
      last_name: "Doe",
      created_at: new Date().toISOString(),
    })
    .execute();

  const result = await kysely
    .selectFrom("person")
    .where("id", "=", 1)
    .selectAll()
    // TODO: format json
    .explain();
  console.log(result);
});
