const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC_PATH = path.resolve(__dirname, "src/client");
const DIST_PATH = path.resolve(__dirname, "dist/app");

module.exports = {
  entry: {
    app: path.join(SRC_PATH, "bootstrap.ts"),
    storage: path.join(SRC_PATH, "storage-container.ts")
  },
  output: {
    filename: "[name].js",
    path: DIST_PATH,
    publicPath: "/app/"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /src\/client\/.+\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.client.json"
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Xapphire13",
      chunks: ["app"]
    }),
    new HtmlWebpackPlugin({
      title: "Xapphire13",
      filename: "storage.html",
      chunks: ["storage"]
    }),
  ]
};
