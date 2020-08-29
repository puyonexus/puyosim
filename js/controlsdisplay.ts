/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

import $ from "jquery";
import { PuyoType, SimulationDefaultSpeed } from "./constants";
import { PuyoSim } from "./puyosim";

export class ControlsDisplay {
  constructor(readonly sim: PuyoSim) {}

  display() {
    const self = this;

    // Displays the controls
    $("#puyo-insertion").change(function () {
      self.sim.fieldDisplay.insertPuyo = $(this).prop("checked");
    });

    $("#field-erase-all").click(function () {
      self.sim.field.setChain(
        "",
        self.sim.field.width,
        self.sim.field.height,
        self.sim.field.hiddenRows
      );
    });

    if (self.sim.field.chainInURL) {
      // Make the "Set from URL" button function if a chain can be set from the URL
      $("#field-set-from-url").click(function () {
        self.sim.field.setChainFromURL();
      });
    } else {
      // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
      $("#field-set-from-url").hide();
    }

    $("#puyo-selection .puyo.puyo-none").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.None;
    });
    $("#puyo-selection .puyo.puyo-delete").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Delete;
    });
    $("#puyo-selection .puyo.puyo-red").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Red;
    });
    $("#puyo-selection .puyo.puyo-green").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Green;
    });
    $("#puyo-selection .puyo.puyo-blue").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Blue;
    });
    $("#puyo-selection .puyo.puyo-yellow").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Yellow;
    });
    $("#puyo-selection .puyo.puyo-purple").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Purple;
    });
    $("#puyo-selection .puyo.puyo-nuisance").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Nuisance;
    });
    $("#puyo-selection .puyo.puyo-point").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Point;
    });
    $("#puyo-selection .puyo.puyo-hard").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Hard;
    });
    $("#puyo-selection .puyo.puyo-iron").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Iron;
    });
    $("#puyo-selection .puyo.puyo-block").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Block;
    });
    $("#puyo-selection .puyo.puyo-sun").click(function () {
      self.sim.fieldDisplay.selectedPuyo = PuyoType.Sun;
    });
    $("#puyo-selection .puyo").click(function () {
      $("#puyo-selection .selected").removeClass("selected");
      $(this).parent().addClass("selected");
    });
    $("#puyo-selection .puyo.puyo-none").parent().addClass("selected");

    $("#simulation-back").click(function () {
      self.sim.simulation.back();
    });
    $("#simulation-start").click(function () {
      self.sim.simulation.start();
    });
    $("#simulation-pause").click(function () {
      self.sim.simulation.pause();
    });
    $("#simulation-step").click(function () {
      self.sim.simulation.step();
    });
    $("#simulation-skip").click(function () {
      self.sim.simulation.skip();
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
      function (index, value) {
        $("#simulation-speed").append(
          '<option value="' + (9 - index) * 100 + '">' + value + "</option>"
        );
      }
    );
    $("#simulation-speed")
      .change(function () {
        self.sim.simulation.speed = parseInt(String($(this).val()), 10);
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
