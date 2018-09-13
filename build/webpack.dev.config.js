'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (env, argv) {
  return {
    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

    entry: {
      app: './src/index.js'
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'app.js'
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html',
        minify: false
      })
    ],

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'eslint-loader',
            options: { // TODO add property:  formatter: require('eslint-friendly-formatter')
              configFile: path.resolve(__dirname, '../.eslintrc.js')
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [ '@babel/preset-env', { targets: ['> 1%', 'last 2 versions', 'not ie <= 8', 'not dead'] } ]
              ]
            }
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: [
            'html-loader'
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },

    stats: {
      colors: true,
      chunks: false,
      modules: false
    },

    devServer: {
      compress: true,
      contentBase: path.join(__dirname, 'dist'),
      open: true,
      stats: {
        colors: true,
        chunks: false,
        modules: false
      },
      watchContentBase: true
    }
  }
}
