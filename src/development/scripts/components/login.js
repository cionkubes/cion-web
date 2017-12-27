import m from 'mithril'
import login_style from 'style/login.useable';
import {LogoSvg} from "./logo/controller";
import {req} from 'scripts/helpers/requests';
import {NotificationPanel} from './notifications/panel'
import {createNotification} from "./notifications/panel";

let Auth = {
    username: "",
    password: "",

    setUsername(value) {
        Auth.username = value
    },
    setPassword(value) {
        Auth.password = value
    },
    login(e) {
        e.preventDefault();
        req({
            url: "/api/v1/auth",
            method: 'POST',
            data: {username: Auth.username, password: Auth.password}
        }).then(function (response) {
            // console.log(response);
            let status = response.status;
            if (status === 200) {
                let data = response.body;
                localStorage.setItem("auth-token", data['token']);
                m.route.set("/");
            } else {

            }
        }).then((e) =>
            createNotification('Auth success', '', 'success')
        ).catch((e) =>
            createNotification('Bad credentials', '', 'error')
        )
    }
};


export const component_name = "Login";
export const Login = {
    view() {
        return [m('div.login-box', [
                m("div.title-container", [
                    m(LogoSvg)
                ]),
                m("div.separator"),
                m('form', {onsubmit: Auth.login}, [
                    m('label', m("input[type=text]", {
                        oninput: m.withAttr("value", Auth.setUsername),
                        value: Auth.username,
                        placeholder: "username"
                    })),
                    m('label', m("input[type=password]", {
                        oninput: m.withAttr("value", Auth.setPassword),
                        value: Auth.password,
                        placeholder: "password"
                    })),
                    m('input', {type: "submit", value: "Login"}),
                ])
            ]
        ), m(NotificationPanel)];
    },
    oncreate() {
        login_style.ref();
    },
    onremove() {
        login_style.unref();
    }
};
