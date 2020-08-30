/*
 * Tabs
 *
 * Deals with the tabs (Saved Chains, Chains, etc...)
 */

import $ from "jquery";
import { PuyoSim } from "../PuyoSim";
import { SavedChainsTab } from "./tabs/SavedChainsTab";
import { ChainsTab } from "./tabs/ChainsTab";
import { SimulatorTab } from "./tabs/SimulatorTab";
import { LinksTab } from "./tabs/LinksTab";
import { SettingsTab } from "./tabs/SettingsTab";

export class Tabs {
  savedChains: SavedChainsTab;
  chains: ChainsTab;
  simulator: SimulatorTab;
  links: LinksTab;
  settings: SettingsTab;

  constructor(readonly sim: PuyoSim) {
    this.savedChains = new SavedChainsTab(sim);
    this.chains = new ChainsTab(sim);
    this.simulator = new SimulatorTab(sim);
    this.links = new LinksTab(sim);
    this.settings = new SettingsTab(sim);
  }

  display() {
    // Displays the tab content and initalizes all of the tabs
    // Set up the tabs for the options
    $("#simulator-tabs-select > li a[data-target]").on(
      "click",
      ({ currentTarget }) => {
        const $this = $(currentTarget);
        const $dataTarget = $this.attr("data-target") || "";
        const $parent = $this.parent();

        $("#simulator-tabs-select > li.tab-active").removeClass("tab-active");
        $("#simulator-tabs .content-active").removeClass("content-active");

        if (
          !$("#simulator-tabs").hasClass("float") ||
          !$parent.hasClass("tab-active")
        ) {
          $parent.addClass("tab-active");
          $($dataTarget).addClass("content-active");
          // Don't need to get the #
          localStorage.setItem("chainsim.lastTab", $dataTarget.substr(1));
        }
      }
    );
    $(
      "#simulator-tabs-select > li a[data-target='#" +
        (localStorage.getItem("chainsim.lastTab") || "tab-share") +
        "']"
    ).trigger("click");

    $(".simulator-tabs-toggle").on("click", () => {
      const $simulatorTabs = $("#simulator-tabs");

      if ($simulatorTabs.hasClass("toggled")) {
        $simulatorTabs.removeClass("toggled");
      } else {
        $simulatorTabs.addClass("toggled");
      }
    });

    this.savedChains.init();
    this.chains.init();
    this.simulator.init();
    this.links.init();
    this.settings.init();
  }

  fieldWidthChanged() {
    // Called when the field width changes
    const $simulatorTabs = $("#simulator-tabs");
    const $simulatorTabsWidth = $simulatorTabs.outerWidth(true) || 0;
    const $simulatorTabsMinWidth = $simulatorTabs.data("min-width");

    if (
      $simulatorTabsWidth <= $simulatorTabsMinWidth &&
      !$simulatorTabs.hasClass("float")
    ) {
      $simulatorTabs.addClass("float");

      $(document).on("click.simulatorTabs", (e) => {
        const clicked = $(e.target);
        if (!clicked.parents().is("#simulator-tabs, #simulator-tabs-select")) {
          $simulatorTabs.removeClass("toggled");
        }
      });
    } else if (
      $simulatorTabsWidth > $simulatorTabsMinWidth &&
      $simulatorTabs.hasClass("float")
    ) {
      $simulatorTabs.removeClass("float toggled");
      $(document).off("click.simulatorTabs");
    }
  }
}
