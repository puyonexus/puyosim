(function () {
    "use strict";

    var pnNavbarToggleOnClick = function () {
        var navbarCollapse = this.parentNode.getElementsByClassName(
            "pn-navbar-collapse"
        )[0];

        // Get the scrollHeight of the element, and set its height to that
        // We need to do this for both opening and closing the nav
        // Since the padding is 0, we don't need to factor that into the height
        navbarCollapse.style.height = navbarCollapse.scrollHeight + "px";

        if (this.classList.contains("collapsed")) {
            this.classList.remove("collapsed");
            navbarCollapse.classList.remove("collapse");
        } else {
            // Remove the height css
            navbarCollapse.style.height = "";

            this.classList.add("collapsed");
            navbarCollapse.classList.add("collapse");
        }
    };

    var pnNavbarCollapseOnTransitionEnd = function () {
        this.style.height = "";
    };

    var init = function () {
        var pnNavbarToggles = document.getElementsByClassName("pn-navbar-toggle"),
            pnNavbarCollapses = document.getElementsByClassName("pn-navbar-collapse");

        for (var i = 0; i < pnNavbarToggles.length; i++) {
            pnNavbarToggles[i].addEventListener("click", pnNavbarToggleOnClick);
        }

        for (var i = 0; i < pnNavbarCollapses.length; i++) {
            pnNavbarCollapses[i].addEventListener(
                "ontransitionend",
                pnNavbarCollapseOnTransitionEnd
            );
        }
    };

    document.addEventListener("DOMContentLoaded", init);
})();
