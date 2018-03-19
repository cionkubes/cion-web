import m from "mithril";
import { ErrorSvg } from "component/graphic/error/error";
import { Checkmark } from "component/graphic/checkmark/checkmark";
import { map, pipe } from "utils/fp";
import { changefeed } from "services/api/reactive";
import "rxjs-es/add/operator/debounceTime";
import style from "./events.use.scss";
import { req_with_auth } from "services/api/requests";
import { createNotification } from "../../notification/panel/panel";

export const component_name = "Events";

function taskSort(data, key1, key2) {
    let status1 = data[key1].status;
    let status2 = data[key2].status;
    let time1 = data[key1].time;
    let time2 = data[key2].time;

    if(status1 === "processing" && status2 === "processing") {
        return time2 - time1;
    } else if(status1 === "processing") {
        return -1;
    } else if(status2 === "processing") {
        return 1;
    }

    return time2 - time1;
}

const statusSvgMap = {
    erroneous: ErrorSvg,
    done:Checkmark
};

export const Events = {
    state: {
        socket_data: {}
    },
    oninit() {

        req_with_auth({
            url: "/api/v1/tasks/recent" + "?" + m.buildQueryString({
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
                    Object.keys(data).sort((key1, key2) => taskSort(data, key1, key2)),
                    map(id => {
                        console.log(data[id]);
                        let imageName = data[id]["image-name"];
                        let status = data[id]["status"];
                        return m("blockquote.event." + status, [
                            status in statusSvgMap
                                ? m("div.task-icon", m(statusSvgMap[status]))
                                : m("div.task-icon"),
                            data[id].environment
                                ? m("span", imageName + " -> " + data[id]["environment"])
                                : m("span", imageName),
                            m("span.event-type", data[id]["event"])
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
