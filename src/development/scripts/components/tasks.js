import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {changefeed} from "../api/reactive";
import {req_with_auth} from 'scripts/helpers/requests';
import style from 'style/tasks';

export const component_name = "Tasks";

const data_map = {
    "new-image": ["image"],
    "service-update": ["swarm", "service", "image"]
};

const State = {
    list: {},
    error: "",
    fetch: function () {
        const data = State.list;
        req_with_auth({
            url: "/api/v1/tasks",
            method: 'GET',
            then: function (response) {
                for (let task of response) {
                    data[task.id] = task;
                }
            },
            catch: (e) => console.log(e)
        });
    }
};

export const Tasks = {
    oninit() {
        State.fetch();
        State.subscription = changefeed('tasks')
            .map(message => message['new_val'])
            .subscribe(data => {
                try {
                    let id = data.id;
                    State.list[id] = data;
                    m.redraw();
                } catch (e) {
                    console.error('There is a problem: ' + e);
                }
            });
    },
    view() {
        return m("table", [
                m("thead", m("tr", [
                    m("th", ""),
                    m("th", "Time"),
                    m("th", "Type"),
                    m("th", "Status"),
                    m("th", "Data")
                ])),
                m("tbody", pipe(
                    Object.keys(State.list).sort((fir, sec) => State.list[sec]['time'] - State.list[fir]['time']),
                    map(id => {
                        let status = State.list[id]["status"];
                        let date = new Date(0);
                        date.setUTCSeconds(State.list[id]["time"]);
                        let timeString = date.toLocaleString();

                        let data = pipe(data_map[State.list[id]["event"]],
                            map(key => State.list[id][key]),
                            Array.from
                        ).join(", ");

                        return m("tr." + status, [
                            m("td.task-icon"),
                            m("td", timeString),
                            m("td", State.list[id]["event"]),
                            m("td", status),
                            m("td", data)
                        ])
                    }), Array.from)
                )
            ]
        );
    },
    remove() {
        State.subscription.unsubscribe();
    }
};
