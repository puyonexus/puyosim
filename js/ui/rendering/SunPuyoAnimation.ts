import $ from "jquery";
import { PuyoSim } from "../../PuyoSim";
import { PuyoType } from "../../constants";

// Sun Puyo animation class
export class SunPuyoAnimation {
  // Current frame the animation is on
  frame = 0;

  // Total number of frames in the animation (always 8)
  totalFrames = 8;

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
        const p = this.sim.field.map.get(x, y);
        if (p.puyo === PuyoType.Sun) {
          // Only redraw sun puyo
          this.sim.puyoDisplay.renderer.drawPuyo(x, y, p);
        }
      }
    }

    $("#puyo-selection .puyo.puyo-sun").css(
      "background-position",
      "-" +
        this.frame * this.sim.puyoDisplay.puyoSize +
        "px -" +
        7 * this.sim.puyoDisplay.puyoSize +
        "px"
    );

    this.timer = window.setTimeout(() => {
      this.animate();
    }, 120);
  }

  start() {
    // Starts the animation (n = total number of frames)
    this.running = true;

    this.frame = 0;

    this.timer = window.setTimeout(() => {
      this.animate();
    }, 120);
  }

  stop() {
    // Stops the animation
    this.running = false;
    this.frame = 0;
    clearTimeout(this.timer);

    for (let y = 0; y < this.sim.field.totalHeight; y++) {
      for (let x = 0; x < this.sim.field.width; x++) {
        const p = this.sim.field.map.get(x, y);
        if (p.puyo === PuyoType.Sun) {
          // Only redraw sun puyo
          this.sim.puyoDisplay.renderer.drawPuyo(x, y, p);
        }
      }
    }

    $("#puyo-selection .puyo.puyo-sun").css(
      "background-position",
      "0 -" + 7 * this.sim.puyoDisplay.puyoSize + "px"
    );
  }
}
