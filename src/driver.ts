import { DuckDBInstance } from "@duckdb/node-api";
import type { DatabaseConnection, Driver } from "kysely";

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

  async acquireConnection(): Promise<DatabaseConnection> {
    throw new Error("Not implemented");
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

  async releaseConnection(): Promise<void> {
    throw new Error("Not implemented");
  }

  async destroy(): Promise<void> {
    throw new Error("Not implemented");
  }
}
