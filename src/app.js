import { route } from "mithril";

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
    "/":                 lazy_load_component(() => System.import("component/site/dashboard/dashboard.js")),
    "/login":            lazy_load_component(() => System.import("component/login/login.js")),
    "/admin":            lazy_load_component(() => System.import("component/site/admin/admin.js")),
    "/logs":             lazy_load_component(() => System.import("component/site/logs/logs.js")),
    "/log/:id":          lazy_load_component(() => System.import("component/site/log/view/log-view.js")),
    "/confeditor":       lazy_load_component(() => System.import("component/site/conf-edit/conf-edit.js")),
    "/services":         lazy_load_component(() => System.import("component/site/service/list/services.js")),
    "/service/:service": lazy_load_component(() => System.import("component/site/service/edit/service-edit.js")),
    "/user/:username":   lazy_load_component(() => System.import("component/site/user-edit/user-edit.js")),
    "/services/create":  lazy_load_component(() => System.import("component/site/service/create/service-create.js")),
    "/profile":          lazy_load_component(() => System.import("component/site/profile/profile.js"))
});
