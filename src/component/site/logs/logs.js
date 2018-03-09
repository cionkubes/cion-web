import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { map, pipe } from "utils/fp";
import { Table } from "component/table/table";
import logsStyle from "./logs.use.scss";

export const component_name = "Logs";

const data_map = {
    "new-image": ["image-name"],
    "service-update": ["swarm", "service", "image-name"],
    "system-error": ["stack-trace"]
};

export const Logs = site_wrapper({
    view: function () {
        return m("div.home", [
                m("h1", "Logs"),
                m("div.scroll",
                    m(Table, {
                        resourceEndpoint: "/api/v1/tasks",
                        pageStart: 0,
                        pageLength: 20,
                        pageLengthChoices: [1, 10, 20, 50, 100],
                        headers: [
                            ["time", true],
                            "event",
                            "status",
                            "data"
                        ],
                        transformFunc(row) {
                            let status = row["status"];
                            let date = new Date(0);
                            date.setUTCSeconds(row["time"]);
                            let timeString = date.toLocaleString();

                            let data = pipe(data_map[row["event"]],
                                map(key => row[key]),
                                Array.from
                            ).join(", ");

                            return [timeString, row["event"], status, data];
                        },
                        rowClassFunc: row => row["status"]
                    })
                )
            ]
        );
    },
    oncreate() {
        logsStyle.ref();
    },
    onremove() {
        logsStyle.unref();
    }
});
