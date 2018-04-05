import m from "mithril";
import { map, pipe } from "utils/fp";
import { createNotification } from "component/notification/panel/panel";
import { ListRow } from "component/clickable-table-row/table-row";
import { req_with_auth } from "services/api/requests";


export const ServiceList = {
    oninit() {
        this.services = [];
        req_with_auth({
            url: "/api/v1/services",
            method: "GET",
            then: response => this.services = response,
            catch: e => createNotification(
                "Error occurred while fetching services",
                "Check your connection to the database",
                "error"),
            this: this
        });
    },
    view() {
        return m("table", [
            m("tr", [
                m("th", "Service"),
                m("th", "Environments"),
                m("th", "Image name")
            ]),
            pipe(this.services,
                map(service =>
                    m(ListRow, {
                        route: "/service/" + service["name"],
                        cols: [
                            service["name"],
                            service["environments"].join(", "),
                            service["image-name"]
                        ]
                    })
                ),
                Array.from)
        ]);
    }
};
