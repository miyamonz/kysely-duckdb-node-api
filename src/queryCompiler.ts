import { DefaultQueryCompiler, ExplainNode, TableNode } from "kysely";

const ID_WRAP_REGEX = /"/g;

type DuckDbQueryCompilerConfigs = {};

export class DuckDbQueryCompiler extends DefaultQueryCompiler {
  #configs: DuckDbQueryCompilerConfigs;

  constructor(configs: DuckDbQueryCompilerConfigs) {
    super();
    this.#configs = configs;
  }

  protected override getCurrentParameterPlaceholder() {
    return "?";
  }

  protected override getLeftExplainOptionsWrapper() {
    return "";
  }
  protected override getRightExplainOptionsWrapper() {
    return "";
  }

  protected override getLeftIdentifierWrapper() {
    return '"';
  }
  protected override getRightIdentifierWrapper() {
    return '"';
  }

  protected override getAutoIncrement(): string {
    throw new Error("Can not use auto increment in DuckDB");
    // but you can use sequence
    // ```
    // CREATE SEQUENCE seq_person_id START 1;
    // create table person (
    //  id INTEGER PRIMARY KEY DEFAULT nextval('seq_person_id');
    // );
    // ```
  }

  protected override sanitizeIdentifier(identifier: string) {
    return identifier.replace(ID_WRAP_REGEX, '""');
  }

  protected override visitTable(node: TableNode) {
    // TODO: table mapping
    super.visitTable(node);
  }
  protected override visitExplain(node: ExplainNode) {
    // TODO: explain
    // https://github.com/duckdb/duckdb/discussions/7575
    return super.visitExplain(node);
  }
}
