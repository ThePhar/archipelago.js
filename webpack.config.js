const path = require("path");

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
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "archipelago.min.js",
        library: {
            type: "umd",
            name: "archipelagoJS",
        },
        globalObject: "this",
        umdNamedDefine: true,
    },
};
