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
    compiledQuery: CompiledQuery
  ): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("Not implemented");
  }

  async disconnect(): Promise<void> {
    this.#conn.closeSync();
  }
}
