/*
 * Field Display
 *
 * Controls the display and the style of the field.
 */

import $ from "jquery";
import { PuyoDisplay } from "./puyodisplay";
import { Simulation } from "./simulation";
import { Constants } from "./constants";
import { Content } from "./content";
import { Field } from "./field";
import { Tabs } from "./tabs";

export const FieldDisplay = {
  fieldContent: undefined, // A reference to the content of the field
  selectedPuyo: Constants.Puyo.None, // Current Puyo that is selected
  insertPuyo: false, // Indicates if we are going to insert Puyo (the insert box is checked)

  init: function () {
    // Initalize
    PuyoDisplay.init();
    this.load(localStorage.getItem("chainsim.fieldStyle") || "standard", true);
  },

  load: function (style, init) {
    // Loads the display and the style (need to do this after DOM ready)
    // Init specifies if this is the simulator is being loaded (aka style isn't being changed)
    init = init || false;

    // Set the field content reference
    switch (style) {
      case "standard":
        this.fieldContent = Content.Field.Standard;
        break;
      case "eyecandy":
        this.fieldContent = Content.Field.EyeCandy;
        break;
      default:
        this.fieldContent = Content.Field.Basic;
        break;
    }

    if (!init) {
      // Only fade out & fade in if we are switching styles
      var self = this;
      $("#simulator-field, #nuisance-tray").fadeOut(200, function () {
        // Fade out the simulator and display the new one
        $("#field-bg-1, #field-bg-2, #field-bg-3").removeAttr("style");
        $("#simulator").removeClass(
          "field-basic field-standard field-eyecandy"
        );
        $("#simulator").addClass(self.fieldContent.CSSClass);

        if (self.fieldContent.Script !== undefined) {
          self.fieldContent.Script.call(self);
        }

        $("#field").css({
          width: Field.width * PuyoDisplay.puyoSize + "px",
          height: Field.totalHeight * PuyoDisplay.puyoSize + "px",
        });
        $("#field-bg-2").css(
          "top",
          Field.hiddenRows * PuyoDisplay.puyoSize + "px"
        );
        $("#field-bg-3").css(
          "height",
          Field.hiddenRows * PuyoDisplay.puyoSize + "px"
        );
        Tabs.fieldWidthChanged();

        $("#simulator-field, #nuisance-tray").fadeIn(200);
        $("#field-style").prop("disabled", false);
      });
    }
  },

  display: function () {
    // Displays the field
    $("#simulator").removeClass("field-basic field-standard field-eyecandy");
    $("#simulator").addClass(this.fieldContent.CSSClass);

    if (this.fieldContent.Script !== undefined) {
      this.fieldContent.Script.call(this);
    }

    $("#field").css({
      width: Field.width * PuyoDisplay.puyoSize + "px",
      height: Field.totalHeight * PuyoDisplay.puyoSize + "px",
    });
    $("#field-bg-2").css("top", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
    $("#field-bg-3").css(
      "height",
      Field.hiddenRows * PuyoDisplay.puyoSize + "px"
    );
    Tabs.fieldWidthChanged();

    // Set up the field cursor
    var self = this;
    (function () {
      // Wrap in a function call
      var mouseDown = false, // A mouse button is pressed
        leftMouseDown = false, // Left mouse button is pressed
        rightMouseDown = false, // Right mouse button is pressed
        offsetX, // X offset in the DOM
        offsetY, // Y offset in the DOM
        fieldX, // X position in the field
        fieldY, // Y position in the field
        y; // Loop variable

      $("#field")
        .mouseenter(function (e) {
          if (Simulation.running) {
            // Don't allow placing puyo when the simulator is running
            return;
          }

          offsetX = e.pageX - $(this).offset().left;
          offsetY = e.pageY - $(this).offset().top;
          fieldX = Math.floor(offsetX / PuyoDisplay.puyoSize);
          fieldY = Math.floor(offsetY / PuyoDisplay.puyoSize);

          $("<div>")
            .attr("id", "field-cursor")
            .css({
              top: fieldY * PuyoDisplay.puyoSize + "px",
              left: fieldX * PuyoDisplay.puyoSize + "px",
            })
            .appendTo(this);
        })
        .mousemove(function (e) {
          if (Simulation.running) {
            // Don't allow placing puyo when the simulator is running
            return;
          }

          var newFieldX, newFieldY;
          offsetX = e.pageX - $(this).offset().left;
          offsetY = e.pageY - $(this).offset().top;

          if (
            offsetX < 0 ||
            offsetX >= $(this).width() ||
            offsetY < 0 ||
            offsetY >= $(this).height()
          ) {
            // Check for out of bounds before continuing
            $(this).mouseleave();
            return;
          }

          newFieldX = Math.floor(offsetX / PuyoDisplay.puyoSize);
          newFieldY = Math.floor(offsetY / PuyoDisplay.puyoSize);

          if (newFieldX !== fieldX || newFieldY !== fieldY) {
            // Are we hovering over another puyo now?
            fieldX = newFieldX;
            fieldY = newFieldY;

            if (mouseDown) {
              // Place puyo
              $(this).mousedown();
            }

            $("#field-cursor").css({
              top: fieldY * PuyoDisplay.puyoSize + "px",
              left: fieldX * PuyoDisplay.puyoSize + "px",
            });
          }
        })
        .mouseleave(function () {
          $(this).mouseup();
          $("#field-cursor").remove();
        })
        .mousedown(function (e) {
          e.preventDefault();

          if (Simulation.running) {
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
            if (self.selectedPuyo === Constants.Puyo.Delete) {
              // Delete this puyo and shift the ones on top down one row
              for (y = fieldY; y > 0; y--) {
                Field.map.set(fieldX, y, Field.map.puyo(fieldX, y - 1));
              }
              Field.map.set(fieldX, 0, Constants.Puyo.None);
            } else {
              if (self.insertPuyo) {
                // Insert puyo
                for (y = 0; y < fieldY; y++) {
                  Field.map.set(fieldX, y, Field.map.puyo(fieldX, y + 1));
                }
              }

              Field.map.set(fieldX, fieldY, self.selectedPuyo);
            }
          } else if (rightMouseDown) {
            // Right click, delete puyo
            Field.map.set(fieldX, fieldY, Constants.Puyo.None);
          }
        })
        .mouseup(function () {
          mouseDown = false;

          if (leftMouseDown) {
            leftMouseDown = false;
            $("#field-cursor").removeClass("left-mouse-down");
          } else if (rightMouseDown) {
            rightMouseDown = false;
            $("#field-cursor").removeClass("right-mouse-down");
          }
        })
        .on("contextmenu", function () {
          return false;
        });
    })();
  },
};
