import m from "mithril";
import login_style from "./login.use.scss";
import { LogoSvg } from "component/graphic/logo/logo";
import { req } from "services/api/requests";
import {
    createNotification,
    NotificationPanel
} from "component/notification/panel/panel";
import { req_with_auth } from "../../services/api/requests";

let Auth = {
    username: "",
    password: "",

    setUsername(value) {
        Auth.username = value;
    },
    setPassword(value) {
        Auth.password = value;
    },
    login(e) {
        e.preventDefault();
        req({
            url: "/api/v1/auth",
            method: "POST",
            data: {username: Auth.username, password: Auth.password},
            extract: xhr => {
                return {
                    status: xhr.status,
                    body: JSON.parse(xhr.responseText)
                };
            }
        })
            .then(function (response) {
                // console.log(response);
                let status = response.status;
                if (status === 200) {
                    let data = response.body;
                    localStorage.setItem("auth-token", data["token"]);
                    localStorage.setItem("username", data["user"]["username"]);
                    localStorage.setItem("gravatar-url", data["user"]["gravatar-url"]);
                    localStorage.setItem(
                        "gravatar-email",
                        data["user"]["gravatar-email"]
                    );
                    let r = localStorage.getItem("previousRoute");
                    localStorage.removeItem("previousRoute");
                    console.log('route', r);
                    if (r) {
                        m.route.set(r);
                    } else {
                        m.route.set("/");
                    }
                    createNotification("Auth success", "", "success");
                } else {
                    createNotification(status, "An error occured", "error");
                }
            })
            .catch(e => {
                if (e.status === 401) {
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("gravatar-url");
                    localStorage.removeItem("gravatar-email");

                    m.route.set("/login");
                    createNotification("Invalid credentials", "", "warning");
                }
            });
    }
};

export const component_name = "Login";
export const Login = {
    oninit() {
        req_with_auth({
            url: "/api/v1/verify-session",
            method: "GET",
            then: e => m.route.set("/"),
            catch: () => undefined,
            401: () => undefined
        });
    },
    view() {
        return [
            m("div.login-box", [
                m("div.title-container", [m(LogoSvg)]),
                m("div.separator"),
                m("form", {onsubmit: Auth.login}, [
                    m(
                        "label",
                        m("input[type=text]", {
                            oninput: m.withAttr("value", Auth.setUsername),
                            value: Auth.username,
                            placeholder: "username"
                        })
                    ),
                    m(
                        "label",
                        m("input[type=password]", {
                            oninput: m.withAttr("value", Auth.setPassword),
                            value: Auth.password,
                            placeholder: "password"
                        })
                    ),
                    m("input", {type: "submit", value: "Login"})
                ])
            ]),
            m(NotificationPanel)
        ];
    },
    oncreate() {
        login_style.ref();
    },
    onremove() {
        login_style.unref();
    }
};
