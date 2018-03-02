import m from "mithril";
import { ErrorSvg } from "../../../../components/graphics/error/error";
import { map, pipe } from "../../helpers/fp";
import { changefeed } from "../../api/reactive";
import "rxjs-es/add/operator/debounceTime";
import style from "./events.use";

export const component_name = "Events";

export const Events = {
    state: {
        socket_data: {}
    },
    oninit() {
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
        return m(
            "div.overview",
            pipe(
                Object.keys(data),
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
        );
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        this.state.tasks_sub.unsubscribe();
        style.unref();
    }
};
