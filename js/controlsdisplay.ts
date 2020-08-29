/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

import $ from "jquery";
import { Field } from "./field";
import { FieldDisplay } from "./fielddisplay";
import { Simulation } from "./simulation";
import { PuyoType, SimulationDefaultSpeed } from "./constants";

export class ControlsDisplay {
  static display() {
    // Displays the controls
    $("#puyo-insertion").change(function () {
      FieldDisplay.insertPuyo = $(this).prop("checked");
    });

    $("#field-erase-all").click(function () {
      Field.setChain("", Field.width, Field.height, Field.hiddenRows);
    });

    if (Field.chainInURL) {
      // Make the "Set from URL" button function if a chain can be set from the URL
      $("#field-set-from-url").click(function () {
        Field.setChainFromURL();
      });
    } else {
      // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
      $("#field-set-from-url").hide();
    }

    $("#puyo-selection .puyo.puyo-none").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.None;
    });
    $("#puyo-selection .puyo.puyo-delete").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Delete;
    });
    $("#puyo-selection .puyo.puyo-red").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Red;
    });
    $("#puyo-selection .puyo.puyo-green").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Green;
    });
    $("#puyo-selection .puyo.puyo-blue").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Blue;
    });
    $("#puyo-selection .puyo.puyo-yellow").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Yellow;
    });
    $("#puyo-selection .puyo.puyo-purple").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Purple;
    });
    $("#puyo-selection .puyo.puyo-nuisance").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Nuisance;
    });
    $("#puyo-selection .puyo.puyo-point").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Point;
    });
    $("#puyo-selection .puyo.puyo-hard").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Hard;
    });
    $("#puyo-selection .puyo.puyo-iron").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Iron;
    });
    $("#puyo-selection .puyo.puyo-block").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Block;
    });
    $("#puyo-selection .puyo.puyo-sun").click(function () {
      FieldDisplay.selectedPuyo = PuyoType.Sun;
    });
    $("#puyo-selection .puyo").click(function () {
      $("#puyo-selection .selected").removeClass("selected");
      $(this).parent().addClass("selected");
    });
    $("#puyo-selection .puyo.puyo-none").parent().addClass("selected");

    $("#simulation-back").click(function () {
      Simulation.back();
    });
    $("#simulation-start").click(function () {
      Simulation.start();
    });
    $("#simulation-pause").click(function () {
      Simulation.pause();
    });
    $("#simulation-step").click(function () {
      Simulation.step();
    });
    $("#simulation-skip").click(function () {
      Simulation.skip();
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
        Simulation.speed = parseInt(String($(this).val()), 10);
      })
      .val(SimulationDefaultSpeed);

    this.toggleSimulationButtons(false, true, false, true, true);

    $("#field-score").text("0");
    $("#field-chains").text("0");
    $("#field-nuisance").text("0");
    $("#field-cleared").text("0");
  }

  static toggleSimulationButtons(back: boolean, start: boolean, pause: boolean, step: boolean, skip: boolean) {
    // Controls the display of the simulator control buttons
    $("#simulation-back").prop("disabled", !back);
    $("#simulation-start").prop("disabled", !start);
    $("#simulation-pause").prop("disabled", !pause);
    $("#simulation-step").prop("disabled", !step);
    $("#simulation-skip").prop("disabled", !skip);
  }
};
