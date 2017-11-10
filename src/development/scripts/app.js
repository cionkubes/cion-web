import { route } from 'mithril';

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
    "/": lazy_load_component(() => System.import('scripts/components/dashboard.js')),
    "/login": lazy_load_component(() => System.import('scripts/components/login.js')),
    "/admin": lazy_load_component(() => System.import('scripts/components/admin.js')),
    "/logs": lazy_load_component(() => System.import('scripts/components/logs.js')),
    "/confeditor": lazy_load_component(() => System.import('scripts/components/confEditor/confEditor.js')),
});