declare global {
  interface Window {
    jQuery: JQueryStatic;
  }
}

import $ from "jquery";
window.jQuery = $;
// tslint:disable-next-line: no-var-requires Until bootstrap is updated?
require("bootstrap/js/dropdown.js");

function pnNavbarToggleOnClick(event: Event) {
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const navbarCollapse = target.parentElement
    ?.getElementsByClassName("pn-navbar-collapse")
    .item(0);
  if (!(navbarCollapse instanceof HTMLElement)) {
    return;
  }

  // Get the scrollHeight of the element, and set its height to that
  // We need to do this for both opening and closing the nav
  // Since the padding is 0, we don't need to factor that into the height
  navbarCollapse.style.height = navbarCollapse.scrollHeight + "px";

  if (target.classList.contains("collapsed")) {
    target.classList.remove("collapsed");
    navbarCollapse.classList.remove("collapse");
  } else {
    // Remove the height css
    navbarCollapse.style.height = "";
    target.classList.add("collapsed");
    navbarCollapse.classList.add("collapse");
  }
}

function pnNavbarCollapseOnTransitionEnd(event: Event) {
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  target.style.height = "";
}

function init() {
  for (const elem of document.getElementsByClassName("pn-navbar-toggle")) {
    elem.addEventListener("click", pnNavbarToggleOnClick);
  }
  for (const elem of document.getElementsByClassName("pn-navbar-collapse")) {
    elem.addEventListener("ontransitionend", pnNavbarCollapseOnTransitionEnd);
  }
}

document.addEventListener("DOMContentLoaded", init);
