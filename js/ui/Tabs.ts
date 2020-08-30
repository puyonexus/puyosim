/*
 * Tabs
 *
 * Deals with the tabs (Saved Chains, Chains, etc...)
 */

import $ from "jquery";
import { PuyoSim } from "../PuyoSim";
import { SavedChainsTab } from "./tabs-legacy/SavedChainsTab";
import { ChainsTab } from "./tabs-legacy/ChainsTab";
import { SimulatorTab } from "./tabs-legacy/SimulatorTab";
import { LinksTab } from "./tabs-legacy/LinksTab";
import { SettingsTab } from "./tabs-legacy/SettingsTab";

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

  // Displays the tab content and initalizes all of the tabs
  display() {
    // Set up the tabs for the options
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
