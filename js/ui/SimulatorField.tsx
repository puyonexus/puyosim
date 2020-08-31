import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../PuyoSim";
import { PuyoType } from "../constants";
import { IFieldType } from "../data/content";

interface Props {
  sim: PuyoSim;
  insertPuyo: boolean;
  fieldContent: IFieldType;
  selectedPuyo: PuyoType;
}

export class SimulatorField extends Component<Props> {
  render() {
    return (
      <div id="simulator-field">
        <div id="field-content">
          <div id="field-bg-1"></div>
          <div id="field-bg-2"></div>
          <div id="field-bg-3"></div>
          <div id="field"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    Promise.resolve().then(() => this.initLegacy());
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.fieldContent !== prevProps.fieldContent) {
      this.load(this.props.fieldContent);
    }
  }

  initLegacy() {
    const { sim, fieldContent } = this.props;

    // Initalize
    sim.puyoDisplay.init();
    this.load(fieldContent, true);

    // Displays the field
    $("#simulator").removeClass("field-basic field-standard field-eyecandy");
    $("#simulator").addClass(this.props.fieldContent.CSSClass);

    if (this.props.fieldContent.CSSClass === "field-eyecandy") {
      this.props.fieldContent.Script.call(this);
    }

    $("#field").css({
      width: sim.field.width * sim.puyoDisplay.puyoSize + "px",
      height: sim.field.totalHeight * sim.puyoDisplay.puyoSize + "px",
    });
    $("#field-bg-2").css(
      "top",
      sim.field.hiddenRows * sim.puyoDisplay.puyoSize + "px"
    );
    $("#field-bg-3").css(
      "height",
      sim.field.hiddenRows * sim.puyoDisplay.puyoSize + "px"
    );

    // Set up the field cursor

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

    $("#field")
      .on("mouseenter", ({ currentTarget, pageX, pageY }) => {
        if (sim.simulation.running) {
          // Don't allow placing puyo when the simulator is running
          return;
        }

        const offset = $(currentTarget).offset();
        if (!offset) {
          return;
        }

        offsetX = pageX - offset.left;
        offsetY = pageY - offset.top;
        fieldX = Math.floor(offsetX / sim.puyoDisplay.puyoSize);
        fieldY = Math.floor(offsetY / sim.puyoDisplay.puyoSize);

        $("<div>")
          .attr("id", "field-cursor")
          .css({
            top: fieldY * sim.puyoDisplay.puyoSize + "px",
            left: fieldX * sim.puyoDisplay.puyoSize + "px",
          })
          .appendTo(currentTarget);
      })
      .on("mousemove", ({ currentTarget, pageX, pageY }) => {
        if (sim.simulation.running) {
          // Don't allow placing puyo when the simulator is running
          return;
        }

        const width = $(currentTarget).width();
        const height = $(currentTarget).height();
        const offset = $(currentTarget).offset();
        if (!width || !height || !offset) {
          return;
        }

        let newFieldX: number;
        let newFieldY: number;
        offsetX = pageX - offset.left;
        offsetY = pageY - offset.top;

        if (
          offsetX < 0 ||
          offsetX >= width ||
          offsetY < 0 ||
          offsetY >= height
        ) {
          // Check for out of bounds before continuing
          $(currentTarget).trigger("mouseleave");
          return;
        }

        newFieldX = Math.floor(offsetX / sim.puyoDisplay.puyoSize);
        newFieldY = Math.floor(offsetY / sim.puyoDisplay.puyoSize);

        if (newFieldX !== fieldX || newFieldY !== fieldY) {
          // Are we hovering over another puyo now?
          fieldX = newFieldX;
          fieldY = newFieldY;

          if (mouseDown) {
            // Place puyo
            $(currentTarget).trigger("mousedown");
          }

          $("#field-cursor").css({
            top: fieldY * sim.puyoDisplay.puyoSize + "px",
            left: fieldX * sim.puyoDisplay.puyoSize + "px",
          });
        }
      })
      .on("mouseleave", ({ currentTarget }) => {
        $(currentTarget).trigger("mouseup");
        $("#field-cursor").remove();
      })
      .on("mousedown", (e) => {
        e.preventDefault();

        if (sim.simulation.running) {
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
          if (this.props.selectedPuyo === PuyoType.Delete) {
            // Delete this puyo and shift the ones on top down one row
            for (let y = fieldY; y > 0; y--) {
              sim.field.map.set(
                fieldX,
                y,
                sim.field.map.puyo(fieldX, y - 1)
              );
            }
            sim.field.map.set(fieldX, 0, PuyoType.None);
          } else {
            if (this.props.insertPuyo) {
              // Insert puyo
              for (let y = 0; y < fieldY; y++) {
                sim.field.map.set(
                  fieldX,
                  y,
                  sim.field.map.puyo(fieldX, y + 1)
                );
              }
            }

            sim.field.map.set(fieldX, fieldY, this.props.selectedPuyo);
          }
        } else if (rightMouseDown) {
          // Right click, delete puyo
          sim.field.map.set(fieldX, fieldY, PuyoType.None);
        }
      })
      .on("mouseup", () => {
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

  load(fieldContent: IFieldType, init?: boolean) {
    const { sim } = this.props;

    if (!init) {
      // Only fade out & fade in if we are switching styles
      $("#simulator-field, #nuisance-tray").fadeOut(200, () => {
        // Fade out the simulator and display the new one
        $("#field-bg-1, #field-bg-2, #field-bg-3").removeAttr("style");
        $("#simulator").removeClass(
          "field-basic field-standard field-eyecandy"
        );
        $("#simulator").addClass(fieldContent.CSSClass);

        if (fieldContent.CSSClass === "field-eyecandy") {
          fieldContent.Script.call(this);
        }

        $("#field").css({
          width: sim.field.width * sim.puyoDisplay.puyoSize + "px",
          height: sim.field.totalHeight * sim.puyoDisplay.puyoSize + "px",
        });
        $("#field-bg-2").css(
          "top",
          sim.field.hiddenRows * sim.puyoDisplay.puyoSize + "px"
        );
        $("#field-bg-3").css(
          "height",
          sim.field.hiddenRows * sim.puyoDisplay.puyoSize + "px"
        );
        // Refresh the layout.
        window.dispatchEvent(new Event('resize'));

        $("#simulator-field, #nuisance-tray").fadeIn(200);
        $("#field-style").prop("disabled", false);
      });
    }
  }
}
