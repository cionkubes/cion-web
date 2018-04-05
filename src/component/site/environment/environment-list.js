import m from "mithril";
import { map, pipe } from "utils/fp";
import { Table } from "component/table/table";

export const EnvironmentList = {
    view: function (vnode) {
        return m(Table, {
            resourceEndpoint: "/api/v1/environments",
            pageStart: 0,
            pageLength: vnode.attrs.pageLength,
            pageLengthChoices: [10, 20, 50, 100],
            compName: "environment-list",
            headers: [
                "Name",
                "Mode",
                "Tag match",
                "Data"
            ],
            transformFunc(row) {
                let name = Object.keys(row)[0];

                row = row[name];

                let mode = row["mode"];
                let tagMatch = row["tag-match"];
                let data = "";
                if (mode === "tls") {
                    data = pipe(
                        Object.keys(row["tls"]),
                        map(key => key + ": " + row[key]),
                        Array.from
                    ).join(", ");
                }

                return {
                    cols: [name, mode , tagMatch, data],
                    route: "/#!/log/" + row["id"]
                };
            },
            rowClassFunc: row => ""
        });
    }
};
