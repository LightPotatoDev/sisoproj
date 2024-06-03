const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: [
    "./src/index.js",
  ],
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
                    presets: [
                      '@babel/preset-env',{ modules: false }
                    ],
                    plugins: [
                      ['@babel/plugin-transform-strict-mode', { strictMode: true }] // Enable strict mode to avoid 'with' statements
                    ]
                }
            }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.ejs$/,
          use: ['ejs-loader'],
       },
    ]
},
plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: './index.ejs',
        filename: 'index.html',
        inject: 'body',
    }),
],
devtool: 'source-map',
devServer:{
  static: {
    directory: path.join(__dirname) //should serve correct HTML file, otherwise cannot GET
  },
  compress: true,
  port:9000,
  proxy:[
    { 
      context: ['/insert', '/review'], //used to avoid CORS, put api calls here
      target:  'http://localhost:3000',
    }
  ],
}
};