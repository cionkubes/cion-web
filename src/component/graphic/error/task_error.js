import m from "mithril";
import svgpath from "./task_error.svg";

export const TaskErrorSvg = {
    view() {
        return m("img", { src: svgpath, title: "error" });
    }
};
