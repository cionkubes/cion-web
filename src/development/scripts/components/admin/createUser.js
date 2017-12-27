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
        console.log(this.username);
    }

    setPassword(password) {
        this.password = password;
        console.log(this.password);
    }

    send() {
        let username = this.username;
        let password = this.password;
        req_with_auth({
            url: "/api/v1/create/user",
            method: 'POST',
            data: {
                username: username,
                password: password
            }
        }).then((e) =>
            createNotification('Success', 'User was created', 'success')
        ).catch((e) => {
                console.log(e);
                createNotification('Error', e['error'], 'error')
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
            m('input[type=button]', {onclick: m.withAttr('', this.send, this)}, 'Submit')
        ])
    }
}