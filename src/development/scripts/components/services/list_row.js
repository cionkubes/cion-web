import m from 'mithril';
import list_row_style from './list_row.useable';

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
        oncreate() {
            list_row_style.ref();
        }
        onremove() {
            list_row_style.unref();
        }

    }
}
