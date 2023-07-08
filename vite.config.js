import dts from "vite-plugin-dts";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
    build: {
        minify: "terser",
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "archipelago",
            fileName: "archipelago",
        },
        rollupOptions: {
            plugins: [terser({
                format: {
                    comments: false,
                }
            })]
        }
    },
    plugins: [dts(), nodePolyfills({
        globals: {
            Buffer: false,
            global: false,
            process: false,
        },
        protocolImports: false,
    })],
});
