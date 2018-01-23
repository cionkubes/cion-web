import m from 'mithril';
import {createNotification} from "../notifications/panel";
import {req_with_auth} from 'scripts/helpers/requests';

export class CreateUserForm {
    constructor() {
        this.username = "";
        this.password = "";
        this.repeatPassword = "";
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
            createNotification('Password mismatch', 'Passwords do not match', 'error');
            return;
        }
        req_with_auth({
                url: "/api/v1/create/user",
                method: 'POST',
                data: {
                    username: username,
                    password: password,
                    'repeat-password': repeatPassword
                },
                then: (e) => {
                    createNotification('Success', 'User was created', 'success');
                },
                catch: (e) => createNotification('Error', e, 'error'),
                this: t
            }
        );
    }

    view() {
        return m('div', [
            m('h3', 'Create user'),
            m('label[for=username]', 'Username'),
            m('input#username[type=text]', {
                oninput: m.withAttr("value", this.setUsername, this),
                placeholder: "Username"
            }),
            m('label[for=password]', 'Password'),
            m('input#password[type=password]', {
                oninput: m.withAttr("value", this.setPassword, this),
                placeholder: "Password"
            }),
            m('label[for=repeat_password]', 'Repeat Password'),
            m('input#repeat_password[type=password]', {
                oninput: m.withAttr("value", this.setRepeatPassword, this),
                placeholder: "Repeat Password"
            }),
            m('button', {onclick: this.send.bind(this)}, 'Submit')
        ])
    }
}