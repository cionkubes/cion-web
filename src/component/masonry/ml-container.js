import m from "mithril";
import style from "./ml.use.scss";

export const MLContainer = {
    view(vnode) {
        return m('div.masonry-container', vnode.children)
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
