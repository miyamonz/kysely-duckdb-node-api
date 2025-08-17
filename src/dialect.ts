import type {
  Dialect,
  Driver,
  QueryCompiler,
  DatabaseIntrospector,
  Kysely,
  DialectAdapter,
} from "kysely";
import { DuckDbDriver } from "./driver.js";
import { DuckDBInstance } from "@duckdb/node-api";
import { DuckDbQueryCompiler } from "./queryCompiler.js";
import { DuckDbAdapter } from "./adapter.js";
import { DuckDbIntrospector } from "./introspector.js";

type Config = {
  database: DuckDBInstance;
};
export class DuckDBDialect implements Dialect {
  constructor(private readonly config: Config) {}
  createDriver(): Driver {
    return new DuckDbDriver(this.config);
  }
  createQueryCompiler(): QueryCompiler {
    return new DuckDbQueryCompiler({});
  }
  createAdapter(): DialectAdapter {
    return new DuckDbAdapter();
  }
  createIntrospector(db: Kysely<unknown>): DatabaseIntrospector {
    return new DuckDbIntrospector(db);
  }
}
