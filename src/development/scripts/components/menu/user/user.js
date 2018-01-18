import m from 'mithril';
import style from './user.useable';
import {createNotification} from "../../notifications/panel";
import {req_with_auth} from '../../../helpers/requests';

export const User = {
    postLogout(e) {
        localStorage.removeItem('auth-token');
        m.route.set("/login");
        createNotification('Success', 'You have been logged out', 'success');
    },
    logout() {
        req_with_auth({
            url: "/api/v1/logout",
            method: "POST",
            then: this.postLogout,
            catch: this.postLogout
        })
    },
    view() {
        return m("user", {role: "banner"}, m("div.user_content", [
                m("div.profile"),
                m("div.username",
                    m("p", "admin")
                ),
                m("div.actions", [
                    m("a", "profile"),
                    m("a",
                        {onclick: this.logout.bind(this)},
                        "logout")
                ])
            ])
        );
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};