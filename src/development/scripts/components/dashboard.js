import m from 'mithril';
import {site_wrapper} from 'scripts/site';
import {map, pipe} from 'scripts/helpers/fp';
import {Events} from 'scripts/components/events';
import style from 'style/dashboard';

export const component_name = "Dashboard";


function dashboard_comp_wrapper(title, component) {
    return {
        view: () => {
            return m('div.dash_component', [
                m("div.title", m("h4", title)),
                m("div.content", component)
            ]);
        }
    }
}

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
