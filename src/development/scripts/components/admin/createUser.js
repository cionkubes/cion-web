import m from 'mithril';
import {createNotification} from "../notifications/panel";
import {req_with_auth} from 'scripts/helpers/requests';

export class CreateUserForm {
    constructor() {
        this.username = "";
        this.password = "";
    }

    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    send() {
        let t = this;
        let username = this.username;
        let password = this.password;
        req_with_auth({
                url: "/api/v1/create/user",
                method: 'POST',
                data: {
                    username: username,
                    password: password
                },
                then: (e) => createNotification('Success', 'User was created', 'success'),
                catch: (e) => createNotification('Error', e, 'error'),
                this: t
            }
        );

    }

    view() {
        return m('div', [
            m('h2', 'Create user'),
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
            m('button', {onclick: this.send.bind(this)}, 'Submit')
        ])
    }
}