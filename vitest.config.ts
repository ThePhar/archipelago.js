import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        tags: [
            {
                name: "integration",
                description: "Tests that require Archipelago to be running",
            },
        ],
        coverage: {
            provider: "istanbul",
            include: ["src/**/*.{ts,tsx}"],
            reporter: ["text", "json", "json-summary"],
            reportOnFailure: true,
        },
    },
});
