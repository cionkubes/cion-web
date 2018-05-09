import m from "mithril";
import { map, pipe } from "utils/fp";
import { EntryField } from "./entry-field";
import style from "./multi-value-entry.use.scss";

export const MultiValueEntry = {
    oninit(vnode) {
        this.increment = 0;
        this.entries = vnode.attrs.entries;
    },

    getId() {
        return this.increment++;
    },

    // setVal(id, name, value, t) {
    //     t.entries[id].name = name;
    //     t.entries[id].value = value;
    // },

    removeEntry(id, t) {
        delete t.entries[id];
        m.redraw();
    },

    createVal() {
        this.entries[this.getId()] = { "name": "", "value": "" }
    },

    view() {
        let t = this;
        return m("div", [
            m("div.fields",
                Object.keys(this.entries).length !== 0 ?
                    pipe(
                        Object.keys(this.entries),
                        map(id => {
                            let val = this.entries[id];
                            return m(EntryField, {
                                id: id,
                                name: val.name,
                                value: val.value,
                                entry: val,
                                removeEntry: (id) => delete t.entries[id]
                            })
                        }),
                        Array.from
                    ) : "NA"
            ),
            m("button.create-entry",
                { onclick: m.withAttr("", this.createVal, this) }, "+")
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
