import $ from "jquery";
import { PuyoSim } from "./puyosim";
import { FieldDefaultWidth, FieldDefaultHeight, FieldDefaultHiddenRows, PuyoType } from "./constants";
import { Puyo } from "./puyo";

// CanvasRenderer (uses HTML5 Canvas to display the puyo on the field)
export class CanvasRenderer {
  // Field canvas context
  ctx!: CanvasRenderingContext2D;

  // Nuisance tray canvas context
  nuisanceTrayCtx!: CanvasRenderingContext2D;

  // Puyo Image sheet
  puyoImage?: HTMLImageElement;

  // Name of the renderer
  name = "CanvasRenderer";

  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalize the Canvas Renderer
    if (
      (this.sim.field.width !== FieldDefaultWidth ||
        this.sim.field.height !== FieldDefaultHeight) &&
      !$("#field-content").hasClass("alternate")
    ) {
      $("#field-content").addClass("alternate");
    } else if (
      this.sim.field.width === FieldDefaultWidth &&
      this.sim.field.height === FieldDefaultHeight &&
      $("#field-content").hasClass("alternate")
    ) {
      $("#field-content").removeClass("alternate");
    }

    if (
      this.sim.field.hiddenRows !== FieldDefaultHiddenRows &&
      !$("#field-bg-1").hasClass("alternate")
    ) {
      $("#field-bg-1").addClass("alternate");
    } else if (
      this.sim.field.hiddenRows === FieldDefaultHiddenRows &&
      $("#field-bg-1").hasClass("alternate")
    ) {
      $("#field-bg-1").removeClass("alternate");
    }

    $("<canvas>")
      .attr({
        id: "field-canvas",
        width: this.sim.field.width * this.sim.puyoDisplay.puyoSize,
        height: this.sim.field.totalHeight * this.sim.puyoDisplay.puyoSize,
      })
      .appendTo("#field");
    const fieldCanvas: HTMLCanvasElement = document.getElementById(
      "field-canvas"
    ) as HTMLCanvasElement;
    this.ctx = fieldCanvas.getContext("2d")!;

    // Now draw everything
    for (let y = 0; y < this.sim.field.totalHeight; y++) {
      for (let x = 0; x < this.sim.field.width; x++) {
        this.drawPuyo(x, y, this.sim.field.map.get(x, y));
      }
    }

    // Set up the nuisance tray
    $("<canvas>")
      .attr({
        id: "nuisance-tray-canvas",
        width: 224,
        height: 64,
      })
      .css({
        "margin-left": "-16px",
        "margin-top": "-15px",
      })
      .appendTo("#nuisance-tray");
    const nuisanceTrayCanvas: HTMLCanvasElement = document.getElementById(
      "nuisance-tray-canvas"
    ) as HTMLCanvasElement;
    this.nuisanceTrayCtx = nuisanceTrayCanvas.getContext("2d")!;

