import m from 'mithril';
import {UploadSvg} from "../upload-icon/controller";
import style from './doc_editor.useable';

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
                m.request({
                    url: "/api/v1/documents",
                    method: 'POST',
                    data: vnode.config,
                    extract: function (xhr) {
                        return {status: xhr.status, body: xhr.responseText}
                    }
                }).then(function (response) {
                    console.log(response)
                })
            } catch (e) {
                console.log(e);
                console.log('Refusing to send updated document. ' +
                    `Reason: error occurred while parsing JSON in config '${vnode.config.name}'`)
            }
        }

        setText(e, vnode) {
            console.log("set text called");
            console.log(vnode);
            e.preventDefault();
            vnode.text = e.currentTarget.value;
            try {
                vnode.config.document = JSON.parse(vnode.text);
            } catch (e) {
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
