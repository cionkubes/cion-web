import m from "mithril";
import style from "./footer.use.scss";
import { LogoSvg } from "component/graphic/logo/logo";

export const Footer = {
    view() {
        return m(
            "footer",
            {role: "banner"},
            m(
                "a",
                {
                    href: "https://github.com/cionkubes/cion"
                },
                m("div", [m(LogoSvg), m("h4", "cion 1.0.0")])
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
