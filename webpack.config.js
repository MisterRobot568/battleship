const path = require('path');

module.exports = {
    mode: 'development', // added this line
    entry: './src/index.js',
    devtool: 'inline-source-map', //added this line to track errors with webpack
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};