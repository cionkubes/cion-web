import m from 'mithril';
import io from 'socket.io-client';
import {site_wrapper} from 'scripts/site';
import {map} from 'scripts/helpers/fp'

export const component_name = "Home";

const socket = io();

export const Home = {
    oninit() {
        const state = this;
        state.socket_data = [];

        socket.on('task_update', function (data) {
            try {
                let id = data.id;
                state.socket_data.push({key: id, value: data});
                console.log(data);
                m.redraw();
            } catch (e) {
                alert('There is a problem: ' + e);
            }
        });
    },
    view: function() {
        const state = this;

        return m("section",
            m("h1", "Events"),
            m("div.overview", [
                map(data => {
                    return m('div',
                        m('b', data['image-name']),
                        m('span', data['status'])
                    )
                }, state.socket_data)
            ])
        );
    }
};