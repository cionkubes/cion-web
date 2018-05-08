import m from "mithril";
import { req_with_auth } from "../../../services/api/requests";
import { createNotification } from "../../notification/panel/panel";
import { TooltipBox } from "../../tooltip/tooltip-box";


const K8sForm = {
    view(vnode) {
        let state = vnode.attrs.state;
        return m("Label", ["Connection details",
            m("div", { style: "margin-left: 2rem;" }, [
                m("label", { title: "Kubernetes REST API endpoint" }, [
                    "URL", m("input[type=text]", {
                        placeholder: "E.g. https://192.168.39.71:8443",
                        onchange: m.withAttr("value", val => state.form.tls.url = val, this)
                    })
                ]),
                m("label", { title: "CA pem-file for TLS authentication" }, [
                    "CA", m("input[type=text]", {
                        placeholder: "E.g. /run/secrets/kube.ca.pem",
                        onchange: m.withAttr("value", val => state.form.tls.ca = val, this)
                    })
                ]),
                m("label", { title: "File-path to base64-encoded service account token" }, [
                    "Token", m("input[type=text]", {
                        placeholder: "E.g. /run/secrets/kube.token",
                        onchange: m.withAttr("value", val => state.form.tls.cert = val, this)
                    })
                ])
            ])
        ]);
    }
};


const DockerTLSForm = {
    view(vnode) {
        let state = vnode.attrs.state;
        return m("Label", ["Connection details",
            m("div", { style: "margin-left: 2rem;" }, [
                m("label", [
                    "URL", m("input[type=text]", {
                        placeholder: "E.g. tcp://10.68.4.60:2376",
                        onchange: m.withAttr("value", val => state.form.tls.url = val, this)
                    })
                ]),
                m("label", [
                    "CA", m("input[type=text]", {
                        placeholder: "E.g. /run/secrets/ca.pem",
                        onchange: m.withAttr("value", val => state.form.tls.ca = val, this)
                    })
                ]),
                m("label", [
                    "Cert", m(TooltipBox, { lines: [] }), m("input[type=text]", {
                        placeholder: "E.g. /run/secrets/qa.cert.pem",
                        onchange: m.withAttr("value", val => state.form.tls.cert = val, this)
                    })
                ]),
                m("label", [
                    "Key", m("input[type=text]", {
                        placeholder: "E.g. /run/secrets/qa.key.pem",
                        onchange: m.withAttr("value", val => state.form.tls.key = val, this)
                    })
                ])
            ])
        ]);
    }
};


export const NewEnvironmentForm = {
    setModeSelected(value) {
        this.form.mode = value;
        if (value === "tls") {
            this.form.tls = {};
        } else {
            delete this.form["tls"];
        }
    },

    send(e) {
        console.log(e);
        e.preventDefault();
        console.log("send activated", this.form.mode);
        console.log(this);
        req_with_auth({
            url: "/api/v1/environment/create",
            method: "POST",
            data: this.form,
            then: () => createNotification("Environment added", "", "success"),
            catch: () => createNotification("Error adding environment", "", "error"),
            this: this
        })
    },

    oninit() {
        this.form = { mode: "tls", tls: {} };
        this.formLookup = {
            "tls": DockerTLSForm,
            "k8s_serviceaccount": K8sForm
        }
    },

    view() {
        return m("form", { onsubmit: this.send.bind(this) }, [
            m("label", [
                "Name", m("input[type=text]", {
                    placeholder: "Name of the environment",
                    onchange: m.withAttr("value", val => this.form.name = val, this)
                })
            ]),
            m("label", [
                "Tag-match", m("input[type=text]", {
                    placeholder: "E.g. \\d+\\.\\d+\\.\\d+-rc.*",
                    onchange: m.withAttr("value", val => this.form["tag-match"] = val, this)
                })
            ]),
            m("label", [
                "Connection mode", m("select", {
                    onchange: m.withAttr("value", val => this.setModeSelected(val), this)
                }, [
                    m("option[value=tls]", "Docker TLS"),
                    m("option[value=from_env]", "Docker socket"),
                    m("option[value=k8s_serviceaccount]", "Kubernetes service account")
                ])
            ]),
            this.form.mode in this.formLookup
                ? m(this.formLookup[this.form.mode], { state: this })
                : null,
            m("input[type=submit]")
        ]);
    }
};
