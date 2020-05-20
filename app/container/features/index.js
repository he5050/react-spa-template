/** 构建与特性页 **/

/** 所需的各种插件 **/
import { connect } from "react-redux";
import React from "react";

/** 所需的所有资源 **/
import "./index.less";

function FeaturesPageContainer(props) {
    return (
        <div className="page-features">
            <h1 className="title">构建与特性</h1>
            <div className="box">
                <div className="list">
                    <h2>安装依赖文件</h2>
                    <p>npm install</p>
                </div>
                <div className="list">
                    <h2>生成dll</h2>
                    <p>npm run dll</p>
                </div>
                <div className="list">
                    <h2>启动开发环境</h2>
                    <p>npm run dev</p>
                    <div>可以config/env配置</div>
                    <div>代码打包编译，默认监听9960端口</div>
                    <div>访问http://localhost:9960 即可查看</div>
                </div>
                <div className="list">
                    <h2>测试打包</h2>
                    <p>npm run build:test</p>
                    <div>会将最终代码打包至/public/static文件夹中</div>
                </div>
                <div className="list">
                    <h2>正式打包</h2>
                    <p>npm run build</p>
                    <div>会将最终代码打包至/public/static文件夹中</div>
                </div>
                <div className="list">
                    <h2>测试打包</h2>
                    <p>npm run test </p>
                    <div>运行/public/static文件夹下生成好的最终代码</div>
                </div>
                <div className="list">
                    <h2>运行生产环境的代码</h2>
                    <p>npm run prod </p>
                    <div>运行/public/static文件夹下生成好的最终代码</div>
                </div>
                <div className="list">
                    <h2>代码eslint</h2>
                    <p>npm run eslint</p>
                    <div>自动美化所有js/css/less等文件</div>
                </div>
                <div className="list">
                    <h2>代码自动格式化</h2>
                    <p>npm run prettier</p>
                    <div>自动美化所有js/css/less等文件</div>
                </div>
                <div className="list">
                    <h2>HMR局部热更新</h2>
                    <div>使用webpack-dev-middleware 和 webpack-hot-middleware设置了热更新</div>
                </div>
                <div className="list">
                    <h2>代码分割</h2>
                    <div>react-loadable实现的代码分割</div>
                    <div>src/container/root/index.js中能查看例子</div>
                </div>
                <div className="list">
                    <h2>webpack4.x</h2>
                    <div>使用了最新版本的webpack4，beta版本用的webpack5</div>
                </div>
            </div>
        </div>
    );
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: {}
    })
)(FeaturesPageContainer);
