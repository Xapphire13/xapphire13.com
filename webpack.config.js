/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, 'src/client');
const PLAYGROUND_PATH = path.join(SRC_PATH, 'playground');
const DIST_PATH = path.resolve(__dirname, 'dist/app');

const playgroundDirs = fs.readdirSync(PLAYGROUND_PATH);
const playgroundApps = playgroundDirs
  .map(dir => {
    const appPath = path.join(PLAYGROUND_PATH, dir, 'index.ts');
    if (fs.existsSync(appPath)) {
      const appName = `playground-${dir}`;
      return [appName, appPath];
    }

    return null;
  })
  .filter(appPath => !!appPath);

const isProd = process.env.NODE_ENV === 'production';

const commonConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

function playgroundAppConfig([appName, appPath]) {
  return {
    ...commonConfig,
    entry: appPath,
    output: {
      filename: `${appName}.js`,
      path: path.join(DIST_PATH, 'playground')
    }
  };
}

const clientBaseConfig = {
  ...commonConfig,
  entry: {
    app: path.join(SRC_PATH, 'bootstrap.ts'),
    storage: path.join(SRC_PATH, 'storage-container.ts')
  },
  output: {
    filename: '[name].js',
    path: DIST_PATH,
    publicPath: '/app/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Xapphire13',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      title: 'Xapphire13',
      filename: 'storage.html',
      chunks: ['storage']
    })
  ]
};

const clientDevConfigOverrides = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'less-loader' // compiles Less to CSS
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader' // translates CSS into CommonJS
        ]
      }
    ]
  }
};

const clientProdConfigOverrides = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = [
  merge(
    clientBaseConfig,
    isProd ? clientProdConfigOverrides : clientDevConfigOverrides
  ),
  ...playgroundApps.map(playgroundAppConfig)
];
