import m from "mithril";
import svgpath from "./profile.svg";

export const ProfileSvg = {
  view() {
    return m("img", { src: svgpath });
  }
};
