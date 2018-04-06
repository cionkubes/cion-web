import m from "mithril";
import svgpath from "./task_processing.svg";

export const TaskProcessingSvg = {
    view() {
        return m("img", { src: svgpath, title: "processing" });
    }
};
