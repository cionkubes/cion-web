import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";
import style from './service.scss';

export const component_name = "Service";


class State {

    constructor(vnode) {
        this.selectedImage = '';
        this.selectedEnv = '';
        this.service_name = '';
        this.data = {
            environments: {},
            'images-deployed': []
        };
    }

    canDeploy() {
        return this.selectedImage !== '' && this.selectedEnv !== '';
    };

    static setSelImage(img, vnode) { // this is too hacky, but until I find a better way it has to be this way
        vnode.state.selectedImage = img;
    };

    static setSelEnv(env, vnode) {
        console.log(vnode);
        vnode.state.selectedEnv = env;
    };

    fetch() {
        let state = this;
        m.request({
            url: "/api/v1/service/" + this.service_name,
            method: 'GET',
        }).then(function (response) {
            state.data = response;
        }).catch(function (e) {
            console.log(e.message)
        });
    };

    sendDeploy(vnode) {
        let state = vnode.state;
        m.request({
            method: "POST",
            url: "/api/v1/create/deploy",
            data: {
                environment: state.selectedEnv,
                image: state.selectedImage
            }
        }).then(function (result) {
            console.log(result)
            // reset select fields
            // create successful notification
        }).catch(function (e) {
            console.log(e.message);
        });
    }
}

export const Service = site_wrapper({
    oninit(vnode) {
        let state = new State();
        state.service_name = m.route.param('service');
        state.fetch();
        vnode.state = state;
    },
    view(vnode) {
        return m("div.home", [
                m("h1", vnode.state.service_name),
                m('div', [
                    m('table', [
                        m('tr', [
                            m('th', 'Environment'),
                            m('th', 'Last deployed image'),
                            m('th', 'Deployed at')
                        ]),
                        pipe(Object.keys(vnode.state.data.environments),
                            map(k => {
                                    let epoch = vnode.state.data.environments[k]['time'];
                                    let timeString;
                                    if (!epoch) {
                                        timeString = 'NA';
                                    } else {
                                        let date = new Date(0);
                                        date.setUTCSeconds(epoch);
                                        timeString = date.toLocaleString();
                                    }

                                    return m('tr', [
                                        m('td', k),
                                        m('td', vnode.state.data.environments[k]['image-name']),
                                        m('td', timeString)
                                    ])
                                }
                            ), Array.from)
                    ]),
                    m('div', [
                        m('h3', 'Deploy'),
                        m('div.deploy_grid', [
                            m('select.deploy_select', {
                                onchange: m.withAttr("value", (val) => State.setSelImage(val, vnode))
                            }, [
                                m('option', {value: ''}, 'Image'),
                                pipe(vnode.state.data['images-deployed'],
                                    map(img => m('option', {value: img}, img)), Array.from)
                            ]),
                            m('select.deploy_select', {
                                onchange: m.withAttr("value", (val) => State.setSelEnv(val, vnode))
                            }, [
                                m('option', {value: ''}, 'Environment'),
                                pipe(Object.keys(vnode.state.data.environments),
                                    map(k => m('option', {value: k}, k)), Array.from)
                            ]),
                            m('button', {
                                disabled: !vnode.state.canDeploy(),
                                onclick: () => vnode.state.sendDeploy(vnode)
                            }, 'Deploy')
                        ])
                    ])
                ])
            ]
        );
    }
});
