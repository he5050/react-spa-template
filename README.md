## 前言

1. 项目兼容性，根据需求确定
2. 统一代码格式与风格
3. 技术栈(React),模式(SPA),是否需要(PWA)

## 使用

运行脚本文件`run.sh`

```
Usage         : ./run.sh {f|p|v}
f             : 编译运行项目
v             : 发布版本
p             : 更新拉取项目
```

运行项目

```
./run.sh f
Usage       : ./run.sh f {dll|dev|prod|build:test|build|start|stop|version|lint}
dll         : 生成dll文件
dev         : 开发模式启动
prod        : 生产模式启动
test        : 测试模式启动
build:test  : 编译测试打包
build       : 编译正式打包
start       : 启动应用(进程守护)
stop        : 关闭应用(进程守护)
restart     : 重启应用(进程守护)
reload      : 重载应用(进程守护)
lint        : 代码检测
```

项目发版

```
./run.sh v
Usage      : ./run.sh v {patch|minor|major|beta|push}
version    : 生成版本信息(changelog)
patch      : bug修复
minor      : 功能更新
major      : 大版本变动
beta       : 生成beta版
push       : 发布版本
```

项目更新

```
./run.sh p
Usage       : ./run.sh p {clone|pull}
clone       : 下载项目
pull        : 更新项目
```

## 项目基础架构

├─.babelrc // babel 配置
├─.browerslistrc // 浏览器兼容
├─.editorconfig // 编辑器设置
├─.eslintignore // elsint 忽略
├─.eslintrc.js // elsint 配置
├─.eslintrc.json // elsint 配置
├─.gitignore // git 配置
├─.prettierignore // prettier 配置
├─.prettierrc.js // prettier 配置
├─.travis.yml // travis 配置
├─COMMIT_CONVENTION.md // git 提交说明
├─csscomb.json // css 格式配置
├─nodemon.json // 开发环境
├─package-lock.json
├─package.json // 包管理
├─pm2-test.json // 测试环境 pm2
├─pm2.json // 生产环境
├─postcss.config.js // css 前缀
├─prettire.config.js // prettier 配置
├─README.md
├─run.sh // 项目运行脚本
├─size-plugin.json
├─stats.json // webpack 打包分析
├─theme.js // 项目主题设置
├─views // 基础模版
| ├─js.ejs
| └tpl.ejs
├─server // 服务端口
| ├─dev.js
| ├─prod.js
| ├─middleware // 中间件
| | ├─print.js
| | ├─static.js
| | ├─mock.js
| | └webpack.js
├─scripts // 脚本文件
| └verify-commit-msg.js // git 代码校验
├─public // 公共文件
| ├─favicon.png
| ├─static // 编译后打包的文件
| | ├─favicon.png
| | ├─index.ejs
| | ├─js
| | | ├─page1.js
| | | ├─page2.js
| | | ├─common.js
| | | ├─home.js
| | | ├─main.js
| | | └ui.js
| | ├─dll
| | | ├─dll.js
| | | └manifest.json
| | ├─css
| | | ├─common.css
| | | ├─page1.css
| | | ├─page2.css
| | | └main.css
| | ├─assets
| | | ├─loading.9b54.gif
| | | ├─react-logo.5223.jpg
| | | ├─starSky.4dcb.mp3
| | | └test.b739.jpg
| ├─assets // 这里资源不需要打包编译
├─mock // 模式本地数据
| ├─Interface1.js
| └Interface2.js
├─config // 项目配置
| └env.js
├─build // 编译配置
| ├─webpack.dev.config.js
| ├─webpack.dll.js
| └webpack.prod.config.js
├─app // 前端代码
| ├─index.js // 入口文件
| ├─util // 工具类
| | ├─server.js
| | └tools.js
| ├─styles // 公用样式 预设样式代码
| | ├─initialize.css
| | ├─public.scss
| | ├─mixin.scss
| | ├─variable.scss
| | └less.less
| ├─store // 状态库入口
| | └index.js
| ├─root // 根文件
| | ├─index.js
| | └root.js
| ├─models // model
| | ├─model1.js
| | ├─model2.js
| ├─pages // 页面
| | ├─pages1
| | ├─pages2
| ├─component // 组件
| | ├─component1
| | ├─component2
| | ├─component3
| ├─assets // 资源
| | ├─images1
| | ├─images2
├─.cache //开发时的构建 提高编译效率
|
