const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const SRC_PATH = path.resolve(__dirname, "src/client");
const PLAYGROUND_PATH = path.join(SRC_PATH, "playground");
const DIST_PATH = path.resolve(__dirname, "dist/app");

const playgroundDirs = fs.readdirSync(PLAYGROUND_PATH);
const playgroundApps = {};
for (let dir of playgroundDirs) {
  const appPath = path.join(PLAYGROUND_PATH, dir, "index.ts");
  if (fs.existsSync(appPath)) {
    playgroundApps[`playground-${dir}`] = appPath;
  }
}

module.exports = {
  entry: {
    app: path.join(SRC_PATH, "bootstrap.ts"),
    storage: path.join(SRC_PATH, "storage-container.ts"),
    ...playgroundApps
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
          loader: "ts-loader"
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
    })
  ]
};
