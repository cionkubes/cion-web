import m from "mithril";
import { req_with_auth } from "services/api/requests";
import { createNotification } from "component/notification/panel/panel";
import style from "./entity-view.use.scss";
import { rdbEpochToDate } from "utils/dates";


export const EntityView = {
    oninit(vnode) {
        this.entity = {};
        this.id = m.route.param("id");
        this.entityType = vnode.attrs.entityType;
        this.resource = vnode.attrs.resource;

        req_with_auth({
            url: this.resource.get + "/" + this.id,
            method: "GET",
            then: (response) => this.entity = response,
            catch: () => createNotification("Unable to fetch entity", "", "error"),
            this: this
        });
    },

    del() {
        req_with_auth({
            url: this.resource.del + "/" + this.id,
            method: "PUT",
            then: () => createNotification("Delete successful", "", "success"),
            catch: () => createNotification("An error occurred when deleting entity", "", "error"),
            this: this
        });
    },

    handleNode(node, name, parseFunc) {
        let nodes = [];
        if (node.constructor === Array) {
            let ar = [];
            for (let entry of node) {
                ar.push(this.handleNode(entry));
            }
            if (name) {
                return [ m("label", name), m("div.group", ar) ];
            }
            return m("div.group", ar);
        } else if (typeof node === 'object' && node !== null && !(node instanceof Date)) {
            let ar = [];
            for (let key of Object.keys(node)) {
                let dict = node[ key ];
                if (key === "time") {
                    ar.push(this.handleNode(dict, key, e => rdbEpochToDate(e).toLocaleString()));
                } else {
                    ar.push(this.handleNode(dict, key));
                }
            }
            nodes.push(ar);
        } else {

            if (parseFunc) {
                node = parseFunc(node);
            }

            nodes.push(m("span.block", node));
        }

        if (name) {
            return [ m("label", name), m("div.group", nodes) ];
        }

        return nodes;
    },

    view() {
        return m("div",
            m("div.scroll", [
                m("h1", this.entityType + ": " + this.entity.id),
                m("div.entity", m("div.top", this.handleNode(this.entity)))
            ]),
            this.resource.del ? m("button.delete", {onclick: m.withAttr("", this.del, this)}, "Delete") : null
        );
    },

    oncreate() {
        style.ref();
    },

    onremove() {
        style.unref();
    }
};
