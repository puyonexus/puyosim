import "./common";
import $ from "jquery";
import Clipboard from "clipboard";
import { default as contentHtml } from "./data/content.html";
import { Utils } from "./utils";
import { Field } from "./simulator/Field";
import { Simulation } from "./simulator/Simulation";
import { Tabs } from "./ui/Tabs";
import { FieldDisplay } from "./ui/FieldDisplay";
import { PuyoDisplay } from "./ui/rendering/PuyoDisplay";
import { ControlsDisplay } from "./ui/ControlsDisplay";

// An instance of PuyoSim.
export class PuyoSim {
  field: Field;
  controlsDisplay: ControlsDisplay;
  fieldDisplay: FieldDisplay;
  puyoDisplay: PuyoDisplay;
  simulation: Simulation;
  tabs: Tabs;
  clipboard?: Clipboard;

  constructor() {
    this.field = new Field(this);
    this.controlsDisplay = new ControlsDisplay(this);
    this.fieldDisplay = new FieldDisplay(this);
    this.puyoDisplay = new PuyoDisplay(this);
    this.simulation = new Simulation(this);
    this.tabs = new Tabs(this);
  }

  init() {
    // Initalize the Field Display
    this.fieldDisplay.init();

    // Display the contents of the simulator
    $("#simulator").html(Utils.stringFormat(contentHtml, "/assets"));

    // Enable auto-copying to clipboard
    if (Clipboard.isSupported()) {
      this.clipboard = new Clipboard(".clipboard-button");
    } else {
      $(".clipboard-button").hide();
    }

    // Handle resizing for #simulator
    $(window).on("resize", () => {
      this.tabs.fieldWidthChanged();
    });

    // Show/hide elements depending on if we are viewing a shared chain
    if (window.chainData) {
      $(".show-on-shared-chain").show();
    } else {
      $(".hide-on-shared-chain").show();
    }

    // Display the Field
    this.fieldDisplay.display();

    // Display the Controls Display
    this.controlsDisplay.display();

    // Display the Puyo Display
    this.puyoDisplay.display();

    // Display the tabs
    this.tabs.display();

    // Easter eggs :D
    function easteregg(keys: number[], surprise: () => void) {
      // Set up the main easter egg function
      let key = 0;

      $(document).on("keydown", e => {
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
        26 // Set to the 108 chain from Puyo~n
      );
      this.simulation.puyoToClear = 4;
      $("#puyo-to-clear").val(this.simulation.puyoToClear);
    });
  }
}
