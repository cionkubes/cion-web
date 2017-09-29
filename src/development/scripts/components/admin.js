import m from 'mithril'
import { site_wrapper } from 'scripts/site'
import { map, pipe } from 'scripts/helpers/fp'

export const component_name = "Admin";
export const Admin = site_wrapper({
    controller: () => {
    },
    view: () => {
        return m('div', pipe(['Hello', 'World!'],
            map(word => m('h1', word)),
            Array.from
        ));
    }
});