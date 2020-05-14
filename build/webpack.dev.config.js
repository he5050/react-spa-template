const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin"); // 大小写的问题
const HappyPack = require("happypack"); // 多线程编译
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin"); // 缓存 webpack5 不需要了
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 动态生成html插件
const os = require("os");
const path = require("path");
const Webpack = require("webpack");
const Webpackbar = require("webpackbar"); // 进度条
const packJson = require("../package.json");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// const antdTheme = require('./theme.js');
const getRelPath = src => {
    return path.resolve(__dirname, src);
};
const PUBLIC_PATH = "/"; // 基础路径
const INCLUDE_PATH = getRelPath("../app");
// 创建多线程
const createHappyPlugin = (id, loaders) => {
    // eslint-disable-next-line new-cap
    return new HappyPack({
        id,
        loaders,
        threadPool: happyThreadPool,
        verbose: false // 是否显示
    });
};

module.exports = {
    // 缓存
    cache: true,
    // 模式
    mode: "development",
    // 入口文件
    entry: [
        "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", // webpack热更新插件
        getRelPath("../app/index.js") // 项目入口
    ],
    // 输出文件
    output: {
        path: getRelPath("../public/static"), // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
        publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
        // filename: "bundle.js" // 编译后的文件名字
        filename: "js/[name].[hash:5].js",
        // filename: `js/[name].dev.v${packJson.version}.js`,
        // 非入口文件的打包名称
        // chunkFilename: param.env === "development" ? "js/[name].js" : "js/[name]_[hash].js",
        chunkFilename: "js/[name].[hash:5].js"
        // chunkFilename: `js/[name].chunk.dev.v${packJson.version}.js`
    },
    resolve: {
        extensions: [".js", ".jsx", ".less", ".css", ".wasm", ".scss"], //后缀名自动补全
        alias: {
            "@": path.resolve(__dirname, "../app")
        }
    },
    devtool: "cheap-module-source-map",
    optimization: {
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
            {
                // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
                test: /\.js?$/,
                enforce: "pre",
                use: ["eslint-loader"],
                include: INCLUDE_PATH
            },
            // js jsx
            {
                test: /\.(js|jsx)$/,
                use: "happypack/loader?id=happy-babel-js"
            },
            // scss css sass
            {
                test: /\.(sa|sc|c)ss/,
                use: "happypack/loader?id=happy-scss"
            },
            // less
            {
                test: /\.less$/,
                use: "happypack/loader?id=happy-less"
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
        // 进度条
        new Webpackbar(),
        // 设置默认参数
        new Webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            // 设置浏览器环境，webpack打包的都是在浏览器使用
            "process.browser": JSON.stringify(true)
        }),
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
        //     maxChunks: 1, // 必须大于或等于 1
        //     minChunkSize: 1000
        // }),
        // 通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上
        // new Webpack.optimize.MinChunkSizePlugin({
        //     minChunkSize: 10000
        // }),
        // 构建缓存
        new HardSourceWebpackPlugin({
            info: {
                mode: "none",
                level: "debug"
            },
            cachePrune: {
                maxAge: 2 * 24 * 60 * 60 * 1000,
                sizeThreshold: 50 * 1024 * 1024
            },
            cacheDirectory: getRelPath("../.cache")
        }),
        new AntdDayjsWebpackPlugin(), // dayjs 替代 momentjs
        // happyPack babel
        /******* */
        createHappyPlugin("happy-babel-js", [
            {
                loader: "cache-loader",
                options: {
                    cacheDirectory: getRelPath("../.cache")
                }
            },
            {
                loader: "babel-loader?cacheDirectory"
            }
        ]),
        createHappyPlugin("happy-less", [
            {
                loader: "style-loader"
            },
            {
                loader: "cache-loader",
                options: {
                    cacheDirectory: getRelPath("../.cache")
                }
            },
            {
                loader: "css-loader"
            },
            {
                loader: "postcss-loader"
            },
            {
                loader: "less-loader",
                options: {
                    lessOptions: {
                        javascriptEnabled: true
                        //modifyVars: antdTheme
                    }
                }
            }
        ]),
        createHappyPlugin("happy-scss", [
            {
                loader: "style-loader"
            },
            {
                loader: "cache-loader",
                options: {
                    cacheDirectory: getRelPath("../.cache")
                }
            },
            {
                loader: "css-loader"
            },
            {
                loader: "postcss-loader"
            },
            {
                loader: "sass-loader"
            }
        ]),
        /******* */
        new HappyPack({
            loaders: ["babel-loader"]
        }),
        new Webpack.HotModuleReplacementPlugin(), // 热更新插件
        // dll 插件
        new Webpack.DllReferencePlugin({
            context: __dirname,
            /**下面这个地址对应webpack.dll.config.js中生成的那个json文件的路径这样webpack打包时，
             * 就先直接去这个json文件中把那些预编译的资源弄进来
             **/
            manifest: getRelPath("../public/static/dll/manifest.json")
        }),
        new HtmlWebpackPlugin({
            // 根据模板插入css/js等生成最终HTML
            filename: "index.html", //生成的html存放路径，相对于 output.path
            favicon: getRelPath("../public/favicon.png"), // 自动把根目录下的favicon.ico图片加入html
            template: getRelPath("../views/tpl.ejs"), //html模板路径
            hash: true, // 如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用。
            inject: true, // 是否将js放在body的末尾
            templateParameters: {
                dll: "<script src='/dll/dll.js'></script>",
                version: packJson.version
            }
        })
    ]
};
