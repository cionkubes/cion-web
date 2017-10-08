import m from 'mithril';
import {site_wrapper, dashboard_comp_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp';
import {Tasks} from 'scripts/components/tasks';
import style from 'style/dashboard';

export const component_name = "Status";

export const Status = site_wrapper({
    view() {
        return m("div.home", [
                m("h1", "Status"),
                m("div.component_container",
                    m(dashboard_comp_wrapper("Tasks", m(Tasks)))
                )
            ]
        );
    }
});
