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
            sortIndex: "name",
            headers: [
                "Name",
                "Mode",
                "Tag match",
                "Data"
            ],
            transformFunc(row) {
                let name = row["name"];
                let mode = row["mode"];
                let tagMatch = row["tag-match"];
                let data = "NA";
                if (mode !== "from_env") {
                    data = pipe(
                        Object.keys(row["tls"]),
                        map(key => key + ": " + row["tls"][key]),
                        Array.from
                    ).join(", ");
                }

                return {
                    cols: [name, mode , tagMatch, data]
                };
            },
            rowClassFunc: row => ""
        });
    }
};
