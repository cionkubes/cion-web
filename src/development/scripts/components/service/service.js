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
            State.parse(response);
        }).catch(function (e) {
            console.log(e);
        });
    },
    parse: function (data) {
        let envs = data.environments;
        State.comps.environments =
            pipe(Object.keys(envs),
                map(k => m('tr', [
                        m('td', k),
                        m('td', envs[k])
                    ])
                ),
                Array.from);
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
                ])
            ]
        );
    }
});
