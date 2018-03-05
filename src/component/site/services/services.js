import m from "mithril";
import { map, pipe } from "utils/fp";
import { site_wrapper } from "component/site/site-wrapper";
import { createNotification } from "component/notification/panel/panel";
import { ListRow } from "component/clickable-table-row/table-row";
import { req_with_auth } from "services/api/requests";

export const component_name = "ConfEditor";

const State = {
    servicesRows: [],
    fetch: function () {
        req_with_auth({
            url: "/api/v1/services",
            method: "GET",
            then: e =>
                (State.servicesRows = pipe(
                    e,
                    map(d =>
                        m(ListRow, {
                            route: "/service/" + d["name"],
                            cols: [
                                d["name"],
                                d["environments"].join(", ")
                            ]
                        })
                    ),
                    Array.from
                )),
            catch: e =>
                createNotification(
                    "An error occurred while fetching services",
                    e,
                    "error"
                )
        });
    }
};

export const ConfEditor = site_wrapper({
    oninit() {
        State.fetch();
    },
    view() {
        return m("div.home", [
            m("h1", [
                "Services",
                m(
                    "button",
                    {
                        style: "float: right;",
                        onclick: () => m.route.set("/services/create")
                    },
                    "Add"
                )
            ]),
            m("table", [
                m("tr", [m("th", "Service"), m("th", "Environments")]),
                State.servicesRows
            ])
        ]);
    }
});
