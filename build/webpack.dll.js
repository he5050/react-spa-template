// dll 公共文件
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // 每次打包前清除旧的build文件夹
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const webpackbar = require("webpackbar");
const packJson = require("../package.json");
const outputPath = path.join(__dirname, "../public/static/dll");

module.exports = {
    mode: "production",
    // @babel/polyfill IE10 当中垫片
    entry: {
        dll: ["react", "react-dom", "react-router-dom", "react-redux"]
    },
    output: {
        path: outputPath, // 生成的dll.js路径
        filename: `[name].js`, // 生成的文件名字
        library: "[name]" // 生成文件的一些映射关系，与下面DllPlugin中配置对应
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    ie8: true, // 支持ie8
                    output: {
                        // 最紧凑的输出
                        // beautify: false,
                        // 删除所有的注释
                        comments: false
                    },
                    compress: {
                        // 删除无用代码时是否给出警告
                        warnings: false,
                        // 删除所有的console.*
                        drop_console: true,
                        // 删除所有的debugger
                        drop_debugger: true
                    }
                },
                sourceMap: false
            })
        ]
    },
    plugins: [
        new webpack.BannerPlugin("XXX技版权所有，翻版必究"),
        new CleanWebpackPlugin({
            verbose: true
        }),
        // eslint-disable-next-line
        new webpackbar(),
        // eslint-disable-next-line
        new CompressionWebpackPlugin({
            test: new RegExp(
                "\\.(js|css)$" // 压缩 js与 css
            ),
            algorithm: "gzip",
            threshold: 0, // 只处理大于这个大小的文件，以字节为单位
            minRatio: 0.8, // 只处理比这个比率更好的文件
            // asset: "[path].gz[query]",
            deleteOriginalAssets: false // 是否删除压缩前的文件
        }),
        // 压缩代码
        new BrotliPlugin({
            // cache: path.resolve(__dirname, ".cache"),
            test: new RegExp(
                "\\.(js|css)$" // 压缩 js与 css
            ),
            // algorithm: "gzip",
            threshold: 0, // 只处理大于这个大小的文件，以字节为单位
            minRatio: 0.8, // 只处理比这个比率更好的文件
            asset: "[path].br[query]",
            deleteOriginalAssets: false // 是否删除压缩前的文件
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
        // 使用DllPlugin插件编译上面配置的NPM包
        new webpack.DllPlugin({
            // 会生成一个json文件，里面是关于dll.js的一些配置信息
            context: __dirname,
            path: path.resolve(__dirname, "../public/static/dll/manifest.json"),
            name: "[name]"
        })
    ]
};
