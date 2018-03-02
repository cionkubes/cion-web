import m from "mithril";
import style from "src/style/footer";
import { LogoSvg } from "./logo/controller";

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
                m("div", [m(LogoSvg), m("h4", "cion 1.0.0")])
            )
        );
    }
};
