import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import style from "./webhooks.use.scss";
import { CreateWebhookForm } from "./new-webhook-form";
import { MLContainer } from "component/masonry/ml-container";
import { MLPanel } from "component/masonry/ml-panel";
import { Minimizable } from "component/minimizable/minimizable";
import { WebhookList } from "./webhook-list";

export const component_name = "Webhooks";

export const Webhooks = site_wrapper({
    view() {
        return m("div.scroll", [
            m("h1", "Webhooks"),
            m(MLContainer, [
                m(MLPanel,
                    m(Minimizable, {
                        comp_title: "Create webhook",
                        comp: CreateWebhookForm
                    })
                )
            ]),
            // TODO: WebhookList is updated each time an entry is updated in entry-field
            m("div", [
                m("h3", "Webhooks"),
                m(WebhookList)
            ])
        ]);
    },
    oncreate() {
        style.ref();
    },
    onremove() {
        style.unref();
    }
});
