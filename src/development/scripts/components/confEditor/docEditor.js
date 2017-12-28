import m from 'mithril';
import {UploadSvg} from "../upload-icon/controller";
import {createNotification} from "../notifications/panel";
import style from './doc_editor.useable';
import {req_with_auth} from 'scripts/helpers/requests';

export function docEditor(config) {
    return class {

        constructor(vnode) {
            vnode.config = config;
            vnode.text = JSON.stringify(config.document, null, 2);
            vnode.setText = this.setText;
            vnode.updateDocument = this.updateDocument;
        }

        updateDocument(e, vnode) {
            console.log("update doc called");
            try {
                vnode.config.document = JSON.parse(vnode.text);
                let data = vnode.config;
                console.log(vnode.config);
                req_with_auth({
                    url: "/api/v1/documents",
                    method: 'POST',
                    data: data,
                    then: (e) => createNotification('Document saved successfully', '', 'success'),
                    catch: (e) => createNotification('An error occurred when saving the document', e, 'error')
                })
            } catch (e) {
                createNotification('Invalid JSON', 'Refusing to send document \'' + vnode.config.name +
                    '\' due to it being of incorrect format', 'error');
            }
        }

        setText(e, vnode) {
            e.preventDefault();
            vnode.text = e.currentTarget.value;
            try {
                vnode.config.document = JSON.parse(vnode.text);
                console.log(`Document '${vnode.config.name}' is correct`);
            } catch (e) {
                // TODO: set borders of textarea to red
                console.log(`Error occurred while parsing JSON in config '${vnode.config.name}'`);
            }
        }

        view(vnode) {
            return m("div", [
                m("h3", vnode.config.name),
                m("textarea", {
                    oninput: function (e) {
                        vnode.setText(e, vnode)
                    }
                }, vnode.text),
                m("div.bot",
                    m("button.save-button", {
                            onclick: function (e) {
                                vnode.updateDocument(e, vnode)
                            }
                        },
                        m("div", [
                            m(UploadSvg),
                            m("span", "Save")
                        ])
                    )
                )
            ]);
        }

        oncreate() {
            style.ref();
        }

        onremove() {
            style.unref();
        }

    }
}
