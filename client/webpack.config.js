const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  entry: './src/index.tsx',
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? 'eval-source-map' : 'source-map', // Enable sourcemaps
  output: {
    filename: "bundle.[fullhash].js",
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.png|svg|jpg|gif$/,
        exclude: /node_modules/,
        use: ["file-loader"]
      },
    ]
  },
  devServer: {
    hot: true,
    open: false,
    port: 3000,
    static: ['./public'],
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5000',
      },
      {
        context: ['/websocket'],
        target: 'http://localhost:5001',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.EnvironmentPlugin( { ...process.env } )
  ]
};