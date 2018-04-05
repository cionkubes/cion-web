import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import style from "./environment.use.scss";
import { NewEnvironmentForm } from "./new-environment-form";
import { MLContainer } from "component/masonry/ml-container";
import { MLPanel } from "component/masonry/ml-panel";
import { Minimizable } from "component/minimizable/minimizable";
import { EnvironmentList } from "./environment-list";

export const component_name = "Environment";

export const Environment = site_wrapper({
    view() {
        return m("div.scroll", [
            m("h1", "Environments"),
            m(MLContainer, [
                m(MLPanel,
                    m(Minimizable, {
                        comp_title: "Add environment",
                        comp: NewEnvironmentForm
                    })
                )
            ]),
            m("div", [
                m("h3", "Existing environments"),
                m(EnvironmentList)
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
