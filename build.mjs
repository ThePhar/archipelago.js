import dts from "bun-plugin-dts";

await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    plugins: [dts()],
});

// Standalone.
await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    naming: "[dir]/archipelago.min.[ext]",
    minify: true,
});
