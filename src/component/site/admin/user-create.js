import m from "mithril";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";
import { PermissionForm } from "component/permission/permission";

export const CreateUserForm = {
    oninit() {
        this.username = "";
        this.password = "";
        this.repeatPassword = "";
        this.permissions = {};
    },

    setUsername(username) {
        this.username = username;
    },

    setPassword(password) {
        this.password = password;
    },

    setRepeatPassword(password) {
        this.repeatPassword = password;
    },

    send() {
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

        PermissionForm.removeEmptyPermissions(this.permissions);
        req_with_auth({
            url: "/api/v1/create/user",
            method: "POST",
            data: {
                username: username,
                password: password,
                "repeat-password": repeatPassword,
                permissions: this.permissions
            },
            then: () => createNotification("Success", "User was created", "success"),
            catch: e => createNotification("Error", e, "error")
        });
    },

    view() {
        return m("div", [
            m("label", [
                "Username",
                m("input[type=text]", {
                    oninput: m.withAttr("value", this.setUsername, this),
                    placeholder: "Username"
                })
            ]),
            m("label", [
                "Password",
                m("input[type=password]", {
                    oninput: m.withAttr("value", this.setPassword, this),
                    placeholder: "Password"
                })
            ]),
            m("label", [
                "Repeat Password",
                m("input[type=password]", {
                    oninput: m.withAttr("value", this.setRepeatPassword, this),
                    placeholder: "Repeat Password"
                })
            ]),
            m("label", "Permissions"),
            m(PermissionForm, {permissions: this.permissions}),
            m("button", {onclick: m.withAttr("", this.send, this)}, "Submit")
        ]);
    }
};
