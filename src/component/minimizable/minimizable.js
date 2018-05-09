import m from "mithril";
import style from "./minimizable.use.scss";

export const Minimizable = {
    oninit(vnode) {
        this.comp = vnode.attrs.comp;
        this.comp_title = vnode.attrs.comp_title;
        this.comp_attrs = vnode.attrs.comp_attrs;
        this.comp_content = vnode.attrs.comp_content;
        this.minimized = vnode.attrs.start_minimized;
    },
    view() {
        return m('div.minimizable', [
            m("div.minimize-title", [
                m("h3", this.comp_title),
                m("button.minimize", {
                    onclick: m.withAttr('', () => this.minimized = !this.minimized, this),
                    title: this.minimized ? "Expand" : "Collapse"
                }, this.minimized ? "+" : "-"),
            ]),
            m("div.comp", this.minimized ? null : m(this.comp, this.comp_attrs))
        ])
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
