import m from 'mithril'
import { Menu } from 'scripts/components/menu'
import { Search } from 'scripts/components/search'
import style from 'style/common';

export function site_wrapper(component) {
    return {
        view: () => {
            return m('div', [
                m(Menu),
                m(Search),
                m(component)
            ]);
        }
    }
}