import m from "mithril";
import { map, pipe } from "scripts/helpers/fp";
import { req_with_auth } from "scripts/helpers/requests";
import { createNotification } from "../notifications/panel";
import { listRow } from "../clickable_tr/list_row";

const State = {
  list: [],
  fetch: function() {
    State.list = [];
    const data = State.list;
    req_with_auth({
      url: "/api/v1/users",
      method: "GET",
      then: function(response) {
        for (let user of response) {
          data.push(user);
        }
      },
      catch: e => createNotification("Error", e, "error")
    });
  }
};

export const UserList = {
  oninit() {
    State.fetch();
  },
  view() {
    return m("div", [
      m("h3", "Existing users"),
      m("table", [
        m(
          "thead",
          m("tr", [
            m("th", "Username"),
            m("th", "Created"),
            m("th", "Something")
          ])
        ),
        m(
          "tbody",
          pipe(
            State.list.sort((a, b) =>
              a["username"].localeCompare(b["username"])
            ),
            map(user => {
              let username = user["username"];
              let date = new Date(0);
              date.setUTCSeconds(user["time_created"]);
              let timeString = date.toLocaleString();

              return m(
                listRow("/user/" + username, [
                  username,
                  timeString,
                  "Something"
                ])
              );
            }),
            Array.from
          )
        )
      ])
    ]);
  }
};
