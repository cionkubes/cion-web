import m from "mithril";
import { ErrorSvg } from "component/graphic/error/error";
import { map, pipe } from "utils/fp";
import { changefeed } from "services/api/reactive";
import "rxjs-es/add/operator/debounceTime";
import style from "./events.use.scss";
import { req_with_auth } from "services/api/requests";
import { createNotification } from "../../notification/panel/panel";

export const component_name = "Events";

export const Events = {
    state: {
        socket_data: {}
    },
    oninit() {

        req_with_auth({
            url: "/api/v1/tasks/recent"  + "?" + m.buildQueryString({
                amount: 15
            }),
            method: "GET",
            then: function (response) {
                for (let row of response.rows) {
                    state.socket_data[row['id']] = row;
                }
            },
            catch: () =>
                createNotification("Unable to fetch tasks", "", "error")
        });

        const state = this.state;

        this.state.tasks_sub = changefeed("tasks")
            .debounceTime(500)
            .map(message => message["new_val"])
            .subscribe(data => {
                try {
                    let id = data.id;
                    state.socket_data[id] = data;
                    m.redraw();
                } catch (e) {
                    console.error("There is a problem: " + e);
                }
            });
    },
    view() {
        let data = this.state.socket_data;
        return m("div", [
            m("h3", "Events"),
            m("div.overview",
                pipe(
                    Object.keys(data).sort((key1, key2) => data[key2]['time'] - data[key1]['time']),
                    map(id => {
                        let imageName = data[id]["image-name"];
                        let status = data[id]["status"];
                        let icon;
                        if (status === "erroneous") {
                            icon = m("div.task-icon", m(ErrorSvg));
                        } else {
                            icon = m("div.task-icon");
                        }
                        return m("div.row.task-row." + status, [
                            icon,
                            m("span", imageName + " is " + status)
                        ]);
                    }),
                    Array.from
                )
            )]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        this.state.tasks_sub.unsubscribe();
        style.unref();
    }
};
