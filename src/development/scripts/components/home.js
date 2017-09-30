import m from 'mithril';
import io from 'socket.io-client';
import {site_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp'

export const component_name = "Home";

const socket = io();

export const Home = {
    oninit(vnode) {
        const state = vnode.state;
        state.socket_data = {};

        socket.on('task_update', function (data) {
            try {
                console.log(data);
                let id = data.id;
                state.socket_data[id] =data;
                m.redraw();
            } catch (e) {
                console.log('There is a problem: ' + e);
            }
        });
    },
    view(vnode) {
        const state = vnode.state;

        console.log(state.socket_data);
        return m("section",
            m("h1", "Events"), m("div.overview", pipe(
                Object.keys(state.socket_data),
                map(id => {
                    return m('div',
                        m('b', state.socket_data[id]['image-name']),
                        m('span', state.socket_data[id]['status'])
                    )
                }),
                Array.from
            ))
        );
    }
};