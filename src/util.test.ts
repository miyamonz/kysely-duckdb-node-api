import {
  DuckDBConnection,
  DuckDBDataChunk,
  DuckDBTimestampMillisecondsValue,
  INTEGER,
  TIMESTAMP_MS,
  VARCHAR,
} from "@duckdb/node-api";

const connection = await DuckDBConnection.create();

export const data = [
  {
    id: 1,
    first_name: "foo",
    gender: "man",
    last_name: "bar",
    created_at: new Date("1970-01-01T00:00:00.000+09:00"),
  },

  {
    id: 2,
    first_name: "bar",
    gender: "woman",
    last_name: "baz",
    created_at: new Date("2025-01-01T00:00:00.000+09:00"),
  },
  {
    id: 3,
    first_name: "baz",
    gender: "other",
    last_name: "qux",
    created_at: new Date("2025-01-01T00:00:00.000+09:00"),
  },
];

export const setupDb = async () => {
  await connection.run(
    "CREATE TABLE person (id INTEGER, first_name TEXT, gender TEXT, last_name TEXT, created_at TIMESTAMP_MS)"
  );

  const appender = await connection.createAppender("person");
  const chunk = DuckDBDataChunk.create([
    INTEGER,
    VARCHAR,
    VARCHAR,
    VARCHAR,
    TIMESTAMP_MS,
  ]);

  chunk.setRows(
    data.map((row) => [
      row.id,
      row.first_name,
      row.gender,
      row.last_name,
      new DuckDBTimestampMillisecondsValue(BigInt(row.created_at.getTime())),
    ])
  );
  appender.appendDataChunk(chunk);
  appender.flushSync();

  return connection;
};
