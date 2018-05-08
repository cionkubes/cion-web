import m from "mithril";
import style from "./entry-field.use.scss";

export const EntryField = {
    oninit(vnode) {
        this.entry = vnode.attrs.entry;
        this.id = vnode.attrs.id;
        this.removeEntry = vnode.attrs.removeEntry;
    },

    setName(value){
        this.entry.name = value;
    },

    setValue(value){
        this.entry.value = value;
    },

    view() {
        let t = this;
        return m("div.entry", [
            m("input[type=text].name", {
                oninput: m.withAttr("value", this.setName, this),
                placeholder: "Name"
            }, this.name),
            m("input[type=text].value", {
                oninput: m.withAttr("value", this.setValue),
                placeholder: "Value"
            }, this.value),
            m("button.delete", {
                onclick: () => t.removeEntry(t.id)
            }, "-"),
            this.id
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
