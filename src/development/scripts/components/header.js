import m from "mithril";

let Collapser = {
  toggleCollapse() {
    document.getElementById("main-container").classList.toggle("container");
    document
      .getElementById("main-container")
      .classList.toggle("container-collapsed");
    let sign = document.getElementById("toggle-button").textContent;
    sign = sign === ">" ? "<" : ">";
    document.getElementById("toggle-button").textContent = sign;
  }
};

export const Header = {
  view() {
    return m("header", { role: "banner" }, [
      m("h2", "cion"),
      m("span", { onclick: Collapser.toggleCollapse, id: "toggle-button" }, "<")
    ]);
  }
};
