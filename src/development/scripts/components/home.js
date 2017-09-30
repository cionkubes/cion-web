import m from 'mithril';
import io from 'socket.io-client';
import {site_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp'

export const component_name = "Home";

const socket = io();

export const Home = site_wrapper({
    oninit() {
        const state = this;
        state.socket_data = {};

        socket.on('task_update', function (data) {
            try {
                let id = data.id;
                console.log(data);
                state.socket_data[id] = data;
                m.redraw();
            } catch (e) {
                console.error('There is a problem: ' + e);
            }
        });
    },
    view(vnode) {
        const state = vnode.state;

        console.log(state.socket_data);
        return m("section",
            m("h1", "Events"), m(
                "div.container",
                pipe(
                    Object.keys(state.socket_data),
                    map(id => {
                        let imageName = state.socket_data[id]['image-name'];
                        let status = state.socket_data[id]['status'];

                        return m(
                            "div.row",
                            [
                                m("div", {"class": "column column-3em"}, m('div', {"class": "task-processing-loader"})),
                                m("div", {"class": "column column-50"}, m('span', imageName)),
                                m("div", {"class": "column column-25"}, m('span', status))
                            ]
                        )
                    }),
                    Array.from
                ))
        );
    }
});
