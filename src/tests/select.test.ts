import { test, expect } from "vitest";
import { type ColumnType, type Generated, Kysely } from "kysely";
import { DuckDBInstance } from "@duckdb/node-api";
import { DuckDBDialect } from "../dialect.js";

interface Database {
  person: {
    id: Generated<number>;
    first_name: string;
    gender: "man" | "woman" | "other";
    last_name: string | null;
    created_at: ColumnType<Date, string | undefined, never>;
  };
}

async function setupDb() {
  const instance = await DuckDBInstance.create();
  const connection = await instance.connect();
  await connection.run(
    `CREATE TABLE person (id INTEGER, first_name VARCHAR, gender VARCHAR, last_name VARCHAR, created_at TIMESTAMP)`
  );
  await connection.run(
    `INSERT INTO person (id, first_name, gender, last_name, created_at) VALUES
    (1, 'foo', 'man', 'bar', '2021-01-01 00:00:00'),
    (2, 'baz', 'woman', 'qux', '2021-01-01 00:00:00')`
  );

  const kysely = new Kysely<Database>({
    dialect: new DuckDBDialect({
      database: instance,
    }),
  });
  return kysely;
}

test("select", async () => {
  const kysely = await setupDb();
  const results = await kysely
    .selectFrom("person")
    .select(["first_name"])
    .execute();
  expect(results).toEqual([{ first_name: "foo" }, { first_name: "baz" }]);

  const results2 = await kysely
    .selectFrom("person")
    .select(["first_name", "gender"])
    .execute();
  expect(results2).toEqual([
    { first_name: "foo", gender: "man" },
    { first_name: "baz", gender: "woman" },
  ]);
});

test("select with wheres", async () => {
  const kysely = await setupDb();
  const results = await kysely
    .selectFrom("person")
    .select(["first_name"])
    .where("id", "=", 1)
    .execute();
  expect(results).toEqual([{ first_name: "foo" }]);

  const results2 = await kysely
    .selectFrom("person")
    .select(["first_name", "gender"])
    .where("id", "=", 1)
    .execute();
  expect(results2).toEqual([{ first_name: "foo", gender: "man" }]);

  const results3 = await kysely
    .selectFrom("person")
    .select(["first_name", "gender"])
    .where("id", "=", 2)
    .where("gender", "=", "woman")
    .execute();
  expect(results3).toEqual([{ first_name: "baz", gender: "woman" }]);
});

test("stream", async () => {
  const kysely = await setupDb();
  const results = kysely
    .selectFrom("person")
    .select(["first_name", "gender"])
    .stream(1);

  const reader = results[Symbol.asyncIterator]();

  {
    const { done, value } = await reader.next();
    expect(done).toBe(false);
    expect(value).toEqual({ first_name: "foo", gender: "man" });
  }
  {
    const { done, value } = await reader.next();
    expect(done).toBe(false);
    expect(value).toEqual({ first_name: "baz", gender: "woman" });
  }
  {
    const { done, value } = await reader.next();
    expect(done).toBe(true);
    expect(value).toBeUndefined();
  }
});
