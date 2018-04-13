import m from "mithril";
import { map, pipe, filter } from "utils/fp";
import { createNotification } from "component/notification/panel/panel";
import { site_wrapper } from "component/site/site-wrapper";
import { req_with_auth } from "services/api/requests";

const State = {
    swarms: {},
    swarmsAdded: {},
    swarmCheckBoxes: [],
    serviceName: "",
    imageName: "",
    checkHandle(cb) {
        cb = cb.srcElement;
        State.swarmsAdded[cb.id] = cb.checked;
    },
    setServiceName(v) {
        State.serviceName = v;
    },
    setImageName(v) {
        State.imageName = v;
    },
    fetch: function () {
        req_with_auth({
            url: "/api/v1/document/swarms",
            method: "GET",
            then: function (response) {
                State.swarmCheckBoxes = pipe(
                    Object.keys(response.document),
                    map(d =>
                        m("div", [
                            m("input", {
                                type: "checkbox",
                                onchange: State.checkHandle,
                                id: d
                            }),
                            m("label.label-inline", {for: d}, d)
                        ])
                    ),
                    Array.from
                );
                State.swarms = response;
            },
            catch: () =>
                createNotification(
                    "Unable to fetch environments",
                    "Check your connection to the server.",
                    "error"
                )
        });
    },
    submit: function () {
        let envs = pipe(
            Object.keys(State.swarmsAdded),
            filter(d => State.swarmsAdded[d]),
            Array.from
        );

        req_with_auth({
            url: "/api/v1/services/create",
            method: "POST",
            data: {
                environments: envs,
                "service-name": State.serviceName,
                "image-name": State.imageName
            },
            then: e =>
                createNotification(
                    "Service '" + State.serviceName + "' created",
                    e,
                    "success"
                ),
            catch: e => createNotification("Unable to create service", e, "error")
        });
    }
};

export const ServiceCreateForm = {
    oninit() {
        State.fetch();
    },
    view() {
        return m("div", [
            m("label[for=servicename]", "Service name"),
            m("input#servicename[type=text]", {
                oninput: m.withAttr("value", State.setServiceName)
            }),
            m("label[for=swarmchecks]", "Environments"),
            m("div#swarmchecks", State.swarmCheckBoxes),
            m("label[for=imageName]", "Image-name"),
            m("input#imagename[type=text]", {
                oninput: m.withAttr("value", State.setImageName)
            }),
            m("button", {onclick: State.submit}, "Create service")
        ]);
    }
};
