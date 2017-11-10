import m from 'mithril';

export const component_name = "DocEditor";

export const DocEditor = {
    view() {
        return m("div.home", [
                m("h1", "Config Editor"),
                m("div.component_container", m('p', 'asdfasdf'))
            ]
        );
    }
};
