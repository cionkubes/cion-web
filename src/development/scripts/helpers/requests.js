import m from 'mithril';
import {createNotification} from "../components/notifications/panel";

export function req(args) {
    args['extract'] = function (xhr) {
        return {status: xhr.status, body: JSON.parse(xhr.responseText)}
    };
    return m.request(args);
}

export function req_with_auth(args) {
    if (!args['headers']) {
        args['headers'] = {};
    }
    args['headers']['X-CSRF-Token'] = localStorage.getItem('auth-token');

    let then = args['then'];
    let erHandler = args['catch'];
    let thisArg = args['this'];

    return req(args).then((res) => {
        if (then) {
            if (thisArg) {
                then.bind(thisArg);
            }
            then(res.body, res)
        }
    }).catch((res) => {
        if (res.status === 401) {
            localStorage.removeItem("auth-token");
            m.route.set("/login");
            createNotification('Invalid credentials', 'The server returned a 401. Please re-authenticate', 'warning')
        } else if (erHandler) {
            console.log(res);
            if (thisArg) {
                erHandler.bind(thisArg);
            }
            let message = JSON.parse(res.message)['error'];
            erHandler(message, res);
        } else {
            throw res;
        }
    });
}
