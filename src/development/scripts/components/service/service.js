import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";

export const component_name = "Service";


// const State = {
//     data: {},
//     fetch: function () {
//         m.request({
//             url: "/api/v1/document/images",
//             method: 'GET',
//         }).then(function (response) {
//             State.servicesRows = response
//         }).catch(function (e) {
//             console.log(e);
//         });
//     }
// };

export const Service = site_wrapper({
    // oninit() {
    //     State.fetch();
    // },
    view(vnode) {
        return m("div.home", [
                m("h1", m.route.param('service')),
                m('p', m.route.param('service'))
            ]
        );
    }
});
