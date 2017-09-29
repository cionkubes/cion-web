'use strict';

import { route } from 'mithril'
import { Home } from 'scripts/components/home'

function lazy_load_component(promise_fn) {
    return {
        async onmatch() {
            try {
                let module = await promise_fn();
                return module[module.component_name];
            } catch (ex) {
                console.error(ex);
            }
        }
    };
}

route.mode = "hash";
route(document.body, "/", {
    // "/": lazy_load_component(() => System.import('scripts/components/home.js')),
    "/": Home,
    "/login": lazy_load_component(() => System.import('scripts/components/login.js')),
    "/admin": lazy_load_component(() => System.import('scripts/components/admin.js'))
});