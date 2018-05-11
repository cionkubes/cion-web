import m from "mithril";
import { map, pipe } from "utils/fp";
import { site_wrapper } from "component/site/site-wrapper";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";
import service_style from "./service-edit.use.scss";
import { TaskLogs } from "../../../task-logs/task-logs";
import { MLContainer } from "../../../masonry/ml-container";
import { MLPanel } from "../../../masonry/ml-panel";

export const component_name = "Service";

export const Service = site_wrapper({
    oninit() {
        this.service_name = m.route.param("service");

        this.selectedImage = "";
        this.selectedEnv = "";
        this.data = {
            environments: {},
            "images-deployed": []
        };

        this.fetch();
    },

    editService(vnode) {
        m.route.set("/service/" + vnode.state.service_name + "/edit/");
    },

    deleteService(vnode) {
        let sname = vnode.state.service_name;
        req_with_auth({
            url: "/api/v1/service/" + sname,
            method: "DELETE",
            then: () =>
                createNotification("Service " + sname + " was deleted", "", "success"),
            catch: e =>
                createNotification(
                    "An error occurred while deleting service",
                    e,
                    "error"
                )
        });
        m.route.set("/services");
    },

    setSelImage(img, vnode) {
        vnode.state.selectedImage = img;
    },

    setSelEnv(env, vnode) {
        vnode.state.selectedEnv = env;
    },

    canDeploy() {
        return this.selectedImage !== "" && this.selectedEnv !== "";
    },

    sendDeploy(vnode) {
        let state = vnode.state;
        req_with_auth({
            method: "POST",
            url: "/api/v1/create/entity",
            data: {
                environment: state.selectedEnv,
                "image-name": state.selectedImage,
                "service-name": state.service_name
            },
            then: function () {
                createNotification(
                    "Task created",
                    "Update service entity created successfully",
                    "success"
                );
            },
            catch: function (e) {
                console.error(e);
            }
        });
    },

    fetch() {
        let state = this;
        console.log(this);
        req_with_auth({
            url: "/api/v1/service/" + state.service_name,
            method: "GET",
            then: response => (state.data = response),
            catch: function () {
                m.route.set("/services");
                createNotification(
                    "An error occurred while fetching the service",
                    "Please confirm that the service exists and that you are connected to the server",
                    "error"
                );
            },
            this: this
        });
    },

    view(vnode) {
        return m("div.home", [
            m("h1", [
                vnode.state.service_name,
                m("button.red", {
                        style: "float: right;",
                        onclick: () => this.deleteService(vnode)
                    },
                    "Delete"
                )
            ]),
            m(MLContainer, [
                m(MLPanel, { comp_title: "Deployed images" },
                    m("table", [
                        m("tr", [
                            m("th", "Environment"),
                            m("th", "Last deployed image"),
                            m("th", "Deployed at")
                        ]),
                        pipe(
                            Object.keys(vnode.state.data.environments),
                            map(k => {
                                let epoch = vnode.state.data.environments[k]["time"];
                                let timeString;
                                if (!epoch) {
                                    timeString = "NA";
                                } else {
                                    let date = new Date(0);
                                    date.setUTCSeconds(epoch);
                                    timeString = date.toLocaleString();
                                }

                                return m("tr", [
                                    m("td", k),
                                    m("td", vnode.state.data.environments[k]["image-name"]),
                                    m("td", timeString)
                                ]);
                            }),
                            Array.from
                        )
                    ])
                ),
                m(MLPanel, { comp_title: "Deploy" }, [
                    m("div.deploy_grid", [
                        m("input[type=text]", {
                            placeholder: "Image",
                            oninput: m.withAttr("value", val => this.setSelImage(val, vnode)),
                            list: "image-list"
                        }),
                        m("datalist[id=image-list]", pipe(
                            vnode.state.data["images-deployed"],
                            map(img => m("option", { value: img }, img)),
                            Array.from
                        )),
                        m("select.deploy_select", {
                            onchange: m.withAttr("value", val => this.setSelEnv(val, vnode))
                        }, [
                            m("option", {
                                value: "",
                                disabled: "disabled",
                                selected: "selected"
                            }, "Environment"),
                            pipe(
                                Object.keys(vnode.state.data.environments),
                                map(k => m("option", { value: k }, k)),
                                Array.from
                            )
                        ]),
                        m("button", {
                                disabled: !vnode.state.canDeploy(),
                                onclick: () => vnode.state.sendDeploy(vnode)
                            }, "Deploy"
                        )
                    ])
                ])
            ]),
            m("div", [
                m("h3", "Service update history"),
                m(TaskLogs, {
                    compName: "service-logs-" + this.service_name,
                    term: "service-name:\"^" + this.service_name + "$\"",
                    overrides: ["term", "pageLength"],
                    pageLength: 10
                })
            ])
        ]);
    },
    oncreate() {
        service_style.ref();
    },
    onremove() {
        service_style.unref();
    }
});
