import m from 'mithril'
import login_style from 'style/login.useable';

export const component_name = "Login";
export const Login = {
    view() {
        return m('div.login-box', [
            m('h1.title', "cion"),
            m("div.separator"),
            m('form', [
                m('label', m('input', {
                    type: "text",
                    placeholder: "username"
                })),
                m('label', m('input', {
                    type: "password",
                    placeholder: "password"
                })),
                m('input', {type: "submit", value: "Login"}),
            ])
        ]
        );
    },
    oncreate(){
        login_style.ref();
    },
    onremove(){
        login_style.unref();
    }
};
