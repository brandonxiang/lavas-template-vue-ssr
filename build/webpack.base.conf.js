/**
 * @file 基础 webpack 配置文件，开发环境和生产环境公用的
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable no-console */

const webpack = require('webpack');
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

require('babel-polyfill');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/entry-client.js']
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            // register custom svgs
            {
                resource: resolve('src/app.js'),
                loader: 'svg-loader',
                enforce: 'pre'
            },
            // inject vuetify theme variables
            {
                resource: resolve('src/assets/styles/global'),
                loader: 'theme-loader',
                enforce: 'pre'
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: vueLoaderConfig
                    },
                    // inject global variables in every .vue file
                    {
                        loader: 'theme-loader',
                        options: {
                            injectInVueFile: true
                        }
                    }
                ],
                include: [resolve('src')]
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: vueLoaderConfig
                    }
                ],
                exclude: [resolve('src')]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve('src')
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    resolveLoader: {
        alias: {
            'svg-loader': path.join(__dirname, './loaders/svg-loader'),
            'theme-loader': path.join(__dirname, './loaders/theme-loader')
        }
    },
    plugins: process.env.NODE_ENV === 'production'
        ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: true
            }),
            new ExtractTextPlugin({
                filename: utils.assetsPath('css/[name].[contenthash].css')
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            })
        ]
        : [
            new FriendlyErrorsPlugin()
        ]
};
