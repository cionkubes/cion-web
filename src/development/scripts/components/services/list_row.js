import m from 'mithril';
import style from './list_row.scss';

export function listRow(name, envs) {
    return class {

        constructor(vnode) {
            vnode.service = {name: name, envs: envs};
        }

        view(vnode) {
            return m("tr.list_row_click", {
                onclick: function () {
                    m.route.set('/service/' + vnode.service.name)
                }
            }, [
                m("td", vnode.service.name),
                m("td", vnode.service.envs.sort().join(', '))
            ]);
        }

    }
}
