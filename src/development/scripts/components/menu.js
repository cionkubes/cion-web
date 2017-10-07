import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';

import {DashboardSvg} from 'scripts/components/svg/DashboardSvg';
import style from 'style/nav';


const links = {
    '': ["Dashboard", m(DashboardSvg)],
    'admin': ["Admin", m("p", "@")]
};

export const Menu = {
    view() {
        return m("nav", {role: "navigation"},
            pipe(Object.keys(links),
                map(k => m('a', {href: '/#!/' + k}, [
                        m("span.link-text", links[k][0]),
                        links[k][1]
                    ])
                ),
                Array.from)
        );
    }
};