import m from 'mithril'
import { site_wrapper } from 'scripts/site'

export const component_name = "Login";
export const Login = site_wrapper({
    controller: () => {
    },
    view: () => {
        return m('div', [
            m('h1', "Hello from login!"),
            m('form', [
                m('label', m('input', { type: "text" })),
                m('label', m('input', { type: "text" })),
                m('input', { type: "submit", value: "Submit" }),
            ])
        ]);
    }
});