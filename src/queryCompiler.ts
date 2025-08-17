import { DefaultQueryCompiler } from "kysely";

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

  protected override getLeftExplainOptionsWrapper(): string {
    return "";
  }

  protected override getRightExplainOptionsWrapper(): string {
    return "";
  }

  protected override getLeftIdentifierWrapper(): string {
    return '"';
  }

  protected override getRightIdentifierWrapper(): string {
    return '"';
  }

  protected override getAutoIncrement(): string {
    throw new Error("Can not use auto increment in DuckDB");
  }

  protected override sanitizeIdentifier(identifier: string): string {
    return identifier.replace(ID_WRAP_REGEX, '""');
  }

  protected override visitTable() {
    throw new Error("Not implemented");
  }
}
