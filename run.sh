#! /bin/sh

runWeb() {
    if [ ! -d 'node_modules' ];then
    npm install -g pm2
    npm install
    fi
    npm run $1 --scripts-prepend-node-path=auto
}

cloneProject() {
    if [ ! -d 'spa-template' ];then
    git pull
    fi
    git clone
}

case "$1" in
    f)
        case "$2" in
            dll)
                runWeb dll
            ;;
            dev)
                runWeb dev
            ;;
            prod)
                runWeb prod
            ;;
            build)
                runWeb build:test
            ;;
            build)
                runWeb build
            ;;
            start)
                runWeb start
            ;;
            stop)
                runWeb stop
            ;;
            restart)
                runWeb restart
            ;;
            reload)
                runWeb reload
            ;;
            lint)
                runWeb lint
            ;;
            version)
                runWeb version
            ;;
            *)
                echo $"Usage       : $0 $1 {dll|dev|prod|build:test|build|start|stop|version|lint}"
                echo $"dll         : 生成dll文件"
                echo $"dev         : 开发模式启动"
                echo $"prod        : 生产模式启动"
                echo $"test        : 测试模式启动"
                echo $"build:test  : 编译测试打包"
                echo $"build       : 编译正式打包"
                echo $"start       : 启动应用(进程守护)"
                echo $"stop        : 关闭应用(进程守护)"
                echo $"restart     : 重启应用(进程守护)"
                echo $"reload      : 重载应用(进程守护)"
                echo $"lint        : 代码检测"
                exit 3
        esac
    ;;
    v)
        case "$2" in
            patch)
                runWeb release:patch
            ;;
            minor)
                runWeb release:minor
            ;;
            major)
                runWeb release:major
            ;;
            beta)
                runWeb release:beta
            ;;
            push)
                runWeb push
            ;;
            *)
                echo $"Usage      : $0 $1 {patch|minor|major|beta|push}"
                echo $"version    : 生成版本信息"
                echo $"patch      : bug修复"
                echo $"minor      : 功能更新"
                echo $"major      : 大版本变动"
                echo $"beta       : 生成beta版"
                echo $"push       : 发布版本"
                exit 3
        esac
    ;;
    p)
        case "$2" in
            clone)
                git clone
                ;;
            pull)
                git pull
                ;;
            *)
                echo $"Usage       : $0 $1 {clone|pull}"
                echo $"clone       : 下载项目"
                echo $"pull        : 更新项目"
                exit 3
        esac
    ;;
    *)
        echo $"Usage         : $0 {f|p|v}"
        echo $"f             : 编译运行项目"
        echo $"v             : 发布版本"
        echo $"p             : 更新拉取项目"
        exit 2
esac

exit $?
