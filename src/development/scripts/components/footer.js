import m from 'mithril'
import style from 'style/footer';

export const Footer = {
    view() {
        return m("footer", {role: "banner"},
            m("a", {
                    href: 'https://github.com/Trondheim-kommune/cion'
                },
                m("div", [
                        m("img", {src: "resources/logo.svg"}),
                        m("h4", "cion 1.0.0")
                    ]
                ))
        );
    }
};