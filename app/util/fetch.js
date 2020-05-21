/**
 * 自己封装的异步请求函数
 * APP中的所有请求都将汇聚于此
 * **/

import axios from "axios";
import conf from "../../config/conf";
const defaultConfig = {
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    withCredentials: true // cookie
};
// let cancel = null;
// let promiseArr = {};
// const CancelToken = axios.CancelToken;
const fetch = axios.create(defaultConfig);
// 请求拦截器
fetch.interceptors.request.use(
    config => {
        // 发起请求时，取消掉当前正在进行的相同请求
        // if (promiseArr[config.url]) {
        //     promiseArr[config.url]("操作取消");
        //     promiseArr[config.url] = cancel;
        // } else {
        //     promiseArr[config.url] = cancel;
        // }
        // Tip: 1 开启loading
        // Tip: 2 token 什么的
        const apiHost = conf.apiHost;
        let url = config.url;
        if (!url) throw Error("未找到接口请求地址");
        if (!url.startsWith("http://") || !url.startsWith("https://")) {
            if (url.indexOf("/") === 0) {
                url = `${apiHost}${url}`;
            } else {
                url = `${apiHost}/${url}`;
            }
        }
        return {
            ...config,
            url,
            headers: {
                ...config.headers
            }
        };
    },
    err => {
        console.log("请求超时！");
        // 请求错误时做些事(接口错误、超时等)
        // Tip: 4
        // 关闭loadding
        console.log("request:", err);

        //  1.判断请求超时
        if (err.code === "ECONNABORTED" && err.message.indexOf("timeout") !== -1) {
            console.log("根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案");
            // 例如再重复请求一次
        }
        //  2.需要重定向到错误页面
        const errorInfo = err.response;
        console.log(errorInfo);
        if (errorInfo) {
            // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
            const errorStatus = errorInfo.status; // 404 403 500 ... 等
            console.log("errorStatus", errorStatus);
            // router 获取是history.push等
        }
        return Promise.reject(err); // 在调用的那边可以拿到(catch)你想返回的错误信息
    }
);

// 响应拦截器
fetch.interceptors.response.use(
    resp => {
        let data;
        // resp.data是undefined，因此需要使用resp.request.responseText(Stringify后的字符串)
        if (resp.data === undefined) {
            data = resp.request.responseText;
        } else {
            data = resp.data;
        }
        return data;
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = "请求错误";
                    break;

                case 401:
                    err.message = "未授权，请登录";
                    break;

                case 403:
                    err.message = "拒绝访问";
                    break;

                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`;
                    break;

                case 408:
                    err.message = "请求超时";
                    break;

                case 500:
                    err.message = "服务器内部错误";
                    break;

                case 501:
                    err.message = "服务未实现";
                    break;

                case 502:
                    err.message = "网关错误";
                    break;

                case 503:
                    err.message = "服务不可用";
                    break;

                case 504:
                    err.message = "网关超时";
                    break;

                case 505:
                    err.message = "HTTP版本不受支持";
                    break;

                default:
            }
        }
        console.error(err);
        // Message.error(`ERROR: ${err}`);
        return Promise.reject(err); // 返回接口返回的错误信息
    }
);

export default class Ajax {
    constructor() {
        this.requestList = {};
    }
    // 存放请求记录
    addRequestKey(key) {
        this.requestList[key] = true;
    }

    // 移除请求记录
    removeRequestKey(key) {
        delete this.requestList[key];
    }

    // 当前请求的api是否已有记录
    searchRequestKey(key) {
        return !!this.requestList[key];
    }

    // 获取串行请求的key,方便记录
    getLockRequestKey(data = {}) {
        let ajaxKey = "lockRequestKey";
        try {
            ajaxKey += JSON.stringify(data);
        } catch (e) {
            ajaxKey += data;
        }
        return ajaxKey;
    }

    // 根据请求的地址，请求参数组装成api请求的key,方便记录
    getRequestKey(data = {}) {
        let ajaxKey = "Method: " + data.method + ",Url: " + data.url + ",Data: ";
        try {
            ajaxKey += JSON.stringify(data.parmas || {});
        } catch (e) {
            ajaxKey += data.parmas || "";
        }
        return ajaxKey;
    }
    // 判断新增还是重复
    checkRequest(data) {
        const key = this.getRequestKey(data);
        if (this.searchRequestKey(key)) {
            // 如果存在 表示重复请求
            return false;
        } else {
            this.addRequestKey(key);
            return key;
        }
    }

    get(url, params, opt = {}) {
        return new Promise((resolve, reject) => {
            const key = this.checkRequest({ method: "get", url, params });
            if (!key) {
                return;
            }
            fetch({
                method: "get",
                url,
                params: params,
                // cancelToken: new CancelToken(c => {
                //     cancel = c;
                // }),
                ...opt
            })
                .then(res => {
                    this.removeRequestKey(key);
                    resolve(res);
                })
                .catch(err => {
                    this.removeRequestKey(key);
                    reject(err);
                });
        });
    }
    post(url, params, opt = {}) {
        return new Promise((resolve, reject) => {
            const key = this.checkRequest({ method: "get", url, params });
            if (!key) {
                return;
            }
            fetch({
                method: "post",
                url,
                data: params,
                // cancelToken: new CancelToken(c => {
                //     cancel = c;
                // }),
                ...opt
            })
                .then(res => {
                    this.removeRequestKey(key);
                    resolve(res);
                })
                .catch(err => {
                    this.removeRequestKey(key);
                    reject(err);
                });
        });
    }
}
// export const get = (url, param,opt = {}) => {
//     return new Promise((resolve, reject) => {
//         fetch({
//             method: "get",
//             url,
//             params: param,
//             cancelToken: new CancelToken(c => {
//                 cancel = c;
//             })
//         })
//             .then(res => {
//                 resolve(res);
//             })
//             .catch(err => {
//                 reject(err);
//             });
//     });
// };

// export const post = (url, param,opt = {}) => {
//     return new Promise((resolve, reject) => {
//       fetch({
//             method: "post",
//             url,
//             data: param,
//             cancelToken: new CancelToken(c => {
//                 cancel = c;
//             })
//         })
//             .then(res => {
//                 resolve(res);
//             })
//             .catch(err => {
//                 reject(err);
//             });
//     });
// };
