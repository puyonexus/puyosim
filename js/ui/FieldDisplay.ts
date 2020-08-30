/*
 * Field Display
 *
 * Controls the display and the style of the field.
 */

import $ from "jquery";
import { PuyoType } from "../constants";
import { content, IFieldType } from "../data/content";
import { PuyoSim } from "../PuyoSim";

export class FieldDisplay {
  // A reference to the content of the field
  fieldContent: IFieldType = content.Field.Standard;

  // Current Puyo that is selected
  selectedPuyo = PuyoType.None;

  // Indicates if we are going to insert Puyo (the insert box is checked)
  insertPuyo = false;

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
        this.fieldContent = content.Field.Standard;
        break;
      case "eyecandy":
        this.fieldContent = content.Field.EyeCandy;
        break;
      default:
        this.fieldContent = content.Field.Basic;
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
        $("#simulator").addClass(this.fieldContent.CSSClass);

        if (this.fieldContent.CSSClass === "field-eyecandy") {
          this.fieldContent.Script.call(this);
        }

        $("#field").css({
          width: this.sim.field.width * this.sim.puyoDisplay.puyoSize + "px",
          height: this.sim.field.totalHeight * this.sim.puyoDisplay.puyoSize + "px",
        });
        $("#field-bg-2").css(
          "top",
          this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
        );
        $("#field-bg-3").css(
          "height",
          this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
        );
        this.sim.tabs.fieldWidthChanged();

        $("#simulator-field, #nuisance-tray").fadeIn(200);
        $("#field-style").prop("disabled", false);
      });
    }
  }

  display() {
    // Displays the field
    $("#simulator").removeClass("field-basic field-standard field-eyecandy");
    $("#simulator").addClass(this.fieldContent.CSSClass);

    if (this.fieldContent.CSSClass === "field-eyecandy") {
      this.fieldContent.Script.call(this);
    }

    $("#field").css({
      width: this.sim.field.width * this.sim.puyoDisplay.puyoSize + "px",
      height: this.sim.field.totalHeight * this.sim.puyoDisplay.puyoSize + "px",
    });
    $("#field-bg-2").css(
      "top",
      this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#field-bg-3").css(
      "height",
      this.sim.field.hiddenRows * this.sim.puyoDisplay.puyoSize + "px"
    );
    this.sim.tabs.fieldWidthChanged();

    // Set up the field cursor
    const self = this;

    // A mouse button is pressed
    let mouseDown = false;
    // Left mouse button is pressed
    let leftMouseDown = false;
    // Right mouse button is pressed
    let rightMouseDown = false;
    // X offset in the DOM
    let offsetX;
    // Y offset in the DOM
    let offsetY;
    // X position in the field
    let fieldX = 0;
    // Y position in the field
    let fieldY = 0;
    // Loop variable
    let y;

    $("#field")
      .mouseenter(function (e) {
        if (self.sim.simulation.running) {
          // Don't allow placing puyo when the simulator is running
          return;
        }

        // TODO: Remove usage of 'this'.
        const offset = $(this).offset();
        if (!offset) {
          return;
        }

        offsetX = e.pageX - offset.left;
        offsetY = e.pageY - offset.top;
        fieldX = Math.floor(offsetX / self.sim.puyoDisplay.puyoSize);
        fieldY = Math.floor(offsetY / self.sim.puyoDisplay.puyoSize);

        $("<div>")
          .attr("id", "field-cursor")
          .css({
            top: fieldY * self.sim.puyoDisplay.puyoSize + "px",
            left: fieldX * self.sim.puyoDisplay.puyoSize + "px",
          })
          // TODO: Remove usage of 'this'.
          .appendTo(this);
      })
      .mousemove(function (e) {
        if (self.sim.simulation.running) {
          // Don't allow placing puyo when the simulator is running
          return;
        }

        // TODO: Remove usages of 'this'.
        const width = $(this).width();
        const height = $(this).height()
        const offset = $(this).offset();
        if (!width || !height || !offset) {
          return;
        }

        let newFieldX: number;
        let newFieldY: number;
        offsetX = e.pageX - offset.left;
        offsetY = e.pageY - offset.top;

        if (
          offsetX < 0 ||
          offsetX >= width ||
          offsetY < 0 ||
          offsetY >= height
        ) {
          // Check for out of bounds before continuing
          // TODO: Remove usage of 'this'.
          $(this).mouseleave();
          return;
        }

        newFieldX = Math.floor(offsetX / self.sim.puyoDisplay.puyoSize);
        newFieldY = Math.floor(offsetY / self.sim.puyoDisplay.puyoSize);

        if (newFieldX !== fieldX || newFieldY !== fieldY) {
          // Are we hovering over another puyo now?
          fieldX = newFieldX;
          fieldY = newFieldY;

          if (mouseDown) {
            // Place puyo
            // TODO: Remove usage of 'this'.
            $(this).mousedown();
          }

          $("#field-cursor").css({
            top: fieldY * self.sim.puyoDisplay.puyoSize + "px",
            left: fieldX * self.sim.puyoDisplay.puyoSize + "px",
          });
        }
      })
      .mouseleave(function () {
        // TODO: Remove usage of 'this'.
        $(this).mouseup();
        $("#field-cursor").remove();
      })
      .mousedown((e) => {
        e.preventDefault();

        if (self.sim.simulation.running) {
          // Don't allow placing puyo when the simulator is running
          return;
        }

        if (!mouseDown && (e.which === 1 || e.which === 3)) {
          mouseDown = true;
          if (e.which === 1) {
            leftMouseDown = true;
            $("#field-cursor").addClass("left-mouse-down");
          } else if (e.which === 3) {
            rightMouseDown = true;
            $("#field-cursor").addClass("right-mouse-down");
          }
        }

        if (leftMouseDown) {
          // Left click, place puyo
          if (self.selectedPuyo === PuyoType.Delete) {
            // Delete this puyo and shift the ones on top down one row
            for (y = fieldY; y > 0; y--) {
              self.sim.field.map.set(
                fieldX,
                y,
                self.sim.field.map.puyo(fieldX, y - 1)
              );
            }
            self.sim.field.map.set(fieldX, 0, PuyoType.None);
          } else {
            if (self.insertPuyo) {
              // Insert puyo
              for (y = 0; y < fieldY; y++) {
                self.sim.field.map.set(
                  fieldX,
                  y,
                  self.sim.field.map.puyo(fieldX, y + 1)
                );
              }
            }

            self.sim.field.map.set(fieldX, fieldY, self.selectedPuyo);
          }
        } else if (rightMouseDown) {
          // Right click, delete puyo
          self.sim.field.map.set(fieldX, fieldY, PuyoType.None);
        }
      })
      .mouseup(() => {
        mouseDown = false;

        if (leftMouseDown) {
          leftMouseDown = false;
          $("#field-cursor").removeClass("left-mouse-down");
        } else if (rightMouseDown) {
          rightMouseDown = false;
          $("#field-cursor").removeClass("right-mouse-down");
        }
      })
      .on("contextmenu", () => false);
  }
}
