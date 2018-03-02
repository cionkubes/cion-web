import m from "mithril";
import { createNotification } from "../notifications/panel";
import { req_with_auth } from "src/services/api/requests";

export class ResetPasswordForm {
    constructor() {
        this.oldPassword = "";
        this.newPassword = "";
        this.repeatPassword = "";
    }

    setOldPassword(oldPassword) {
        this.oldPassword = oldPassword;
    }

    setNewPassword(password) {
        this.newPassword = password;
    }

    setRepeatPassword(password) {
        this.repeatPassword = password;
    }

    resetPassword() {
        let t = this;
        let oldPassword = this.oldPassword;
        let newPassword = this.newPassword;
        let repeatPassword = this.repeatPassword;
        if (newPassword !== repeatPassword) {
            createNotification(
                "Password mismatch",
                "Passwords do not match",
                "error"
            );
            return;
        }
        req_with_auth({
            url: "/api/v1/user/setpassword",
            method: "POST",
            data: {
                "old-password": oldPassword,
                "new-password": newPassword,
                "repeat-password": repeatPassword
            },
            then: () => {
                createNotification("Success", "User was created", "success");
            },
            catch: e => createNotification("Error", e, "error"),
            this: t
        });
    }

    view() {
        let t = this;
        return m("div", [
            m("h2", "Set password"),
            m("input#password[type=password]", {
                oninput: m.withAttr("value", this.setOldPassword, this),
                placeholder: "Old password",
                value: t.oldPassword
            }),
            m("hr[style=margin:0 0 1em 0;]"),
            m("input#new_pw[type=password]", {
                oninput: m.withAttr("value", this.setNewPassword, this),
                placeholder: "New password"
            }),
            m("input#repeat_new_pw[type=password]", {
                oninput: m.withAttr("value", this.setRepeatPassword, this),
                placeholder: "Repeat new password"
            }),
            m("button", { onclick: this.resetPassword.bind(this) }, "Submit")
        ]);
    }
}
