import m from 'mithril';
import style from './user.useable';
import {createNotification} from "../../notifications/panel";
import {req_with_auth} from '../../../helpers/requests';
import {ProfileSvg} from "./default_profile/controller";

export const User = {
    username: "",
    oninit() {
        this.username = localStorage.getItem("username");
        console.log(localStorage.getItem("username"));
    },
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
        let t = this;
        return m("user", {role: "banner"},
            m("div.user_content", [
                m("div.profile", m(ProfileSvg)),
                m("div.username",
                    m("p", t.username)
                ),
                m("div.actions", [
                    m("a", {href: "/#!/profile"}, "profile"),
                    m("a",
                        {
                            href: "#",
                            onclick: this.logout.bind(this)
                        },
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