import m from "mithril";
import { createNotification } from "component/notification/panel/panel";
import { req_with_auth } from "services/api/requests";

export class GravatarEmailForm {
    constructor() {
        this.gravatarEmail = localStorage.getItem("gravatar-email");
    }

    setGravatarEmail(gravatarEmail) {
        this.gravatarEmail = gravatarEmail;
    }

    sendNewGravatarEmail() {
        let t = this;
        let gravatarEmail = this.gravatarEmail;
        req_with_auth({
            url: "/api/v1/user/setgravataremail",
            method: "POST",
            data: {
                "gravatar-email": gravatarEmail
            },
            then: () => {
                createNotification(
                    "Success",
                    "Gravatar email was set. Changes will take effect the next time you log in.",
                    "success"
                );
            },
            catch: e => createNotification("Error", e, "error"),
            this: t
        });
    }

    view() {
        let t = this;
        return m("div", [
            m("h2", "Set gravatar email"),
            m("input#gravatarEmail[type=text]", {
                oninput: m.withAttr("value", this.setGravatarEmail, this),
                placeholder: "Gravatar email",
                value: t.gravatarEmail
            }),
            m("button", {onclick: this.sendNewGravatarEmail.bind(this)}, "Submit")
        ]);
    }
}
