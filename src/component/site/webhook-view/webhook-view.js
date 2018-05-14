import m from "mithril";
import { site_wrapper } from "component/site/site-wrapper";
import { EntityView } from "component/entity-view/entity-view";

export const component_name = "WebhookView";
export const WebhookView = site_wrapper({
    view() {
        return m(EntityView, {
            entityType: "Webhook",
            resource: {
                get: "/api/v1/webhook",
                del: "/api/v1/webhook"
            }
        });
    }
});
