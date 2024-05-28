const path = require('path');
const webpack = require('webpack');

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
                    presets: ['@babel/preset-env']
                }
            }
        }
    ]
},
plugins: [
    new webpack.HotModuleReplacementPlugin()
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
      context: ['/insert'],
      target:  'http://localhost:3000',
    }
  ],
}
};