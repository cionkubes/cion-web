import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {req_with_auth} from 'scripts/helpers/requests';
import {createNotification} from "../notifications/panel";
import tableStyle from './table.useable';
import helpStyle from 'style/help.useable';

const GoToPageField = {
    oninit(vnode) {
        vnode.state.pagination = vnode.attrs.pagination;
    },
    setGoToNumber(val, state) {
        state.goToNumber = val;
    },
    view(vnode) {
        return m('div.go-to-container', [
            m('div.go-to-descriptor', 'Go to:'),
            m('input.go-to-input', {
                type: 'number',
                oninput: m.withAttr('value', val => GoToPageField.setGoToNumber(val, vnode.state.pagination)),
                onkeypress: val => {
                    if (val.keyCode === 13) {
                        vnode.state.pagination.updateTable(vnode.state.pagination.goToNumber - 1);
                        vnode.state.pagination.goToNumber = undefined;
                    }
                    return true;
                }
            })
        ])
    },

    goToSpecificPage(pageNum, state) {
        let nPage = pageNum + 1;
        if (nPage >= 0 && nPage < state.totalPages) {
            state.activePage = nPage;
            state.updateTable();
        }
    },
};

const RowCountSelector = {
    oninit(vnode) {
        vnode.state.pagination = vnode.attrs.pagination;
    },
    view(vnode) {
        let t = this;
        return m('div.page-length-container', [
            m("div.page-length-descriptor", "Row-count:"),
            m("select.page-length-selector", {
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
                )
            )
        ])
    }
};

const PageSelector = {
    oninit(vnode) {
        vnode.state.pagination = vnode.attrs.pagination;
    },

    setSearchTerm(term, state) {
        state.term = term;
        // state.updateTable();
    },

    incDecActivePage(delta, state) {
        let nPage = state.activePage + delta;
        this.goToSpecificPage(nPage, state);
    },

    goToSpecificPage(pageNum, state) {
        let nPage = pageNum;
        if (nPage >= 0 && nPage < state.totalPages) {
            state.activePage = nPage;
            state.updateTable(nPage);
        }
    },

    view(vnode) {
        // console.log(this.pagination);
        let totalPages = Math.ceil(this.pagination.totalLength / this.pagination.pageLength);
        if (isNaN(totalPages))
            totalPages = 0;
        let t = this;
        t.pagination.totalPages = totalPages;

        if (t.pagination.totalPages === 0) {
            t.pagination.activePage = 0;
        } else if (t.pagination.activePage + 1 >= t.pagination.totalPages) {
            t.pagination.activePage = t.pagination.totalPages - 1;
        }

        return m("div", [
                m("div.cion-table-header", [
                    m("div.search-container", [
                        m("div.search-field", [
                            m('input', {
                                type: 'text',
                                placeholder: 'Search',
                                oninput: m.withAttr('value', val => PageSelector.setSearchTerm(val, vnode.state.pagination)),
                                onkeypress: val => val.keyCode === 13 ? vnode.state.pagination.updateTable() : true
                            }),
                            m("button", {
                                onclick: m.withAttr('', val => vnode.state.pagination.updateTable(), this)
                            }, ">"),
                            m('div.search-tooltip', m('div.tooltip', [
                                    m('div.tooltip-content', '?'),
                                    m('div.tooltip-text.tooltip-left', [
                                        m('p', 'Search by field from the database using the Lucene query language'),
                                        m('p', 'Apply search: press Enter'),
                                        m('p', 'Time-format: 2017-6-1-16.00.01')
                                    ])
                                ])
                            ),
                        ]),
                    ]),
                    m('ul.page-list', [
                        m('li.page-list-element.page-list-element-link.page-list-element-first', {
                                onclick: m.withAttr("", () => PageSelector.goToSpecificPage(0, t.pagination), this)
                            },
                            m('span.page-link', '<<')),
                        m('li.page-list-element.page-list-element-link', {
                                onclick: m.withAttr("", () => PageSelector.incDecActivePage(-1, t.pagination), this)
                            },
                            m('span.page-link', '<')),
                        m('li.page-list-element.active-page', {
                                onclick: m.withAttr("", () => {
                                    t.pagination.updateTable()
                                })
                            },
                            // m('span', (this.pagination.activePage + 1) + " / " + this.pagination.totalPages)
                            m('span', t.pagination.pageStart + " - " + t.pagination.pageEnd + ' of ' + t.pagination.totalLength.toLocaleString())
                        ),
                        m('li.page-list-element.page-list-element-link', {
                                onclick: m.withAttr("", () => PageSelector.incDecActivePage(1, t.pagination), this)
                            },
                            m('span.page-link', '>')),
                        m('li.page-list-element.page-list-element-last.page-list-element-link', {
                                onclick: m.withAttr("", () => PageSelector.goToSpecificPage(t.pagination.totalPages - 1, t.pagination), this)
                            },
                            m('span.page-link', '>>')),
                    ]),
                    m(GoToPageField, {pagination: t.pagination}),
                    m(RowCountSelector, {pagination: t.pagination}),
                ]),
            ]
        )
    }
};

