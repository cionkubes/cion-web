import m from "mithril";
import { map, pipe } from "utils/fp";
import { Table } from "component/table/table";

const DictToString = (name, dict) => {
    let vals = pipe(
        Object.keys(dict.hasOwnProperty("headers") ? dict["headers"] : []),
        map(key => key + ": " + dict[key]),
        Array.from
    );
    return vals.length !== 0 ? vals : "NA";
};

export const WebhookList = {
    view: function () {
        return m(Table, {
            resourceEndpoint: "/api/v1/webhooks",
            compName: "webhook-list",
            sortIndex: "id",
            headers: [
                "Event",
                "URL",
                "Headers",
                "Triggers"
            ],
            transformFunc(row) {
                let event = row["event"];
                let url = row["url"];
                let headers = DictToString("Headers", row["headers"]);
                let triggers = DictToString("On-matches", row["on"]);

                return {
                    cols: [event, url, headers, triggers]
                };
            },
            rowClassFunc: row => ""
        });
    }
};
