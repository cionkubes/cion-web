import m from 'mithril';
import io from 'socket.io-client';
import {site_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp'
import style from 'style/home';

export const component_name = "Home";

const socket = io();

export const Home = site_wrapper({
    oninit() {
        const state = this;
        state.socket_data = {};

        socket.on('task_update', function (data) {
            try {
                let id = data.id;
                state.socket_data[id] = data;
                m.redraw();
            } catch (e) {
                console.error('There is a problem: ' + e);
            }
        });
    },
    view(vnode) {
        const state = vnode.state;

        return m("div.container.content",
            m("h1", "Events"), m(
                "div.overview",
                pipe(
                    Object.keys(state.socket_data),
                    map(id => {
                        let imageName = state.socket_data[id]['image-name'];
                        let status = state.socket_data[id]['status'];

                        return m(
                            "div.row.task-status-row",
                            [
                                m("div", [
                                    m('div', {"class": "task-processing-loader"}),
                                    m('span', imageName + " is " + status)
                                ])
                            ]
                        )
                    }),
                    Array.from
                ))
        );
    }
});
