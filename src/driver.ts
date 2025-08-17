import {
  DuckDBConnection,
  DuckDBInstance,
  type DuckDBValue,
} from "@duckdb/node-api";
import type {
  CompiledQuery,
  DatabaseConnection,
  Driver,
  QueryResult,
} from "kysely";

type Config = {
  database: DuckDBInstance;
};

export class DuckDbDriver implements Driver {
  readonly #config: Config;
  #db?: DuckDBInstance;

  constructor(config: Config) {
    this.#config = Object.freeze({ ...config });
  }

  async init() {
    this.#db = this.#config.database;
  }

  async acquireConnection() {
    return new DuckDBKyselyConnection(await this.#db!.connect());
  }

  async beginTransaction(): Promise<void> {
    throw new Error("Not implemented");
  }

  async commitTransaction(): Promise<void> {
    throw new Error("Not implemented");
  }

  async rollbackTransaction(): Promise<void> {
    throw new Error("Not implemented");
  }

  async releaseConnection(connection: DuckDBKyselyConnection) {
    await connection.disconnect();
  }

  async destroy(): Promise<void> {
    throw new Error("Not implemented");
  }
}
class DuckDBKyselyConnection implements DatabaseConnection {
  readonly #conn: DuckDBConnection;

  constructor(conn: DuckDBConnection) {
    this.#conn = conn;
  }

  async executeQuery<O>({
    sql,
    parameters,
  }: CompiledQuery): Promise<QueryResult<O>> {
    const stmt = await this.#conn.prepare(sql);
    stmt.bind(parameters as DuckDBValue[]);
    const result = await stmt.run();
    const rows = (await result.getRowObjectsJS()) as O[];
    return { rows };
  }

  async *streamQuery<R>(
    compiledQuery: CompiledQuery,
    chunkSize: number
  ): AsyncIterableIterator<QueryResult<R>> {
    const { sql, parameters } = compiledQuery;
    const reader = await this.#conn.streamAndRead(
      sql,
      parameters as DuckDBValue[]
    );

    let count = 0;
    while (!reader.done) {
      const until = chunkSize * (count + 1);
      await reader.readUntil(until);
      const obj = await reader.getRowObjectsJS();

      const startRow = count * chunkSize;
      const endRow = Math.min(reader.currentRowCount, until);

      yield { rows: obj.slice(startRow, endRow) as R[] };
      count++;
    }
  }

  async disconnect(): Promise<void> {
    this.#conn.closeSync();
  }
}
