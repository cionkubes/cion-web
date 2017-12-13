import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";

export const component_name = "Service";


const State = {
    service_name: '',
    data: {},
    comps: m(''),
    fetch: function () {
        m.request({
            url: "/api/v1/service/" + State.service_name,
            method: 'GET',
        }).then(function (response) {
            State.data = response;
            State.parse(response);
        }).catch(function (e) {
            State.comps = m('p', e.message)
        });
    },
    parse: function (data) {
        let envs = data['environments'];
        console.log(envs);
        let rows = [
            m('tr', [
                m('th', 'Environment'),
                m('th', 'Last deployed image'),
                m('th', 'Deployed at')
            ]),
            pipe(Object.keys(envs),
                map(k => {
                        let epoch = envs[k]['time'];
                        let timeString;
                        if(!epoch){
                            timeString = 'NA';
                        } else {
                            let date = new Date(0);
                            date.setUTCSeconds(epoch);
                            timeString = date.toLocaleString();
                        }

                        return m('tr', [
                            m('td', k),
                            m('td', envs[k]['image-name']),
                            m('td', timeString)
                        ])
                    }
                ), Array.from)
        ];
        State.comps = m('table', rows);
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
                State.comps
            ]
        );
    }
});
