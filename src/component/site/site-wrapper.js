import m from "mithril";
import { Menu } from "component/sidebar/nav/nav";
import { Header } from "component/sidebar/header/header";
import { Footer } from "component/sidebar/footer/footer";
import { User } from "component/sidebar/user/user";
import { NotificationPanel } from "component/notification/panel/panel";
import site_style from "./site.use.scss";

const UnloadFuncs = {};

export function registerUnloadFunc(func, thisArg) {
    let k = createUnloadFuncKey(func, thisArg);
    if (!(k in UnloadFuncs)) {
        if (thisArg) {
            func = func.bind(thisArg);
        }
        UnloadFuncs[k] = func;
    }
}

export function unregisterUnloadFunc(func, thisArg) {
    delete UnloadFuncs[createUnloadFuncKey(func, thisArg)];
}

function createUnloadFuncKey(func, thisArg) {
    let key = func;
    if (thisArg) {
        key = [func, thisArg];
    }
    return key;
}

export function site_wrapper(component) {
    return {
        oninit() {
            window.onbeforeunload = (e) => {
                let ret = [];
                for(let key in UnloadFuncs) {
                    let func = UnloadFuncs[key];
                    let r = func(e);
                    if (r) {
                        ret.push(r);
                    }
                }
                if (ret.length > 0) {
                    console.log("returing to onbeforeunload", ret);
                    return ret;
                }
            };
        },
        view: () => {
            return [
                m("div.container", { id: "main-container" }, [
                    m(Header),
                    m(Menu),
                    m("main", { role: "main" }, m(component)),
                    m(User),
                    m(Footer)
                ]),
                m(NotificationPanel)
            ];
        },
        oncreate() {
            site_style.ref();
        },
        onremove() {
            site_style.unref();
            window.onbeforeunload = null;
        }
    };
}
