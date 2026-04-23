import { describe, expect, test } from "vitest";

import { uuid } from "../src/utils";

describe("uuid", () => {
    test("should generate valid v4", () => {
        expect(uuid()).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    });
});
