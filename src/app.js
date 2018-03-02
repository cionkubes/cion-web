import {route} from "mithril";

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
    "/": lazy_load_component(() => System.import("../../component/site/dashboard/dashboard.js")),
    "/login": lazy_load_component(() => System.import("../../components/login/login.js")),
    "/admin": lazy_load_component(() => System.import("../../component/site/admin/admin.js")),
    "/logs": lazy_load_component(() => System.import("../../component/site/logs/logs.js")),
    "/confeditor": lazy_load_component(() => System.import("../../component/site/conf-edit/confEditor.js")),
    "/services": lazy_load_component(() => System.import("../../component/site/services/services.js")),
    "/service/:service": lazy_load_component(() => System.import("scripts/components/service/service.js")),
    "/user/:username": lazy_load_component(() => System.import("../../component/site/user-edit/user-edit.js")),
    "/services/create": lazy_load_component(() => System.import("../../component/service-create/service-create.js")),
    "/profile": lazy_load_component(() => System.import("../../component/site/profile/profile.js"))
});
