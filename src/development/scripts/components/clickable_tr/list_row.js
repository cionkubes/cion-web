import m from "mithril";
import list_row_style from "./list_row.useable";
import { map, pipe } from "../../helpers/fp";

export function listRow(route, cols) {
  return class {
    constructor(vnode) {
      vnode.route = route;
      vnode.cols = cols;
    }

    view(vnode) {
      return m(
        "tr.list_row_click",
        { onclick: () => m.route.set(vnode.route) },
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
