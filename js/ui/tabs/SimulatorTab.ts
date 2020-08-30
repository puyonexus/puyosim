import $ from "jquery";
import { PuyoSim } from "../../PuyoSim";
import { Utils } from "../../Utils";
import { SimulationDefaultTargetPoints } from "../../constants";
import { default as attackPowersJson } from "../../data/attackPowers.json";

export class SimulatorTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    const self = this;

    // Initalizes this tab
    // Scoring
    $("input[type='radio'][name='score-mode']")
      .on("change", function () {
        // TODO: remove usage of this
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
      .on("change", function () {
        // TODO: remove usage of this
        self.sim.simulation.puyoToClear = parseInt(String($(this).val()), 10);
      })
      .html(Utils.createDropDownListOptions(Utils.range(2, 6, 1)))
      .val(this.sim.simulation.puyoToClear); // Default to 4

    // Target Points
    $("#target-points")
      .on("change", function () {
        // TODO: remove usage of this
        self.sim.simulation.targetPoints = parseInt(String($(this).val()), 10);
      })
      .html(Utils.createDropDownListOptions(Utils.range(10, 990, 10)))
      .val(this.sim.simulation.targetPoints); // Default to 70

    // Point Puyo bonus
    $("#point-puyo-bonus")
      .on("change", function () {
        self.sim.simulation.pointPuyoBonus = parseInt(
          // TODO: remove usage of this
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
      .val(this.sim.simulation.pointPuyoBonus); // Default to 50

    // Field Size
    $("#field-size-width")
      .html(Utils.createDropDownListOptions(Utils.range(3, 16, 1)))
      .val(this.sim.field.width); // Default to 6
    $("#field-size-height")
      .html(Utils.createDropDownListOptions(Utils.range(6, 26, 1)))
      .val(this.sim.field.height); // Default to 12

    $("#set-field-size").on("click", () => {
      const w = parseInt(String($("#field-size-width").val()), 10);
      const h = parseInt(String($("#field-size-height").val()), 10);

      if (w !== this.sim.field.width || h !== this.sim.field.height) {
        this.sim.field.setChain("", w, h, this.sim.field.hiddenRows);
      }
    });

    // Hidden Rows
    $("#field-hidden-rows")
      .html(Utils.createDropDownListOptions(Utils.range(1, 2, 1)))
      .val(this.sim.field.hiddenRows); // Default to 1

    $("#set-hidden-rows").on("click", () => {
      const hr = parseInt(String($("#field-hidden-rows").val()), 10);

      if (hr !== this.sim.field.hiddenRows) {
        this.sim.field.setChain(
          "",
          this.sim.field.width,
          this.sim.field.height,
          hr
        );
      }
    });

    // Attack Powers
    const attackPowers = attackPowersJson;

    // Loop through each of the powers
    for (let i = 0; i < attackPowers.length; i++) {
      $("#attack-powers .dropdown-menu").append(
        "<h3>" + attackPowers[i].name + "</h3>"
      );
      const category = $("<ul>");

      // Loop through each of the powers in the category
      for (let j = 0; j < attackPowers[i].powers.length; j++) {
        $("<li>")
          .attr("data-category", i)
          .attr("data-value", j)
          .html("<a>" + attackPowers[i].powers[j].name + "</a>")
          .appendTo(category);
      }

      $("#attack-powers .dropdown-menu").append(category);
    }

    $("#attack-powers .dropdown-menu a").on("click", function () {
      const category = parseInt(
        // TODO: remove usage of this
        String($(this).parent().attr("data-category")),
        10
      );
      // TODO: remove usage of this
      const value = parseInt(String($(this).parent().attr("data-value")), 10);

      $("#attack-powers .dropdown-menu li.selected").removeClass("selected");
      // TODO: remove usage of this
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
        .trigger("change");
      $("#target-points")
        .val(
          attackPowers[category].targetPoints || SimulationDefaultTargetPoints
        )
        .trigger("change");
    });
    $(
      "#attack-powers .dropdown-menu li[data-category='0'][data-value='1'] a"
    ).trigger("click");
  }
}
