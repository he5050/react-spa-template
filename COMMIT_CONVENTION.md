## 规范约定

> 主要来是来自 [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

#### Git版本规范

- **master**分支为主分支(保护分支)，不能直接在master上进行修改代码和提交

  + master 为主分支，也是用于部署生产环境的分支，确保master分支稳定性
  + master 分支一般由develop以及hotfix分支合并，任何时间都不能直接修改代码

  ```
  (master)$: git merge release --no-ff          # 把release测试好的代码合并到master
  (master)$: git tag -a v0.1 -m '部署包版本名'  #给版本命名，打Tag

  ```

- **develop**分支为测试分支，所以开发完成需要提交测试的功能合并到该分支

  + develop 为开发分支，始终保持最新完成以及bug修复后的代码
  + 一般开发的新功能时，feature分支都是基于develop分支下创建的

- **feature**分支为开发分支，大家根据不同需求创建独立的功能分支，开发完成后合并到develop分支;

  + 开发新功能时，以develop为基础创建feature分支
  + 分支命名: feature/ 开头的为特性分支， 命名规则: feature/user_module、 feature/cart_module

  ``` javascript
  (dev)$: git checkout -b feature/xxx            # 从dev建立特性分支
  (feature/xxx)$: blabla                         # 开发
  (feature/xxx)$: git add xxx
  (feature/xxx)$: git commit -m 'commit comment'
  (dev)$: git merge feature/xxx --no-ff          # 把特性分支合并到dev

  ```
- **release**分支 主要为是了预上线时用于测试的版本

  + release 为预上线分支，发布提测阶段，会release分支代码为基准提测

  > 当有一组feature开发完成，首先会合并到develop分支，进入提测时，会创建release分支。如果测试过程中若存在bug需要修复，则直接由开发者在release分支修复并提交。当测试完成之后，合并release分支到master和develop分支，此时master为最新代码，用作上线。

  ```
  (release)$: git merge dev --no-ff             # 把dev分支合并到release，然后在测试环境拉取并测试
  ```

- **hotfix**分支为bug修复分支，需要根据实际情况对已发布的版本进行漏洞修复

  + 分支命名: hotfix/ 开头的为修复分支，它的命名规则与 feature 分支类似
  + 线上出现紧急问题时，需要及时修复，以master分支为基线，创建hotfix分支，修复完成后，需要合并到master分支和develop分支

  ``` javascript
  (master)$: git checkout -b hotfix/xxx         # 从master建立hotfix分支
  (hotfix/xxx)$: blabla                         # 开发
  (hotfix/xxx)$: git add xxx
  (hotfix/xxx)$: git commit -m 'commit comment'
  (master)$: git merge hotfix/xxx --no-ff       # 把hotfix分支合并到master，并上线到生产环境
  (dev)$: git merge hotfix/xxx --no-ff          # 把hotfix分支合并到dev，同步代码

  ```

#### Tag
采用三段式，v版本.里程碑.序号，如v1.2.1

- 架构升级或架构重大调整，修改第2位
- 新功能上线或者模块大的调整，修改第2位
- bug修复上线，修改第3位

## 匹配正则

**commit**提交的正则表达式匹配:

``` javascript
/^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/
```

## Commit messages的基本语法

### 具体格式:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### 中文说明

```
# fix(components/myPicker): 修复联动时 第二列数据没有更新
#
# 这里是一个说明文件具体内容
# * 为什么这个变更是必须的? 它可能是用来修复一个bug，增加一个feature，提升性能、可靠性、稳定性等等
# * 他如何解决这个问题? 具体描述解决问题的步骤
# * 是否存在副作用、风险?
#
# BREAKING CHANGE： 重大修改 时请使用这个
# 如果需要的化可以添加一个链接到issue地址或者其它文档 close#111

```
### 格式说明:

+ **type**: 本次 commit 的类型，诸如 bugfix docs style 等
+ **scope**: 本次 commit 波及的范围
+ **subject**: 简明扼要的阐述下本次 commit 的主旨，在原文中特意强调了几点:

  - 使用祈使句，是不是很熟悉又陌生的一个词，来传送门在此 祈使句
  - 首字母不要大写
  - 结尾无需添加标点

+ **body**: 同样使用祈使句，在主体内容中我们需要把本次 commit 详细的描述一下，比如此次变更的动机，如需换行，则使用 |
+ **footer**: 描述下与之关联的 issue 或 break change，详见案例

### Type

+ **feat**: 添加新特性或新功能
+ **fix**: 修复bug
+ **docs**: 仅仅修改了文档
+ **style**: 不影响代码运行的更改(空格，格式，缺少分号等),不改变代码逻辑
+ **refactor**: 代码重构，没有加新功能或者修复bug
+ **perf**: 增加代码进行性能测试,代码优化，改善性能
+ **test**: 添加或修改测试用例
+ **ci**：自动化流程配置修改
+ **revert**：回滚到上一个版本
+ **build**：改变构建流程，新增依赖库、工具等（例如webpack修改）
+ **chore**: 以上都不是

> 特别注意：使用 **revert** 标识撤销 commit 时，subject 应为所撤销的 commit 的 message， Body 应包含 所撤销的 commit 的 hash。

示例如下:

```
revert: fix: change aa to bb

This reverts commit ca1b58f63fcaa2ae763a5604e5b46e802d83105c.

```

### scope

  - 用于说明 `commit` 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

### subject
  > 是 `commit` 目的的简短描述，不超过50个字符

  - 以动词开头，使用第一人称现在时，比如change，而不是changed或changes
  - 第一个字母小写
  - 结尾不加句号（.）
