import m from "mithril";

import { LogoSvg } from "component/graphic/logo/logo";
import version from "utils/version";

export const Footer = {

    oninit(vnode) {
        this.sidebarState = vnode.attrs.sidebarState;
    },
    view() {
        return m(
            "footer",
            { role: "banner" },
            m("a", { href: "http://cionkubes.com" }, [
                    m(LogoSvg),
                    !this.sidebarState.collapsed
                        ? m("h4", `cion ${version()}`)
                        : null
                ]
            )
        );
    }
};
