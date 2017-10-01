import m from 'mithril'
import {Menu} from 'scripts/components/menu'
import {Header} from 'scripts/components/header'
import {Footer} from 'scripts/components/footer'
import style from 'style/common';

export function site_wrapper(component) {
    return {
        controller: () => {
        },
        view: () => {
            return m('div.container', [
                m(Header),
                m(Menu),
                m("main", {role: "main"}, m(component)),
                m(Footer)
                // m('footer', "QUaKTM")
            ]);
        }
    }
}
