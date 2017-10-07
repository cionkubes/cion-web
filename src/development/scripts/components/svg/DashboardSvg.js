import m from 'mithril';

export const DashboardSvg = {
    view() {
        return m("svg", {
                width: "66.203mm",
                height: "66.203mm",
                version: "1.1",
                viewbox: "0 0 66.203 66.203",
            },
            m("g", {transform: "translate(-34.852 -23.156)"},
                m("g",{stroke: "#fff"}, [
                    m("path", {d: "m67.953 24.919a31.337 31.337 0 0 0-31.338 31.338 31.337 31.337 0 0 0 31.338 31.337 31.337 31.337 0 0 0 31.337-31.337 31.337 31.337 0 0 0-31.337-31.338zm0 2.8505a28.487 28.487 0 0 1 28.487 28.487 28.487 28.487 0 0 1-28.487 28.487 28.487 28.487 0 0 1-28.488-28.487 28.487 28.487 0 0 1 28.488-28.487z",
                        "stroke-width": "3.5278"}),
                    m("path", {d: "m67.691 56.519 12.149-12.148",
                        "stroke-linecap": "round",
                        "stroke-linejoin":"round",
                        "stroke-width": "4.609"}),
                    m("path", {d: "m67.953 32.624a23.633 23.633 0 0 0-23.633 23.633h2.1497a21.483 21.483 0 0 1 21.483-21.483 21.483 21.483 0 0 1 21.483 21.483h2.1497a23.633 23.633 0 0 0-23.633-23.633z",
                        "stroke-width": "2.6604"})
                ])
            )
        );
    }
};