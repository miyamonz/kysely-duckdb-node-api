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
  {
    const connection = await database.connect();
    const result = await connection.runAndReadAll("DESCRIBE person");
    const table = result.getRowObjectsJS();
    expect(table).toEqual([
      {
        column_name: "id",
        column_type: "INTEGER",
        default: null,
        extra: null,
        key: "PRI",
        null: "NO",
      },
      {
        column_name: "first_name",
        column_type: "VARCHAR",
        default: null,
        extra: null,
        key: null,
        null: "NO",
      },
      {
        column_name: "age",
        column_type: "INTEGER",
        default: "20",
        extra: null,
        key: null,
        null: "YES",
      },
      {
        column_name: "gender",
        column_type: "VARCHAR",
        default: null,
        extra: null,
        key: null,
        null: "NO",
      },
      {
        column_name: "last_name",
        column_type: "VARCHAR",
        default: null,
        extra: null,
        key: null,
        null: "NO",
      },
      {
        column_name: "created_at",
        column_type: "TIMESTAMP_MS",
        default: null,
        extra: null,
        key: null,
        null: "NO",
      },
    ]);
  }
  {
    const result = await kysely.introspection.getTables();
    expect(result).toEqual([
      {
        name: "person",
        schema: "main",
        isView: false,
        columns: [
          {
            name: "id",
            dataType: "INTEGER",
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
          {
            name: "first_name",
            dataType: "VARCHAR",
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
          {
            name: "age",
            dataType: "INTEGER",
            hasDefaultValue: true,
            isAutoIncrementing: false,
            isNullable: true,
          },
          {
            name: "gender",
            dataType: "VARCHAR",
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
          {
            name: "last_name",
            dataType: "VARCHAR",
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
          {
            name: "created_at",
            dataType: "TIMESTAMP_MS",
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
        ],
      },
    ]);
  }
});
