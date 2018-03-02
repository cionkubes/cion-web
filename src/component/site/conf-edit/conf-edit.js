import m from "mithril";
import { map, pipe } from "src/utils/fp";
import { req_with_auth } from "src/services/api/requests";
import { site_wrapper } from "src/component/site/site-wrapper";
import { createNotification } from "../notifications/panel";
import { docEditor } from "./docEditor";

export const component_name = "ConfEditor";

const State = {
    docComps: [],
    documents: {},
    error: "",
    fetch: function () {
        const docs = State.documents;
        req_with_auth({
            url: "/api/v1/documents",
            method: "GET",
            then: function (response) {
                for (let document of response) {
                    docs[document.name] = document;
                }
                State.docComps = pipe(
                    Object.keys(docs),
                    map(d => m(docEditor(docs[d]))),
                    Array.from
                );
            },
            catch: function (e) {
                console.error(e);
                createNotification("Request error", e, "error");
            }
        });
    }
};

export const ConfEditor = site_wrapper({
    oninit() {
        State.fetch();
    },
    view() {
        return m("div.home", [m("h1", "Configs"), m("div.scroll", State.docComps)]);
    }
});
