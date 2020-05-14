// "off" 或 0 - 关闭这个规则检查
// "warn" 或 1 - 开启这个规则检查并提示（不影响退出状态）
// "error" 或 2 - 开启规则检查并报错
// /* eslint-disable*/
// eslint-disable-next-line
// eslint-disable-line
module.exports = {
    extends: ["alloy", "alloy/react", "prettier"],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        mocha: true
    },
    settings: {
        react: {
            createClass: "createReactClass", // Regex for Component Factory to use,
            // default to "createReactClass"
            pragma: "React", // Pragma to use, default to "React"
            version: "detect", // React version. "detect" automatically picks the version you have installed.
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // default to latest and warns if missing
            // It will default to "detect" in the future
            flowVersion: "0.53" // Flow version
        },
        propWrapperFunctions: [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            { property: "freeze", object: "Object" },
            { property: "myFavoriteWrapper" }
        ],
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            "Hyperlink",
            { name: "Link", linkAttribute: "to" }
        ]
    },
    // "parser": "babel-eslint",
    parserOptions: {
        ecmaVersion: 9,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true
        },
        allowImportExportEverywhere: true,
        sourceType: "module"
    },
    plugins: ["react-hooks", "prettier"],
    rules: {
        "react/no-unescaped-entities": "off"
        // "semi": "warn",
        // "no-unused-vars": "off",
        // "no-cond-assign": "error",
        // "no-debugger": "warn",
        // "no-dupe-args": "error",
        // "no-caller": "error",
        // "no-unmodified-loop-condition": "error",
        // "no-with": "error",
        // "no-catch-shadow": "error",
        // "react/no-unescaped-entities": "off",
        // "react-hooks/rules-of-hooks": "error",
        // "prettier/prettier": "warn"
    }
};
