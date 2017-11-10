import m from 'mithril';
import {site_wrapper, dashboard_comp_wrapper} from 'scripts/site';
import {DocEditor} from "./docEditor";
// import style from 'style/dashboard';

export const component_name = "ConfEditor";

export const ConfEditor = site_wrapper({
    view: function () {
        return m("div.home", [
                m("h1", "Logs"),
                m("div",
                    m(DocEditor)
                )
            ]
        );
    }
});
