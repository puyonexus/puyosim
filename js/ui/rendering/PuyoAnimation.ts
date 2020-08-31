import $ from "jquery";
import { PuyoSim } from "../../PuyoSim";

// Puyo animation class
export class PuyoAnimation {
  // Current frame the animation is on
  frame = 0;

  // Total number of frames in the animation
  totalFrames = 0;

  // Timer for setInterval
  timer?: number;

  // If the animation is running
  running = false;

  constructor(readonly sim: PuyoSim) {}

  animate() {
    // Animates the puyo
    this.frame++;
    if (this.frame >= this.totalFrames) {
      this.frame = 0;
    }

    for (let y = 0; y < this.sim.field.totalHeight; y++) {
      for (let x = 0; x < this.sim.field.width; x++) {
        const p = this.sim.field.get(x, y);
        if (p.hasAnimation()) {
          // Only redraw puyo that can have animation
          this.sim.puyoDisplay.renderer.drawPuyo(x, y, p);
        }
      }
    }

    $("#puyo-selection .puyo.puyo-red").css(
      "background-position",
      "-" + this.frame * this.sim.puyoDisplay.puyoSize + "px 0"
    );
    $("#puyo-selection .puyo.puyo-green").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        1 * this.sim.puyoDisplay.puyoSize +
        "px"
    );
    $("#puyo-selection .puyo.puyo-blue").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        2 * this.sim.puyoDisplay.puyoSize +
        "px"
    );
    $("#puyo-selection .puyo.puyo-yellow").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        3 * this.sim.puyoDisplay.puyoSize +
        "px"
    );
    $("#puyo-selection .puyo.puyo-purple").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        4 * this.sim.puyoDisplay.puyoSize +
        "px"
    );
    $("#puyo-selection .puyo.puyo-nuisance").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        5 * this.sim.puyoDisplay.puyoSize +
        "px"
    );
    $("#puyo-selection .puyo.puyo-point").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        6 * this.sim.puyoDisplay.puyoSize +
        "px"
    );

    this.timer = window.setTimeout(() => {
      this.animate();
    }, 200);
  }

  start(n: number) {
    // Starts the animation (n = total number of frames)
    this.running = true;

    this.frame = 0;
    this.totalFrames = n;

    this.timer = window.setTimeout(() => {
      this.animate();
    }, 200);
  }

  stop() {
    // Stops the animation
    this.running = false;
    this.frame = 0;
    clearTimeout(this.timer);

    for (let y = 0; y < this.sim.field.totalHeight; y++) {
      for (let x = 0; x < this.sim.field.width; x++) {
        const p = this.sim.field.get(x, y);
        if (p.hasAnimation()) {
          // Only redraw puyo that can have animation
          this.sim.puyoDisplay.renderer.drawPuyo(x, y, p);
        }
      }
    }

    $("#puyo-selection .puyo.puyo-red").css("background-position", "0 0");
    $("#puyo-selection .puyo.puyo-green").css(
      "background-position",
      "0 -" + 1 * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#puyo-selection .puyo.puyo-blue").css(
      "background-position",
      "0 -" + 2 * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#puyo-selection .puyo.puyo-yellow").css(
      "background-position",
      "0 -" + 3 * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#puyo-selection .puyo.puyo-purple").css(
      "background-position",
      "0 -" + 4 * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#puyo-selection .puyo.puyo-nuisance").css(
      "background-position",
      "0 -" + 5 * this.sim.puyoDisplay.puyoSize + "px"
    );
    $("#puyo-selection .puyo.puyo-point").css(
      "background-position",
      "0 -" + 6 * this.sim.puyoDisplay.puyoSize + "px"
    );
  }
}
