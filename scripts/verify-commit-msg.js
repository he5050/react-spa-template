const chalk = require("chalk");
const msgPath = process.env.GIT_PARAMS;
const msg = require("fs").readFileSync(msgPath, "utf-8").trim();

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build|merge|Merge\\s*)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(" commit 格式错误 ")} ${chalk.red("请使用参考以下commit格式")}\n\n` +
    chalk.red("  对于自动的变更生成，需要适当的提交消息格式:\n\n") +
    `    ${chalk.green("feat(home module): 添加XXX功能")}\n` +
    `    ${chalk.green("fix(fun/modlue/options): 修复XXX功能或是属性方法 (关闭bug或是issue #28)")}\n` +
    `    ${chalk.green("style(home.css): 修改home页面的title的样式")}\n` +
    `    ${chalk.green("docs(tool): 变更方法的注释")}\n` +
    `    ${chalk.green("Merge|merge(src): 代码合并")}\n` +
    `    ${chalk.green("chore(build): 项目构建,增加依赖库、工具等,非src和test的修改")}\n` +
    `    ${chalk.green("build(webpack): 改变构建流程，新增依赖库、工具等（例如webpack修改）")}\n` +
    `    ${chalk.green("refactor(src): 代码重构")}\n` +
    `    ${chalk.green("perf(app module): 改善或是优化app module获取token的方法")}\n\n` +
    chalk.red("  查看 COMMIT_CONVENTION.md 获取更多信息\n") +
    chalk.red(`  当然你也可以使用 ${chalk.cyan("npm run commit")} 交互式生成提交消息(使用的是angular的commit规范).\n`)
  );
  process.exit(1);
}
