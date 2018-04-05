import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { MLContainer } from "component/masonry/ml-container";
import { MLPanel } from "component/masonry/ml-panel";
import { Minimizable } from "component/minimizable/minimizable";
import { ServiceList } from "./list/service-list";
import { ServiceCreateForm } from "./create/service-create";

export const component_name = "Services";

export const Services = site_wrapper({
    view() {
        return m("div.admin",
            m("div.scroll", [
                m("h1", "Services"),
                m(MLContainer, [
                    m(MLPanel,
                        m(Minimizable, {
                            comp_title: "Existing services",
                            comp: ServiceList
                        })
                    ),
                    m(MLPanel,
                        m(Minimizable, {
                            comp_title: "Add service",
                            comp: ServiceCreateForm
                        })
                    )
                ])
            ])
        );
    }
});
