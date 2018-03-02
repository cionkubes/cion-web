import m from "mithril";
import list_row_style from "./table-row.use.scss";
import { map, pipe } from "utils/fp";

export function listRow(route, cols) {
    return class {
        constructor(vnode) {
            vnode.route = route;
            vnode.cols = cols;
        }

        view(vnode) {
            return m(
                "tr.list-row-click",
                {onclick: () => m.route.set(vnode.route)},
                pipe(vnode.cols, map(d => m("td", d)), Array.from)
            );
        }

        oncreate() {
            list_row_style.ref();
        }

        onremove() {
            list_row_style.unref();
        }
    };
}
