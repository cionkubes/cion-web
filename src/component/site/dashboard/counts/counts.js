import m from "mithril";
import style from "./counts.use.scss";
import { pipe, map } from "utils/fp";
import { MLPanel } from "component/masonry/ml-panel";

const descriptionMap = {
    "done": "Number of tasks marked as \"Done\"",
    "ready": "Number of tasks not started yet",
    "processing": "Tasks started but not completed yet",
    "erroneous": "Tasks completed unsuccessfully"
};

export const Counts = {

    oninit() {
        this.counts = {};
    },

    updateVals(counts) {
        this.counts = counts;
    },

    view(vnode) {
        let t = this;
        return pipe(
            Object.keys(t.counts),
            map(key =>
                m(MLPanel, m("div.count-grid", [
                    m("div.num-container", m("h1.num", t.counts[key].reduction)),
                    m("div.name-container", m("h3.name", t.counts[key].group)),
                    m("div.description-container", m("span.description", descriptionMap[t.counts[key].group]))
                ]))
            ),
            Array.from
        );
    },

    oncreate() {
        style.ref();
    },

    onremove() {
        style.unref();
    }
};
