import { test, expect } from "vitest";
import { DuckDBConnection } from "@duckdb/node-api";

test("create table", async () => {
  const connection = await DuckDBConnection.create();
  await connection.run(
    `CREATE TABLE person (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    gender TEXT,
    last_name TEXT,
    created_at TIMESTAMP_MS,
    )`
  );

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
      null: "YES",
    },
    {
      column_name: "gender",
      column_type: "VARCHAR",
      default: null,
      extra: null,
      key: null,
      null: "YES",
    },
    {
      column_name: "last_name",
      column_type: "VARCHAR",
      default: null,
      extra: null,
      key: null,
      null: "YES",
    },
    {
      column_name: "created_at",
      column_type: "TIMESTAMP_MS",
      default: null,
      extra: null,
      key: null,
      null: "YES",
    },
  ]);
});

// https://duckdb.org/docs/stable/sql/data_types/overview.html
test("describe all types", async () => {
  const connection = await DuckDBConnection.create();
  await connection.run(
    `CREATE TABLE all_types (
      id INTEGER PRIMARY KEY,
      big_int BIGINT, -- 8 byte integer
      bit BIT, -- BITSTRING strings of 1s and 0s
      blob BLOB, -- Variable-length binary data
      bool BOOLEAN, -- true or false
      date DATE, -- Calendar date (year, month day)
      decimal DECIMAL, -- Fixed-precision number with the given width (precision) and scale, defaults to prec = 18 and scale = 3
      double DOUBLE, -- Double precision floating-point number (8 bytes)
      float FLOAT, -- Single precision floating-point number (4 bytes)
      hugeint HUGEINT, -- signed 16 byte integer
      int INTEGER, -- signed 4 byte integer
      interval INTERVAL, -- Date /time delta
      smallint SMALLINT, -- signed 2 byte integer
      time TIME, -- no timezone
      timestamptz TIMESTAMPTZ,
      timestamp TIMESTAMP, --
      tinyint TINYINT, -- signed 1 byte integer
      ubingint UBIGINT, -- 8 byte integer
      uhugeint UHUGEINT, -- 16 byte integer
      uinteger UINTEGER, -- 4 byte integer
      usmallint USMALLINT, -- 2 byte integer
      utinyint UTINYINT, -- 1 byte integer
      uuid UUID,
      varchar VARCHAR, -- Variable-length character string
      )`
  );

  const result = await connection.runAndReadAll("DESCRIBE all_types");
  const table = result.getRowObjectsJS();
  expect(
    table.map(({ column_name, column_type }) => ({ column_name, column_type }))
  ).toEqual([
    {
      column_name: "id",
      column_type: "INTEGER",
    },
    {
      column_name: "big_int",
      column_type: "BIGINT",
    },
    {
      column_name: "bit",
      column_type: "BIT",
    },
    {
      column_name: "blob",
      column_type: "BLOB",
    },
    {
      column_name: "bool",
      column_type: "BOOLEAN",
    },
    {
      column_name: "date",
      column_type: "DATE",
    },
    {
      column_name: "decimal",
      column_type: "DECIMAL(18,3)",
    },
    {
      column_name: "double",
      column_type: "DOUBLE",
    },
    {
      column_name: "float",
      column_type: "FLOAT",
    },
    {
      column_name: "hugeint",
      column_type: "HUGEINT",
    },
    {
      column_name: "int",
      column_type: "INTEGER",
    },
    {
      column_name: "interval",
      column_type: "INTERVAL",
    },
    {
      column_name: "smallint",
      column_type: "SMALLINT",
    },
    {
      column_name: "time",
      column_type: "TIME",
    },
    {
      column_name: "timestamptz",
      column_type: "TIMESTAMP WITH TIME ZONE",
    },
    {
      column_name: "timestamp",
      column_type: "TIMESTAMP",
    },
    {
      column_name: "tinyint",
      column_type: "TINYINT",
    },
    {
      column_name: "ubingint",
      column_type: "UBIGINT",
    },
    {
      column_name: "uhugeint",
      column_type: "UHUGEINT",
    },
    {
      column_name: "uinteger",
      column_type: "UINTEGER",
    },
    {
      column_name: "usmallint",
      column_type: "USMALLINT",
    },
    {
      column_name: "utinyint",
      column_type: "UTINYINT",
    },
    {
      column_name: "uuid",
      column_type: "UUID",
    },
    {
      column_name: "varchar",
      column_type: "VARCHAR",
    },
  ]);
});
