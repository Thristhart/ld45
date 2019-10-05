const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: path.resolve(__dirname, 'src'),

  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
      }
    ],
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new CopyWebpackPlugin(["./assets/**/*",]),
  ],
  
  node: {
    fs: 'empty'
  }
};