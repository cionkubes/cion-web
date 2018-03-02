import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { CreateUserForm } from "./user-create";
import { UserList } from "./user-list";

export const component_name = "Admin";
export const Admin = site_wrapper({
    view() {
        return m("div.admin", [
            m("div.scroll", m("h1", "Admin"), m(CreateUserForm), m(UserList))
        ]);
    }
});
