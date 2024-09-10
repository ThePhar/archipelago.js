import dts from "bun-plugin-dts";

// eslint-disable-next-line no-undef
await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    plugins: [dts()],
});

// Standalone.
await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    naming: "[dir]/archipelago.[hash].[ext]"
});
