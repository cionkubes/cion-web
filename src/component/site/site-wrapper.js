import m from "mithril";
import { Menu } from "component/sidebar/nav/nav";
import { Header } from "component/sidebar/header/header";
import { Footer } from "component/sidebar/footer/footer";
import { User } from "component/sidebar/user/user";
import { NotificationPanel } from "component/notification/panel/panel";
import site_style from "./site.use.scss";

export function site_wrapper(component) {
    return {
        view: () => {
            return [
                m("div.container", {id: "main-container"}, [
                    m(Header),
                    m(Menu),
                    m("main", {role: "main"}, m(component)),
                    m(User),
                    m(Footer)
                ]),
                m(NotificationPanel)
            ];
        },
        oncreate() {
            site_style.ref();
        },
        onremove() {
            site_style.unref();
        }
    };
}
