import { describe, expectTypeOf, test } from "vitest";

import * as archipelago from "../src";

describe("index", () => {
    test("no-op just to get coverage of files with only static declarations", () => {
        expectTypeOf(archipelago).toBeObject();
    });
});
