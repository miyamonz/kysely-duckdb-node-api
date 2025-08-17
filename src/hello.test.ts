import { it, expect } from "vitest";
import { hello } from "./hello";

it("hello", () => {
  expect(hello()).toBe("world");
});
