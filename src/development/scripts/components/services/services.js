import m from "mithril";
import { map, pipe } from "scripts/helpers/fp";
import { site_wrapper } from "scripts/site";
import { createNotification } from "../notifications/panel";
import { listRow } from "../clickable_tr/list_row";
import { req_with_auth } from "scripts/helpers/requests";

export const component_name = "ConfEditor";

const State = {
  servicesRows: [],
  fetch: function() {
    req_with_auth({
      url: "/api/v1/services",
      method: "GET",
      then: e =>
        (State.servicesRows = pipe(
          e,
          map(d =>
            m(
              listRow("/service/" + d["name"], [
                d["name"],
                d["environments"].join(", ")
              ])
            )
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
  view(vnode) {
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
