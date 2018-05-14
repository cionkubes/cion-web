import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import logsStyle from "../../task-logs/task-logs.use.scss";
import { TaskLogs } from "../../task-logs/task-logs";

export const component_name = "Logs";

export const Logs = site_wrapper({
    view: function () {
        return m("div.home", [
            m("h1", "Logs"),
            m("div.scroll", m(TaskLogs, {compName: "rootLevelLogs"}))
        ]);
    },
    oncreate() {
        logsStyle.ref();
    },
    onremove() {
        logsStyle.unref();
    }
});