export const Table = {
    getTableRows(state, wantedPage) {
        let t = state;
        if (wantedPage) {
            t.pagination.activePage = wantedPage;
        }
        // TODO: active page larger than total pages. Has to be fixed in backend and frontend
        if (t.pagination.activePage + 1 >= t.pagination.totalPages) {
            t.pagination.activePage = t.pagination.totalPages - 1;
        }
        if (t.pagination.activePage < 0) {
            t.pagination.activePage = 0;
        }

        console.log('updating table with activePage ', t.pagination.activePage, 'and page length', t.pagination.pageLength);
        let pageStart = t.pagination.activePage * t.pagination.pageLength;

        req_with_auth({
            url: t.resourceEndpoint + "?" + m.buildQueryString({
                pageStart: pageStart,
                pageLength: t.pagination.pageLength,
                sortIndex: t.sortIndex,
                reverseSort: t.reverseSort,
                searchTerm: t.pagination.term
            }),
            method: 'GET',
            then: function (response) {
                t.rows = [];
                response.rows.forEach(row => t.rows.push(row));
                t.pagination.totalLength = response.totalLength;

                // TODO: not accurate, use resultset to calculate pageEnd accurately
                t.pagination.pageStart = pageStart + 1;
                t.pagination.pageEnd = t.pagination.pageStart + t.pagination.pageLength;
            },
            catch: (response) => {
                t.rows = [];
                t.pagination.totalLength = 0;
                console.log(response);
            },
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
            m(PageSelector, {pagination: t.pagination}),
            m("table", [
                    m("thead",
                        m("tr",
                            pipe(
                                t.headers,
                                map(headerIndex => {
                                    let c = ["th.thead"];
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
                                                cs.push(m('td.tdat' + cssClass, data))
                                            }
                                        );
                                        return cs;
                                    },
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

        this.sortIndex = vnode.attrs.sortIndex ? vnode.attrs.sortIndex : 'time';
        this.reverseSort = false;

        this.pagination = {};
        this.pagination.term = "";
        this.pagination.pageLengthChoices = vnode.attrs.pageLengthChoices ? vnode.attrs.pageLengthChoices : [10, 20, 50, 100];
        this.pagination.totalLength = 0;
        this.pagination.activePage = 0;
        this.pagination.pageLength = vnode.attrs.pageLength ? vnode.attrs.pageLength : 20;

        this.pagination.pageStart = this.pagination.activePage * this.pagination.pageLength + 1;
        this.pagination.pageEnd = this.pagination.pageStart + this.pagination.pageLength;

        this.pagination.updateTable = function (wantedPage) {
            Table.getTableRows(this, wantedPage);

        }.bind(this);

        console.log(this.pagination.term);

        Table.getTableRows(this);
    },

    oncreate() {
        tableStyle.ref();
        helpStyle.ref();
    },

    onremove() {
        tableStyle.unref();
        helpStyle.unref();
    }
};
