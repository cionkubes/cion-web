import m from 'mithril'
import svgpath from './upload.svg'


export const UploadSvg = {
    view() {
        return m('img', {src: svgpath})
    }
};