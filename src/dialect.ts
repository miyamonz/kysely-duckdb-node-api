import type {
  Dialect,
  Driver,
  QueryCompiler,
  DatabaseIntrospector,
  Kysely,
  DialectAdapter,
} from "kysely";

type Config = {};
export class DuckDBDialect implements Dialect {
  constructor(private readonly config: Config) {}
  createDriver(): Driver {
    throw new Error("Not implemented");
  }
  createQueryCompiler(): QueryCompiler {
    throw new Error("Not implemented");
  }
  createAdapter(): DialectAdapter {
    throw new Error("Not implemented");
  }
  createIntrospector(db: Kysely<unknown>): DatabaseIntrospector {
    throw new Error("Not implemented");
  }
}
