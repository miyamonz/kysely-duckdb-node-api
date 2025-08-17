import { test, expect } from "vitest";
import { DuckDBDialect } from "./dialect";

test("DuckDBDialect", () => {
  const dialect = new DuckDBDialect({});
  expect(dialect).toBeDefined();
});
