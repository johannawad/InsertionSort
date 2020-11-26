const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');
const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: { index: path.resolve(__dirname, 'src', 'app.js') },
  output: {
    path: distDir,
    filename: '[name].bundle.js',
    globalObject: 'this'
  },
  devServer: {
    open: true
  },
  module: {
    rules: [
      {
        test: /\.?worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: { filename: '[name].js', inline: 'fallback' }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new CleanWebpackPlugin()
  ]
};
