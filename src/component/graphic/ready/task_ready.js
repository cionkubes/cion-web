import m from "mithril";
import svgpath from "./task_ready.svg";

export const TaskReadySvg = {
    view() {
        return m("img", {src: svgpath, title: "ready"});
    }
};
