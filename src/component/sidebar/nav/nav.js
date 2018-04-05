import m from "mithril";
import { map, pipe } from "utils/fp";

import { DashboardSvg } from "component/graphic/sidebar/dashboard/dashboard";
import { AdminSvg } from "component/graphic/sidebar/admin/admin";
import { LogsSvg } from "component/graphic/sidebar/logs/logs";
import { ConfSvg } from "component/graphic/sidebar/conf-edit/conf-edit";
import { CloudSvg } from "component/graphic/sidebar/services/services";
import { EnvironmentSvg } from "component/graphic/sidebar/environment/environment";
import style from "./nav.use.scss";

const links = {
    "": ["Dashboard", m(DashboardSvg)],
    admin: ["Admin", m(AdminSvg)],
    logs: ["Logs", m(LogsSvg)],
    confeditor: ["Config", m(ConfSvg)],
    services: ["Services", m(CloudSvg)],
    environments: ["Environments", m(EnvironmentSvg)]
};

export const Menu = {
    view() {
        return m(
            "nav",
            {role: "navigation"},
            pipe(
                Object.keys(links),
                map(k =>
                    m("a", {href: "/#!/" + k}, [
                        m("span.link-text", links[k][0]),
                        m("div.dash-icon", links[k][1])
                    ])
                ),
                Array.from
            )
        );
    },

    oncreate() {
        style.ref();
    },

    onremove() {
        style.unref();
    }
};
