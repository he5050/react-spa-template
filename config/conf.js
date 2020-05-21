const isProd = process.env.NODE_ENV === "production";
const ENV = process.env.NODE_ENV || "development"; // 开发环境
const hostData = {
    development: "https://dev.xxx.com", // 开发环境
    test: "https://test.xxx", // 测试环境
    production: "https://prod.xxx.com" // 正式环境
};
const conf = {
    isProd,
    env: ENV, // 开发环境
    apiHost: hostData[ENV] || hostData.development,
    listenPort: isProd ? 9970 : 9960 // 服务端口
};

export default conf;
