/*
 * 根页
 * 这里单独分一层是为了热更新能正常监听store的变化
 * 而把Routers放在了另外一个文件里，这样Routers中的内容就能使用connect挂载到redux上了
 * */

/** 所需的各种插件 **/
import { Provider } from "react-redux";
import React from "react";

import Routers from "../container/routers";
import store from "../store";

export default function RootContainer() {
    return (
        <Provider store={store}>
            <Routers />
        </Provider>
    );
}
