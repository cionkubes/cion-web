import m from "mithril";
import { map, pipe } from "utils/fp";
import { req_with_auth } from "services/api/requests";
import tableStyle from "./table.use.scss";
import helpStyle from "component/tooltip/tooltip.use.scss";
import { LoadingIcon } from "component/graphic/loading/loading";

const GoToEntryField = {
    oninit(vnode) {
        vnode.state.pagination = vnode.attrs.pagination;
    },
    setGoToNumber(val, state) {
        state.goToNumber = val;
    },
    view(vnode) {
        return m("div.go-to-container", [
            m("div.go-to-descriptor", "Go to:"),
            m("input.go-to-input", {
                type: "number",
                oninput: m.withAttr("value", val => GoToEntryField.setGoToNumber(val, vnode.state.pagination)),
                onkeypress: val => {
                    if (val.keyCode === 13) {
                        if (vnode.state.pagination.goToNumber) {
                            vnode.state.pagination.updateTable(Math.floor((parseInt(vnode.state.pagination.goToNumber - 1)) / vnode.state.pagination.pageLength));
                        }
                    }
                    return true;
                }
            })
        ]);
    }
};

const RowCountSelector = {
    oninit(vnode) {
        vnode.state.pagination = vnode.attrs.pagination;
    },
    view() {
        let t = this;
        return m("div.page-length-container", [
            m("div.page-length-descriptor", "Row-count:"),
            m("select.page-length-selector", {
                    onchange: m.withAttr("value", val => {
                        t.pagination.pageLength = parseInt(val);
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
        ]);
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
        let t = this;

        if (t.pagination.totalPages === 0) {
            t.pagination.activePage = 0;
        } else if (t.pagination.activePage + 1 >= t.pagination.totalPages) {
            t.pagination.activePage = t.pagination.totalPages - 1;
        }

        return m("div", [
            m("div.cion-table-header", [
                m("div.search-container", [
                    m("div.search-field", [
                        m("input", {
                            type: "text",
                            placeholder: "Search",
                            oninput: m.withAttr("value", val => PageSelector.setSearchTerm(val, vnode.state.pagination)),
                            onkeypress: val => val.keyCode === 13 ? vnode.state.pagination.updateTable() : true
                        }),
                        m("button", {
                            onclick: m.withAttr("", () => vnode.state.pagination.updateTable(), this)
                        }, ">"),
                        m("div.search-tooltip", m("div.tooltip", [
                                m("div.tooltip-content", "?"),
                                m("div.tooltip-text.tooltip-left", [
                                    m("p", "Search by field from the database using the Lucene query language"),
                                    m("p", "Apply search: press Enter"),
                                    m("p", "Time-format: 2017-6-1-16.00.01")
                                ])
                            ])
                        ),
                    ]),
                ]),
                m("ul.page-list", [
                    m("li.page-list-element.page-list-element-link.page-list-element-first", {
                            onclick: m.withAttr("", () => PageSelector.goToSpecificPage(0, t.pagination), this)
                        },
                        m("span.page-link", "<<")),
                    m("li.page-list-element.page-list-element-link", {
                            onclick: m.withAttr("", () => PageSelector.incDecActivePage(-1, t.pagination), this)
                        },
                        m("span.page-link", "<")),
                    m("li.page-list-element.active-page", {
                            onclick: m.withAttr("", () => {
                                t.pagination.updateTable();
                            })
                        },
                        // m('span', (this.pagination.activePage + 1) + " / " + this.pagination.totalPages)
                        m("span", t.pagination.pageStart.toLocaleString() + " - " + t.pagination.pageEnd.toLocaleString() + " of " + t.pagination.totalLength.toLocaleString())
                    ),
                    m("li.page-list-element.page-list-element-link", {
                            onclick: m.withAttr("", () => PageSelector.incDecActivePage(1, t.pagination), this)
                        },
                        m("span.page-link", ">")),
                    m("li.page-list-element.page-list-element-last.page-list-element-link", {
                            onclick: m.withAttr("", () => PageSelector.goToSpecificPage(t.pagination.totalPages - 1, t.pagination), this)
                        },
                        m("span.page-link", ">>")),
                ]),
                m(GoToEntryField, { pagination: t.pagination }),
                m(RowCountSelector, { pagination: t.pagination }),
            ]),
        ]);
    }
};

export const Table = {
    getTableRows(state, wantedPage) {
        let t = state;
        let acPage = t.pagination.activePage;
        let totalPages = Math.ceil(t.pagination.totalLength / t.pagination.pageLength);
        if (isNaN(totalPages))
            totalPages = 0;
        t.pagination.totalPages = totalPages;

        if (wantedPage !== undefined) {
            acPage = wantedPage;
        }

        // TODO: active page larger than total pages. Has to be fixed in backend and frontend
        if (acPage + 1 >= t.pagination.totalPages) {
            acPage = t.pagination.totalPages - 1;
        }
        if (acPage < 0) {
            acPage = 0;
        }

        t.pagination.activePage = acPage;

        let pageStart = t.pagination.activePage * t.pagination.pageLength;

        t.rows = [];
        t.loading = true;
        req_with_auth({
            url: t.resourceEndpoint + "?" + m.buildQueryString({
                pageStart: pageStart,
                pageLength: t.pagination.pageLength,
                sortIndex: t.pagination.sortIndex,
                reverseSort: t.pagination.reverseSort,
                searchTerm: t.pagination.term
            }),
            method: "GET",
            then: function (response) {
                response.rows.forEach(row => t.rows.push(row));
                let resLength = parseInt(response.totalLength);
                t.pagination.totalLength = resLength;

                // TODO: not accurate, use resultset to calculate pageEnd accurately
                t.pagination.pageStart = parseInt(pageStart) + 1;

                if (t.pagination.pageStart > resLength - t.pagination.pageLength) {
                    t.pagination.pageStart = resLength - t.pagination.pageLength;
                }

                if (t.pagination.pageStart < 0) {
                    t.pagination.pageStart = 0;
                }

                t.pagination.pageEnd = parseInt(pageStart) + t.pagination.pageLength;
                if (t.pagination.pageEnd > resLength) {
                    t.pagination.pageEnd = resLength;
                }

                t.loading = false;
            },
            catch: (response) => {
                t.pagination.totalLength = 0;
                console.error(response);
                t.loading = false;
            },
            this: t
        });
    },

    sortTable(index, state) {
        let prevIndex = state.pagination.sortIndex;
        state.pagination.sortIndex = index;
        if (prevIndex === index) {
            state.pagination.reverseSort = !state.pagination.reverseSort;
        } else {
            state.pagination.reverseSort = false;
        }
        Table.getTableRows(state);
    },

    truncString(data) {
        let l = 65; // TODO move somewhere else
        if (data && data.length > l) {
            return data.substring(0, l - 6) + " [...]";
        }
        return data;
    },

    headMap(headerIndex) {
        let c = ["th.thead"];
        let attrs = {};
        let s = headerIndex;
        if (Array.isArray(headerIndex)) {
            c.push("clickable");
            if (headerIndex[0] === this.pagination.sortIndex) {
                c.push("sorted-by");
            }
            attrs = {
                onclick: m.withAttr("", () => Table.sortTable(headerIndex[0], this), this)
            };
            s = headerIndex[0];
        }
        return m(c.join("."), attrs, s);
    },

    rowMap(row) {
        return m("tr",
            { class: this.rowClassFunc(row) },
            pipe(row,
                this.transformFunc,
                (row) => {
                    let i = 0;
                    let cs = [];
                    row.cols.forEach(data => {
                        let cssClass = "";
                        if (Array.isArray(this.headers[i]) && this.pagination.sortIndex === this.headers[i][0]) {
                            cssClass += ".sorted-by";
                        }

                        if (i === row.cols.length - 1) {
                            cssClass += ".last";
                        }

                        i++;
                        let c = Table.truncString(data);
                        cs.push(row.route ?
                            m("td.tdat.anchored" + cssClass, m("a", { href: row.route }, c))
                            : m("td.tdat" + cssClass, c)
                        );
                    });
                    // console.log(cs);
                    return cs;
                }, Array.from));
    },

    view() {
        let t = this;
        return m("div", [
            m(PageSelector, { pagination: t.pagination }),
            // m(LoadingIcon)
            t.loading ? m(LoadingIcon) :
                m("table", [
                    m("thead", m("tr", pipe(
                        t.headers,
                        map(this.headMap.bind(this)),
                        Array.from))),
                    m("tbody", pipe(
                        this.rows, // list of dictionaries, where each dict is a row
                        map(this.rowMap.bind(this)),
                        Array.from)
                    )
                ])
        ]);
    },

    oninit(vnode) {
        if (!vnode.attrs.resourceEndpoint) {
            throw new Error(
                "Unable to create table without any content. Make sure to " +
                "specify the attribute 'resourceEndpoint' for the table."
            );
        }

        this.resourceEndpoint = vnode.attrs.resourceEndpoint;

        this.headers = vnode.attrs.headers;

        this.transformFunc = vnode.attrs.transformFunc
            ? vnode.attrs.transformFunc
            : row => pipe(Object.keys(row), map(key => row[key]), Array.from);

        if (vnode.attrs.rowClassFunc) {
            this.rowClassFunc = vnode.attrs.rowClassFunc;
        } else {
            this.rowClassFunc = () => "row-class";
        }

        this.rows = [];

        this.compName = vnode.attrs.compName ? vnode.attrs.compName : btoa(this.resourceEndpoint);

        // this.sortIndex = vnode.attrs.sortIndex ? vnode.attrs.sortIndex : "time";
        // this.reverseSort = false;

        let paginationStorage = this.loadState();
        this.pagination = {
            sortIndex: this.getStoredValue(paginationStorage, ["sortIndex"], vnode.attrs.sortIndex ? vnode.attrs.sortIndex : "time"),
            reverseSort: this.getStoredValue(paginationStorage, ["reverseSort"], false),
            term: this.getStoredValue(paginationStorage, ["term"], ""),
            pageLengthChoices: vnode.attrs.pageLengthChoices ? vnode.attrs.pageLengthChoices : [10, 20, 50, 100],
            totalLength: this.getStoredValue(paginationStorage, ["totalLength"], 0),
            activePage: this.getStoredValue(paginationStorage, ["activePage"], 0),
            pageLength: this.getStoredValue(paginationStorage, ["pageLength"], vnode.attrs.pageLength ? vnode.attrs.pageLength : 20),
        };

        this.pagination.pageStart = this.pagination.activePage * this.pagination.pageLength + 1;
        this.pagination.pageEnd = this.pagination.pageStart + this.pagination.pageLength;

        this.pagination.updateTable = function (wantedPage) {
            Table.getTableRows(this, wantedPage);
        }.bind(this);

        Table.getTableRows(this);
    },

    getStoredValue(storage, keyList, defaultValue) {
        let d = storage;
        if (!storage) {
            return defaultValue;
        }
        let foundVal = false;
        for (let key of keyList) {
            if (!d.hasOwnProperty(key)) {
                break;
            }
            foundVal = true;
            d = storage[key];
            if (!d) {
                break;
            }
        }
        return foundVal ? d : defaultValue;
    },

    oncreate() {
        tableStyle.ref();
        helpStyle.ref();
    },

    onremove() {
        tableStyle.unref();
        helpStyle.unref();
        this.saveState();
    },

    saveState() {
        localStorage.setItem(this.createKey(), JSON.stringify(this.pagination));
    },

    loadState() {
        return JSON.parse(localStorage.getItem(this.createKey()));
    },

    createKey() {
        let t = "table";
        let username = localStorage.getItem("username");
        let compName = this.compName;
        return [t, compName, username].join(".");
    }
};
