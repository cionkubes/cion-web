import m from 'mithril';
import io from 'socket.io-client';
import {map, pipe} from 'scripts/helpers/fp';
import {dashboard_comp_wrapper} from 'scripts/components/home'
import style from 'style/events';

export const component_name = "Events";

const socket = io();

export const Events = dashboard_comp_wrapper("Events", {
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

        return m("div.overview",
            pipe(
                Object.keys(state.socket_data),
                map(id => {
                    let imageName = state.socket_data[id]['image-name'];
                    let status = state.socket_data[id]['status'];

                    return m(
                        "div.row.task-status-row",
                        m("div", [
                            m('div.task-processing-loader'),
                            m('span', imageName + " is " + status)
                        ]))
                }), Array.from
            ));
    }
});
