import m from 'mithril';

export const component_name = "document";

export const DocEditor = {
    view() {
        return m("div.home", [
                m("h1", "Config Editor"),
                m("div.component_container", m('p', 'asdfasdf'))
            ]
        );
    }
};
