目前开发目录
    ./src/index

目前需要完成的内容
    基础配置
        1. 资源解析
            -- 解析ES6              +
            -- 解析React            +
            -- 解析CSS              +
            -- 解析图片              +
            -- 解析字体              +
        2. 样式增强
            -- css前缀补齐           +
            -- css px转rem          +
        3. 目录清理                  +
        4. 多页面打包       
        5. 命令行信息显示优化          +
        6. 错误捕获和处理              +
        7. css提取成一个单独的文件      +
    
    开发阶段配置：
        1. 代码热更新
            -- css热更新
            -- js热更新              +

        2. sourcemap                +
    
    生产阶段配置
        1. 代码压缩                   +
        2. 文件指纹                   +
        3. TreeShaking               +
        4. Scope Hoisting           
        5. 速度优化(基础包cdn)          +
        6. 体积优化(代码分割)           +   

    dll配置
        分离基础包
    (进一步分包，可以把把构建速度和打包速度提升)

    ssr配置（待考虑)
        1. output的librayTarget设置
        2. css解析ignore



搭建
    1. npm init -y 初始化配置文件
    2. yarn webpack webpack-cli -D
    3. 设置入口出口和模式。
    4. 解析js文件,安装babelrc.(安装babelrc工具)
    yarn add @babel/core @babel/preset-env babel-oader -D 
    设置读取.js的babel-loader 
    5. 设置解析jsx的loader
    6. 安装react包
    yarn react react-dom @babel/preset-react -D



build:stats 
    把打包对象输出到json(颗粒度很粗，不推荐)

SpeedMeasureWebpackPlugin(分析速度的工具)

高版本的webpack和node.js可以将构建时间降低60% - 98%

HappyPack多进程、多实例构建：每次webpack解析一个模块，happypack会将它及它的依赖分配给worker线程中，不过HappyPack已经不再维护了，官方推荐了thread-loader.


package.json中的script是默认在./node_modules/.bin目录下的，所以会这样。

构建与打包优化
    1.
    2. 分包
    3. 准备缓存（babel-loader）包在node_moudule下的.cache中
    · babel-loader 开启缓存
    · terser-webpack-plugin 开启缓存
    · 使用 cache-loader 或者 hard-source-webpack-plugin(最为推荐)
    4. 缩小构建目标（比如node_modules，vants之类的) 对默认的查找进行一个优化
        babel-loader一般不需要对其进行解析，所以可以对这个进行跳过
  
    --
        优化 resolve.modules 配置(减少模块搜索层级) (缩小范围)
        优化 resolve.mainFields 配置        根据package.json中的main进行查找  而main一般都是index.js所以对于默认来说，是会逐层的查找main字段，也就是index.js      
        优化 resolve.extensions 配置        查找类型，对所有import的文件中的js进行查找，所以如果这么用，就必须约定在引入的时候，我们需要对其进行指定的.js后缀。
        合理使用 alias                      比如react : ./nodemoudule/react/dist/react.min.js 可以提高查找速度。


体积优化
    1. treeShaking 删除没有使用到的js和css production模式下自动生成。（purgecss-webpack-plugin) 在预解析的情况下进行css的擦除。
    2. 图片压缩
    3. 动态polyfill。因为有些polyfill我们的生产环境不需要，所以我们不需要，，还有些对于不同的手机用户api（permise）的兼容性不同，所以我们不需要进行兼容。所以可以通过动态polyfill来进行优化。原理很简单。根据不同的手机设备来不同的请求。
    缺点(国内浏览器厂商会魔改usage,会导致polyfill service的失效，不过我们可以针对。)




webapck-merge 合并。

功能
    1. 满足react + typescript + react-router + mobx + less + antd  + ES6开发（前端方向)
    2. 满足koa2 + squelize + mysql 开发（后端)
    3. 满足文件指纹的构建，多模块打包。
    4. 优化webpack的构建速度和打包速度。
    5. 减少webpack的打包体积，分离第三方包。
    6. 增加单元测试模块()
    7. 分离开发，生产环境与测试环境。
    8. 增加command命令，webpack命令皮肤窗口。提高自动化程度。
    9. 构建配置抽离成npm包
    10. docker环境部署。



## 遇见的坑
1. 在热更新中会出现一些明明编译成功，但是网站内容却没有改变的情况。这时需要注意是否是html的问题。因为热更新是不会生成文件保存在硬盘的而是会放在内存中的。

    另外对于HtmlWebpackPlugin中的模板文件template: path.join(__dirname, 'src/index/index.html'),如果我们更改了index.html的话，我们的热更新其实是无效的，它不会监听模板的变化。

2. MiniCssExtractPlugin.loader,        
//将每个包含css的js文件都创建一个css文件，它支持css和sourceMaps的按需加载，支持hmr

和extract-text-webpack-plugin相比： 

异步加载
无重复编译，性能有所提升
用法简单 
之支持css分割

3. JS ⽂文件的压缩 内置了了 uglifyjs-webpack-plugin


4. 在非首次编译的时候中将其中的一些js文件删除会导致webpack报
[hardsource:6f72a45a] Could not freeze ./app-entries/settings.js + 23 modules: Cannot read property 'hash' of undefined
原因是因为开启了缓存，所以会导致下次启动的时候，读取缓存的时候，会报这个错，解决方法是，删除掉./node_moudle/cache文件夹下的hard-source，这样子可以重新的进行缓存。更好的解决方法？

目前的解决方法：在npm script中添加删除缓存的方法，然后再进行dev。

5. 由于typescript统一由@types进行管理，所以引入第三方插件时，记住要先引入声明，比如
比如： 引入路由插件react-router-dom
npm i react-router-dom    还需    npm i @types/react-router-dom


6. 如何修复vscode对于mobx报错
In VSCode, Go to File => Preferences => Settings (or Control+comma) and it will open the User Settings file. Add "javascript.implicitProjectConfig.experimentalDecorators": true to the file and it should fix it. It did for me.
