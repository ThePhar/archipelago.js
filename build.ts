import dts from "bun-plugin-dts";

const baseConfig: Bun.BuildConfig = {
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    sourcemap: "linked",
};

const main = async () => {
    await Bun.build({
        ...baseConfig,
        plugins: [dts()],
    });

    // Standalone.
    await Bun.build({
        ...baseConfig,
        naming: "[dir]/archipelago.min.[ext]",
        minify: true,
    });
};

// @ts-expect-error -- top-level awaits are fine for build scripts that don't get distributed.
await main();
