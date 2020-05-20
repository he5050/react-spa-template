import express from "express";
import path from "path";

import printMiddleware from "./print";

const PUBLIC_STATIC = path.resolve(__dirname, "../../public/static/");
const PUBLIC_ASSETS = path.resolve(__dirname, "../../public/assets/");
export default app => {
    printMiddleware("加载中间件 static中间件");
    app.use(
        express.static(PUBLIC_STATIC, {
            // maxAge: 24 * 60 * 60 * 1000
        })
    );
    app.use(
        express.static(PUBLIC_ASSETS, {
            // maxAge: 24 * 60 * 60 * 1000
        })
    );
};
