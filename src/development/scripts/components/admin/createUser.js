import m from "mithril";
import { createNotification } from "../notifications/panel";
import { req_with_auth } from "scripts/helpers/requests";
import { PermissionForm } from "../user/permission";

export class CreateUserForm {
    constructor() {
        this.username = "";
        this.password = "";
        this.repeatPassword = "";
        this.permissions = {};
    }

    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    setRepeatPassword(password) {
        this.repeatPassword = password;
    }

    send() {
        let t = this;
        let username = this.username;
        let password = this.password;
        let repeatPassword = this.repeatPassword;
        if (repeatPassword !== password) {
            createNotification(
                "Password mismatch",
                "Make sure password fields match",
                "error"
            );
            return;
        }
        PermissionForm.removeEmptyPermissions(t.permissions);
        req_with_auth({
            url: "/api/v1/create/user",
            method: "POST",
            data: {
                username: username,
                password: password,
                "repeat-password": repeatPassword,
                permissions: t.permissions
            },
            then: () => {
                createNotification("Success", "User was created", "success");
            },
            catch: e => createNotification("Error", e, "error"),
            this: t
        });
    }

    view() {
        return m("div", [
            m("h3", "Create user"),
            m("label[for=username]", "Username"),
            m("input#username[type=text]", {
                oninput: m.withAttr("value", this.setUsername, this),
                placeholder: "Username"
            }),
            m("label[for=password]", "Password"),
            m("input#password[type=password]", {
                oninput: m.withAttr("value", this.setPassword, this),
                placeholder: "Password"
            }),
            m("label[for=repeat_password]", "Repeat Password"),
            m("input#repeat_password[type=password]", {
                oninput: m.withAttr("value", this.setRepeatPassword, this),
                placeholder: "Repeat Password"
            }),
            m("label", "Permissions"),
            m(PermissionForm, { permissions: this.permissions }),
            m(
                "button",
                {
                    onclick: m.withAttr("", this.send, this)
                },
                "Submit"
            )
        ]);
    }
}
