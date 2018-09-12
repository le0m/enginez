'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (env, argv) {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: env.production ? 'app.min.js' : 'app.js'
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            ie8: false,
            compress: {
              comparisons: true,
              conditionals: true,
              dead_code: true,
              evaluate: true,
              if_return: true,
              join_vars: true,
              sequences: true,
              unused: true,
              warnings: false
            },
            output: {
              comments: false
            }
          }
        }),
        new OptimizeCssAssetsPlugin({})
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html',
        minify: env.production ? {
          removeComments: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true
        } : false
      }),
      new MiniCssExtractPlugin({
        filename: '[name].min.css'
      }),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: 'static'
      }])
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
            env.production ? MiniCssExtractPlugin.loader : 'style-loader',
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
