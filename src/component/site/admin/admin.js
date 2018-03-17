import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { CreateUserForm } from "./user-create";
import { UserList } from "./user-list";
import { MLContainer } from "component/masonry/ml-container";
import { MLPanel } from "component/masonry/ml-panel";
import { Minimizable } from "component/minimizable/minimizable";

export const component_name = "Admin";
export const Admin = site_wrapper({
    view() {
        return m("div.admin",
            m("div.scroll", [
                m("h1", "Admin"),
                m(MLContainer, [
                    m(MLPanel,
                        m(Minimizable, {
                            comp_title: "Create user",
                            comp: CreateUserForm
                        })
                    ),
                    m(MLPanel,
                        m(Minimizable, {
                            comp_title: "Existing Users",
                            comp: UserList
                        })
                    )
                ])
            ])
        );
    }
});
