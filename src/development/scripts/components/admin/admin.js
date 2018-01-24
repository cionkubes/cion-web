import m from 'mithril'
import {site_wrapper} from '../../site'
import {map, pipe} from '../../helpers/fp'

import {changefeed} from '../../api/reactive'

import {CreateUserForm} from './createUser';

import {UserList} from "./userList";

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
    view(vnode) {
        return m('div.admin', [
            m('div.scroll',
                m('h1', 'Admin'),
                m(CreateUserForm),
                m(UserList)
            )
        ]);
    },
    onremove() {
        const state = this;

        state.sub.unsubscribe();
    }
});