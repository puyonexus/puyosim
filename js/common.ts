declare global {
  interface Window {
    jQuery: JQueryStatic;
  }
}

import $ from "jquery";
window.jQuery = $;
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
  const pnNavbarToggles = document.getElementsByClassName("pn-navbar-toggle");
  const pnNavbarCollapses = document.getElementsByClassName(
    "pn-navbar-collapse"
  );

  for (var i = 0; i < pnNavbarToggles.length; i++) {
    pnNavbarToggles[i].addEventListener("click", pnNavbarToggleOnClick);
  }

  for (var i = 0; i < pnNavbarCollapses.length; i++) {
    pnNavbarCollapses[i].addEventListener(
      "ontransitionend",
      pnNavbarCollapseOnTransitionEnd
    );
  }
}

document.addEventListener("DOMContentLoaded", init);
