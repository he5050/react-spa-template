const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 每次打包前清除旧的build文件夹
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin"); // 代码压缩成br
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin"); // 大小写的问题
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 代码压缩 gz // 进度条
const FaviconsWebpackPlugin = require("favicons-webpack-plugin"); // 自动生成各尺寸的favicon图标
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 动态生成html插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 为了单独打包css
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩CSS
const path = require("path");
const SizePlugin = require("size-plugin"); // 显示文件打包后的大小
const TerserPlugin = require("terser-webpack-plugin"); // 优化js
const Webpack = require("webpack");
const Webpackbar = require("webpackbar"); // 进度条
const WorkboxPlugin = require("workbox-webpack-plugin"); // workbox

const packJson = require("../package.json");
const getRelPath = src => {
    return path.resolve(__dirname, src);
};
const PUBLIC_PATH = "/"; // 基础路径
const INCLUDE_PATH = getRelPath("../app");

module.exports = {
    // 模式
    mode: "production",
    // 入口文件
    entry: getRelPath("../app/index.js"),
    // 输出文件
    output: {
        path: getRelPath("../public/static"), // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
        publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
        // filename: "bundle.js" // 编译后的文件名字
        filename: "js/[name].js",
        // filename: `js/[name].dev.v${packJson.version}.js`,
        // 非入口文件的打包名称
        // chunkFilename: param.env === "development" ? "js/[name].js" : "js/[name]_[hash].js",
        chunkFilename: "js/[name].js"
        // chunkFilename: `js/[name].chunk.dev.v${packJson.version}.js`
    },
    stats: {
        assets: true, // 添加资源信息
        hash: true, // 是否添加hash
        version: true, // 不显示版本信息
        children: false, // 显示 children 信息
        modules: false, // 显示构建模块信息
        builtAt: true, // 添加构建日期和构建时间信息
        cached: true, // 缓存
        reasons: true, // 显示模块被引入的原因
        source: false, // 显示模块的源码
        colors: true, // 显示颜色
        timings: true, // 添加时间信息
        // TODO: 为了隐藏 mini-css-extract-plugin, 因为引入排序规则不一 引起的警告，在后面的版本会排除
        warningsFilter: warning => /Conflicting order between/gm.test(warning)
    },
    resolve: {
        extensions: [".js", ".jsx", ".less", ".css", ".wasm", ".scss"], //后缀名自动补全
        alias: {
            "@": path.resolve(__dirname, "../app")
        }
    },
    // devtool: "source-map",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true, // 多线程并行构建
                terserOptions: {
                    ie8: true, // 支持ie8
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false //是否保留代码中的注释，默认为保留
                    },
                    compress: {
                        warnings: false, // 删除无用代码时是否给出警告
                        drop_console: true, // 删除所有的console.*
                        drop_debugger: true, // 删除所有的debugger
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        runtimeChunk: false, // webpack会添加一个只包含运行时(runtime)额外代码块到每一个入口
        // splitChunks: {
        //     chunks: "all"
        // }
        splitChunks: {
            // “初始”，“异步”和“全部”。配置时，优化只会选择初始块，按需块或所有块。
            // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
            chunks: "all",
            // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
            minSize: 1024 * 10,
            // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
            minChunks: 1, // Infinity
            // 表示按需加载文件时，并行请求的最大数目。默认为5。
            maxAsyncRequests: 5,
            // 表示加载入口文件时，并行请求的最大数目。默认为3。
            maxInitialRequests: 3,
            // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
            automaticNameDelimiter: "_", // 文件链接符号
            // 设置chunk的文件名。默认为true。当为true时，splitChunks基于chunk和cacheGroups的key自动命名。
            name: true,
            // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块，就分配到该组。模块可以被多个组引用，但最终会根据priority来决定打包到哪个组中。默认将所有来自 node_modules目录的模块打包至vendors组，将两个以上的chunk所共享的模块打包至default组。
            cacheGroups: {
                vendors: {
                    chunks: "async", // 必须三选一： "initial" | "all" | "async"(默认就是async)
                    name: "common", // 缓存组优先级
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true // 可设置是否重用该chunk
                },

                tools: {
                    chunks: "async",
                    name: "tools",
                    test: module => {
                        if (!module.resource) {
                            return false;
                        }
                        if (/^.*\.(css|scss|less)$/.test(module.resource)) {
                            return false;
                        }
                        if (/lodash|axios|lanlan|moment|day/.test(module.context)) {
                            return true;
                        }
                        return !module.resource.includes("node_modules");
                    },
                    priority: 9,
                    // 允许复用已存在模块
                    reuseExistingChunk: true
                },
                ui: {
                    chunks: "all",
                    name: "ui",
                    test: module => {
                        if (!module.resource) {
                            return false;
                        }
                        if (/^.*\.(css|scss|less)$/.test(module.resource)) {
                            return false;
                        }
                        if (/(antd|ant)/.test(module.context)) {
                            return true;
                        }
                        return !module.resource.includes("node_modules");
                    },
                    priority: 9,
                    // 允许复用已存在模块
                    reuseExistingChunk: true
                },
                //
                default: {
                    chunks: "async",
                    minChunks: 2,
                    // 优先级
                    priority: -20,
                    // 允许复用已存在模块
                    reuseExistingChunk: true,
                    maxAsyncRequests: 5, // 最大异步请求数， 默认1
                    maxInitialRequests: 3 // 最大初始化请求数，默认1
                }
            }
        }
    },
    module: {
        rules: [
            // js jsx
            {
                test: /\.(js|jsx)$/,
                use: ["babel-loader"]
            },
            // scss css sass
            {
                test: /\.(sa|sc|c)ss/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
            },
            // less
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: { lessOptions: { javascriptEnabled: true } }
                    }
                ]
            },
            {
                // 文件解析
                test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: INCLUDE_PATH,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/[name].[hash:4].[ext]"
                        }
                    }
                ]
            },
            {
                // 图片解析
                test: /\.(png|jpg|jpeg|gif)$/i,
                include: INCLUDE_PATH,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "assets/[name].[hash:4].[ext]"
                        }
                    }
                ]
            },
            {
                // wasm文件解析
                test: /\.wasm$/,
                include: INCLUDE_PATH,
                type: "webassembly/experimental"
            },
            {
                // xml文件解析
                test: /\.xml$/,
                include: INCLUDE_PATH,
                use: ["xml-loader"]
            }
        ]
    },
    plugins: [
        /**
         * 打包前删除上一次打包留下的旧代码（根据output.path）
         * **/
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: [
                "assets/**/*",
                "js/**/*",
                "css/**/*",
                "workbox-*.js",
                getRelPath("../public/static/index.html"),
                getRelPath("../public/static/index.ejs")
            ]
        }),
        // new Webpack.BannerPlugin("XXX技版权所有，翻版必究"),
        // 进度条
        new Webpackbar(),
        // 把不想 bundle 的文件排除掉
        new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // 设置默认参数
        new Webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            // 设置浏览器环境，webpack打包的都是在浏览器使用
            "process.browser": JSON.stringify(true)
        }),
        new OptimizeCSSAssetsPlugin(),
        new CaseSensitivePathsPlugin({ debug: false }),
        // 作用域提升
        new Webpack.optimize.ModuleConcatenationPlugin(),
        // 显示模块的相对路径 (开发)
        new Webpack.NamedModulesPlugin(),
        // 在编译出现错误时 跳过输出阶段
        new Webpack.NoEmitOnErrorsPlugin(),
        // 生成hase模块值
        new Webpack.HashedModuleIdsPlugin({
            // 参数...
            // hashFunction: "sha256",
            // hashDigest: "hex",
            // hashDigestLength: 20
        }),
        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new Webpack.optimize.OccurrenceOrderPlugin(),
        // 在合并 chunk 时，webpack 会尝试识别出具有重复模块的 chunk，并优先进行合并。
        // new Webpack.optimize.LimitChunkCountPlugin({
        //     maxChunks: 5, // 必须大于或等于 1
        //     minChunkSize: 1000
        // }),
        // // 通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上
        // new Webpack.optimize.MinChunkSizePlugin({
        //     minChunkSize: 1000 * 30
        // }),
        // new CompressionWebpackPlugin({
        //     test: new RegExp(
        //         "\\.(js|css)$" // 压缩 js与 css
        //     ),
        //     algorithm: "gzip",
        //     threshold: 0, // 只处理大于这个大小的文件，以字节为单位
        //     minRatio: 0.8, // 只处理比这个比率更好的文件
        //     // asset: "[path].gz[query]",
        //     deleteOriginalAssets: false // 是否删除压缩前的文件
        // }),
        // // 压缩代码
        // new BrotliPlugin({
        //     // cache: path.resolve(__dirname, ".cache"),
        //     test: new RegExp(
        //         "\\.(js|css)$" // 压缩 js与 css
        //     ),
        //     // algorithm: "gzip",
        //     threshold: 0, // 只处理大于这个大小的文件，以字节为单位
        //     minRatio: 0.8, // 只处理比这个比率更好的文件
        //     asset: "[path].br[query]",
        //     deleteOriginalAssets: false // 是否删除压缩前的文件
        // }),
        new AntdDayjsWebpackPlugin(), // dayjs 替代 momentjs
        /**
         * 提取CSS等样式生成单独的CSS文件
         * **/
        new MiniCssExtractPlugin({
            filename: `css/[name].css`,
            // chunkFilename: `css/common.[hash:5].css`,
            ignoreOrder: true
        }),
        // dll 插件
        new Webpack.DllReferencePlugin({
            context: __dirname,
            /**下面这个地址对应webpack.dll.config.js中生成的那个json文件的路径这样webpack打包时，
             * 就先直接去这个json文件中把那些预编译的资源弄进来
             **/
            manifest: getRelPath("../public/static/dll/manifest.json")
        }),
        new FaviconsWebpackPlugin({
            logo: getRelPath("../public/favicon.png"), // 原始图片路径
            // prefix: "", // 自定义目录，把生成的文件存在此目录下
            favicons: {
                appName: "ReactPWA", // 你的APP全称
                appShortName: "React", // 你的APP简称，手机某些地方会显示，比如切换多个APP时显示的标题
                appDescription: "ReactPWA Demo", // 你的APP简介
                background: "#222222", // APP启动页的背景色
                theme_color: "#222222", // APP的主题色
                appleStatusBarStyle: "black-translucent", // 苹果手机状态栏样式
                display: "standalone", // 是否显示搜索框，PWA就别显示了
                start_url: PUBLIC_PATH, // 起始页，‘.’会自动到主页，比'/'好，尤其是网站没有部署到根域名时
                logging: false, // 是否输出日志
                pixel_art: false, // 是否自动锐化一下图标，仅离线模式可用
                loadManifestWithCredentials: true, // 浏览器在获取manifest.json时默认不会代cookie。如果需要请设置true
                icons: {
                    // 生成哪些平台需要的图标
                    android: true, // 安卓
                    appleIcon: false, // 苹果
                    appleStartup: false, // 苹果启动页
                    coast: false, // opera
                    favicons: true, // web小图标
                    firefox: false, // 火狐
                    windows: false, // windows8 桌面应用
                    yandex: false // Yandex浏览器
                }
            }
        }),
        new HtmlWebpackPlugin({
            // 根据模板插入css/js等生成最终HTML
            filename: "index.ejs", //生成的html存放路径，相对于 output.path
            favicon: getRelPath("../public/favicon.png"), // 自动把根目录下的favicon.ico图片加入html
            template: getRelPath("../views/tpl.ejs"), //html模板路径
            hash: true, // 如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用。
            inject: true, // 是否将js放在body的末尾
            templateParameters: {
                dll: `<script src='/dll/dll.js?v${packJson.version}'></script>`,
                version: packJson.version
            }
        }),
        // 分析打包情况
        new BundleAnalyzerPlugin({
            analyzerPort: 9999,
            openAnalyzer: false
        }),
        new SizePlugin(),
        new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true
        }),

        // 写入stats.json
        function () {
            this.plugin("done", function (statsData) {
                const stats = statsData.toJson();
                fs.writeFileSync(getRelPath("../stats.json"), JSON.stringify(stats));
            });
        }
    ]
};
