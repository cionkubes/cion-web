import m from 'mithril';
import io from 'socket.io-client';
import {map, pipe} from 'scripts/helpers/fp';
import style from 'style/tasks';

export const component_name = "Tasks";
const socket = io();

const State = {
    list: {},
    error: "",
    fetch: function () {
        const data = State.list;
        m.request({
            url: "/api/v1/tasks",
            method: 'GET',
        }).then(function (response) {
            for (let task of response) {
                data[task.id] = task;
            }
        }).catch(function (e) {
            console.log(e);
        });
    }
};

export const Tasks = {
    oninit: function () {
        State.fetch();
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
        let data = State.list;
        return m("table", [
                m("thead", m("tr", [
                    m("th", ""),
                    m("th", "Status"),
                    m("th", "Image")
                ])),
                m("tbody", pipe(
                    Object.keys(data),
                    map(id => {
                        let imageName = data[id]["image-name"];
                        let status = data[id]["status"];

                        return m("tr." + status, [
                            m("td.task-icon"),
                            m("td", status),
                            m("td", m("span", imageName))
                        ])
                    }), Array.from)
                )
            ]
        );
    }
};
