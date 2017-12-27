import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";
import {createNotification} from "../notifications/panel";
import {listRow} from "./list_row";

export const component_name = "ConfEditor";


const State = {
    servicesRows: [],
    fetch: function () {
        m.request({
            url: "/api/v1/services",
            method: 'GET',
        }).then(function (response) {
            State.servicesRows =
                pipe(response,
                    map(d => m(listRow(d['name'], d['environments']))),
                    Array.from);
        }).catch(function (e) {
            console.error(e);
            createNotification('An error occurred while fetching services', e.message, 'error')
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
                    m("button", {style: "float: right;", onclick: () => m.route.set('/services/create')}, "Add")
                ]),
                m('table', [
                    m('tr', [
                        m('th', 'Service'),
                        m('th', 'Environments')
                    ]),
                    State.servicesRows
                ])
            ]
        );
    }
});
