import m from "mithril";
import { filter, map, pipe } from "utils/fp";
import { Table } from "component/table/table";
import logsStyle from "./task-logs.use.scss";

const data_map = {
    "new-image": ["image-name"],
    "service-update": ["environment", "service-name", "image-name"],
    "system-error": ["stack-trace"]
};

const excluded = ["event", "id", "status", "time"];

function get_data_fields(row) {
    const defined = data_map[row.event];

    if (defined === undefined) {
        return filter(key => !excluded.includes(key), Object.keys(row));
    }

    return defined;
}

export const TaskLogs = {
    view: function (vnode) {
        return m(Table, {
                resourceEndpoint: "/api/v1/tasks",
                pageStart: 0,
                pageLength: vnode.attrs.pageLength,
                pageLengthChoices: [1, 10, 20, 50, 100],
                compName: vnode.attrs.compName,
                term: vnode.attrs.term,
                overrides: vnode.attrs.overrides,
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

                    let data = pipe(get_data_fields(row),
                        map(key => row[key]),
                        Array.from
                    ).join(", ");

                    return {
                        cols: [timeString, row["event"], status, data],
                        route: "/#!/log/" + row["id"]
                    };
                },
                rowClassFunc: row => row["status"] + " anchored"
            });
    },
    oncreate() {
        logsStyle.ref();
    },
    onremove() {
        logsStyle.unref();
    }
};
