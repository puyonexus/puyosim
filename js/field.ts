/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */

import $ from "jquery";
import { tabs } from "./tabs";
import { FieldMap } from "./fieldmap";
import { simulation } from "./simulation";
import { puyoDisplay } from "./puyodisplay";
import { FieldDefaultWidth, FieldDefaultHeight, FieldDefaultHiddenRows, PuyoType, SimulationDefaultPuyoToClear } from "./constants";

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

class Field {
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

  init() {
    // Initalize
    this.mapEditor = new FieldMap(this.width, this.totalHeight);
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

    if (simulation.running) {
      // Stop the simulation
      simulation.back();
    }

    if (w !== this.width || h !== this.height || hr !== this.hiddenRows) {
      this.width = w;
      this.height = h;
      this.hiddenRows = hr;
      this.totalHeight = h + hr;

      this.mapEditor = new FieldMap(this.width, this.totalHeight);
      this.map = this.mapEditor;

      if (puyoDisplay.renderer) {
        // If we have a render, draw up the new field
        puyoDisplay.renderer!.uninit();
        $("#field").css({
          width: this.width * puyoDisplay.puyoSize + "px",
          height: this.totalHeight * puyoDisplay.puyoSize + "px",
        });
        $("#field-bg-2").css(
          "top",
          field.hiddenRows * puyoDisplay.puyoSize + "px"
        );
        $("#field-bg-3").css(
          "height",
          field.hiddenRows * puyoDisplay.puyoSize + "px"
        );
        tabs.fieldWidthChanged();
        puyoDisplay.renderer!.init();
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

          if (!puyoDisplay.renderer) {
            continue;
          }

          puyoDisplay.renderer!.drawPuyo(x, y, this.map!.get(x, y));
          if (!puyoDisplay.puyoAnimation.running) {
            // Redraw all puyo around us
            if (y > 0) {
              puyoDisplay.renderer!.drawPuyo(x, y - 1, this.map!.get(x, y - 1));
            }
            if (x > 0) {
              puyoDisplay.renderer!.drawPuyo(x - 1, y, this.map!.get(x - 1, y));
            }
            if (y < this.totalHeight - 1) {
              puyoDisplay.renderer!.drawPuyo(x, y + 1, this.map!.get(x, y + 1));
            }
            if (x < this.width - 1) {
              puyoDisplay.renderer!.drawPuyo(x + 1, y, this.map!.get(x + 1, y));
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

    simulation.puyoToClear =
      window.chainData.popLimit || SimulationDefaultPuyoToClear;
    $("#puyo-to-clear").val(simulation.puyoToClear);

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

export const field = new Field();