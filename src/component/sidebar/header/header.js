import m from "mithril";

export const Header = {
    oninit(vnode) {
        this.sidebarState = vnode.attrs.sidebarState;
    },

    collapseClick(){
        this.sidebarState.collapsed = !this.sidebarState.collapsed;
        localStorage.setItem("sidebarState.collapsed", this.sidebarState.collapsed);
    },

    view() {
        return m("header", {role: "banner"}, [
            !this.sidebarState.collapsed ? m("h2", "cion") : null,
            m("button#toggle-button", {
                onclick: m.withAttr("", this.collapseClick, this),
            }, this.sidebarState.collapsed ? ">" : "<")
        ]);
    }
};
