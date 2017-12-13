import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import { changefeed } from "../api/reactive";
import style from 'style/tasks';

export const component_name = "Tasks";

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
        let data = State.list;
        return m("table", [
                m("thead", m("tr", [
                    m("th", ""),
                    m("th", "Environment"),
                    m("th", "Status"),
                    m("th", "Image"),
                    m("th", "Time")
                ])),
                m("tbody", pipe(
                    Object.keys(data),
                    map(id => {
                        let imageName = data[id]["image-name"];
                        let status = data[id]["status"];
                        let epoch = data[id]["time"];
                        let timeString;
                        if(!epoch){
                            timeString = 'NA';
                        } else {
                            let date = new Date(0);
                            date.setUTCSeconds(epoch);
                            timeString = date.toLocaleString();
                        }

                        return m("tr." + status, [
                            m("td.task-icon"),
                            m("td", data[id]["environment"]),
                            m("td", status),
                            m("td", m("span", imageName)),
                            m("td", timeString)
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
