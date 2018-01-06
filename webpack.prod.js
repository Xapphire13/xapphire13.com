const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require("./webpack.config.js");

const SRC_PATH = path.resolve(__dirname, "src/app");
const DIST_PATH = path.resolve(__dirname, "dist/app");

module.exports = merge(config, {
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
});
