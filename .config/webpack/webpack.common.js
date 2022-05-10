const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const fs = require('fs');
const EventHooksPlugin = require('event-hooks-webpack-plugin');

const entries = { 'main': path.resolve(__dirname, '../../src/main.js'),
                  'main.css': path.resolve(__dirname, '../../src/css/main.css') };

for (let file of fs.readdirSync('./src/scss/bundles/')) {
  entries[file.replace('.scss', '.css')] = path.resolve(__dirname, '../../src/scss/bundles/' + file);
}

module.exports = {
  stats: 'minimal',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../../shopify/assets/'),
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, '../../src/'),
      '@shopify-directory': path.resolve(__dirname, '../../shopify/')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      ... (() => {
        const rules = []

        const loaders = [
          { test: /\.(css|postcss)$/i },
          { test: /\.s[ac]ss$/i, loader: 'sass-loader' },
          { test: /\.less$/i, loader: 'less-loader' },
          { test: /\.styl$/i, loader: 'stylus-loader' }
        ]

        loaders.forEach((element, index) => {
          rules.push({
            test: element.test,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: require(path.resolve(__dirname, '../postcss.config.js'))
                }
              }
            ]
          })

          if (element.loader) rules[index].use.push(element.loader)
        })

        return rules
      })()
    ]
  },
  plugins: [
    /**
     * don't clean files with the 'static' keyword in their filename
     * docs: https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!*static*']
    }),
    /**
     * docs: https://webpack.js.org/plugins/mini-css-extract-plugin
     */
    new MiniCssExtractPlugin({
      filename: "[name]",
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    }),
    new EventHooksPlugin({
      done: () => {
        const files = fs.readdirSync(path.resolve(__dirname, '../../shopify/assets/'));
        for (const file of files) {
          if (path.extname(file) !== '.css') {
            continue;
          }

          const fileJs = path.resolve(__dirname, '../../shopify/assets/' + file)+ '.js';

          if (!fs.existsSync(fileJs)) {
            continue;
          }

          fs.unlinkSync(fileJs);
        }
      }
    })
  ]
}