const isProd = process.env.NODE_ENV === "production";

const conf = {
    isProd,
    env: process.env.NODE_ENV || "development", // 开发环境
    listen_port: isProd ? 9970 : 9960, // 服务端口
    dev_hot_server_host: "localhost", // 开发环境webpack host
    dev_hot_server_port: 7001, // 开发环境webpack端口
    api_host: isProd ? "" : "" // api地址
    // api_port: process.env.NODE_ENV === "production" ? "8081" : "8081" // api端口
};

module.exports = conf;
