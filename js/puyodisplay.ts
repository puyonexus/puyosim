/*
 * Puyo Display
 *
 * Controls the style of the puyo and displays it on the field.
 */

import $ from "jquery";
import {
  PuyoType,
  FieldDefaultWidth,
  FieldDefaultHeight,
  FieldDefaultHiddenRows,
} from "./constants";
import { Puyo } from "./puyo";
import { PuyoSim } from "./puyosim";

interface IPuyoSkin {
  id: string;
  image: string;
  frames?: number;
}

// Puyo animation class
class PuyoAnimation {
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

    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
        var p = this.sim.field.map.get(x, y);
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

    var self = this;
    this.timer = window.setTimeout(function () {
      self.animate();
    }, 200);
  }

  start(n: number) {
    // Starts the animation (n = total number of frames)
    this.running = true;

    this.frame = 0;
    this.totalFrames = n;

    var self = this;
    this.timer = window.setTimeout(function () {
      self.animate();
    }, 200);
  }

  stop() {
    // Stops the animation
    this.running = false;
    this.frame = 0;
    clearTimeout(this.timer);

    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
        var p = this.sim.field.map.get(x, y);
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

// Sun Puyo animation class
class SunPuyoAnimation {
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

    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
        var p = this.sim.field.map.get(x, y);
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

    var self = this;
    this.timer = window.setTimeout(function () {
      self.animate();
    }, 120);
  }

  start() {
    // Starts the animation (n = total number of frames)
    this.running = true;

    this.frame = 0;

    var self = this;
    this.timer = window.setTimeout(function () {
      self.animate();
    }, 120);
  }

  stop() {
    // Stops the animation
    this.running = false;
    this.frame = 0;
    clearTimeout(this.timer);

    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
        var p = this.sim.field.map.get(x, y);
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

// CanvasRenderer (uses HTML5 Canvas to display the puyo on the field)
class CanvasRenderer {
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
    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
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
    var pos;
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
    var newPuyoImage = new Image(),
      self = this;
    newPuyoImage.src = "/images/puyo/" + this.sim.puyoDisplay.puyoSkin!.image;
    newPuyoImage.onload = function () {
      if (self.sim.puyoDisplay.puyoAnimation.running) {
        // Stop the animation if it is running
        self.sim.puyoDisplay.puyoAnimation.stop();
      }
      if (self.sim.puyoDisplay.sunPuyoAnimation.running) {
        // Stop the sun puyo animation if it is running
        self.sim.puyoDisplay.sunPuyoAnimation.stop();
      }

      self.puyoImage = newPuyoImage;

      if (
        self.sim.puyoDisplay.animate.puyo &&
        self.sim.puyoDisplay.puyoSkin!.frames !== undefined &&
        self.sim.puyoDisplay.puyoSkin!.frames > 0
      ) {
        // Is this puyo skin animated?
        self.sim.puyoDisplay.puyoAnimation.start(
          self.sim.puyoDisplay.puyoSkin!.frames
        );
      }
      if (self.sim.puyoDisplay.animate.sunPuyo) {
        // Animate sun puyo?
        self.sim.puyoDisplay.sunPuyoAnimation.start();
      }

      if ($("#field-canvas").length > 0) {
        // Can we draw the puyo?
        for (var y = 0; y < self.sim.field.totalHeight; y++) {
          for (var x = 0; x < self.sim.field.width; x++) {
            self.drawPuyo(x, y, self.sim.field.map.get(x, y));
          }
        }
      }

      $("#puyo-selection .puyo")
        .not(".puyo-none, .puyo-delete")
        .css(
          "background-image",
          "url('/images/puyo/" + self.sim.puyoDisplay.puyoSkin!.image + "')"
        );

      if (self.sim.puyoDisplay.nuisanceTrayTimer === undefined) {
        self.drawNuisanceTray(self.sim.simulation.nuisance, false);
      }
    };
  }

  drawNuisanceTray(n: number, animate?: boolean) {
    // Draws nuisance in the nuisance tray
    var amounts = [1, 6, 30, 180, 360, 720, 1440],
      pos = [],
      nuisance = n,
      i;

    for (i = 0; i < 6; i++) {
      if (nuisance <= 0) {
        // No nuisance = no image
        pos[i] = -1;
      } else {
        for (var am = amounts.length - 1; am >= 0; am--) {
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
      for (i = 5; i >= 0; i--) {
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

    for (var i = 5; i >= 0; i--) {
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

    var self = this;
    this.sim.puyoDisplay.nuisanceTrayTimer = window.setTimeout(function () {
      self.animateNuisanceTray(step + 5, pos);
    }, 1000 / 60);
  }
}

export class PuyoDisplay {
  renderer: CanvasRenderer;
  puyoAnimation: PuyoAnimation;
  sunPuyoAnimation: SunPuyoAnimation;

  // Puyo size in pixels (always 32)
  readonly puyoSize = 32;

  // The current puyo skin
  puyoSkin?: IPuyoSkin;

  // The timer for the nuisance tray
  nuisanceTrayTimer?: number;

  // Animation settings
  animate = {
    // Animate Puyo (only the chalk puyo skin is animated)
    puyo: true,

    // Animate Sun Puyo
    sunPuyo: true,

    // Animate the nuisance tray
    nuisanceTray: true,
  };

  // Finally, we will list the available puyo skins here
  puyoSkins = [
    { id: "classic", image: "classic.png" },
    { id: "puyo4", image: "puyo4.png" },
    { id: "fever", image: "fever.png" },
    { id: "shiki", image: "shiki.png" },
    { id: "aqua", image: "aqua.png" },
    { id: "beta", image: "beta.png" },
    { id: "block", image: "block.png" },
    { id: "board", image: "board.png" },
    { id: "box", image: "box.png" },
    { id: "capsule", image: "capsule.png" },
    { id: "chalk", image: "chalk.png", frames: 4 },
    { id: "chalk2", image: "chalk2.png", frames: 4 },
    { id: "clear", image: "clear.png" },
    { id: "cube", image: "cube.png" },
    { id: "cube2", image: "cube2.png" },
    { id: "degi", image: "degi.png" },
    { id: "fever2", image: "fever2.png" },
    { id: "gyakko", image: "gyakko.png" },
    { id: "human", image: "human.png" },
    { id: "moji", image: "moji.png" },
    { id: "moji2", image: "moji2.png" },
    { id: "moro", image: "moro.png" },
    { id: "msx", image: "msx.png" },
    { id: "real", image: "real.png" },
    { id: "shiki2", image: "shiki2.png" },
    { id: "sonic", image: "sonic.png" },
  ];

  constructor(readonly sim: PuyoSim) {
    this.renderer = new CanvasRenderer(sim);
    this.puyoAnimation = new PuyoAnimation(sim);
    this.sunPuyoAnimation = new SunPuyoAnimation(sim);
  }

  init() {
    // Set the puyo skin
    this.setPuyoSkin(localStorage.getItem("chainsim.puyoSkin") || "classic");

    // Set our animation settings
    this.animate.puyo =
      (localStorage.getItem("chainsim.animate.puyo") || "yes") === "yes";
    this.animate.sunPuyo =
      (localStorage.getItem("chainsim.animate.sunPuyo") || "yes") === "yes";
    this.animate.nuisanceTray =
      (localStorage.getItem("chainsim.animate.nuisanceTray") || "yes") ===
      "yes";
  }

  getImagePosition(x: number, y: number, p: PuyoType) {
    // Returns the position of the image for background-image (p = puyo object)
    var posX = 0,
      posY = 0,
      self = this;

    function getXPosition(x: number, y: number, p: PuyoType): number {
      // Returns the X position of the puyo
      var pos = 0;

      if (p === PuyoType.Sun) {
        // Sun Puyo
        if (self.sunPuyoAnimation.running) {
          return self.sunPuyoAnimation.frame;
        } else {
          return 0;
        }
      }
      if (self.puyoSkin!.frames !== undefined && self.puyoSkin!.frames > 0) {
        // Animated Puyo
        if (self.puyoAnimation.running) {
          return self.puyoAnimation.frame;
        } else {
          return 0;
        }
      }

      if (y < self.sim.field.hiddenRows) return 0;
      if (p === PuyoType.Nuisance || p === PuyoType.Point) return 0;

      var L = x > 0 && self.sim.field.map.puyo(x - 1, y) === p,
        R =
          x < self.sim.field.width - 1 &&
          self.sim.field.map.puyo(x + 1, y) === p,
        U =
          y > self.sim.field.hiddenRows &&
          self.sim.field.map.puyo(x, y - 1) === p,
        D =
          y < self.sim.field.totalHeight - 1 &&
          self.sim.field.map.puyo(x, y + 1) === p;

      if (L) pos += 8;
      if (R) pos += 4;
      if (U) pos += 2;
      if (D) pos += 1;

      return pos;
    }

    switch (p) {
      case PuyoType.None:
        posX = 0;
        posY = 0;
        break;
      case PuyoType.Delete:
        posX = 0;
        posY = 0;
        break;

      case PuyoType.Red:
        posX = getXPosition(x, y, p);
        posY = 0;
        break;
      case PuyoType.Green:
        posX = getXPosition(x, y, p);
        posY = 1;
        break;
      case PuyoType.Blue:
        posX = getXPosition(x, y, p);
        posY = 2;
        break;
      case PuyoType.Yellow:
        posX = getXPosition(x, y, p);
        posY = 3;
        break;
      case PuyoType.Purple:
        posX = getXPosition(x, y, p);
        posY = 4;
        break;

      case PuyoType.Nuisance:
        posX = getXPosition(x, y, p);
        posY = 5;
        break;
      case PuyoType.Point:
        posX = getXPosition(x, y, p);
        posY = 6;
        break;
      case PuyoType.Sun:
        posX = getXPosition(x, y, p);
        posY = 7;
        break;
      case PuyoType.Hard:
        posX = 0;
        posY = 8;
        break;
      case PuyoType.Iron:
        posX = 1;
        posY = 8;
        break;
      case PuyoType.Block:
        posX = 2;
        posY = 8;
        break;

      case PuyoType.ClearedRed:
        posX = 3;
        posY = 8;
        break;
      case PuyoType.ClearedGreen:
        posX = 4;
        posY = 8;
        break;
      case PuyoType.ClearedBlue:
        posX = 5;
        posY = 8;
        break;
      case PuyoType.ClearedYellow:
        posX = 6;
        posY = 8;
        break;
      case PuyoType.ClearedPurple:
        posX = 7;
        posY = 8;
        break;

      case PuyoType.ClearedNuisance:
        posX = 8;
        posY = 8;
        break;
      case PuyoType.ClearedPoint:
        posX = 9;
        posY = 8;
        break;
      case PuyoType.ClearedSun:
        posX = 10;
        posY = 8;
        break;
    }

    return { x: posX, y: posY };
  }

  display() {
    // Display (in other words, initalize the renderer)
    this.renderer.init();

    // Display the Puyo selection
    this.displayPuyoSelection();
  }

  setPuyoSkin(skin: string) {
    // Sets the puyo skin
    for (var i = 0; i < this.puyoSkins.length; i++) {
      if (this.puyoSkins[i].id === skin) {
        this.puyoSkin = this.puyoSkins[i];
        this.renderer.setPuyoSkin();

        return;
      }
    }

    this.puyoSkin = this.puyoSkins[0];
    this.renderer.setPuyoSkin();
  }

  displayPuyoSelection() {
    $("#puyo-selection .puyo")
      .not(".puyo-none, .puyo-delete")
      .css(
        "background-image",
        "url('/images/puyo/" + this.puyoSkin!.image + "')"
      );
  }

  getSkinIndex(id: string) {
    for (var i = 0; i < this.puyoSkins.length; i++) {
      if (this.puyoSkins[i].id === id) return i;
    }

    return -1;
  }
}
