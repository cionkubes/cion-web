import m from 'mithril'

export const Header = {
    view() {
        return m("header", {role: "banner"}, [
                m("h1", "cion")
            ]
        );
    }
};