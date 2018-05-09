import m from "mithril";
import { map, pipe } from "utils/fp";
import { MultiValueEntry } from "../../multi-value-entry/multi-value-entry";
// import { createNotification } from "component/notification/panel/panel";
// import { req_with_auth } from "services/api/requests";

const events = ["new-image", "service-update"];


export const CreateWebhookForm = {
    oninit() {
        this.event = "";
        this.url = "";
        this.headers = {};
        this.triggers = {};
        this.body = "";
    },

    setVal(name, value) {
        this[name] = value;
    },

    send() {
        // let username = this.username;
        // let password = this.password;
        // let repeatPassword = this.repeatPassword;
        // if (repeatPassword !== password) {
        //     createNotification(
        //         "Password mismatch",
        //         "Make sure password fields match",
        //         "error"
        //     );
        //     return;
        // }
        //
        // req_with_auth({
        //     url: "/api/v1/create/user",
        //     method: "POST",
        //     data: {
        //         username: username,
        //         password: password,
        //         "repeat-password": repeatPassword,
        //         permissions: this.permissions
        //     },
        //     then: () => createNotification("Success", "User was created", "success"),
        //     catch: e => createNotification("Error", e, "error")
        // });
        console.log("Send triggered");
    },

    view() {
        return m("div", [
            m("label", [
                "URL",
                m("input[type=text]", {
                    oninput: m.withAttr("value", value => this.setVal("url", value), this),
                    placeholder: "URL"
                })
            ]),
            m("label", [
                "Event",
                m("select", {
                    onchange: m.withAttr("value", val => this.setVal("event", val), this)
                }, [
                    m("option", {
                        value: "",
                        disabled: "disabled",
                        selected: "selected"
                    }, "event"),
                    pipe(
                        events,
                        map(k => m("option", { value: k }, k)),
                        Array.from
                    )
                ])
            ]),
            m("label", [
                "Headers"
            ]),
            m(MultiValueEntry, { "entries": this.headers }),
            m("label", [
                "Triggers"
            ]),
            m(MultiValueEntry, { "entries": this.triggers }),
            m("label", {title: "Body of the webhook-request. Uses python.format. So you will need to escape squiggly brakcets ({, })"}, [
                "Body"
            ]),
            m("textarea", {
                oninput: m.withAttr("value", val => this.body = val, this)
            }),
            m("button", { onclick: m.withAttr("", this.send, this) }, "Submit")
        ]);
    }
};
