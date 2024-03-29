const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
/**
 *  Returns the hostname without the domain name.
 */
function getShortHostname() {
  let host = require('os').hostname() || 'localhost';
  if (host.indexOf('.') > 0)
    host = host.split('.')[0];
  return host;
}
var shortHostname = getShortHostname();
var port = 4039;

module.exports = {
  entry: './app.js',
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin(), new CssMinimizerPlugin({})],
  },
  output: {
    filename: 'app.[contenthash].js',
    path: path.resolve(__dirname, 'public'),
    library: 'app',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // under output.path
      template: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'app.[contenthash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
           filename: '[name].[contenthash].[ext]'
        }
    },
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env',
              {
                "targets": {
                  "browsers": "ie >= 10"
                }
              }
            ]]
          }
        }
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    open: true,
    port: port
  }
}
