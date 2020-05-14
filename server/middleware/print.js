import colors from "colors";
import moment from "moment";

colors.setTheme({
    silly: "rainbow",
    input: "inverse",
    verbose: "cyan",
    prompt: "random",
    info: "green",
    data: "america",
    help: "magenta",
    warn: "yellow",
    debug: "blue",
    error: "red"
});
const print = (msg = "加载中", type = "magenta") => {
    console.log(
        colors[type](
            `[server_${process.env.NODE_ENV}]: ${msg}, ${moment().format("YYYY-MM-DD: HH:mm:ss")}`
        )
    );
};

export default print;
