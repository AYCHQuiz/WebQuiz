module.exports = {
    entry: './app/app.ts',
    output: {
        filename: 'app/bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        alias: {
            //'vue$': 'vue/dist/vue.js'
        }
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'vue-ts' },
            { test: /\.vue$/, loader: 'vue' }
        ]
    },
    vue: {
        // instruct vue-loader to load TypeScript
        loaders: { js: 'vue-ts-loader' },
        // make TS' generated code cooperate with vue-loader
        esModule: true
    }
};
