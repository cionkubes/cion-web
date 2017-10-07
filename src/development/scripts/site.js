import m from 'mithril'
import {Menu} from 'scripts/components/menu'
import {Header} from 'scripts/components/header'
import {Footer} from 'scripts/components/footer'
import style from 'style/common';

export function site_wrapper(component) {
    return {
        view: () => {
            return m('div.container', {id: "main-container"}, [
                m(Header),
                m(Menu),
                m("main", {role: "main"}, m(component)),
                m(Footer)
            ]);
        }
    }
}

export function dashboard_comp_wrapper(title, component) {
    return {
        view: () => {
            return m('div.dash_component', [
                m("div.title", m("h4", title)),
                m("div.content", component)
            ]);
        }
    }
}
