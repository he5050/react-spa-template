import compression from "compression";
import express from "express";
import path from "path";

import conf from "../config/env";
import printMiddleware from "./middleware/print";

printMiddleware("服务正在启动", "yellow");
const loader = (path, app) => {
    require(path).default(app);
};

printMiddleware("开始加载中间件.....", "input");
const app = express(); // 实例化express服务
let bundleStart = Date.now();
loader("./middleware/static.js", app); // 加载static
app.use(compression());
app.set("view engine", "ejs");
printMiddleware("加载中间结束,开始加载路由.....", "input");
// 如果是生产环境，则运行public文件夹中的代码
app.get("*", function (req, res) {
    res.render(path.resolve(__dirname, "../public/static/index.ejs"));
});

/** 启动服务 **/
app.listen(conf.listen_port, () => {
    printMiddleware(
        `express服务已经启动,耗时 ${Date.now() - bundleStart}ms!, http://127.0.0.1:${conf.listen_port}`,
        "debug"
    );
});
app.on("error", err => {
    console.log(err);
    printMiddleware(`服务运行报错了,可能的原因是: ${err.message}`, "error");
});
