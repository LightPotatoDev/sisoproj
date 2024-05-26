//import path from 'path';
//import webpack from 'webpack';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: ["./src/index.js",'webpack-hot-middleware/client?reload=true'],
  output: {
    filename: "bundle.js",
    publicPath: '/',
    path: path.resolve(__dirname,"dist"),
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
    ]
},
plugins: [
    new webpack.HotModuleReplacementPlugin()
],
devtool: 'source-map'
};