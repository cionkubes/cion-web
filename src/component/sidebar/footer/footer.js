import m from "mithril";

import { LogoSvg } from "component/graphic/logo/logo";
import version from "utils/version";

import style from "./footer.use.scss";

export const Footer = {
    view() {
        return m(
            "footer",
            { role: "banner" },
            m(
                "a",
                {
                    href: "https://github.com/cionkubes/cion"
                },
                m("div", [m(LogoSvg), m("h4", `cion ${version()}`)])
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
