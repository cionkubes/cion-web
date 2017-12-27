import m from 'mithril';
import {createNotification} from "../components/notifications/panel";

export function req(args) {
    args['extract'] = function (xhr) {
        return {status: xhr.status, body: JSON.parse(xhr.response)}
    };
    return m.request(args);
}

export function req_with_auth(args) {
    if (!args['headers']) {
        args['headers'] = {};
    }
    args['headers']['X-CSRF-Token'] = localStorage.getItem('auth-token');
    return req(args).catch((e) => {
        if (e.status === 401) {
            localStorage.removeItem("auth-token");
            m.route.set("/login");
            createNotification('Invalid credentials', 'The server returned a 401. Please re-authenticate', 'Warning')
        } else {
            throw e.body;
        }
    });
}
