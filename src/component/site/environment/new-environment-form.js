import m from "mithril";
import { req_with_auth } from "../../../services/api/requests";
import { createNotification } from "../../notification/panel/panel";
import { TooltipBox } from "../../tooltip/tooltip-box";

export const NewEnvironmentForm = {
    setEnvSelected(value) {
        this.form.env = value;
        if (value === "tls") {
            this.form.tls = {};
        } else {
            delete this.form["tls"];
        }
    },

    send(e) {
        console.log(e);
        e.preventDefault();
        console.log("send activated", this.form.env);
        console.log(this);
        req_with_auth({
            url: "/api/v1/environment/create",
            then: () => createNotification("Environment added", "", "success"),
            catch: () => createNotification("Error adding environment", "", "error"),
            this: this
        })
    },

    oninit() {
        this.form = { env: "tls", tls: {} };
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
                    onchange: m.withAttr("value", val => this.setEnvSelected(val), this)
                }, [
                    m("option[value=tls]", "Docker TLS"),
                    m("option[value=from_env]", "Docker socket")
                ])
            ]),
            this.form.env === "tls"
                ? m("Label", ["Connection details",
                    m("div", { style: "margin-left: 2rem;" }, [
                        m("label", [
                            "URL", m("input[type=text]", {
                                placeholder: "E.g. tcp://10.68.4.60:2376",
                                onchange: m.withAttr("value", val => this.form.tls.url = val, this)
                            })
                        ]),
                        m("label", [
                            "CA", m("input[type=text]", {
                                placeholder: "E.g. /run/secrets/ca.pem",
                                onchange: m.withAttr("value", val => this.form.tls.ca = val, this)
                            })
                        ]),
                        m("label", [
                            "Cert", m(TooltipBox, {lines: []}), m("input[type=text]", {
                                placeholder: "E.g. /run/secrets/qa.cert.pem",
                                onchange: m.withAttr("value", val => this.form.tls.cert = val, this)
                            })
                        ]),
                        m("label", [
                            "Key", m("input[type=text]", {
                                placeholder: "E.g. /run/secrets/qa.key.pem",
                                onchange: m.withAttr("value", val => this.form.tls.key = val, this)
                            })
                        ])
                    ])
                ])
                : null,
            m("input[type=submit]")
        ]);
    }
};
