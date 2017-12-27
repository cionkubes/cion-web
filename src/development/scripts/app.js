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
    "/": lazy_load_component(() => System.import('scripts/components/dashboard/dashboard.js')),
    "/login": lazy_load_component(() => System.import('scripts/components/login.js')),
    "/admin": lazy_load_component(() => System.import('scripts/components/admin/admin.js')),
    "/logs": lazy_load_component(() => System.import('scripts/components/logs.js')),
    "/confeditor": lazy_load_component(() => System.import('scripts/components/confEditor/confEditor.js')),
    "/services": lazy_load_component(() => System.import('scripts/components/services/services.js')),
    "/service/:service": lazy_load_component(() => System.import('scripts/components/service/service.js')),
    // "/service/:service/edit": lazy_load_component(() => System.import('scripts/components/service_manip/serviceEdit.js')),
    "/services/create": lazy_load_component(() => System.import('scripts/components/service_manip/serviceCreate.js'))
});