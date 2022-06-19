const path = require("path");

module.exports = {
    mode: "production",
    target: "web",
    entry: "./src/index.ts",
    resolve: {
        extensions: [".ts"],
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
        path: path.join(__dirname, "web"),
        filename: "archipelago.min.js",
        library: {
            name: "archipelagoJS",
            type: "umd",
        },
        globalObject: "this",
        umdNamedDefine: true,
    },
};
