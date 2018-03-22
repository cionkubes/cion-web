import m from "mithril";
import list_row_style from "./table-row.use.scss";
import { map, pipe } from "utils/fp";

export const ListRow = {
    oninit(vnode) {
        this.route = vnode.attrs.route;
        this.cols = vnode.attrs.cols;
    },

    view() {
        return m(
            "tr.list-row-click",
            {onclick: m.withAttr("", () => m.route.set(this.route), this)},
            pipe(this.cols, map(d => m("td", d)), Array.from)
        );
    },

    oncreate() {
        list_row_style.ref();
    },

    onremove() {
        list_row_style.unref();
    }
}
