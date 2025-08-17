import { test, expect } from "vitest";
import { data, setupDb } from "./util.test.js";

test("select from json file", async () => {
  const connection = await setupDb();
  const results = await connection.runAndReadAll("SELECT * FROM person");

  const rows = results.getRowObjectsJS();
  expect(rows).toEqual(data);
});
