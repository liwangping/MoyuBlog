const cssnano = require('cssnano');
const merge = require('webpack-merge');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimzeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const baseConfig = require('./webpack.base');

const prodConfig = ({
    mode: "production",
    plugins: [
        new OptimzeCssAssetsPlugin({ //代码压缩 解决extract-text-webpack-plugin在merge 情况下的css重复创建问题 
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
        }),
        new HtmlWebpackExternalsPlugin({    //提取公共资源包到cdn中去
            externals: [
                {
                    module: 'react',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                    global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                    global: 'ReactDOM',
                },
            ],
        }),
        new webpack.DllReferencePlugin({
            manifest: require('../build/library/library.json')
        })
    ],
    optimization: {//手动设置webpack的默认选项，可以使得webpack更为个性化
        splitChunks: {//分离复用函数，当复用次数达到2的时候分离出来
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'vendors',
                    chunks: 'all',
                    minChunks: 2,
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true
            })
        ]
    }
})

module.exports = merge(baseConfig, prodConfig);