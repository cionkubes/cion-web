import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {site_wrapper} from "scripts/site";
import {docEditor} from "./docEditor";
// import style from 'style/dashboard';

export const component_name = "ConfEditor";


const State = {
    docComps: [],
    documents: {},
    error: "",
    fetch: function () {
        const docs = State.documents;
        m.request({
            url: "/api/v1/documents",
            method: 'GET',
        }).then(function (response) {
            for (let document of response) {
                docs[document.name] = document;
            }
            State.docComps =
                pipe(Object.keys(docs),
                    map(d => m(docEditor(docs[d]))),
                    Array.from);
        }).catch(function (e) {
            console.log(e);
        });
    }
};

export const ConfEditor = site_wrapper({
    oninit() {
        State.fetch();
    },
    view() {
        return m("div.home", [
                m("h1", "Configs"),
                m("div", State.docComps)
            ]
        );
    }
});
