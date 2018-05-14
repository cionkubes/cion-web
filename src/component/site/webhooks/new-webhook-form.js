import m from "mithril";
import { map, pipe } from "utils/fp";
import { MultiValueEntry } from "../../multi-value-entry/multi-value-entry";
import { TooltipBox } from "component/tooltip/tooltip-box";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";

const events = [ "new-image", "service-update" ];


export const CreateWebhookForm = {
    oninit() {
        this.event = "";
        this.url = "";
        this.headers = {};
        this.triggers = {};
        this.body = "";
    },

    setVal(name, value) {
        this[ name ] = value;
    },

    convertMultiValueEntry(d) {
        let r = {};
        for (let key of Object.keys(d)) {
            let v = d[ key ];
            r[ v[ "name" ] ] = v[ "value" ];
        }
        return r;
    },

    send() {
        req_with_auth({
            url: "/api/v1/webhook",
            method: "POST",
            data: {
                "url": this.url,
                "event": this.event,
                "on": this.convertMultiValueEntry(this.triggers),
                "headers": this.convertMultiValueEntry(this.headers),
                "data": this.body
            },
            then: () => createNotification("Success", "Webhook was created", "success"),
            catch: e => createNotification("Error", e, "error")
        });
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
            m(MultiValueEntry, { "entries": this.headers, button_text: "Add Header" }),
            m("label", [
                "Triggers"
            ]),
            m(MultiValueEntry, { "entries": this.triggers, button_text: "Add Trigger" }),
            m("label", [
                "Body",
                m(TooltipBox, {
                    side: "right",
                    character: "!",
                    lines: [
                        "Uses python.format. So you will need to escape squiggly brackets ({, })",
                        m("a", { href: "https://www.python.org/dev/peps/pep-3101/" },
                            "https://www.python.org/dev/peps/pep-3101/")
                    ]
                })
            ]),
            m("textarea", {
                oninput: m.withAttr("value", val => this.body = val, this)
            }),
            m("button", { onclick: m.withAttr("", this.send, this) }, "Submit")
        ]);
    }
};
