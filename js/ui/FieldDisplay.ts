/*
 * Field Display
 *
 * Controls the display and the style of the field.
 */

import $ from "jquery";
import { content } from "../data/content";
import { PuyoSim } from "../PuyoSim";

export class FieldDisplay {
  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalize
    this.sim.puyoDisplay.init();
    this.load(localStorage.getItem("chainsim.fieldStyle") || "standard", true);
  }

  load(style: string, init?: boolean) {
    // Loads the display and the style (need to do this after DOM ready)
    // Init specifies if this is the simulator is being loaded (aka style isn't being changed)
    init = init || false;

    // Set the field content reference
    switch (style) {
      case "standard":
        this.sim.fieldContent = content.Field.Standard;
        break;
      case "eyecandy":
        this.sim.fieldContent = content.Field.EyeCandy;
        break;
      default:
        this.sim.fieldContent = content.Field.Basic;
        break;
    }

    if (!init) {
      // Only fade out & fade in if we are switching styles
      $("#simulator-field, #nuisance-tray").fadeOut(200, () => {
        // Fade out the simulator and display the new one
        $("#field-bg-1, #field-bg-2, #field-bg-3").removeAttr("style");
        $("#simulator").removeClass(
          "field-basic field-standard field-eyecandy"
        );
        $("#simulator").addClass(this.sim.fieldContent.CSSClass);

        if (this.sim.fieldContent.CSSClass === "field-eyecandy") {
          this.sim.fieldContent.Script.call(this);
        }

        $("#field").css({
          width: this.sim.field.width * this.sim.puyoDisplay.puyoSize + "px",
          height:
            this.sim.field.totalHeight * this.sim.puyoDisplay.puyoSize + "px",
        });
        $("#field-bg-2").css(
          "top",
          this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
        );
        $("#field-bg-3").css(
          "height",
          this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
        );
        // Refresh the layout.
        window.dispatchEvent(new Event('resize'));

        $("#simulator-field, #nuisance-tray").fadeIn(200);
        $("#field-style").prop("disabled", false);
      });
    }
  }
}
