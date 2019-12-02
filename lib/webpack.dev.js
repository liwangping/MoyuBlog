'use strict';
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新
    ],
    devServer: {                        //设置devser
        contentBase: './dist',  //监听目录
        hot: true,
        // quiet: true,                //不显示devserver的console信息，让friendErrorswebpackPlugin取而代之
        stats: 'minimal'
    },
    devtool: 'cheap-source-map',//插入source使得开发模式可以在浏览器中得到展现
};

module.exports = merge(baseConfig, devConfig);