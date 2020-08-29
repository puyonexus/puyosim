/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */

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

import $ from "jquery";
import { Tabs } from "./tabs";
import { FieldMap } from "./fieldmap";
import { Constants } from "./constants";
import { Simulation } from "./simulation";
import { PuyoDisplay } from "./puyodisplay";

interface IField {
  width: number;
  height: number;
  hiddenRows: number;
  totalHeight: number;
  chainInURL: boolean;
  map?: FieldMap;
  mapEditor?: FieldMap;
  mapSimulation?: FieldMap;
  init: () => void;
  setChain: (chain: any, w: any, h: any, hr?: any) => void;
  setChainFromURL: () => void;
  mapToString: () => string;
}

export const Field: IField = {
  width: Constants.Field.DefaultWidth, // Field Width (Default = 6)
  height: Constants.Field.DefaultHeight, // Field Height (Default = 12)
  hiddenRows: Constants.Field.DefaultHiddenRows, // Hidden Rows (Default = 1)
  totalHeight:
    Constants.Field.DefaultHeight + Constants.Field.DefaultHiddenRows, // Total height (height + hidden rows)

  chainInURL: false, // A chain is in the URL and can be successfully set
  map: undefined, // Map that contains the puyo
  mapEditor: undefined, // The map used during the "editing" portion of the simulator
  mapSimulation: undefined, // The map used during the simulation

  init: function () {
    // Initalize
    this.mapEditor = new FieldMap(this.width, this.totalHeight);
    this.map = this.mapEditor;

    if (window.chainData) {
      // We have a chain in the URL. Attempt to use it.
      this.setChainFromURL();
    }
  },

  setChain: function (chain, w, h, hr?) {
    // Sets the chain with the specified width and height
    var pos;
    w = w || Constants.Field.DefaultWidth;
    h = h || Constants.Field.DefaultHeight;
    hr = hr || Constants.Field.DefaultHiddenRows;

    if (Simulation.running) {
      // Stop the simulation
      Simulation.back();
    }

    if (w !== this.width || h !== this.height || hr !== this.hiddenRows) {
      this.width = w;
      this.height = h;
      this.hiddenRows = hr;
      this.totalHeight = h + hr;

      this.mapEditor = new FieldMap(this.width, this.totalHeight);
      this.map = this.mapEditor;

      if (PuyoDisplay.renderer) {
        // If we have a render, draw up the new field
        PuyoDisplay.renderer!.uninit();
        $("#field").css({
          width: this.width * PuyoDisplay.puyoSize + "px",
          height: this.totalHeight * PuyoDisplay.puyoSize + "px",
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
        PuyoDisplay.renderer!.init();
      }

      $("#field-size-width").val(this.width);
      $("#field-size-height").val(this.height);
      $("#field-hidden-rows").val(this.hiddenRows);
    }

    pos = chain.length - 1;
    for (var y = this.totalHeight - 1; y >= 0; y--) {
      for (var x = this.width - 1; x >= 0; x--) {
        if (pos < 0) {
          this.map!.set(x, y, Constants.Puyo.None);
        } else {
          this.map!.set(x, y, parseInt(chain.charAt(pos), 36));
          pos--;

          if (!PuyoDisplay.renderer) {
            continue;
          }

          PuyoDisplay.renderer!.drawPuyo(x, y, this.map!.get(x, y));
          if (!PuyoDisplay.puyoAnimation.running) {
            // Redraw all puyo around us
            if (y > 0) {
              PuyoDisplay.renderer!.drawPuyo(x, y - 1, this.map!.get(x, y - 1));
            }
            if (x > 0) {
              PuyoDisplay.renderer!.drawPuyo(x - 1, y, this.map!.get(x - 1, y));
            }
            if (y < this.totalHeight - 1) {
              PuyoDisplay.renderer!.drawPuyo(x, y + 1, this.map!.get(x, y + 1));
            }
            if (x < this.width - 1) {
              PuyoDisplay.renderer!.drawPuyo(x + 1, y, this.map!.get(x + 1, y));
            }
          }
        }
      }
    }
  },

  setChainFromURL: function () {
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

    Simulation.puyoToClear =
      window.chainData.popLimit || Constants.Simulation.DefaultPuyoToClear;
    $("#puyo-to-clear").val(Simulation.puyoToClear);

    this.chainInURL = true;
  },

  mapToString: function () {
    // Converts mapEditor to a string that can be shared
    var addZeros = false, // Add zeros to the front
      chainString = ""; // The chain string
    for (var y = 0; y < this.totalHeight; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.mapEditor!.puyo(x, y) === Constants.Puyo.None && !addZeros) {
          continue; // Don't need to add zeros to the front of the string
        }

        addZeros = true;
        chainString += this.mapEditor!.puyo(x, y).toString(16);
      }
    }

    return chainString;
  },
};
