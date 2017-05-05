const path = require("path");
const PrepackWebpackPlugin = require("prepack-webpack-plugin").default;

module.exports = {
    entry: "./app/app.ts",
    output: {
        path: path.resolve(__dirname, "static"),
        publicPath: "/static/",
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "vue-ts-loader",
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    // instruct vue-loader to load TypeScript
                    loaders: { js: "vue-ts-loader" },
                    // make TS' generated code cooperate with vue-loader
                    esModule: true,
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: "file-loader",
                query: {
                    name: "[name].[ext]",
                    publicPath: "/static/",
                },
            },
        ],
    },
    plugins: [
        new PrepackWebpackPlugin({
            test: /\.js($|\?)/i,
        }),
    ],
};
