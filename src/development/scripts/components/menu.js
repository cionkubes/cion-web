import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';

import {DashboardSvg} from 'scripts/components/svg/DashboardSvg';
import {AdminSvg} from 'scripts/components/svg/adminsvg';
import {LogsSvg} from 'scripts/components/svg/logssvg';
import {ConfSvg} from 'scripts/components/svg/confeditorsvg';
import style from 'style/nav';


const links = {
    '': ["Dashboard", m(DashboardSvg)],
    'admin': ["Admin", m(AdminSvg)],
    'logs': ["Logs", m(LogsSvg)],
    'confeditor': ["Config", m(ConfSvg)]
};

export const Menu = {
    view() {
        return m("nav", {role: "navigation"},
            pipe(Object.keys(links),
                map(k => m('a', {href: '/#!/' + k}, [
                        m("span.link-text", links[k][0]),
                        m("div.dash-icon", links[k][1])
                    ])
                ),
                Array.from)
        );
    }
};