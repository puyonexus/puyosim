/*
 * Tabs
 *
 * Deals with the tabs (Saved Chains, Chains, etc...)
 */

import $ from "jquery";
import { config } from "./config";
import {
  FieldDefaultWidth,
  FieldDefaultHeight,
  FieldDefaultHiddenRows,
  SimulationDefaultPuyoToClear,
  SimulationDefaultTargetPoints,
} from "./constants";
import { content } from "./content";
import { Utils } from "./utils";
import { default as attackPowersJson } from "./data/attackPowers.json";
import { default as chainsJson } from "./data/chains.json";
import { PuyoSim } from "./puyosim";

interface ISavedChain {
  name: string;
  width: number;
  height: number;
  hiddenRows: number;
  chain: string;
  format: "base36" | "legacy";
}

class SavedChainsTab {
  // Saved chains array
  chains: ISavedChain[] = [];

  constructor(readonly sim: PuyoSim) {}

  // Initalizes this tab
  init() {
    // Use the name of the shared chain if we are viewing one
    if (
      window.chainData !== undefined &&
      window.chainData.title !== undefined
    ) {
      $("#save-chain-name").val(window.chainData.title);
    }

    // Save chain
    $("#save-chain-save").click(() => {
      if ($("#save-chain-name").val() !== "") {
        this.add(String($("#save-chain-name").val()));
        $("#save-chain-name").val("");
      }
    });

    // The chains are stored as a JSON object in localStorage.chainsim.savedChains as follows:
    // name   = the name of the chain
    // width  = width of chain
    // height = height of chain
    // chain  = the actual chain itself
    const data = localStorage.getItem("chainsim.savedChains") || "";
    if (data !== "") {
      try {
        this.chains = JSON.parse(data);
      } catch (e) {
        this.chains = [];
      }
    }

    this.display();
  }

  load(index: number) {
    // Load a chain
    let chain = this.chains[index].chain;

    // If this chain is saved in a legacy format, convert it to base36
    if ((this.chains[index].format || "legacy") === "legacy") {
      const oldChars = "0475681BCA32";
      const oldChain = chain;
      chain = "";

      for (let i = 0; i < oldChain.length; i++) {
        const charIndex = oldChars.indexOf(oldChain[i]);
        chain += charIndex !== -1 ? charIndex.toString(36) : "0";
      }
    }

    this.sim.field.setChain(
      chain,
      this.chains[index].width || FieldDefaultWidth,
      this.chains[index].height || FieldDefaultHeight,
      this.chains[index].hiddenRows || FieldDefaultHiddenRows
    );
  }

  add(name: string) {
    // Add a chain to the chains list
    if (name === "") {
      // No name was set
      return;
    }

    this.chains.push({
      name,
      width: this.sim.field.width,
      height: this.sim.field.height,
      hiddenRows: this.sim.field.hiddenRows,
      chain: this.sim.field.mapToString(),
      format: "base36",
    });

    this.saveChains();
    this.addToDisplay(this.chains.length - 1);
  }

  remove(index: number) {
    // Removes the chain at the specified index
    this.chains.splice(index, 1);

    this.saveChains();
    this.removeFromDisplay(index);
  }

  saveChains() {
    // Saves the chains
    localStorage.setItem("chainsim.savedChains", JSON.stringify(this.chains));
  }

  display() {
    // Display the chains that are saved
    const self = this;

    $("#saved-chains-list").empty(); // Delete any entries that might be displayed

    if (this.chains.length === 0) {
      // No saved chains
      $(".hide-on-saved-chains").show();
    } else {
      for (var i = 0; i < this.chains.length; i++) {
        this.addToDisplay(i);
      }
    }

    $("#saved-chains-list")
      .on("click", "li .chain-name a", function () {
        self.load(
          parseInt(
            $(this).parents("#saved-chains-list li").attr("data-value")!,
            10
          )
        );
      })
      .on("click", "li .icon-delete", function () {
        self.remove(
          parseInt(
            $(this).parents("#saved-chains-list li").attr("data-value")!,
            10
          )
        );
      });
  }

