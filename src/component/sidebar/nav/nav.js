import m from "mithril";
import { map, pipe } from "src/utils/fp";

import { DashboardSvg } from "src/components/graphics/sidebar/dashboard/dashboard";
import { AdminSvg } from "src/components/graphics/sidebar/admin/admin";
import { LogsSvg } from "src/components/graphics/sidebar/logs/logs";
import { ConfSvg } from "src/components/graphics/sidebar/conf-edit/conf-edit";
import { CloudSvg } from "src/components/graphics/sidebar/services/services";
import style from "src/style/nav";

const links = {
    "": ["Dashboard", m(DashboardSvg)],
    admin: ["Admin", m(AdminSvg)],
    logs: ["Logs", m(LogsSvg)],
    confeditor: ["Config", m(ConfSvg)],
    services: ["Services", m(CloudSvg)]
};

export const Menu = {
    view() {
        return m(
            "nav",
            { role: "navigation" },
            pipe(
                Object.keys(links),
                map(k =>
                    m("a", { href: "/#!/" + k }, [
                        m("span.link-text", links[k][0]),
                        m("div.dash-icon", links[k][1])
                    ])
                ),
                Array.from
            )
        );
    }
};
