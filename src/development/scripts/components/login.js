import m from 'mithril'
import style from 'style/login';

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
                m.route.set("/")
            } else {

            }
        })
    }
};


export const component_name = "Login";
export const Login = {
    view() {
        return m('div.container.content.login-container', [
            m("div.row",
                m("div.column.column-40", m('h1.title', "cion")),
                m("div.column.column-10.separator"),
                m("div.column.column-10"),
                m("div.column.column-40",
                    m('div', {
                        style: "margin-bottom: 0"
                    }, [
                        m("input[type=text]", {
                            oninput: m.withAttr("value", Auth.setUsername),
                            value: Auth.username,
                            placeholder: "username"
                        }),
                        m("input[type=password]", {
                            oninput: m.withAttr("value", Auth.setPassword),
                            value: Auth.password,
                            placeholder: "password"
                        }),
                        m("button[type=button]", {onclick: Auth.login, style: "width:100%"}, "Login")
                    ])
                )
            )
        ]);
    }
};
