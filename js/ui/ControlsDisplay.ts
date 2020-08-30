/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

import $ from "jquery";
import { PuyoType, SimulationDefaultSpeed } from "../constants";
import { PuyoSim } from "../PuyoSim";

export class ControlsDisplay {
  constructor(readonly sim: PuyoSim) {}

  display() {
    // Displays the controls
    $("#puyo-insertion").on("change", ({currentTarget}) => {
      this.sim.fieldDisplay.insertPuyo = $(currentTarget).prop("checked");
    });

    $("#field-erase-all").on("click", () => {
      this.sim.field.setChain(
        "",
        this.sim.field.width,
        this.sim.field.height,
        this.sim.field.hiddenRows
      );
    });

    if (this.sim.field.chainInURL) {
      // Make the "Set from URL" button function if a chain can be set from the URL
      $("#field-set-from-url").on("click", () => {
        this.sim.field.setChainFromURL();
      });
    } else {
      // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
      $("#field-set-from-url").hide();
    }

    $("#puyo-selection .puyo.puyo-none").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.None;
    });
    $("#puyo-selection .puyo.puyo-delete").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Delete;
    });
    $("#puyo-selection .puyo.puyo-red").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Red;
    });
    $("#puyo-selection .puyo.puyo-green").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Green;
    });
    $("#puyo-selection .puyo.puyo-blue").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Blue;
    });
    $("#puyo-selection .puyo.puyo-yellow").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Yellow;
    });
    $("#puyo-selection .puyo.puyo-purple").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Purple;
    });
    $("#puyo-selection .puyo.puyo-nuisance").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Nuisance;
    });
    $("#puyo-selection .puyo.puyo-point").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Point;
    });
    $("#puyo-selection .puyo.puyo-hard").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Hard;
    });
    $("#puyo-selection .puyo.puyo-iron").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Iron;
    });
    $("#puyo-selection .puyo.puyo-block").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Block;
    });
    $("#puyo-selection .puyo.puyo-sun").on("click", () => {
      this.sim.fieldDisplay.selectedPuyo = PuyoType.Sun;
    });
    $("#puyo-selection .puyo").on("click", ({currentTarget}) => {
      $("#puyo-selection .selected").removeClass("selected");
      $(currentTarget).parent().addClass("selected");
    });
    $("#puyo-selection .puyo.puyo-none").parent().addClass("selected");

    $("#simulation-back").on("click", () => {
      this.sim.simulation.back();
    });
    $("#simulation-start").on("click", () => {
      this.sim.simulation.start();
    });
    $("#simulation-pause").on("click", () => {
      this.sim.simulation.pause();
    });
    $("#simulation-step").on("click", () => {
      this.sim.simulation.step();
    });
    $("#simulation-skip").on("click", () => {
      this.sim.simulation.skip();
    });

    $.each(
      [
        "1 (Slowest)",
        "2",
        "3",
        "4",
        "5 (Normal)",
        "6",
        "7",
        "8",
        "9 (Fastest)",
      ],
      (index, value) => {
        $("#simulation-speed").append(
          '<option value="' + (9 - index) * 100 + '">' + value + "</option>"
        );
      }
    );
    $("#simulation-speed")
      .on("change", ({currentTarget}) => {
        this.sim.simulation.speed = parseInt(String($(currentTarget).val()), 10);
      })
      .val(SimulationDefaultSpeed);

    this.toggleSimulationButtons(false, true, false, true, true);

    $("#field-score").text("0");
    $("#field-chains").text("0");
    $("#field-nuisance").text("0");
    $("#field-cleared").text("0");
  }

  toggleSimulationButtons(
    back: boolean,
    start: boolean,
    pause: boolean,
    step: boolean,
    skip: boolean
  ) {
    // Controls the display of the simulator control buttons
    $("#simulation-back").prop("disabled", !back);
    $("#simulation-start").prop("disabled", !start);
    $("#simulation-pause").prop("disabled", !pause);
    $("#simulation-step").prop("disabled", !step);
    $("#simulation-skip").prop("disabled", !skip);
  }
}
