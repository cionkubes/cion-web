import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import style from 'style/nav';


const links = {
    '': "Dashboard",
    'admin': "Admin"
};

export const Menu = {
    view() {
        return m("nav", {role: "navigation"},
            pipe(Object.keys(links),
                map(k => m('a', {href: '/#!/' + k}, [
                        m("span.link-text", links[k]),
                        m("img.link-icon", {src: "resources/nav/" + links[k] + ".svg"})
                    ])
                ),
                Array.from)
        );
    }
};