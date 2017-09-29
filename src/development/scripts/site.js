import m from 'mithril'
import { Menu } from 'scripts/components/menu'
import { Search } from 'scripts/components/search'

export function site_wrapper(component) {
    return {
        controller: () => {
        },
        view: () => {
            return m('div', [
                m('header', m('img', { src: "/resources/images/header.png", alt: "", width: 300 })),
                m(Menu),
                m(Search),
                m(component),
                m('footer', "QUaKTM")
            ]);
        }
    }
}