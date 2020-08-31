/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */

import $ from "jquery";
import { FieldMap } from "./FieldMap";
import {
  FieldDefaultWidth,
  FieldDefaultHeight,
  FieldDefaultHiddenRows,
  PuyoType,
  SimulationDefaultPuyoToClear,
} from "../constants";
import { PuyoSim } from "../PuyoSim";
import EventTarget from "@ungap/event-target";

declare global {
  interface Window {
    chainData?: {
      id?: number;
      chain: string;
      width: number;
      height: number;
      hiddenRows: number;
      popLimit?: number;
      title?: string;
      legacyQueryString?: string;
    };
  }
}

export class Field extends EventTarget {
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

  private map: FieldMap;

  // The map used during the "editing" portion of the simulator
  private mapEditor: FieldMap;

  // The map used during the simulation
  private mapSimulation?: FieldMap;

  constructor(readonly sim: PuyoSim) {
    super();
    this.mapEditor = new FieldMap(this.width, this.totalHeight);
    this.map = this.mapEditor;

    if (window.chainData) {
      // We have a chain in the URL. Attempt to use it.
      this.setChainFromURL();
    }
  }

  resetMap() {
    this.mapEditor = new FieldMap(this.width, this.totalHeight);
    this.map = this.mapEditor;
  }

  returnToEditor() {
    this.map = this.mapEditor;
    // TODO: make reactive
    for (let y = 0; y < this.totalHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        this.sim.puyoDisplay.renderer.drawPuyo(x, y, this.map.get(x, y));
      }
    }
  }

  enterSimulation() {
    this.mapSimulation = new FieldMap(
      this.width,
      this.totalHeight,
      this.mapEditor
    );
    this.map = this.mapSimulation;
  }

  puyo(x: number, y: number) {
    return this.map.puyo(x, y);
  }

  get(x: number, y: number) {
    return this.map.get(x, y);
  }

  set(x: number, y: number, p: PuyoType) {
    this.map.set(x, y, p);

    if (!this.sim.puyoDisplay.renderer) {
      return;
    }

    this.sim.puyoDisplay.renderer.drawPuyo(x, y, this.map.map[x][y]);

    if (!this.sim.puyoDisplay.puyoAnimation.running) {
      // Redraw all puyo around us
      if (y > 0) {
        this.sim.puyoDisplay.renderer.drawPuyo(x, y - 1, this.map.map[x][y - 1]);
      }
      if (x > 0) {
        this.sim.puyoDisplay.renderer.drawPuyo(x - 1, y, this.map.map[x - 1][y]);
      }
      if (y < this.height - 1) {
        this.sim.puyoDisplay.renderer.drawPuyo(x, y + 1, this.map.map[x][y + 1]);
      }
      if (x < this.width - 1) {
        this.sim.puyoDisplay.renderer.drawPuyo(x + 1, y, this.map.map[x + 1][y]);
      }
    }
  }

  // Sets the chain with the specified width and height
  setChain(chain: string, w: number, h: number, hr?: number) {
    let pos: number;
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

      this.resetMap();

      if (this.sim.puyoDisplay.renderer) {
        // If we have a render, draw up the new field
        this.sim.puyoDisplay.renderer.uninit();
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
        // Refresh the layout.
        window.dispatchEvent(new Event('resize'));
        this.sim.puyoDisplay.renderer.init();
      }

      $("#field-size-width").val(this.width);
      $("#field-size-height").val(this.height);
      $("#field-hidden-rows").val(this.hiddenRows);
    }

    pos = chain.length - 1;
    for (let y = this.totalHeight - 1; y >= 0; y--) {
      for (let x = this.width - 1; x >= 0; x--) {
        if (pos < 0) {
          this.map.set(x, y, PuyoType.None);
        } else {
          this.map.set(x, y, parseInt(chain.charAt(pos), 36));
          pos--;

          if (!this.sim.puyoDisplay.renderer) {
            continue;
          }

          this.sim.puyoDisplay.renderer.drawPuyo(x, y, this.map.get(x, y));
          if (!this.sim.puyoDisplay.puyoAnimation.running) {
            // Redraw all puyo around us
            if (y > 0) {
              this.sim.puyoDisplay.renderer.drawPuyo(
                x,
                y - 1,
                this.map.get(x, y - 1)
              );
            }
            if (x > 0) {
              this.sim.puyoDisplay.renderer.drawPuyo(
                x - 1,
                y,
                this.map.get(x - 1, y)
              );
            }
            if (y < this.totalHeight - 1) {
              this.sim.puyoDisplay.renderer.drawPuyo(
                x,
                y + 1,
                this.map.get(x, y + 1)
              );
            }
            if (x < this.width - 1) {
              this.sim.puyoDisplay.renderer.drawPuyo(
                x + 1,
                y,
                this.map.get(x + 1, y)
              );
            }
          }
        }
      }
    }
  }

  // Attempts to set the chain from the URL
  setChainFromURL() {
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

  // Converts mapEditor to a string that can be shared
  mapToString() {
    // Add zeros to the front
    let addZeros = false;
    // The chain string
    let chainString = "";
    for (let y = 0; y < this.totalHeight; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.mapEditor.puyo(x, y) === PuyoType.None && !addZeros) {
          continue; // Don't need to add zeros to the front of the string
        }

        addZeros = true;
        chainString += this.mapEditor.puyo(x, y).toString(16);
      }
    }

    return chainString;
  }
}
