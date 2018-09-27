const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''

const isDev = process.env.npm_lifecycle_event=='dev' ? true : false
let options = isDev ? require('./config/dev.js') : require('./config/pro.js');

module.exports = () => ({
  entry: {
    vendor: ['vue'],
    index: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash:7].js',
    chunkFilename: 'js/[name].[id].[chunkhash:7].js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        loaders: 'less-loader'
    },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: path.posix.join('assets', 'image/[name].[hash:7].[ext]')
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    }),
    new webpack.DefinePlugin({//运行时变量
      '_BASE_URL':JSON.stringify(options.apiBaseUrl),
      '_CODE_SPLIT': true,
      '_MOCK':false,//模拟数据
  })
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '~': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: '192.168.10.161',
    port: 8020,
    proxy: options.proxy,
    historyApiFallback: {
      index: url.parse(isDev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: isDev ? '#source-map' : ''
})
