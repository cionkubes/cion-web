import m from 'mithril';
import {createNotification} from "../notifications/panel";
import {req_with_auth} from 'scripts/helpers/requests';
import {site_wrapper} from '../../site'

export const component_name = "EditUser";
export const EditUser = site_wrapper(class EditUser {
    constructor() {
        this.username = m.route.param('username');
    }

    setNewPassword(password) {
        this.newPassword = password;
    }

    setRepeatPassword(password) {
        this.repeatPassword = password;
    }

    deleteUser() {
        let username = this.username;
        req_with_auth({
            url: "/api/v1/user/" + username,
            method: "DELETE",
            then: (e) => createNotification('User ' + username + ' was deleted', '', 'success'),
            catch: (e) => createNotification(e, '', 'error')
        });
        m.route.set("/admin");
    }

    resetPassword() {
        let t = this;
        let newPassword = this.newPassword;
        let repeatPassword = this.repeatPassword;
        if (newPassword !== repeatPassword) {
            createNotification('Password mismatch', 'Passwords do not match', 'error');
            return;
        }
        req_with_auth({
                url: "/api/v1/user/" + t.username + "/setpassword",
                method: 'PUT',
                data: {
                    'new-password': newPassword,
                    'repeat-password': repeatPassword
                },
                then: (e) => {
                    createNotification('Success', 'User was updated', 'success');
                },
                catch: (e) => createNotification('Error', e, 'error'),
                this: t
            }
        );
    }

    view() {
        let t = this;
        return m('div', [
            m("h1", [
                t.username,
                m("button.red", {
                    style: "float: right;",
                    onclick: t.deleteUser.bind(t)
                }, "Delete")
            ]),
            m('h2', 'Set password'),
            m('input#new_pw[type=password]', {
                oninput: m.withAttr("value", this.setNewPassword, this),
                placeholder: "New password"
            }),
            m('input#repeat_new_pw[type=password]', {
                oninput: m.withAttr("value", this.setRepeatPassword, this),
                placeholder: "Repeat new password"
            }),
            m('button', {onclick: this.resetPassword.bind(this)}, 'Submit')
        ])
    }
});