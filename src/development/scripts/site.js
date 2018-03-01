import m from "mithril";
import { Menu } from "scripts/components/menu";
import { Header } from "scripts/components/header";
import { Footer } from "scripts/components/footer";
import { User } from "scripts/components/menu/user/user";
import { NotificationPanel } from "scripts/components/notifications/panel";
import common_style from "style/common.useable";

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
