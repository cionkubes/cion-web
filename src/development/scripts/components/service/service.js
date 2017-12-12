import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";

export const component_name = "Service";


const State = {
    service_name: '',
    data: {},
    comps: {},
    fetch: function () {
        m.request({
            url: "/api/v1/service/" + State.service_name,
            method: 'GET',
        }).then(function (response) {
            State.data = response;
            State.parse();
        }).catch(function (e) {
            console.log(e);
        });
    },
    parse: function() {
        let rows = [];
        console.log(State.data);
        let data = State.data;
        let envs = data.environments;
        for(let key in envs) {
            let row = m('tr', [
                m('td', key),
                m('td', envs[key])
            ]);
            rows.push(row);
        }
        State.comps.environments = rows;
    }
};

export const Service = site_wrapper({
    oninit() {
        State.service_name = m.route.param('service');
        State.fetch();
    },
    view(vnode) {
        return m("div.home", [
                m("h1", State.service_name),
                m('table', [
                    m('tr', [
                        m('th', 'Environment'),
                        m('th', 'Last deployed image')
                    ]),
                    State.comps.environments
                ]),
                m('p', State.service_name)
            ]
        );
    }
});
