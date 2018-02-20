import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {req_with_auth} from 'scripts/helpers/requests';
import {Table} from "./table/table";
import style from 'style/tasks';

export const component_name = "Tasks";

const data_map = {
    "new-image": ["image-name"],
    "service-update": ["swarm", "service", "image-name"]
};

export const Tasks = {
    view() {
        return m(Table, {
            resourceEndpoint: '/api/v1/tasks',
            pageStart: 0,
            pageLength: 20,
            headers: ["", 'Time', 'Type', 'Status', 'Data'],
            transformFunc(row) {
                let status = row["status"];
                let date = new Date(0);
                date.setUTCSeconds(row["time"]);
                let timeString = date.toLocaleString();

                let data = pipe(data_map[row["event"]],
                    map(key => row[key]),
                    Array.from
                ).join(", ");

                return ["", timeString, row["event"], status, data]
            },
            rowClassFunc: row => row['status']
        });
    },
    remove() {
        State.subscription.unsubscribe();
    }
};
