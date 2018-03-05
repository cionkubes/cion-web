import m from "mithril";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";
import { PermissionForm } from "component/permission/permission";
import { site_wrapper } from "component/site/site-wrapper";

export const component_name = "EditUser";
export const EditUser = site_wrapper({
    oninit() {
        this.username = m.route.param("username");
        this.permissions = {};
        req_with_auth({
            url: "/api/v1/permissions/user/" + this.username,
            method: "GET",
            then: e => {
                let rPerms = e["permissions"];
                for (let key in rPerms) {
                    if (rPerms.hasOwnProperty(key)) {
                        this.permissions[key] = rPerms[key];
                    }
                }
            },
            catch: e => createNotification("Failed to get permission", e, "error"),
            this: this
        });
    },

    setNewPassword(password) {
        this.newPassword = password;
    },

    setRepeatPassword(password) {
        this.repeatPassword = password;
    },

    deleteUser() {
        let username = this.username;
        req_with_auth({
            url: "/api/v1/user/" + username,
            method: "DELETE",
            then: () =>
                createNotification("User " + username + " was deleted", "", "success"),
            catch: e => createNotification(e, "", "error")
        });
        m.route.set("/admin");
    },

    resetPassword() {
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
            url: "/api/v1/user/" + this.username + "/setpassword",
            method: "PUT",
            data: {
                "new-password": newPassword,
                "repeat-password": repeatPassword
            },
            then: () => {
                createNotification("Success", "User was updated", "success");
            },
            catch: e => createNotification("Error", e, "error"),
            this: this
        });
    },

    sendPermissions() {
        let perms = this.permissions;
        PermissionForm.removeEmptyPermissions(perms);
        req_with_auth({
            url: "/api/v1/permissions/user/" + this.username,
            method: "PUT",
            data: {permissions: perms},
            then: () =>
                createNotification(
                    "Permissions for user " + this.username + " where updated",
                    "",
                    "success"
                ),
            catch: e => createNotification("Error", e, "error")
        });
    },

    view() {
        return m("div", [
            m("h1", [
                this.username,
                m(
                    "button.red",
                    {
                        style: "float: right;",
                        onclick: m.withAttr("", this.deleteUser, this)
                    },
                    "Delete"
                )
            ]),
            m("h2", "Set password"),
            m("input#new_pw[type=password]", {
                oninput: m.withAttr("value", this.setNewPassword, this),
                placeholder: "New password"
            }),
            m("input#repeat_new_pw[type=password]", {
                oninput: m.withAttr("value", this.setRepeatPassword, this),
                placeholder: "Repeat new password"
            }),
            m("button", {onclick: this.resetPassword.bind(this)}, "Set Password"),
            m("h2", "Permissions"),
            m(PermissionForm, {permissions: this.permissions}),
            m(
                "button",
                {onclick: m.withAttr("", this.sendPermissions, this)},
                "Set permission"
            )
        ]);
    }
});
