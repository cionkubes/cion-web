import m from "mithril";
import svgpath from "./logo.svg";

export const LogoSvg = {
  view() {
    return m("img", { src: svgpath });
  }
};
