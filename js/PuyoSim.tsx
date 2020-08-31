import "./common";
import $ from "jquery";
import Clipboard from "clipboard";
import { h, render } from "preact";
import { Simulator } from "./ui/Simulator";
import { Field } from "./simulator/Field";
import { Simulation } from "./simulator/Simulation";
import { PuyoDisplay } from "./ui/rendering/PuyoDisplay";

// An instance of PuyoSim.
export class PuyoSim {
  field: Field;
  puyoDisplay: PuyoDisplay;
  simulation: Simulation;
  clipboard?: Clipboard;

  constructor() {
    this.field = new Field(this);
    this.puyoDisplay = new PuyoDisplay(this);
    this.simulation = new Simulation(this);
  }

  init() {
    // Display the contents of the simulator
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("Could not find #app.");
    }
    render(<Simulator sim={this} />, app);

    // Enable auto-copying to clipboard
    if (Clipboard.isSupported()) {
      this.clipboard = new Clipboard(".clipboard-button");
    } else {
      $(".clipboard-button").hide();
    }

    // Show/hide elements depending on if we are viewing a shared chain
    if (window.chainData) {
      $(".show-on-shared-chain").show();
    } else {
      $(".hide-on-shared-chain").show();
    }

    // Display the Puyo Display
    this.puyoDisplay.display();

    // Easter eggs :D
    function easteregg(keys: number[], surprise: () => void) {
      // Set up the main easter egg function
      let key = 0;

      document.addEventListener("keydown", e => {
        if (e.which === keys[key]) {
          key++;
          if (key === keys.length) {
            surprise();
            key = 0;
          }
        } else {
          key = 0;
        }
      });
    }

    // Puyo Puyo~n 108 chain secret
    // It's simply the Konami code, silly!
    // Code: Up, Up, Down, Down, Left, Right, B, A, Enter
    easteregg([38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13], () => {
      // Set to the 108 chain from Puyo~n
      this.field.setChain(
        "421212224324123312131211442442211213431123321132142423" +
          "424324123341244343221344222431343211341112142312433213" +
          "342443412321234123124434123212341231334123212341231241" +
          "412321234123121234123412341244234123412341233412341234" +
          "123412311234123412341214434123412341234144341234123412" +
          "342341234123412341134123412341234121341234123412342134" +
          "123412341234134123412341231421341234123412312341234123" +
          "412341123412341234123412341234123412341234123412341234",
        16,
        26
      );
      this.simulation.puyoToClear = 4;
      $("#puyo-to-clear").val(this.simulation.puyoToClear);
    });
  }
}
