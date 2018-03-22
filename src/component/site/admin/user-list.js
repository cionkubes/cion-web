import m from "mithril";
import { map, pipe } from "utils/fp";
import { req_with_auth } from "services/api/requests";
import { createNotification } from "component/notification/panel/panel";
import { ListRow } from "component/clickable-table-row/table-row";
import { rdbEpochToDate } from "../../../utils/dates";

export const UserList = {
    oninit() {
        this.user_list = [];
        req_with_auth({
            url: "/api/v1/users",
            method: "GET",
            then: function (response) {
                for (let user of response) {
                    this.user_list.push(user);
                }
            },
            catch: e => createNotification("Error", e, "error"),
            this: this
        });


    },
    view(vnode) {
        return m("div", [
            m("table", [
                m(
                    "thead",
                    m("tr", [
                        m("th", "Username"),
                        m("th", "Created")
                    ])
                ),
                m(
                    "tbody",
                    pipe(
                        vnode.state.user_list.sort((a, b) =>
                            a["username"].localeCompare(b["username"])
                        ),
                        map(user => {
                            let username = user["username"];
                            let timeString = rdbEpochToDate(user["time_created"]).toLocaleString();

                            return m(ListRow, {
                                route: "/user/" + username,
                                cols: [
                                    username,
                                    timeString
                                ]
                            });
                        }),
                        Array.from
                    )
                )
            ])
        ]);
    }
};