  addToDisplay(index: number) {
    // Adds the chain with the specified index to the end of the displayed list
    if ($("#saved-chains-list").children("li[data-value]").length === 0) {
      // Remove the "You have no saved chains" message
      $(".hide-on-saved-chains").hide();
      $(".show-on-saved-chains").show();
    }

    $("<li>")
      .attr("data-value", index)
      .html(
        '<a class="icon-delete" title="Delete Chain"></a><span class="chain-name"><a class="link">' +
          Utils.escape(this.chains[index].name) +
          "</a></span>"
      )
      .appendTo("#saved-chains-list");
  }

  removeFromDisplay(index: number) {
    // Removes the chain with the specified index from the list
    $("#saved-chains-list li[data-value='" + index + "']").remove();

    if ($("#saved-chains-list").children("li[data-value]").length === 0) {
      // If there is nothing left then display the "You have no saved chains" message
      $(".show-on-saved-chains").hide();
      $(".hide-on-saved-chains").show();
    }
  }
}

class ChainsTab {
  chains: typeof chainsJson = [];

  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalizes this tab
    var self = this;

    this.chains = chainsJson;

    // Categories
    for (var i = 0; i < this.chains.length; i++) {
      $("#preset-chains .dropdown-menu").append(
        "<h3>" + this.chains[i].name + "</h3>"
      );
      var category = $("<ul>");

      // Sub-categories
      for (var j = 0; j < this.chains[i].categories.length; j++) {
        $("<li>")
          .attr("data-category", i)
          .attr("data-value", j)
          .html("<a>" + this.chains[i].categories[j].name + "</a>")
          .appendTo(category);
      }

      $("#preset-chains .dropdown-menu").append(category);
    }

    $("#preset-chains .dropdown-menu a").click(function () {
      var category = parseInt(
          String($(this).parent().attr("data-category")),
          10
        ),
        value = parseInt(String($(this).parent().attr("data-value")), 10);

      $("#preset-chains .dropdown-menu li.selected").removeClass("selected");
      $(this).parent().addClass("selected");

      $("#preset-chains-series").text(self.chains[category].name);
      $("#preset-chains-group").text(
        self.chains[category].categories[value].name
      );

      self.displaySubCategory(category, value);
    });

    $(document).on("change", "#preset-chains-list select", function () {
      if ($(this).prop("selectedIndex") === 0) {
        return;
      }

      var category = parseInt(
          String(
            $("#preset-chains .dropdown-menu .selected").attr("data-category")
          ),
          10
        ),
        subCategory = parseInt(
          String(
            $("#preset-chains .dropdown-menu .selected").attr("data-value")
          ),
          10
        ),
        type = parseInt(String($(this).attr("data-type")), 10),
        colors = parseInt(String($(this).attr("data-colors")), 10),
        length = parseInt(String($(this).val()), 10);

      self.sim.field.setChain(
        self.chains[category].categories[subCategory].types[type].colors[colors]
          .chains[length].chain, // Chain
        self.chains[category].categories[subCategory].fieldWidth ||
          FieldDefaultWidth, // Field width
        self.chains[category].categories[subCategory].fieldHeight ||
          FieldDefaultHeight, // Field height
        FieldDefaultHiddenRows // Hidden rows (It's always 1 with these chains)
      );

      self.sim.simulation.puyoToClear =
        self.chains[category].categories[subCategory].puyoToClear ||
        SimulationDefaultPuyoToClear;
      $("#puyo-to-clear").val(self.sim.simulation.puyoToClear);

      $(this).prop("selectedIndex", 0);
    });

