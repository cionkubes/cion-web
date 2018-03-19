import m from "mithril";
import { req_with_auth } from "services/api/requests";
import { site_wrapper } from "component/site/site-wrapper";
import { createNotification } from "component/notification/panel/panel";
import style from "./log-view.use.scss";

export const component_name = "LogView";

export const LogView = site_wrapper({
    oninit(vnode) {
        this.task = {};
        this.id = m.route.param("id");
        req_with_auth({
            url: "/api/v1/task/" + this.id,
            method: "GET",
            then: (response) => this.task = response,
            catch: function (e) {
                console.error(e);
                createNotification("Request error", e, "error");
            }
        });
    },

    handleNode(node, name) {
        let nodes = [];
        if (node.constructor === Array) {
            let ar = [];
            for (let entry of node) {
                ar.push(this.handleNode(entry));
            }
            if (name) {
                return [m("label", name), m("div.group", ar)]
            }
            return m("div.group", ar);
        } else if (node.constructor === String
            || node.constructor === Number) {
            nodes.push(m("span.block", node));
        } else {
            let ar = [];
            for (let key of Object.keys(node)) {
                let dict = node[key];
                ar.push(this.handleNode(dict, key));
            }
            nodes.push(ar);
        }

        if (name) {
            return [m("label", name), m("div.group", nodes)]
        }

        return nodes;
    },

    view() {
        return m("div.admin",
            m("div.scroll", [
                m("h1", "Log - " + this.task.id),
                m("div.task", m("div.top", this.handleNode(this.task)))
            ])
        );
    },

    oncreate() {
        style.ref();
    },

    onremove() {
        style.unref();
    }
});
