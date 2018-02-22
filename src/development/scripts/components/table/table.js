import m from 'mithril';
import {iterobj, flatMap, map, pipe, isfunction} from 'scripts/helpers/fp';
import {req_with_auth} from 'scripts/helpers/requests';
import {createNotification} from "../notifications/panel";
import tableStyle from './table.useable';

export const component_name = "Tasks";

const PageSelector = {
    oninit(vnode) {
        vnode.state.search = vnode.attrs.search;
        vnode.state.pagination = vnode.attrs.pagination;
    },

    setSearchTerm(term, state) {
        state.term = term;
    },

    incDecActivePage(delta, state) {
        let nPage = state.activePage + delta;
        if (nPage >= 0 && nPage < state.totalPages) {
            state.activePage = nPage;
            state.updateTable()
        }
    },

    view(vnode) {
        // console.log(this.pagination);
        let totalPages = Math.ceil(this.pagination.totalLength / this.pagination.pageLength);
        if (isNaN(totalPages))
            totalPages = 0;
        let t = this;
        t.pagination.totalPages = totalPages;
        return m("div", [
                m("div.cion-table-header", [
                    m("div", m('input', {
                        type: 'text',
                        placeholder: 'Search',
                        oninput: m.withAttr('value', val => PageSelector.setSearchTerm(val, vnode.state.search))
                    })),
                    m("div", m("div", "Row-count:")),
                    m("div", m("select", {
                            onchange: m.withAttr("value", val => {
                                t.pagination.pageLength = val;
                                t.pagination.updateTable();
                            }, this)
                        },
                        pipe(
                            t.pagination.pageLengthChoices,
                            map(lengthNum => m("option", {
                                value: lengthNum,
                                selected: (t.pagination.pageLength === lengthNum ? "selected" : "")
                            }, lengthNum)),
                            Array.from
                        )))
                ]),
                m('ul.page-list', [
                    m('li.page-list-element', {
                        onclick: m.withAttr("", () => PageSelector.incDecActivePage(-1, t.pagination), this)
                    }, m('span.page-link', '< previous')),
                    pipe(
                        Array(totalPages).keys(),
                        map(i => m('li.page-list-element' + (i === t.pagination.activePage ? ".active-page" : ""), {
                                onclick: m.withAttr("", () => {
                                    t.pagination.activePage = i;
                                    t.pagination.updateTable()
                                }),
                            },
                            m('span.page-link', i + 1))),
                        Array.from),
                    m('li.page-list-element.page-list-element-last', {
                        onclick: m.withAttr("", () => PageSelector.incDecActivePage(1, t.pagination), this)
                    }, m('span.page-link', 'next >')),
                ])
            ]
        )
    }
};

export const Table = {
    getTableRows(state) {
        let t = state;
        req_with_auth({
            url: t.resourceEndpoint + "?" + m.buildQueryString({
                pageStart: t.pagination.activePage * t.pagination.pageLength,
                pageLength: t.pagination.pageLength,
                sortIndex: t.sortIndex,
                reverseSort: t.reverseSort
            }),
            method: 'GET',
            then: function (response) {
                t.rows.splice(0, t.rows.length);
                response.rows.forEach(row => t.rows.push(row));
                t.pagination.totalLength = response.totalLength;
            },
            catch: (e) => console.log(e),
            this: t
        });
    },

    sortTable(index, searchState) {
        let prevIndex = searchState.sortIndex;
        searchState.sortIndex = index;
        if (prevIndex === index) {
            searchState.reverseSort = !searchState.reverseSort;
            // table.reverse();
        } else {
            searchState.reverseSort = false;
        }

        Table.getTableRows(searchState);
    },

    view() {
        let t = this;
        return m('div', [
            m(PageSelector, {pagination: t.pagination, search: t.search}),
            m("table", [
                    m("thead",
                        m("tr",
                            pipe(
                                t.headers,
                                map(headerIndex => {
                                    let c = ["th"];
                                    if (headerIndex[1]) {
                                        c.push('clickable')
                                    }
                                    if (headerIndex[1] === this.sortIndex) {
                                        c.push('sortedBy')
                                    }
                                    return m(c.join("."), {
                                        onclick: m.withAttr("", () => Table.sortTable(headerIndex[1], this), this)
                                    }, headerIndex[0])
                                }),
                                Array.from
                            )
                        )
                    ),
                    m("tbody",
                        pipe(
                            this.rows, // list of dictionaries, where each dict is a row
                            map(row => m("tr",
                                {class: this.rowClassFunc(row)},
                                pipe(
                                    row,
                                    this.transformFunc,
                                    (row) => {
                                        let i = 0;
                                        let cs = [];
                                        row.forEach(
                                            data => {
                                                let cssClass = "";
                                                if (this.sortIndex === this.headers[i][1]) {
                                                    cssClass = ".sortedBy";
                                                }
                                                i++;
                                                cs.push(m('td' + cssClass, data))
                                            }
                                        );
                                        return cs;
                                    },
                                    // map(data => m('td', data)),
                                    Array.from))),
                            Array.from
                        )
                    )
                ]
            )]);
    },

    oninit(vnode) {
        if (!vnode.attrs.resourceEndpoint) {
            throw new Error(
                "Unable to create table without any content. Make sure to " +
                "specify the attribute 'resourceEndpoint' for the table.");
        }

        this.resourceEndpoint = vnode.attrs.resourceEndpoint;

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
        this.search = {};
        this.search.term = "";

        this.sortIndex = -1;
        this.reverseSort = false;
        this.totalLength = -1;

        this.pagination = {};
        this.pagination.pageLengthChoices = vnode.attrs.pageLengthChoices ? vnode.attrs.pageLengthChoices : [10, 20, 50, 100];
        this.pagination.totalLength = -1;
        this.pagination.activePage = 0;
        this.pagination.pageLength = vnode.attrs.pageLength ? vnode.attrs.pageLength : 20;
        this.pagination.updateTable = function () {
            Table.getTableRows(this);
        }.bind(this);

        console.log(this.search.term);

        Table.getTableRows(this);
    },

    oncreate() {
        tableStyle.ref();
    },

    onremove() {
        tableStyle.unref();
    }
};
