import m from 'mithril'
import style from 'style/login';

export const component_name = "Login";
export const Login = {
    view() {
        return m('div.container.content.login-container', [
            m("div.row",
                m("div.column.column-40", m('h1.title', "cion")),
                m("div.column.column-10.separator"),
                m("div.column.column-10"),
                m("div.column.column-40",
                    m('form', {
                        style: "margin-bottom: 0"
                    }, [
                        m('label', m('input', {
                            type: "text",
                            placeholder: "username"
                        })),
                        m('label', m('input', {
                            type: "password",
                            placeholder: "password"
                        })),
                        m('input', {type: "submit", value: "Login", style: "width:100%"}),
                    ])
                )
            )
        ]);
    }
};
