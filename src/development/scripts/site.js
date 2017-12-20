import m from 'mithril'
import {Menu} from 'scripts/components/menu'
import {Header} from 'scripts/components/header'
import {Footer} from 'scripts/components/footer'
import common_style from 'style/common.useable';

export function site_wrapper(component) {
    return {
        view: () => {
            return m('div.container', {id: "main-container"}, [
                m(Header),
                m(Menu),
                m("main", {role: "main"}, m(component)),
                m(Footer)
            ]);
        },
        oncreate() {
            common_style.ref();
        },
        onremove() {
            common_style.unref();
        }
    }
}
