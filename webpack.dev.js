const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require('webpack-merge');
const common = require("./webpack.common.js");

const SRC_PATH = path.resolve(__dirname, "src/app");
const DIST_PATH = path.resolve(__dirname, "dist/app");

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      }
    ]
  }
});
