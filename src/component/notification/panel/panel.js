import m from "mithril";
import { Notification } from "../notification";
import { map, pipe } from "utils/fp";
import style from "./panel.use.scss";

const State = {
    notifications: [],
    delNotif(notif) {
        State.notifications.splice(State.notifications.indexOf(notif), 1);
        m.redraw();
    }
};

/**
 * Valid types: success, warning, error
 */
export function createNotification(title, message, type) {
    let notif = new Notification(title, message, type);
    State.notifications.push(notif);
    setTimeout(() => State.delNotif(notif), 10000);
}

export const NotificationPanel = {
    view() {
        return m(
            "div.panel",
            m("div.colwrap",
                pipe(
                    State.notifications,
                    map(notif =>
                        m("blockquote", {class: notif.type}, [
                            m("h6", notif.title),
                            m("p", notif.message)
                        ])
                    ),
                    Array.from
                )
            )
        );
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
};
