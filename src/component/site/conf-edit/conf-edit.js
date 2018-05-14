import m from "mithril";
import { map, pipe } from "utils/fp";
import { req_with_auth } from "services/api/requests";
import { site_wrapper } from "component/site/site-wrapper";
import { createNotification } from "component/notification/panel/panel";
import { docEditor } from "./doc-edit";

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
                createNotification("Error occured when fetching configs",
                    "Check your connection to the database", "error");
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
