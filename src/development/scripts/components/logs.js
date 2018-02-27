import m from 'mithril';
import {site_wrapper, dashboard_comp_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp';
import {Tasks} from 'scripts/components/tasks';

export const component_name = "Logs";

export const Logs = site_wrapper({
    view: function () {
        return m("div.home", [
                m("h1", "Logs"),
                m("div.scroll",
                    m(Tasks)
                )
            ]
        );
    }
});
