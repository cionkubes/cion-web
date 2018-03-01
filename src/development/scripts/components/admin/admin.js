import m from "mithril";
import { site_wrapper } from "../../site";

import { CreateUserForm } from "./createUser";

import { UserList } from "./userList";

export const component_name = "Admin";
export const Admin = site_wrapper({
    view() {
        return m("div.admin", [
            m("div.scroll", m("h1", "Admin"), m(CreateUserForm), m(UserList))
        ]);
    }
});
