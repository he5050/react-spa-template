/** APP入口 **/
import "core-js/stable";
import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";
import Root from "./root";

ReactDOM.render(<Root />, document.getElementById("app-root"));

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(registration => {
                console.log("SW registered: ", registration);
            })
            .catch(registrationError => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

if (module.hot) {
    module.hot.accept();
}
