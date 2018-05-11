import m from "mithril";
import { pipe, map } from "utils/fp";
import style from "./tooltip.use.scss"

export const TooltipBox = {
    view(vnode) {
        return m("div.tooltip", [
            m("div.tooltip-content", vnode.attrs.character ? vnode.attrs.character : "?"),
            m("div.tooltip-text.tooltip-" + (vnode.attrs.side ? vnode.attrs.side : "left"),
                pipe(vnode.attrs.lines,
                    map(line => m("p", line)),
                    Array.from)
            )
        ])
    },

    oncreate() {
        style.ref();
    },

    onremove() {
        style.unref();
    },
};
