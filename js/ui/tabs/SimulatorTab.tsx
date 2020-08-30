import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../../PuyoSim";
import { Utils } from "../../Utils";
import { SimulationDefaultTargetPoints } from "../../constants";
import { default as attackPowersJson } from "../../data/attackPowers.json";

interface Props {
  sim: PuyoSim|null;
  active: boolean;
}

export class SimulatorTab extends Component<Props> {
  render() {
    return (
      <div id="tab-simulator" className={this.props.active ? "tab-content content-active" : "tab-content"}>
        <dl>
          <dt>Scoring</dt>
          <dd>
            <label className="radio">
              <input type="radio" name="score-mode" value="classic" />
              Classic
            </label>
            <label className="radio">
              <input type="radio" name="score-mode" value="fever" />
              Fever
            </label>
          </dd>
        </dl>
        <dl>
          <dt>Pop Limit</dt>
          <dd>
            <select id="puyo-to-clear"></select>
          </dd>
        </dl>
        <dl>
          <dt>Garbage Rate</dt>
          <dd>
            <select id="target-points"></select>
          </dd>
        </dl>
        <dl>
          <dt>Point Puyo</dt>
          <dd>
            <select id="point-puyo-bonus"></select>
          </dd>
        </dl>
        <dl>
          <dt>Attack Power</dt>
          <dd id="attack-powers-outer">
            <div id="attack-powers" className="dropdown">
              <button
                className="dropdown-toggle dropdown-toggle-block"
                data-toggle="dropdown"
              >
                <div className="dropdown-toggle-inner">
                  <strong>
                    <span id="attack-powers-game"></span>
                  </strong>
                  <br />
                  <span id="attack-powers-character"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <div className="dropdown-menu" role="menu"></div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>Board Size</dt>
          <dd>
            <select id="field-size-width"></select>&nbsp;&times;&nbsp;
            <select id="field-size-height"></select>&nbsp;&nbsp;
            <button id="set-field-size">Set</button>
          </dd>
        </dl>
        <dl>
          <dt>Hidden Rows</dt>
          <dd>
            <select id="field-hidden-rows"></select>&nbsp;&nbsp;
            <button id="set-hidden-rows">Set</button>
          </dd>
        </dl>
      </div>
    );
  }
  
  componentDidMount() {
    Promise.resolve().then(() => this.initLegacy());
  }

  initLegacy() {
    const { sim } = this.props;
    if (!sim) {
      return;
    }

    // Scoring
    $("input[type='radio'][name='score-mode']")
      .on("change", ({ currentTarget }) => {
        switch ($(currentTarget).filter(":checked").val()) {
          case "classic":
            // 0 = Classic scoring
            sim.simulation.scoreMode = 0;
            break;
          case "fever":
            // 1 = Fever scoring
            sim.simulation.scoreMode = 1;
            break;
        }
      })
      .filter("[value='classic']")
      .prop("checked", true); // Default to classic scoring

    // Puyo to Clear
    $("#puyo-to-clear")
      .on("change", ({ currentTarget }) => {
        sim.simulation.puyoToClear = parseInt(
          String($(currentTarget).val()),
          10
        );
      })
      .html(Utils.createDropDownListOptions(Utils.range(2, 6, 1)))
      .val(sim.simulation.puyoToClear); // Default to 4

    // Target Points
    $("#target-points")
      .on("change", ({ currentTarget }) => {
        sim.simulation.targetPoints = parseInt(
          String($(currentTarget).val()),
          10
        );
      })
      .html(Utils.createDropDownListOptions(Utils.range(10, 990, 10)))
      .val(sim.simulation.targetPoints); // Default to 70

    // Point Puyo bonus
    $("#point-puyo-bonus")
      .on("change", ({ currentTarget }) => {
        sim.simulation.pointPuyoBonus = parseInt(
          String($(currentTarget).val()),
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
      .val(sim.simulation.pointPuyoBonus); // Default to 50

    // Field Size
    $("#field-size-width")
      .html(Utils.createDropDownListOptions(Utils.range(3, 16, 1)))
      .val(sim.field.width); // Default to 6
    $("#field-size-height")
      .html(Utils.createDropDownListOptions(Utils.range(6, 26, 1)))
      .val(sim.field.height); // Default to 12

    $("#set-field-size").on("click", () => {
      const w = parseInt(String($("#field-size-width").val()), 10);
      const h = parseInt(String($("#field-size-height").val()), 10);

      if (w !== sim.field.width || h !== sim.field.height) {
        sim.field.setChain("", w, h, sim.field.hiddenRows);
      }
    });

    // Hidden Rows
    $("#field-hidden-rows")
      .html(Utils.createDropDownListOptions(Utils.range(1, 2, 1)))
      .val(sim.field.hiddenRows); // Default to 1

    $("#set-hidden-rows").on("click", () => {
      const hr = parseInt(String($("#field-hidden-rows").val()), 10);

      if (hr !== sim.field.hiddenRows) {
        sim.field.setChain(
          "",
          sim.field.width,
          sim.field.height,
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

    $("#attack-powers .dropdown-menu a").on("click", ({ currentTarget }) => {
      const category = parseInt(
        String($(currentTarget).parent().attr("data-category")),
        10
      );
      const value = parseInt(
        String($(currentTarget).parent().attr("data-value")),
        10
      );

      $("#attack-powers .dropdown-menu li.selected").removeClass("selected");
      $(currentTarget).parent().addClass("selected");

      sim.simulation.chainPowers =
        attackPowers[category].powers[value].values;
      sim.simulation.chainPowerInc =
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
