'use strict'

const path = require('path')

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        httpUrl:'https://pre-ilike-activity.zmaxfilm.com/', //https://activity.zmaxfilm.com/
        wapUrl:'http://preilikewap.zmaxfilm.com/',  //http://wap.zmaxfilm.com/
        assetsPublicPath: '/',
        baseUrl:'/preapi',
        proxyTable: {
            '/preapi': {
                target: "http://preilikemapi.zmaxfilm.com/Api_35/",
                changeOrigin: true,
                pathRewrite: {
                    '^/preapi': ''
                }
            }
        },
        host: '0.0.0.0',
        port: 8080,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        useEslint: true,
        showEslintErrorsInOverlay: false,
        devtool: 'eval-source-map',
        cacheBusting: true,
        cssSourceMap: false,
    },

    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',    ///zmax-activity/
        httpUrl:'https://activity-v2.zmaxfilm.com/', //https://activity.zmaxfilm.com/      http://pre-ilike-activity.zmaxfilm.com/
        wapUrl:' http://ilike-pro-wap.zmaxfilm.com/',  //http://ilike-pro-wap.zmaxfilm.com/          http://preilikewap.zmaxfilm.com/
        baseUrl:'/Api_35',
        productionSourceMap: false,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
  }
}
