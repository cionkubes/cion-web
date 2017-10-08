import m from 'mithril';
import io from 'socket.io-client';
import {map, pipe} from 'scripts/helpers/fp';
import style from 'style/events';

export const component_name = "Tasks";
const socket = io();

export const Tasks = {
    state: {
        socket_data: {}
    },
    oninit: function () {
        const data = this.state.socket_data;
        m.request({
            url: "/api/v1/tasks",
            method: 'GET',

            extract: function (xhr) {
                return {status: xhr.status, body: xhr.responseText}
            }
        }).then(function (response) {
            let status = response.status;
            if (status === 200) {
                let bod = response.body;
                bod.forEach(entry => {
                    data[entry.id] = entry;
                });
            } else {

            }
        });

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
                    return m("div.row.task-status-row",
                        m("div", [
                            m("div.task-processing-loader"),
                            m("span", imageName + " is " + status)
                        ]))
                }), Array.from
            ));
    }
};
