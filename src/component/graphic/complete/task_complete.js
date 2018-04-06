import m from "mithril";
import svgpath from "./task_complete.svg";

export const TaskCompleteSvg = {
    view() {
        return m("img", { src: svgpath, title: "complete" });
    }
};
