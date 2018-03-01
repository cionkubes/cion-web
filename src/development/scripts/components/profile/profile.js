import m from "mithril";
import { site_wrapper } from "../../site";
import { map, pipe } from "../../helpers/fp";
import { GravatarEmailForm } from "./gravatarEmailForm";
import { ResetPasswordForm } from "./resetPasswordForm";

export const component_name = "Profile";
export const Profile = site_wrapper({
  view(vnode) {
    return m("div", [
      m("h1", "Profile"),
      m(GravatarEmailForm),
      m(ResetPasswordForm)
    ]);
  }
});
