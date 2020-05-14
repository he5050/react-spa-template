import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDev from "../../build/webpack.dev.config.js";
import printMiddleware from "./print";

const wpc = app => {
    printMiddleware("加载中间件 webpack中间件");
    let bundleStart = Date.now();
    const compiler = webpack(webpackDev); // 实例化webpack
    app.use(
        webpackDevMiddleware(compiler, {
            // 挂载webpack小型服务器
            publicPath: webpackDev.output.publicPath, // 对应webpack配置中的publicPath
            quiet: true, // 是否不输出启动时的相关信息
            hot: true, // 启动webpack热模块替换特性
            inline: true, // 配合 webpack.HotModuleReplacementPlugin()
            noInfo: false,
            stats: {
                // 显示包信息
                // chunks: true, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
                // chunkModules: true, // 将构建模块信息添加到 chunk 信息
                // chunkOrigins: false, // 添加 chunk 和 chunk merge 来源的信息
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
            }
        })
    );
    // 挂载HMR热更新中间件
    app.use(webpackHotMiddleware(compiler));
    // 所有请求都返回index.html
    app.get("*", (req, res, next) => {
        const filename = path.join(webpackDev.output.path, "index.html");
        // 由于index.html是由html-webpack-plugin生成到内存中的，所以使用下面的方式获取
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err);
            }
            res.set("content-type", "text/html");
            res.send(result);
            res.end();
        });
    });
    // 开始编译

    // 编译完成
    // compiler.hooks.done.tap("stats", () => {
    //     printMiddleware(`webpack编译完成耗时: ${Date.now() - bundleStart} ms!`, "cyan");
    // });
};
export default wpc;
