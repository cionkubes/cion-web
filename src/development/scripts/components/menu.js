import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import style from 'style/nav';


const links = {
    '': "Home",
    'admin': "Admin"
};

export const Menu = {
    view() {
        return m("nav", {role: "navigation"},
            pipe(Object.keys(links),
                map(k => m('a', {href: '/#!/' + k}, [
                        m("span.link-text", links[k]),
                        m("span.link-icon", "ic")
                    ])
                ),
                Array.from)
        );
    }
};