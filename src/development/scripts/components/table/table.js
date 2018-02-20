import m from 'mithril';
import {iterobj, flatMap, map, pipe} from 'scripts/helpers/fp';
import {req_with_auth} from 'scripts/helpers/requests';
import {createNotification} from "../notifications/panel";
import tableStyle from './table.useable';

export const component_name = "Tasks";

export const Table = {
    getTableRows() {
        let t = this;
        req_with_auth({
            url: t.resourceEndpoint,
            method: 'GET',
            then: function (response) {
                t.rows.splice(0, t.rows.length);
                response.forEach(row => t.rows.push(row));
            },
            catch: (e) => console.log(e),
            this: t
        });
    },

    view() {
        let t = this;
        return m("table", [
                m("thead",
                    m("tr",
                        pipe(
                            t.headers,
                            map(header => m("th", header)),
                            Array.from
                        )
                    )
                ),
                m("tbody",
                    pipe(
                        this.rows, // list of dictionaries, where each dict is a row
                        map(row => m("tr", {class: this.rowClassFunc(row)},
                            pipe(
                                row,
                                this.transformFunc,
                                map(data => m('td', data)),
                                Array.from))),
                        Array.from
                    )
                )
            ]
        );
    },

    oninit(vnode) {
        if (!vnode.attrs.resourceEndpoint) {
            throw new Error(
                "Unable to create table without any content. Make sure to " +
                "specify the attribute 'resourceEndpoint' for the table.");
        }

        this.resourceEndpoint = vnode.attrs.resourceEndpoint;

        this.pageStart = vnode.attrs.pageStart ? vnode.attrs.pageStart : 0;
        this.pageLength = vnode.attrs.pageLength ? vnode.attrs.pageLength : 20;

        this.headers = vnode.attrs.headers;

        this.transformFunc = vnode.attrs.transformFunc
            ? vnode.attrs.transformFunc
            : (row) => pipe(
                Object.keys(row),
                map(key => row[key]),
                Array.from
            );

        if (vnode.attrs.rowClassFunc) {
            this.rowClassFunc = vnode.attrs.rowClassFunc;
        } else {
            this.rowClassFunc = () => "row-class";
        }

        this.rows = [];
        Table.getTableRows.bind(this)();
    },

    oncreate() {
        tableStyle.ref();
    },

    onremove() {
        tableStyle.unref();
    }
};
