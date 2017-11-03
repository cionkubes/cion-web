import m from 'mithril';
import io from 'socket.io-client';
import {ErrorSvg} from 'scripts/components/svg/errorsvg'
import {map, pipe} from 'scripts/helpers/fp';
import style from 'style/events';

export const component_name = "Events";
const socket = io();

export const Events = {
    state: {
        socket_data: {}
    },
    oninit: function () {
        const data = this.state.socket_data;
        socket.on("task_update", function (socket_data) {
            try {
                let id = socket_data.id;
                data[id] = socket_data;
                m.redraw();
            } catch (e) {
                console.error('There is a problem: ' + e);
            }
        });
    },
    view: function () {
        let data = this.state.socket_data;
        return m("div.overview",
            pipe(
                Object.keys(data),
                map(id => {
                    let imageName = data[id]["image-name"];
                    let status = data[id]["status"];
                    let icon;
                    if (status === 'erroneous') {
                        icon = m("div.task-icon", m(ErrorSvg));
                    } else {
                        icon = m("div.task-icon")
                    }
                    return m("div.row.task-row." + status, [
                        icon,
                        m("span", imageName + " is " + status)
                    ])
                }), Array.from
            ));
    }
};
