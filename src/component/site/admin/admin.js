import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { Minimizable } from "component/minimizable/minimizable";
import { CreateUserForm } from "./user-create";
import { UserList } from "./user-list";

export const component_name = "Admin";
export const Admin = site_wrapper({
    view() {
        return m("div.admin",
            m("div.scroll", [
                m("h1", "Admin"),
                m(Minimizable, {
                    comp: CreateUserForm,
                    comp_title: "Create user"
                }),
                m(Minimizable, {
                    comp: UserList,
                    comp_title: "Existing users"
                })
            ])
        );
    }
});
