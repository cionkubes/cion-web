import m from "mithril";
import { createNotification } from "component/notification/panel/panel";

export function req(args) {
    args["extract"] = function (xhr) {
        let bod = undefined;
        try {
            bod = JSON.parse(xhr.responseText);
        } catch (err) {
            bod = xhr.responseText;
        }
        return {status: xhr.status, body: bod};
    };
    return m.request(args);
}

export function req_with_auth(args) {
    if (!args["headers"]) {
        args["headers"] = {};
    }
    args["headers"]["X-CSRF-Token"] = localStorage.getItem("auth-token");

    let then = args["then"];
    let erHandler = args["catch"];
    let thisArg = args["this"];

    return req(args)
        .then(res => {
            if (then) {
                if (thisArg) {
                    then = then.bind(thisArg);
                }
                then(res.body, res);
            }
        })
        .catch(res => {
            if (res.status === 401) {
                localStorage.removeItem("auth-token");
                m.route.set("/login");
                createNotification(
                    "Invalid credentials",
                    "The server did not recognize your credentials.",
                    "warning"
                );
            } else if (erHandler) {
                if (thisArg) {
                    erHandler = erHandler.bind(thisArg);
                }
                let message = "";
                try {
                    message = JSON.parse(res.message)["error"];
                } catch (err) {
                    message = res.message;
                }
                erHandler(message, res);
            } else {
                throw res;
            }
        });
}
