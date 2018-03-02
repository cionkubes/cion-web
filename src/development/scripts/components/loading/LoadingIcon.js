import m from "mithril";
import iconStyle from "./loading.useable";

export const LoadingIcon = {
    view() {
        return m("div.loading-icon-container", m("svg", {
            id: "loadingIcon",
            width: "25.698mm",
            height: "33.088mm",
            version: "1.1",
            viewBox: "0 0 25.698 33.088",
            xmlns: "http://www.w3.org/2000/svg"
        },
        m("g", {
            transform: "translate(-180.17 -230.38)"
        }, [
            m("path", {
                id: "botRight",
                d: "m193.02 263.46v-16.534h12.839z",
                fill: "#f5b2d4"
            }),
            m("path", {
                id: "botLeft",
                d: "m193.02 263.46v-16.534h-12.839z",
                fill: "#ffbfe0"
            }),
            m("path", {
                id: "topLeft",
                d: "m180.18 246.93h12.839v-16.534z",
                fill: "#ffebf6"
            }),
            m("path", {
                id: "topRight1",
                d: "m199.44 238.66-6.4195 8.267v-16.534z",
                fill: "#f4deea"
            }),
            m("path", {
                id: "topRight2",
                d: "m199.44 238.66-6.4195 8.267h12.839z",
                fill: "#ffbfe0"
            }),
        ])
        ));
    },

    oncreate() {
        iconStyle.ref();
    },

    onremove() {
        iconStyle.unref();
    }
};