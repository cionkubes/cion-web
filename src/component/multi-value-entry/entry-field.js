import m from "mithril";
import style from "./entry-field.use.scss";

export const EntryField = {
    view(vnode) {
        let t = this;
        return m("div.entry", [
            m("input[type=text].name", {
                oninput: m.withAttr("value", (val) => vnode.attrs.entry.name = val),
                placeholder: "Name"
            }),
            m("input[type=text].value", {
                oninput: m.withAttr("value", (val) => vnode.attrs.entry.value = val),
                placeholder: "Value"
            }),
            m("button.delete", {
                onclick: () => vnode.attrs.removeEntry(vnode.attrs.id)
            }, "-")
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
