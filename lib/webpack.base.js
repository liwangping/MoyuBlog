'use strict';

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackDevServer = require('webpack-dev-server');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const PurgecssPlugin = require('purgecss-webpack-plugin');  //擦除没有用的css样式

const PATHS = {
    src: path.join(__dirname, '../src')
}

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, '../src/*/index.js'));//匹配src下所有目录

    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];                    //获取路径
        const match = entryFile.match(/src\/(.*)\/index\.js/);  //拿到页名
        const pageName = match && match[1];                        //匹配第一项

        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `../src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        )
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}
// const projectRoot = process.cwd();                              //当前node进程所在地址

const { entry, htmlWebpackPlugins } = setMPA();


module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js' //文件指纹 版本指纹
    },
    module: {
        rules: [
            {
                test: /.js$/,                       //解析js文件
                include: path.resolve('src'),
                use: 'babel-loader'
                // use: [
                //     {
                //         loader: 'thread-loader',
                //         options: {
                //             workers: 3
                //         }
                //     },
                //     'babel-loader?cacheDirectory=true'
                // ]
            },
            {
                test: /.jsx$/,                       //解析js文件
                use: 'babel-loader'
                // use: [
                //     {
                //         loader: 'thread-loader',
                //         options: {
                //             workers: 3
                //         }
                //     },
                //     'babel-loader'
                // ]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader" //所有输出的js文件都会有sourcemaps重新处理
            },
            {
                test: /.css$/,                          //解析css文件
                use: [
                    MiniCssExtractPlugin.loader,        //将每个包含css的js文件都创建一个css文件，它支持css和sourceMaps的按需加载
                    // 'style-loader',                  //插入header标签 
                    'css-loader'
                ]
            },
            // {
            //     test: /.less$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         'less-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 plugins: () => {
            //                     require('autoprefixer')({                       //autoprefixer前缀自动补齐
            //                         browsers: ["last 2 version", ">1%", "IOS 7"]//补全前缀保证兼容性
            //                     })
            //                 }
            //             }
            //         },
            //         {                               //css px转成rem 
            //             loader: 'px2rem-loader',
            //             options: {
            //                 remUni: 75,         //1rem 75px
            //                 remPreision: 8       //px转rem的小数点位数   
            //             }
            //         }
            //     ]
            // },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]',
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    // {
                    //     loader: 'url-loader',                //file-loader与其功能差不多，不过url-loader为小图片与字体提供了自动base64的效果
                    //     options: {
                    //         limit: 10240
                    //     }
                    // }
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',         //图片压缩
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new CleanWebpackPlugin(),                       //清理输出目录
        new FriendlyErrorsWebpackPlugin(),
        new HardSourceWebpackPlugin(),                   //资源缓存
        // new HardSourceWebpackPlugin.ExcludeModulePlugin([
        //     {
        //         // HardSource works with mini-css-extract-plugin but due to how
        //         // mini-css emits assets, assets are not emitted on repeated builds with
        //         // mini-css and hard-source together. Ignoring the mini-css loader
        //         // modules, but not the other css loader modules, excludes the modules
        //         // that mini-css needs rebuilt to output assets every time.
        //         test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        //     }]),
        new PurgecssPlugin({                                // 擦除没有用的css样式
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
        })
    ].concat(htmlWebpackPlugins),

    resolve: {
        alias: {
            'react': path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js')
        },
        extensions: ['.js', ".ts", ".tsx"],
        mainFields: ['main']                    // package.json 中的main字段
    }
}