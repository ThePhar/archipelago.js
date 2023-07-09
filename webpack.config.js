const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    target: "web",
    entry: "./src/index.ts",
    resolve: {
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    devtool: "inline-source-map",
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    output: {
        path: path.resolve(__dirname),
        filename: "archipelago.min.js",
        library: {
            type: "module",
        },
    },
};
