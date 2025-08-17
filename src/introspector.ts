import { Kysely, sql } from "kysely";
import type {
  DatabaseIntrospector,
  DatabaseMetadata,
  DatabaseMetadataOptions,
  SchemaMetadata,
  TableMetadata,
} from "kysely";

interface RawColumnMetadata {
  column_name: string;
  column_default: any;
  table_name: string;
  table_schema: string;
  table_type: string;
  is_nullable: "YES" | "NO";
  data_type: string;
}

export class DuckDbIntrospector implements DatabaseIntrospector {
  readonly #db: Kysely<any>;

  constructor(db: Kysely<any>) {
    this.#db = db;
  }

  async getSchemas(): Promise<SchemaMetadata[]> {
    throw new Error("Not implemented");
  }

  async getTables(
    options: DatabaseMetadataOptions = { withInternalKyselyTables: false }
  ): Promise<TableMetadata[]> {
    // https://duckdb.org/docs/stable/sql/meta/information_schema.html
    const query = await this.#db
      .selectFrom("information_schema.columns as columns")
      .innerJoin("information_schema.tables as tables", (b) =>
        b
          .onRef("columns.table_catalog", "=", "tables.table_catalog")
          .onRef("columns.table_schema", "=", "tables.table_schema")
          .onRef("columns.table_name", "=", "tables.table_name")
      )
      .select([
        "columns.column_name",
        "columns.column_default",
        "columns.table_name",
        "columns.table_schema",
        "tables.table_type",
        "columns.is_nullable",
        "columns.data_type",
      ])
      .where("columns.table_schema", "=", sql`current_schema()`)
      .orderBy("columns.table_name")
      .orderBy("columns.ordinal_position")
      .$castTo<RawColumnMetadata>();

    const rawColumns = await query.execute();
    return parseTableMetadata(rawColumns);
  }

  async getMetadata(
    options?: DatabaseMetadataOptions
  ): Promise<DatabaseMetadata> {
    throw new Error("Not implemented");
  }
}

function parseTableMetadata(columns: RawColumnMetadata[]): TableMetadata[] {
  const tableMap = new Map<string, TableMetadata>();

  columns.forEach((it) => {
    if (!tableMap.has(it.table_name)) {
      tableMap.set(it.table_name, {
        name: it.table_name,
        isView: it.table_type === "view",
        schema: it.table_schema,
        columns: [],
      });
    }
    const table = tableMap.get(it.table_name)!;

    table.columns.push({
      name: it.column_name,
      dataType: it.data_type,
      isNullable: it.is_nullable === "YES",
      isAutoIncrementing: false,
      hasDefaultValue: it.column_default !== null,
    });
  });

  return Array.from(tableMap.values());
}