    $(
      "#preset-chains .dropdown-menu li[data-category='0'][data-value='1'] a"
    ).click();
  }

  displaySubCategory(category: number, subCategory: number) {
    $("#preset-chains-list").empty(); // Empty the list so we can put new stuff in it

    // Chain types
    for (
      var i = 0;
      i < this.chains[category].categories[subCategory].types.length;
      i++
    ) {
      var row = $("<dl>"),
        dd = $("<dd>");

      // Name of the chain type
      $("<dt>")
        .text(this.chains[category].categories[subCategory].types[i].name)
        .appendTo(row);

      // Select boxes for each color
      for (
        var j = 0;
        j <
        this.chains[category].categories[subCategory].types[i].colors.length;
        j++
      ) {
        var select = $("<select>").attr("data-type", i).attr("data-colors", j);

        // Add color amount as the first index
        $("<option>")
          .text(
            this.chains[category].categories[subCategory].types[i].colors[j]
              .amount + " Col"
          )
          .appendTo(select);

        // Add the list of chains
        for (
          var k = 0;
          k <
          this.chains[category].categories[subCategory].types[i].colors[j]
            .chains.length;
          k++
        ) {
          $("<option>")
            .attr("value", k)
            .text(
              this.chains[category].categories[subCategory].types[i].colors[j]
                .chains[k].length
            )
            .appendTo(select);
        }

        select.appendTo(dd);
        dd.appendTo(row);
      }

      $("<li>").append(row).appendTo("#preset-chains-list");
    }
  }
}

class SimulatorTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    const self = this;

    // Initalizes this tab
    // Scoring
    $("input[type='radio'][name='score-mode']")
      .change(function () {
        switch ($(this).filter(":checked").val()) {
          case "classic":
            self.sim.simulation.scoreMode = 0;
            break; // 0 = Classic scoring
          case "fever":
            self.sim.simulation.scoreMode = 1;
            break; // 1 = Fever scoring
        }
      })
      .filter("[value='classic']")
      .prop("checked", true); // Default to classic scoring

    // Puyo to Clear
    $("#puyo-to-clear")
      .change(function () {
        self.sim.simulation.puyoToClear = parseInt(String($(this).val()), 10);
      })
      .html(Utils.createDropDownListOptions(Utils.range(2, 6, 1)))
      .val(self.sim.simulation.puyoToClear); // Default to 4

    // Target Points
    $("#target-points")
      .change(function () {
        self.sim.simulation.targetPoints = parseInt(String($(this).val()), 10);
      })
      .html(Utils.createDropDownListOptions(Utils.range(10, 990, 10)))
      .val(self.sim.simulation.targetPoints); // Default to 70

    // Point Puyo bonus
    $("#point-puyo-bonus")
      .change(function () {
        self.sim.simulation.pointPuyoBonus = parseInt(
          String($(this).val()),
          10
        );
      })
      .html(
        Utils.createDropDownListOptions({
          50: "50",
          100: "100",
          300: "300",
          500: "500",
          1000: "1K",
          10000: "10K",
          100000: "100K",
          500000: "500K",
          1000000: "1M",
        })
      )
      .val(self.sim.simulation.pointPuyoBonus); // Default to 50

    // Field Size
    $("#field-size-width")
      .html(Utils.createDropDownListOptions(Utils.range(3, 16, 1)))
      .val(self.sim.field.width); // Default to 6
    $("#field-size-height")
      .html(Utils.createDropDownListOptions(Utils.range(6, 26, 1)))
      .val(self.sim.field.height); // Default to 12

    $("#set-field-size").click(function () {
      var w = parseInt(String($("#field-size-width").val()), 10),
        h = parseInt(String($("#field-size-height").val()), 10);

      if (w !== self.sim.field.width || h !== self.sim.field.height) {
        self.sim.field.setChain("", w, h, self.sim.field.hiddenRows);
      }
    });

    // Hidden Rows
    $("#field-hidden-rows")
      .html(Utils.createDropDownListOptions(Utils.range(1, 2, 1)))
      .val(self.sim.field.hiddenRows); // Default to 1

    $("#set-hidden-rows").click(function () {
      var hr = parseInt(String($("#field-hidden-rows").val()), 10);

      if (hr !== self.sim.field.hiddenRows) {
        self.sim.field.setChain(
          "",
          self.sim.field.width,
          self.sim.field.height,
          hr
        );
      }
    });

    // Attack Powers
    (function () {
      var attackPowers = attackPowersJson;

      // Loop through each of the powers
      for (var i = 0; i < attackPowers.length; i++) {
        $("#attack-powers .dropdown-menu").append(
          "<h3>" + attackPowers[i].name + "</h3>"
        );
        var category = $("<ul>");

        // Loop through each of the powers in the category
        for (var j = 0; j < attackPowers[i].powers.length; j++) {
          $("<li>")
            .attr("data-category", i)
            .attr("data-value", j)
            .html("<a>" + attackPowers[i].powers[j].name + "</a>")
            .appendTo(category);
        }

        $("#attack-powers .dropdown-menu").append(category);
      }

      $("#attack-powers .dropdown-menu a").click(function () {
        var category = parseInt(
            String($(this).parent().attr("data-category")),
            10
          ),
          value = parseInt(String($(this).parent().attr("data-value")), 10);

        $("#attack-powers .dropdown-menu li.selected").removeClass("selected");
        $(this).parent().addClass("selected");

        self.sim.simulation.chainPowers =
          attackPowers[category].powers[value].values;
        self.sim.simulation.chainPowerInc =
          attackPowers[category].powers[value].increment || 0;

        $("#attack-powers-game").text(attackPowers[category].name);
        $("#attack-powers-character").text(
          attackPowers[category].powers[value].name
        );

        $(
          "input[name='score-mode'][value='" +
            (attackPowers[category].scoreMode || "classic") +
            "']"
        )
          .prop("checked", true)
          .change();
        $("#target-points")
          .val(
            attackPowers[category].targetPoints || SimulationDefaultTargetPoints
          )
          .change();
      });
      $(
        "#attack-powers .dropdown-menu li[data-category='0'][data-value='1'] a"
      ).click();
    })();
  }
}

class LinksTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalizes this tab
    var self = this;

    $("#get-links").click(function () {
      var data = {
        title: $("#share-chain-title").val(),
        chain: self.sim.field.mapToString(),
        width: self.sim.field.width,
        height: self.sim.field.height,
        hiddenRows: self.sim.field.hiddenRows,
        popLimit: self.sim.simulation.puyoToClear,
      };

      $.post(
        "/api/save",
        data,
        function (response) {
          if (response.success) {
            $("#share-link").val(
              config.baseUrl +
                Utils.stringFormat(config.shareLinkUrl, response.data.id)
            );
            $("#share-image").val(
              config.baseUrl +
                Utils.stringFormat(config.shareImageUrl, response.data.id)
            );
            $("#share-animated-image").val(
              config.baseUrl +
                Utils.stringFormat(
                  config.shareAnimatedImageUrl,
                  response.data.id
                )
            );

            // Hide elements that shouldn't be shown for shared chains, and show elements that should
            $(".hide-on-shared-chain").hide();
            $(".show-on-shared-chain").show();
          }
        },
        "json"
      );
    });

    if (window.chainData !== undefined) {
      if (window.chainData.id !== undefined) {
        $("#share-link").val(
          config.baseUrl +
            Utils.stringFormat(config.shareLinkUrl, window.chainData.id)
        );
        $("#share-image").val(
          config.baseUrl +
            Utils.stringFormat(config.shareImageUrl, window.chainData.id)
        );
        $("#share-animated-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareAnimatedImageUrl,
              window.chainData.id
            )
        );
      } else if (window.chainData.legacyQueryString !== undefined) {
        $("#share-link").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareLegacyLinkUrl,
              window.chainData.legacyQueryString
            )
        );
        $("#share-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareLegacyImageUrl,
              window.chainData.legacyQueryString
            )
        );
      }
    }
  }
}

class SettingsTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    const self = this;

    // Initalizes this tab
    // Animation
    $("#animate-puyo") // Puyo animation
      .click(function () {
        var checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.puyo = checked;
        localStorage.setItem("chainsim.animate.puyo", checked ? "yes" : "no");

        // See if we need to enable or disable the animation
        if (
          checked &&
          !self.sim.puyoDisplay.puyoAnimation.running &&
          self.sim.puyoDisplay.puyoSkin.frames !== undefined &&
          self.sim.puyoDisplay.puyoSkin.frames > 0
        ) {
          self.sim.puyoDisplay.puyoAnimation.start(
            self.sim.puyoDisplay.puyoSkin.frames
          );
        } else if (!checked && self.sim.puyoDisplay.puyoAnimation.running) {
          self.sim.puyoDisplay.puyoAnimation.stop();
        }
      })
      .prop("checked", self.sim.puyoDisplay.animate.puyo);

    $("#animate-sun-puyo") // Sun Puyo animation
      .click(function () {
        var checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.sunPuyo = checked;
        localStorage.setItem(
          "chainsim.animate.sunPuyo",
          checked ? "yes" : "no"
        );

        // See if we need to enable or disable the animation
        if (checked && !self.sim.puyoDisplay.sunPuyoAnimation.running) {
          self.sim.puyoDisplay.sunPuyoAnimation.start();
        } else if (!checked && self.sim.puyoDisplay.sunPuyoAnimation.running) {
          self.sim.puyoDisplay.sunPuyoAnimation.stop();
        }
      })
      .prop("checked", this.sim.puyoDisplay.animate.sunPuyo);

    $("#animate-nuisance-tray") // Nuisance Tray animation
      .click(function () {
        var checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.nuisanceTray = checked;
        localStorage.setItem(
          "chainsim.animate.nuisanceTray",
          checked ? "yes" : "no"
        );
      })
      .prop("checked", this.sim.puyoDisplay.animate.puyo);

    // Field Style
    $("#field-style")
      .change(function () {
        $(this).prop("disabled", true);
        self.sim.fieldDisplay.load(String($(this).val()));
        localStorage.setItem("chainsim.fieldStyle", String($(this).val()));
      })
      .val(localStorage.getItem("chainsim.fieldStyle") || "standard"); // Default to Standard

    // Character Background
    (function () {
      // Loop through each of the backgrounds
      var index = 0;
      for (
        var i = 0;
        i < content.Field.EyeCandy.CharacterBackgrounds.length;
        i++
      ) {
        $("#character-background .dropdown-menu").append(
          "<h3>" +
            content.Field.EyeCandy.CharacterBackgrounds[i].name +
            "</h3>"
        );
        var category = $("<ul>");

        // Loop through each of the powers in the category
        for (
          var j = 0;
          j <
          content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds.length;
          j++
        ) {
          $("<li>")
            .attr("data-category", i)
            .attr("data-value", j)
            .attr("data-id", index)
            .html(
              "<a>" +
                content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds[j] +
                "</a>"
            )
            .appendTo(category);
          index++;
        }

        $("#character-background .dropdown-menu").append(category);
      }

      $("#character-background .dropdown-menu a").click(function () {
        var category = parseInt($(this).parent().attr("data-category")!, 10),
          value = parseInt($(this).parent().attr("data-value")!, 10),
          id = parseInt($(this).parent().attr("data-id")!, 10);

        $("#character-background .dropdown-menu li.selected").removeClass(
          "selected"
        );
        $(this).parent().addClass("selected");

        if (self.sim.fieldDisplay.fieldContent === content.Field.EyeCandy) {
          if (id === 0) {
            $("#field-bg-2").css(
              "background-image",
              "url('/images/eyecandy/field_char_bg/" +
                content.Field.EyeCandy.CharaBGs[
                  Math.floor(
                    Math.random() * content.Field.EyeCandy.CharaBGs.length
                  )
                ] +
                "')"
            );
          } else {
            $("#field-bg-2").css(
              "background-image",
              "url('/images/eyecandy/field_char_bg/" +
                content.Field.EyeCandy.CharaBGs[id - 1] +
                "')"
            );
          }
        }

        $("#character-background-game").text(
          content.Field.EyeCandy.CharacterBackgrounds[category].name
        );
        $("#character-background-character").text(
          content.Field.EyeCandy.CharacterBackgrounds[category].backgrounds[
            value
          ]
        );

        localStorage.setItem("chainsim.boardBackgroundId", String(id));
      });
      var boardBackgroundId = localStorage.getItem(
        "chainsim.boardBackgroundId"
      );
      var boardBackgroundCategory = 0;
      var boardBackgroundValue = 0;
      if (boardBackgroundId !== null) {
        boardBackgroundCategory =
          parseInt(
            $(
              `#character-background .dropdown-menu li[data-id='${boardBackgroundId}']`
            ).attr("data-category")!,
            10
          ) || 0;
        boardBackgroundValue =
          parseInt(
            $(
              `#character-background .dropdown-menu li[data-id='${boardBackgroundId}']`
            ).attr("data-value")!,
            10
          ) || 0;
      }

      $("#character-background-game").text(
        content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory]
          .name
      );
      $("#character-background-character").text(
        content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory]
          .backgrounds[boardBackgroundValue]
      );
      $(
        "#character-background .dropdown-menu li[data-id='" +
          boardBackgroundId +
          "']"
      ).addClass("selected");
    })();

    $.each(this.sim.puyoDisplay.puyoSkins, function (index, value) {
      $("<li>")
        .attr("data-value", value.id)
        .append(
          $("<a>").append(
            $("<span>")
              .addClass("puyo-skin")
              .css(
                "background-position",
                "0px -" + index * self.sim.puyoDisplay.puyoSize + "px"
              )
          )
        )
        .appendTo("#puyo-skins .dropdown-menu");
    });

    $("#puyo-skins .dropdown-menu a").click(function () {
      $("#puyo-skins li.selected").removeClass("selected");
      $($(this).parent()).addClass("selected");

      self.sim.puyoDisplay.setPuyoSkin($(this).parent().attr("data-value")!);
      localStorage.setItem(
        "chainsim.puyoSkin",
        $(this).parent().attr("data-value")!
      );

      $("#puyo-skins .dropdown-toggle .puyo-skin").css(
        "background-position",
        "0px -" +
          self.sim.puyoDisplay.getSkinIndex(self.sim.puyoDisplay.puyoSkin.id) *
            self.sim.puyoDisplay.puyoSize +
          "px"
      );
    });
    $(
      "#puyo-skins li[data-value='" + this.sim.puyoDisplay.puyoSkin.id + "']"
    ).addClass("selected");
    $("#puyo-skins .dropdown-toggle .puyo-skin").css(
      "background-position",
      "0px -" +
        this.sim.puyoDisplay.getSkinIndex(this.sim.puyoDisplay.puyoSkin.id) *
          this.sim.puyoDisplay.puyoSize +
        "px"
    );
  }
}

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
    $("#simulator-tabs-select > li a[data-target]").click(function () {
      var $this = $(this),
        $dataTarget = $this.attr("data-target")!,
        $parent = $this.parent();

      $("#simulator-tabs-select > li.tab-active").removeClass("tab-active");
      $("#simulator-tabs .content-active").removeClass("content-active");

      if (
        !$("#simulator-tabs").hasClass("float") ||
        !$parent.hasClass("tab-active")
      ) {
        $parent.addClass("tab-active");
        $($dataTarget).addClass("content-active");
        localStorage.setItem("chainsim.lastTab", $dataTarget.substr(1)); // Don't need to get the #
      }
    });
    $(
      "#simulator-tabs-select > li a[data-target='#" +
        (localStorage.getItem("chainsim.lastTab") || "tab-share") +
        "']"
    ).click();

    $(".simulator-tabs-toggle").click(function () {
      var $simulatorTabs = $("#simulator-tabs");

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
    var $simulatorTabs = $("#simulator-tabs"),
      $simulatorTabsWidth = $simulatorTabs.outerWidth(true)!,
      $simulatorTabsMinWidth = $simulatorTabs.data("min-width");

    if (
      $simulatorTabsWidth <= $simulatorTabsMinWidth &&
      !$simulatorTabs.hasClass("float")
    ) {
      $simulatorTabs.addClass("float");

      $(document).on("click.simulatorTabs", function (e) {
        var clicked = $(e.target);
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
