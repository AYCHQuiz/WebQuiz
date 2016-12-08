module.exports = {
    entry: "./app/app.ts",
    output: {
        filename: "static/js/bundle.js"
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"],
        alias: {
            //'vue$': 'vue/dist/vue.js'
        }
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: "vue-ts" },
            { test: /\.vue$/, loader: "vue" },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.(eot|svg|ttf|woff|woff2)(\?v=[0-9]+\.[0-9]+\.[0-9]+)?$/,
              loader: "file?name=static/fonts/[name].[ext]"}
        ]
    },
    vue: {
        // instruct vue-loader to load TypeScript
        loaders: { js: "vue-ts-loader" },
        // make TS' generated code cooperate with vue-loader
        esModule: true
    }
};
