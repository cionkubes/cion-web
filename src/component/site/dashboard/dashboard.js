import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { Events } from "./events";
import style from "./dashboard.use.scss";
import { MLContainer } from "../../masonry/ml-container";
import { MLPanel } from "../../masonry/ml-panel";

export const component_name = "Dashboard";

export const Dashboard = site_wrapper({
    view() {
        return m("div.scroll", [
            m("h1", "Dashboard"),
            m(MLContainer, [
                m(MLPanel, {class: "events"}, m(Events)),
            ])
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
});
