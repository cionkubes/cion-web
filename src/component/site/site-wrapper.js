import m from "mithril";
import { Menu } from "src/components/sidebar/nav/nav";
import { Header } from "src/components/sidebar/header/header";
import { Footer } from "src/components/sidebar/footer/footer";
import { User } from "src/components/sidebar/user/user";
import { NotificationPanel } from "src/component/notifications/panel";
import common_style from "src/style/common.use";

export function site_wrapper(component) {
    return {
        view: () => {
            return [
                m("div.container", { id: "main-container" }, [
                    m(Header),
                    m(Menu),
                    m("main", { role: "main" }, m(component)),
                    m(User),
                    m(Footer)
                ]),
                m(NotificationPanel)
            ];
        },
        oncreate() {
            common_style.ref();
        },
        onremove() {
            common_style.unref();
        }
    };
}
