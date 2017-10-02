import m from 'mithril'
import login_style from 'style/login.useable';

let Auth = {
    username: "",
    password: "",

    setUsername(value) {
        Auth.username = value
    },
    setPassword(value) {
        Auth.password = value
    },
    login() {
        m.request({
            url: "/api/v1/auth",
            method: 'POST',
            data: {username: Auth.username, password: Auth.password},
            extract: function (xhr) {
                return {status: xhr.status, body: xhr.responseText}
            }
        }).then(function (response) {
            let status = response.status;
            if (status === 200) {
                let data = response.body;
                localStorage.setItem("auth-token", data.token);
                m.route.set("/");
            } else {

            }
        })
    }
};


export const component_name = "Login";
export const Login = {
    view() {
        return m('div.login-box', [
                m("div.title-container",[
                    m("img", {src: "resources/logo64x64.png"}),
                    m('h1.title', "cion")
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
        );
    },
    oncreate() {
        login_style.ref();
    },
    onremove() {
        login_style.unref();
    }
};
