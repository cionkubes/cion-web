import m from 'mithril'
import { map, pipe } from 'scripts/helpers/fp'

const links = {
    '': "Home",
    'admin': "Admin"
};

export const Menu = {
    controller: () => {},
    view: () => {
        return m('ul', pipe(Object.keys(links),
            map(k => m('li', m('a', { href: '/#!/' + k }, links[k]))),
            Array.from
        ));
    }
};