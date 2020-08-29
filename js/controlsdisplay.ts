/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

import $ from "jquery";
import { field } from "./field";
import { fieldDisplay } from "./fielddisplay";
import { simulation } from "./simulation";
import { PuyoType, SimulationDefaultSpeed } from "./constants";

class ControlsDisplay {
  display() {
    // Displays the controls
    $("#puyo-insertion").change(function () {
      fieldDisplay.insertPuyo = $(this).prop("checked");
    });

    $("#field-erase-all").click(function () {
      field.setChain("", field.width, field.height, field.hiddenRows);
    });

    if (field.chainInURL) {
      // Make the "Set from URL" button function if a chain can be set from the URL
      $("#field-set-from-url").click(function () {
        field.setChainFromURL();
      });
    } else {
      // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
      $("#field-set-from-url").hide();
    }

    $("#puyo-selection .puyo.puyo-none").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.None;
    });
    $("#puyo-selection .puyo.puyo-delete").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Delete;
    });
    $("#puyo-selection .puyo.puyo-red").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Red;
    });
    $("#puyo-selection .puyo.puyo-green").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Green;
    });
    $("#puyo-selection .puyo.puyo-blue").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Blue;
    });
    $("#puyo-selection .puyo.puyo-yellow").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Yellow;
    });
    $("#puyo-selection .puyo.puyo-purple").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Purple;
    });
    $("#puyo-selection .puyo.puyo-nuisance").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Nuisance;
    });
    $("#puyo-selection .puyo.puyo-point").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Point;
    });
    $("#puyo-selection .puyo.puyo-hard").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Hard;
    });
    $("#puyo-selection .puyo.puyo-iron").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Iron;
    });
    $("#puyo-selection .puyo.puyo-block").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Block;
    });
    $("#puyo-selection .puyo.puyo-sun").click(function () {
      fieldDisplay.selectedPuyo = PuyoType.Sun;
    });
    $("#puyo-selection .puyo").click(function () {
      $("#puyo-selection .selected").removeClass("selected");
      $(this).parent().addClass("selected");
    });
    $("#puyo-selection .puyo.puyo-none").parent().addClass("selected");

    $("#simulation-back").click(function () {
      simulation.back();
    });
    $("#simulation-start").click(function () {
      simulation.start();
    });
    $("#simulation-pause").click(function () {
      simulation.pause();
    });
    $("#simulation-step").click(function () {
      simulation.step();
    });
    $("#simulation-skip").click(function () {
      simulation.skip();
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
        simulation.speed = parseInt(String($(this).val()), 10);
      })
      .val(SimulationDefaultSpeed);

    this.toggleSimulationButtons(false, true, false, true, true);

    $("#field-score").text("0");
    $("#field-chains").text("0");
    $("#field-nuisance").text("0");
    $("#field-cleared").text("0");
  }

  toggleSimulationButtons(back: boolean, start: boolean, pause: boolean, step: boolean, skip: boolean) {
    // Controls the display of the simulator control buttons
    $("#simulation-back").prop("disabled", !back);
    $("#simulation-start").prop("disabled", !start);
    $("#simulation-pause").prop("disabled", !pause);
    $("#simulation-step").prop("disabled", !step);
    $("#simulation-skip").prop("disabled", !skip);
  }
};

export const controlsDisplay = new ControlsDisplay();