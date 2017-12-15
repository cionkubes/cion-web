import m from 'mithril';
import {map, pipe} from 'scripts/helpers/fp';
import {req_with_auth} from 'scripts/helpers/requests';
import {site_wrapper} from "scripts/site";
import {docEditor} from "./docEditor";
import style from './conf_editor.scss';

export const component_name = "ConfEditor";


const State = {
    docComps: [],
    documents: {},
    error: "",
    fetch: function () {
        const docs = State.documents;
        req_with_auth({
            url: "/api/v1/documents",
            method: 'GET'
        }).then(function (response) {
            let bod = response.body;
            for (let document of bod) {
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
                m("div.scroll", State.docComps)
            ]
        );
    }
});
