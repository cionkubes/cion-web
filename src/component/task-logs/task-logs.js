import m from "mithril";
import { filter, map, pipe } from "utils/fp";
import { Table } from "component/table/table";
import logsStyle from "./task-logs.use.scss";
import { TaskErrorSvg } from "../graphic/error/task_error";
import { TaskCompleteSvg } from "../graphic/complete/task_complete";
import { TaskReadySvg } from "../graphic/ready/task_ready";
import { TaskProcessingSvg } from "../graphic/processing/task_processing";

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

const statusSvgMap = {
    erroneous: TaskErrorSvg,
    done: TaskCompleteSvg,
    ready: TaskReadySvg,
    processing: TaskProcessingSvg
};

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
                "",
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
                    cols: [
                        status in statusSvgMap
                            ? m("div.entity-icon", m(statusSvgMap[status]))
                            : m("div.entity-icon"),
                        timeString,
                        row["event"],
                        status,
                        data
                    ],
                    route: "/#!/log/" + row["id"]
                };
            },
            rowClassFunc: row => "anchored"
        });
    },
    oncreate() {
        logsStyle.ref();
    },
    onremove() {
        logsStyle.unref();
    }
};
