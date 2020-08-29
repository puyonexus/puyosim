/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */

import $ from "jquery";
import { FieldMap } from "./fieldmap";
import { FieldDefaultWidth, FieldDefaultHeight, FieldDefaultHiddenRows, PuyoType, SimulationDefaultPuyoToClear } from "./constants";
import { PuyoSim } from "./puyosim";

declare global {
  interface Window {
    chainData?: {
      id?: number,
      chain: string,
      width: number,
      height: number,
      hiddenRows: number,
      popLimit?: number,
      title?: string,
      legacyQueryString?: string;
    };
  }
};

export class Field {
  // Field Width (Default = 6)
  width = FieldDefaultWidth;

  // Field Height (Default = 12)
  height = FieldDefaultHeight;

  // Hidden Rows (Default = 1)
  hiddenRows = FieldDefaultHiddenRows;

  // Total height (height + hidden rows)
  totalHeight = FieldDefaultHeight + FieldDefaultHiddenRows;

  // A chain is in the URL and can be successfully set
  chainInURL = false;

  // Map that contains the puyo
  map?: FieldMap;

  // The map used during the "editing" portion of the simulator
  mapEditor?: FieldMap;

  // The map used during the simulation
  mapSimulation?: FieldMap;

  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalize
    this.mapEditor = new FieldMap(this.sim, this.width, this.totalHeight);
    this.map = this.mapEditor;

    if (window.chainData) {
      // We have a chain in the URL. Attempt to use it.
      this.setChainFromURL();
    }
  }

  setChain(chain: any, w: any, h: any, hr?: any) {
    // Sets the chain with the specified width and height
    var pos;
    w = w || FieldDefaultWidth;
    h = h || FieldDefaultHeight;
    hr = hr || FieldDefaultHiddenRows;

    if (this.sim.simulation.running) {
      // Stop the simulation
      this.sim.simulation.back();
    }

    if (w !== this.width || h !== this.height || hr !== this.hiddenRows) {
      this.width = w;
      this.height = h;
      this.hiddenRows = hr;
      this.totalHeight = h + hr;

      this.mapEditor = new FieldMap(this.sim, this.width, this.totalHeight);
      this.map = this.mapEditor;

      if (this.sim.puyoDisplay.renderer) {
        // If we have a render, draw up the new field
        this.sim.puyoDisplay.renderer!.uninit();
        $("#field").css({
          width: this.width * this.sim.puyoDisplay.puyoSize + "px",
          height: this.totalHeight * this.sim.puyoDisplay.puyoSize + "px",
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
        this.sim.puyoDisplay.renderer!.init();
      }

      $("#field-size-width").val(this.width);
      $("#field-size-height").val(this.height);
      $("#field-hidden-rows").val(this.hiddenRows);
    }

    pos = chain.length - 1;
    for (var y = this.totalHeight - 1; y >= 0; y--) {
      for (var x = this.width - 1; x >= 0; x--) {
        if (pos < 0) {
          this.map!.set(x, y, PuyoType.None);
        } else {
          this.map!.set(x, y, parseInt(chain.charAt(pos), 36));
          pos--;

          if (!this.sim.puyoDisplay.renderer) {
            continue;
          }

          this.sim.puyoDisplay.renderer!.drawPuyo(x, y, this.map!.get(x, y));
          if (!this.sim.puyoDisplay.puyoAnimation.running) {
            // Redraw all puyo around us
            if (y > 0) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x, y - 1, this.map!.get(x, y - 1));
            }
            if (x > 0) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x - 1, y, this.map!.get(x - 1, y));
            }
            if (y < this.totalHeight - 1) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x, y + 1, this.map!.get(x, y + 1));
            }
            if (x < this.width - 1) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x + 1, y, this.map!.get(x + 1, y));
            }
          }
        }
      }
    }
  }

  setChainFromURL() {
    // Attempts to set the chain from the URL
    if (!window.chainData) {
      return;
    }

    // Set the chain. setChain takes care of providing default values if they are passed as undefined
    this.setChain(
      window.chainData.chain,
      window.chainData.width,
      window.chainData.height,
      window.chainData.hiddenRows
    );

    this.sim.simulation.puyoToClear =
      window.chainData.popLimit || SimulationDefaultPuyoToClear;
    $("#puyo-to-clear").val(this.sim.simulation.puyoToClear);

    this.chainInURL = true;
  }

  mapToString() {
    // Converts mapEditor to a string that can be shared
    var addZeros = false, // Add zeros to the front
      chainString = ""; // The chain string
    for (var y = 0; y < this.totalHeight; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.mapEditor!.puyo(x, y) === PuyoType.None && !addZeros) {
          continue; // Don't need to add zeros to the front of the string
        }

        addZeros = true;
        chainString += this.mapEditor!.puyo(x, y).toString(16);
      }
    }

    return chainString;
  }
};
