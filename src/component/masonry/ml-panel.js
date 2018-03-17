import m from "mithril";

export const MLPanel = {
    oninit(vnode) {
        this.comp_title = vnode.attrs.comp_title;
    },
    view(vnode) {
        return m('div.tile', [
            this.comp_title ? m("h3", this.comp_title) : null,
            m("div.comp",
                vnode.children
            )
        ])
    }
};
