import m from "mithril";
import { map, pipe } from "utils/fp";
import { site_wrapper } from "component/site/site-wrapper";
import { createNotification } from "component/notification/panel/panel";
import { ListRow } from "component/clickable-table-row/table-row";
import { req_with_auth } from "services/api/requests";

export const component_name = "Services";

export const Services = site_wrapper({
    oninit() {
        this.services = [];
        req_with_auth({
            url: "/api/v1/services",
            method: "GET",
            then: response => this.services = response,
            catch: response => createNotification(
                "An error occurred while fetching list", response, "error"
            ),
            this: this
        });
    },
    view() {
        return m("div.home", [
            m("h1", [
                "Services",
                m(
                    "button", {
                        style: "float: right;",
                        onclick: () => m.route.set("/services/create")
                    }, "Create"
                )
            ]),
            m("table", [
                m("tr", [m("th", "Service"), m("th", "Environments")]),
                pipe(this.services,
                    map(service =>
                        m(ListRow, {
                            route: "/service/" + service["name"],
                            cols: [
                                service["name"],
                                service["environments"].join(", ")
                            ]
                        })
                    ),
                    Array.from)
            ])
        ]);
    }
});
