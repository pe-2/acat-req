const path = require('path');

module.exports = {
    entry: {
        main: '/src/index.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist',
    },
    resolve: {
        // 别名配置
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    devtool: 'inline-source-map',
    mode: "development",
};