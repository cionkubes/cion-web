import m from 'mithril';
import {map, pipe, filter} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";

export const component_name = "ServiceCreate";

const State = {
    swarms: {},
    swarmsAdded: {},
    swarmCheckBoxes: [],
    serviceName: "",
    imageName: "",
    checkHandle(cb) {
        cb = cb.srcElement;
        State.swarmsAdded[cb.id] = cb.checked;
        console.log(State.swarmsAdded);
    },
    setServiceName(v) {
        State.serviceName = v;
    },
    setImageName(v) {
        State.imageName = v;
    },
    fetch: function () {
        m.request({
            url: "/api/v1/document/swarms",
            method: 'GET',
        }).then(function (response) {
            State.swarmCheckBoxes =
                pipe(
                    Object.keys(response.document),
                    map(d => m('div', [
                            m('input', {type: 'checkbox', onchange: State.checkHandle, id: d}),
                            m('label.label-inline', {for: d}, d)
                        ]
                    )),
                    Array.from
                );
            State.swarms = response;
        }).catch(function (e) {
            console.log(e);
        });
    },
    submit: function () {
        console.log(State.swarmsAdded);
        let envs = pipe(
            Object.keys(State.swarmsAdded),
            filter(d => State.swarmsAdded[d]),
            Array.from
        );
        console.log(envs);
        m.request({
            url: "/api/v1/services/create",
            method: 'POST',
            data: {
                environments: envs,
                'service-name': State.serviceName,
                'image-name': State.imageName
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (e) {
            console.log(e);
        });
    }

};

export const ServiceCreate = site_wrapper({
    oninit() {
        State.fetch();
    },
    view(vnode) {
        return m("div.home", [
                m("h1", "Create service"),
                m('label[for=servicename]', "Service name"),
                m('input#servicename[type=text]', {oninput: m.withAttr("value", State.setServiceName)}),
                m('label[for=swarmchecks]', "Environments"),
                m('div#swarmchecks', State.swarmCheckBoxes),
                m('label[for=imageName]', "Image-name"),
                m('input#imagename[type=text]', {oninput: m.withAttr("value", State.setImageName)}),
                m('button', {onclick: State.submit}, "Create service")
            ]
        );
    }
});