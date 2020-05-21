import express from "express";

import conf from "../config/conf";
import printMiddleware from "./middleware/print";

printMiddleware("服务正在启动", "yellow");
const loader = (path, app) => {
    require(path).default(app);
};

printMiddleware("开始加载中间件.....", "input");
const app = express(); // 实例化express服务
let bundleStart = Date.now();
loader("./middleware/static.js", app); // 加载static
loader("./middleware/webpack", app); // 加载webpack

printMiddleware("加载中间结束,开始加载路由.....", "input");

/** 启动服务 **/
app.listen(conf.listenPort, () => {
    printMiddleware(
        `express服务已经启动,耗时 ${Date.now() - bundleStart}ms!, http://127.0.0.1:${conf.listenPort}`,
        "debug"
    );
});
app.on("error", err => {
    console.log(err);
    printMiddleware(`服务运行报错了,可能的原因是: ${err.message}`, "error");
});
