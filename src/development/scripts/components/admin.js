import m from 'mithril'
import { site_wrapper } from '../site'
import { map, pipe } from '../helpers/fp'

import { changefeed } from '../api/reactive'

export const component_name = "Admin";
export const Admin = site_wrapper({
    oninit() {
        const state = this;

        console.log("Subscribing");
        state.sub = changefeed('tasks').subscribe(
            x => console.log(`admin: ${x}`),
            err => console.error(`admin: ${err}`),
            () => console.log("admin: Completed")
        );
    },
    view() {
        return m('div', pipe(['Hello', 'World!'],
            map(word => m('h1', word)),
            Array.from
        ));
    },
    onremove() {
        const state = this;

        state.sub.unsubscribe();
    }
});