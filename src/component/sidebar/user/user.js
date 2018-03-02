import m from "mithril";
import style from "./user.use.scss";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";

export const User = {
    username: "",
    gravatar: "",
    oninit() {
        this.username = localStorage.getItem("username");
        this.gravatar = localStorage.getItem("gravatar-url");
    },
    postLogout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("username");
        localStorage.removeItem("gravatar-url");
        localStorage.removeItem("gravatar-email");

        m.route.set("/login");
        createNotification("Success", "You have been logged out", "success");
    },
    logout() {
        req_with_auth({
            url: "/api/v1/logout",
            method: "POST",
            then: this.postLogout,
            catch: this.postLogout
        });
    },
    view() {
        let t = this;
        return m(
            "user",
            {role: "banner"},
            m("div.user-content", [
                m("div.profile", m("img", {src: t.gravatar})),
                m("div.username", m("p", t.username)),
                m("div.actions", [
                    m("a", {href: "/#!/profile"}, "profile"),
                    m(
                        "a",
                        {
                            href: "#",
                            onclick: this.logout.bind(this)
                        },
                        "logout"
                    )
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
