import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { GravatarEmailForm } from "./gravatar-email";
import { ResetPasswordForm } from "./reset-pw";

export const component_name = "Profile";
export const Profile = site_wrapper({
    view() {
        return m("div", [
            m("h1", "Profile"),
            m(GravatarEmailForm),
            m(ResetPasswordForm)
        ]);
    }
});
