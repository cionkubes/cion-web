import m from "mithril";
import style from "./user.useable";
import { createNotification } from "../../notifications/panel";
import { req_with_auth } from "../../../helpers/requests";

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
            { role: "banner" },
            m("div.user_content", [
                m("div.profile", m("img", { src: t.gravatar })),
                m("div.username", m("p", t.username)),
                m("div.actions", [
                    m("a", { href: "/#!/profile" }, "profile"),
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
