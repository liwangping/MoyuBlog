const merge = require('webpack-merge');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const prodConfig = require('./webpack.prod');

const smp = new SpeedMeasureWebpackPlugin()

const analyConfig = smp.wrap({
    plugins: [
        new BundleAnalyzerPlugin()
    ],
})

module.exports = merge(prodConfig, analyConfig);