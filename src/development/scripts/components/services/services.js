import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";
import {listRow} from "./list_row";

export const component_name = "ConfEditor";


const State = {
    servicesRows: [],
    fetch: function () {
        m.request({
            url: "/api/v1/document/images",
            method: 'GET',
        }).then(function (response) {
            State.servicesRows =
                pipe(Object.keys(response.document),
                    map(d => m(listRow(d, response.document[d]['environments']))),
                    Array.from);
        }).catch(function (e) {
            console.log(e);
        });
    }
};

export const ConfEditor = site_wrapper({
    oninit() {
        State.fetch();
    },
    view(vnode) {
        return m("div.home", [
                m("h1", "Services"),
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
