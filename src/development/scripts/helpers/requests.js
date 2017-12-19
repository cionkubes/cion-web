import m from 'mithril';

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
    return req(args);
}
