import m from 'mithril';
import {site_wrapper, dashboard_comp_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp';
import {Events} from 'scripts/components/events';
import style from 'style/dashboard';

export const component_name = "Dashboard";

export const Dashboard = site_wrapper({
    view() {
        return m("div.home", [
                m("h1", "Dashboard"),
                m("div.component_container",
                    m(dashboard_comp_wrapper("Events", m(Events)))
                )
            ]
        );
    }
});
