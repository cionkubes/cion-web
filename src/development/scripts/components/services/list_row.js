import m from 'mithril';
import style from './list_row.scss';

export function listRow(name, envs) {
    return class {

        constructor(vnode) {
            vnode.service = {name: name, envs: envs};
        }

        view(vnode) {
            return m("tr", [
                m("td", m('a', {href: '#!/service/' + vnode.service.name} , vnode.service.name)),
                m("td", vnode.service.envs.sort().join(', '))
            ]);
        }

    }
}