    this.drawNuisanceTray(this.sim.simulation.nuisance, false);
  }

  uninit() {
    // Uninitalize the Canvas Renderer
    $("#field-canvas").remove();
    $("#nuisance-tray-canvas").remove();

    if (this.sim.puyoDisplay.nuisanceTrayTimer !== undefined) {
      // Stop the timer if it is running
      clearTimeout(this.sim.puyoDisplay.nuisanceTrayTimer);
    }
  }

  drawPuyo(x: number, y: number, p: Puyo) {
    // Draws the puyo at x, y
    let pos: { x: number, y: number };
    if (this.ctx === undefined) return;

    this.ctx.clearRect(
      x * this.sim.puyoDisplay.puyoSize,
      y * this.sim.puyoDisplay.puyoSize,
      this.sim.puyoDisplay.puyoSize,
      this.sim.puyoDisplay.puyoSize
    );

    if (p.puyo !== PuyoType.None && this.puyoImage !== undefined) {
      pos = this.sim.puyoDisplay.getImagePosition(x, y, p.puyo);
      if (y < this.sim.field.hiddenRows) {
        // Puyo in hidden row are partially transparent
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
          this.puyoImage,
          pos.x * this.sim.puyoDisplay.puyoSize,
          pos.y * this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          x * this.sim.puyoDisplay.puyoSize,
          y * this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize
        );
        this.ctx.globalAlpha = 1;
      } else {
        this.ctx.drawImage(
          this.puyoImage,
          pos.x * this.sim.puyoDisplay.puyoSize,
          pos.y * this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          x * this.sim.puyoDisplay.puyoSize,
          y * this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize,
          this.sim.puyoDisplay.puyoSize
        );
      }
    }
  }

  setPuyoSkin() {
    // Sets the puyo skin
    const newPuyoImage = new Image();
    newPuyoImage.src = "/images/puyo/" + this.sim.puyoDisplay.puyoSkin.image;
    newPuyoImage.onload = () => {
      if (this.sim.puyoDisplay.puyoAnimation.running) {
        // Stop the animation if it is running
        this.sim.puyoDisplay.puyoAnimation.stop();
      }
      if (this.sim.puyoDisplay.sunPuyoAnimation.running) {
        // Stop the sun puyo animation if it is running
        this.sim.puyoDisplay.sunPuyoAnimation.stop();
      }

      this.puyoImage = newPuyoImage;

      if (
        this.sim.puyoDisplay.animate.puyo &&
        this.sim.puyoDisplay.puyoSkin.frames !== undefined &&
        this.sim.puyoDisplay.puyoSkin.frames > 0
      ) {
        // Is this puyo skin animated?
        this.sim.puyoDisplay.puyoAnimation.start(
          this.sim.puyoDisplay.puyoSkin.frames
        );
      }
      if (this.sim.puyoDisplay.animate.sunPuyo) {
        // Animate sun puyo?
        this.sim.puyoDisplay.sunPuyoAnimation.start();
      }

      if ($("#field-canvas").length > 0) {
        // Can we draw the puyo?
        for (let y = 0; y < this.sim.field.totalHeight; y++) {
          for (let x = 0; x < this.sim.field.width; x++) {
            this.drawPuyo(x, y, this.sim.field.map.get(x, y));
          }
        }
      }

      $("#puyo-selection .puyo")
        .not(".puyo-none, .puyo-delete")
        .css(
          "background-image",
          "url('/images/puyo/" + this.sim.puyoDisplay.puyoSkin.image + "')"
        );

      if (this.sim.puyoDisplay.nuisanceTrayTimer === undefined) {
        this.drawNuisanceTray(this.sim.simulation.nuisance, false);
      }
    };
  }

  drawNuisanceTray(n: number, animate?: boolean) {
    // Draws nuisance in the nuisance tray
    const amounts = [1, 6, 30, 180, 360, 720, 1440];
    const pos = [];
    let nuisance = n;

    for (let i = 0; i < 6; i++) {
      if (nuisance <= 0) {
        // No nuisance = no image
        pos[i] = -1;
      } else {
        for (let am = amounts.length - 1; am >= 0; am--) {
          if (nuisance >= amounts[am]) {
            nuisance -= amounts[am];
            pos[i] = am;
            break;
          }
        }
      }
    }

    if (
      this.sim.puyoDisplay.animate.nuisanceTray &&
      animate !== false &&
      n !== 0
    ) {
      // Make it nice and animate it
      this.animateNuisanceTray(0, pos);
    } else {
      if (this.sim.puyoDisplay.nuisanceTrayTimer !== undefined) {
        // Stop the timer if it is running
        clearTimeout(this.sim.puyoDisplay.nuisanceTrayTimer);
        this.sim.puyoDisplay.nuisanceTrayTimer = undefined;
      }

      this.nuisanceTrayCtx.clearRect(0, 0, 224, 64);
      for (let i = 5; i >= 0; i--) {
        if (pos[i] !== -1 && this.puyoImage !== undefined) {
          this.nuisanceTrayCtx.drawImage(
            this.puyoImage,
            pos[i] * 64,
            288,
            64,
            64,
            i * 32,
            0,
            64,
            64
          );
        }
      }
    }
  }

  animateNuisanceTray(step: number, pos: number[]) {
    // Animates the nuisance tray
    if (step === 0) {
      // Step not initalized, so we are just starting the animation
      if (this.sim.puyoDisplay.nuisanceTrayTimer !== undefined) {
        // Stop the timer if it is running
        clearTimeout(this.sim.puyoDisplay.nuisanceTrayTimer);
      }
    } else if (step > 80) {
      // Stop animating
      this.sim.puyoDisplay.nuisanceTrayTimer = undefined;
      return;
    }

    this.nuisanceTrayCtx.clearRect(0, 0, 224, 64);
    this.nuisanceTrayCtx.globalAlpha = step / 80;

    for (let i = 5; i >= 0; i--) {
      if (pos[i] !== -1 && this.puyoImage !== undefined) {
        this.nuisanceTrayCtx.drawImage(
          this.puyoImage,
          pos[i] * 64,
          288,
          64,
          64,
          80 - step + i * 32 * (step / 80),
          0,
          64,
          64
        );
      }
    }

    this.nuisanceTrayCtx.globalAlpha = 1;

    this.sim.puyoDisplay.nuisanceTrayTimer = window.setTimeout(() => {
      this.animateNuisanceTray(step + 5, pos);
    }, 1000 / 60);
  }
}
