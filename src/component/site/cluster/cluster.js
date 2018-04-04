import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import style from "./cluster.use.scss";

export const component_name = "Cluster";

export const Cluster = site_wrapper({
    view() {
        return m("div.scroll", [
            m("h1", "Cluster")
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
});
