const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require('webpack-merge');
const common = require("./webpack.common.js");

const SRC_PATH = path.resolve(__dirname, "src/app");
const DIST_PATH = path.resolve(__dirname, "dist/app");

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "less-loader" // compiles Less to CSS
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader" // translates CSS into CommonJS
        ]
      }
    ]
  }
});
