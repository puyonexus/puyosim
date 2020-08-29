/*
 * Puyo Display
 *
 * Controls the style of the puyo and displays it on the field.
 */

import $ from "jquery";
import { Constants } from "./constants";
import { Field } from "./field";
import { Simulation } from "./simulation";

export const PuyoDisplay = {
  // We're going to start out with our constants
  puyoSize: 32, // Puyo size in pixels (always 32)

  // Next we're going to set up our variables
  renderer: undefined, // The renderer object to use to display the puyo (Will always be set to CanvasRenderer)
  puyoSkin: undefined, // The current puyo skin
  nuisanceTrayTimer: undefined, // The timer for the nuisance tray

  animate: {
    // Animation settings
    puyo: true, // Animate Puyo (only the chalk puyo skin is animated)
    sunPuyo: true, // Animate Sun Puyo
    nuisanceTray: true, // Animate the nuisance tray
  },

  // Finally, we will list the available puyo skins here
  puyoSkins: [
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
  ],

  init: function () {
    // Initalize the puyo display
    // Set the parents of our children
    this.CanvasRenderer.parent = this;
    this.puyoAnimation.parent = this;
    this.sunPuyoAnimation.parent = this;

    // Set the renderer
    this.renderer = this.CanvasRenderer;

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
  },

  getImagePosition: function (x, y, p) {
    // Returns the position of the image for background-image (p = puyo object)
    var posX,
      posY,
      self = this;

    function getXPosition(x, y, p) {
      // Returns the X position of the puyo
      var pos = 0;

      if (p === Constants.Puyo.Sun) {
        // Sun Puyo
        if (self.sunPuyoAnimation.running) {
          return self.sunPuyoAnimation.frame;
        } else {
          return 0;
        }
      }
      if (self.puyoSkin.frames !== undefined && self.puyoSkin.frames > 0) {
        // Animated Puyo
        if (self.puyoAnimation.running) {
          return self.puyoAnimation.frame;
        } else {
          return 0;
        }
      }

      if (y < Field.hiddenRows) return 0;
      if (p === Constants.Puyo.Nuisance || p === Constants.Puyo.Point) return 0;

      var L = x > 0 && Field.map.puyo(x - 1, y) === p,
        R = x < Field.width - 1 && Field.map.puyo(x + 1, y) === p,
        U = y > Field.hiddenRows && Field.map.puyo(x, y - 1) === p,
        D = y < Field.totalHeight - 1 && Field.map.puyo(x, y + 1) === p;

      if (L) pos += 8;
      if (R) pos += 4;
      if (U) pos += 2;
      if (D) pos += 1;

      return pos;
    }

    switch (p) {
      case Constants.Puyo.None:
        posX = 0;
        posY = 0;
        break;
      case Constants.Puyo.Delete:
        posX = 0;
        posY = 0;
        break;

      case Constants.Puyo.Red:
        posX = getXPosition(x, y, p);
        posY = 0;
        break;
      case Constants.Puyo.Green:
        posX = getXPosition(x, y, p);
        posY = 1;
        break;
      case Constants.Puyo.Blue:
        posX = getXPosition(x, y, p);
        posY = 2;
        break;
      case Constants.Puyo.Yellow:
        posX = getXPosition(x, y, p);
        posY = 3;
        break;
      case Constants.Puyo.Purple:
        posX = getXPosition(x, y, p);
        posY = 4;
        break;

      case Constants.Puyo.Nuisance:
        posX = getXPosition(x, y, p);
        posY = 5;
        break;
      case Constants.Puyo.Point:
        posX = getXPosition(x, y, p);
        posY = 6;
        break;
      case Constants.Puyo.Sun:
        posX = getXPosition(x, y, p);
        posY = 7;
        break;
      case Constants.Puyo.Hard:
        posX = 0;
        posY = 8;
        break;
      case Constants.Puyo.Iron:
        posX = 1;
        posY = 8;
        break;
      case Constants.Puyo.Block:
        posX = 2;
        posY = 8;
        break;

      case Constants.Puyo.Cleared.Red:
        posX = 3;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Green:
        posX = 4;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Blue:
        posX = 5;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Yellow:
        posX = 6;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Purple:
        posX = 7;
        posY = 8;
        break;

      case Constants.Puyo.Cleared.Nuisance:
        posX = 8;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Point:
        posX = 9;
        posY = 8;
        break;
      case Constants.Puyo.Cleared.Sun:
        posX = 10;
        posY = 8;
        break;
    }

    return { x: posX, y: posY };
  },

  display: function () {
    // Display (in other words, initalize the renderer)
    this.renderer.init();

    // Display the Puyo selection
    this.displayPuyoSelection();
  },

  setPuyoSkin: function (skin) {
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
  },

  displayPuyoSelection: function () {
    $("#puyo-selection .puyo")
      .not(".puyo-none, .puyo-delete")
      .css(
        "background-image",
        "url('/images/puyo/" + this.puyoSkin.image + "')"
      );
  },

  getSkinIndex: function (id) {
    for (var i = 0; i < this.puyoSkins.length; i++) {
      if (this.puyoSkins[i].id === id) return i;
    }

    return -1;
  },

  CanvasRenderer: {
    // CanvasRenderer (uses HTML5 Canvas to display the puyo on the field)
    ctx: undefined, // Field canvas context
    nuisanceTrayCtx: undefined, // Nuisance tray canvas context
    puyoImage: undefined, // Puyo Image sheet
    parent: undefined, // Parent object (will be filled in when parent class is initalized)
    name: "CanvasRenderer", // Name of the renderer

    init: function () {
      // Initalize the Canvas Renderer
      if (
        (Field.width !== Constants.Field.DefaultWidth ||
          Field.height !== Constants.Field.DefaultHeight) &&
        !$("#field-content").hasClass("alternate")
      ) {
        $("#field-content").addClass("alternate");
      } else if (
        Field.width === Constants.Field.DefaultWidth &&
        Field.height === Constants.Field.DefaultHeight &&
        $("#field-content").hasClass("alternate")
      ) {
        $("#field-content").removeClass("alternate");
      }

      if (
        Field.hiddenRows !== Constants.Field.DefaultHiddenRows &&
        !$("#field-bg-1").hasClass("alternate")
      ) {
        $("#field-bg-1").addClass("alternate");
      } else if (
        Field.hiddenRows === Constants.Field.DefaultHiddenRows &&
        $("#field-bg-1").hasClass("alternate")
      ) {
        $("#field-bg-1").removeClass("alternate");
      }

      $("<canvas>")
        .attr({
          id: "field-canvas",
          width: Field.width * this.parent.puyoSize,
          height: Field.totalHeight * this.parent.puyoSize,
        })
        .appendTo("#field");
      const fieldCanvas: HTMLCanvasElement = document.getElementById(
        "field-canvas"
      ) as HTMLCanvasElement;
      this.ctx = fieldCanvas.getContext("2d");

      // Now draw everything
      for (var y = 0; y < Field.totalHeight; y++) {
        for (var x = 0; x < Field.width; x++) {
          this.drawPuyo(x, y, Field.map.get(x, y));
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
      this.nuisanceTrayCtx = nuisanceTrayCanvas.getContext("2d");

      this.drawNuisanceTray(Simulation.nuisance, false);
    },

    uninit: function () {
      // Uninitalize the Canvas Renderer
      $("#field-canvas").remove();
      $("#nuisance-tray-canvas").remove();

      if (this.parent.nuisanceTrayTimer !== undefined) {
        // Stop the timer if it is running
        clearTimeout(this.parent.nuisanceTrayTimer);
      }
    },

    drawPuyo: function (x, y, p) {
      // Draws the puyo at x, y
      var pos;
      if (this.ctx === undefined) return;

      this.ctx.clearRect(
        x * this.parent.puyoSize,
        y * this.parent.puyoSize,
        this.parent.puyoSize,
        this.parent.puyoSize
      );

      if (p.puyo !== Constants.Puyo.None && this.puyoImage !== undefined) {
        pos = this.parent.getImagePosition(x, y, p.puyo);
        if (y < Field.hiddenRows) {
          // Puyo in hidden row are partially transparent
          this.ctx.globalAlpha = 0.5;
          this.ctx.drawImage(
            this.puyoImage,
            pos.x * this.parent.puyoSize,
            pos.y * this.parent.puyoSize,
            this.parent.puyoSize,
            this.parent.puyoSize,
            x * this.parent.puyoSize,
            y * this.parent.puyoSize,
            this.parent.puyoSize,
            this.parent.puyoSize
          );
          this.ctx.globalAlpha = 1;
        } else {
          this.ctx.drawImage(
            this.puyoImage,
            pos.x * this.parent.puyoSize,
            pos.y * this.parent.puyoSize,
            this.parent.puyoSize,
            this.parent.puyoSize,
            x * this.parent.puyoSize,
            y * this.parent.puyoSize,
            this.parent.puyoSize,
            this.parent.puyoSize
          );
        }
      }
    },

    setPuyoSkin: function () {
      // Sets the puyo skin
      var newPuyoImage = new Image(),
        self = this;
      newPuyoImage.src = "/images/puyo/" + this.parent.puyoSkin.image;
      newPuyoImage.onload = function () {
        if (self.parent.puyoAnimation.running) {
          // Stop the animation if it is running
          self.parent.puyoAnimation.stop();
        }
        if (self.parent.sunPuyoAnimation.running) {
          // Stop the sun puyo animation if it is running
          self.parent.sunPuyoAnimation.stop();
        }

        self.puyoImage = newPuyoImage;

        if (
          self.parent.animate.puyo &&
          self.parent.puyoSkin.frames !== undefined &&
          self.parent.puyoSkin.frames > 0
        ) {
          // Is this puyo skin animated?
          self.parent.puyoAnimation.start(self.parent.puyoSkin.frames);
        }
        if (self.parent.animate.sunPuyo) {
          // Animate sun puyo?
          self.parent.sunPuyoAnimation.start();
        }

        if ($("#field-canvas").length > 0) {
          // Can we draw the puyo?
          for (var y = 0; y < Field.totalHeight; y++) {
            for (var x = 0; x < Field.width; x++) {
              self.drawPuyo(x, y, Field.map.get(x, y));
            }
          }
        }

        $("#puyo-selection .puyo")
          .not(".puyo-none, .puyo-delete")
          .css(
            "background-image",
            "url('/images/puyo/" + self.parent.puyoSkin.image + "')"
          );

        if (self.parent.nuisanceTrayTimer === undefined) {
          self.drawNuisanceTray(Simulation.nuisance, false);
        }
      };
    },

    drawNuisanceTray: function (n, animate) {
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

      if (this.parent.animate.nuisanceTray && animate !== false && n !== 0) {
        // Make it nice and animate it
        this.animateNuisanceTray(0, pos);
      } else {
        if (this.parent.nuisanceTrayTimer !== undefined) {
          // Stop the timer if it is running
          clearTimeout(this.parent.nuisanceTrayTimer);
          this.parent.nuisanceTrayTimer = undefined;
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
    },

    animateNuisanceTray: function (step, pos) {
      // Animates the nuisance tray
      if (step === 0) {
        // Step not initalized, so we are just starting the animation
        if (this.parent.nuisanceTrayTimer !== undefined) {
          // Stop the timer if it is running
          clearTimeout(this.parent.nuisanceTrayTimer);
        }
      } else if (step > 80) {
        // Stop animating
        this.parent.nuisanceTrayTimer = undefined;
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
      this.parent.nuisanceTrayTimer = setTimeout(function () {
        self.animateNuisanceTray(step + 5, pos);
      }, 1000 / 60);
    },
  },

  puyoAnimation: {
    // Puyo animation object
    parent: undefined, // Parent object (will be filled in when parent class is initalized)
    frame: 0, // Current frame the animation is on
    totalFrames: 0, // Total number of frames in the animation
    timer: undefined, // Timer for setInterval
    running: false, // If the animation is running

    animate: function () {
      // Animates the puyo
      this.frame++;
      if (this.frame >= this.totalFrames) {
        this.frame = 0;
      }

      for (var y = 0; y < Field.totalHeight; y++) {
        for (var x = 0; x < Field.width; x++) {
          var p = Field.map.get(x, y);
          if (p.hasAnimation()) {
            // Only redraw puyo that can have animation
            this.parent.renderer.drawPuyo(x, y, p);
          }
        }
      }

      $("#puyo-selection .puyo.puyo-red").css(
        "background-position",
        "-" + this.frame * this.parent.puyoSize + "px 0"
      );
      $("#puyo-selection .puyo.puyo-green").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          1 * this.parent.puyoSize +
          "px"
      );
      $("#puyo-selection .puyo.puyo-blue").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          2 * this.parent.puyoSize +
          "px"
      );
      $("#puyo-selection .puyo.puyo-yellow").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          3 * this.parent.puyoSize +
          "px"
      );
      $("#puyo-selection .puyo.puyo-purple").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          4 * this.parent.puyoSize +
          "px"
      );
      $("#puyo-selection .puyo.puyo-nuisance").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          5 * this.parent.puyoSize +
          "px"
      );
      $("#puyo-selection .puyo.puyo-point").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          6 * this.parent.puyoSize +
          "px"
      );

      var self = this;
      this.timer = setTimeout(function () {
        self.animate();
      }, 200);
    },

    start: function (n) {
      // Starts the animation (n = total number of frames)
      this.running = true;

      this.frame = 0;
      this.totalFrames = n;

      var self = this;
      this.timer = setTimeout(function () {
        self.animate();
      }, 200);
    },

    stop: function () {
      // Stops the animation
      this.running = false;
      this.frame = 0;
      clearTimeout(this.timer);

      for (var y = 0; y < Field.totalHeight; y++) {
        for (var x = 0; x < Field.width; x++) {
          var p = Field.map.get(x, y);
          if (p.hasAnimation()) {
            // Only redraw puyo that can have animation
            this.parent.renderer.drawPuyo(x, y, p);
          }
        }
      }

      $("#puyo-selection .puyo.puyo-red").css("background-position", "0 0");
      $("#puyo-selection .puyo.puyo-green").css(
        "background-position",
        "0 -" + 1 * this.parent.puyoSize + "px"
      );
      $("#puyo-selection .puyo.puyo-blue").css(
        "background-position",
        "0 -" + 2 * this.parent.puyoSize + "px"
      );
      $("#puyo-selection .puyo.puyo-yellow").css(
        "background-position",
        "0 -" + 3 * this.parent.puyoSize + "px"
      );
      $("#puyo-selection .puyo.puyo-purple").css(
        "background-position",
        "0 -" + 4 * this.parent.puyoSize + "px"
      );
      $("#puyo-selection .puyo.puyo-nuisance").css(
        "background-position",
        "0 -" + 5 * this.parent.puyoSize + "px"
      );
      $("#puyo-selection .puyo.puyo-point").css(
        "background-position",
        "0 -" + 6 * this.parent.puyoSize + "px"
      );
    },
  },

  sunPuyoAnimation: {
    // Sun Puyo animation object
    parent: undefined, // Parent object (will be filled in when parent class is initalized)
    frame: 0, // Current frame the animation is on
    totalFrames: 8, // Total number of frames in the animation (always 8)
    timer: undefined, // Timer for setInterval
    running: false, // If the animation is running

    animate: function () {
      // Animates the puyo
      this.frame++;
      if (this.frame >= this.totalFrames) {
        this.frame = 0;
      }

      for (var y = 0; y < Field.totalHeight; y++) {
        for (var x = 0; x < Field.width; x++) {
          var p = Field.map.get(x, y);
          if (p.puyo === Constants.Puyo.Sun) {
            // Only redraw sun puyo
            this.parent.renderer.drawPuyo(x, y, p);
          }
        }
      }

      $("#puyo-selection .puyo.puyo-sun").css(
        "background-position",
        "-" +
          this.frame * this.parent.puyoSize +
          "px -" +
          7 * this.parent.puyoSize +
          "px"
      );

      var self = this;
      this.timer = setTimeout(function () {
        self.animate();
      }, 120);
    },

    start: function () {
      // Starts the animation (n = total number of frames)
      this.running = true;

      this.frame = 0;

      var self = this;
      this.timer = setTimeout(function () {
        self.animate();
      }, 120);
    },

    stop: function () {
      // Stops the animation
      this.running = false;
      this.frame = 0;
      clearTimeout(this.timer);

      for (var y = 0; y < Field.totalHeight; y++) {
        for (var x = 0; x < Field.width; x++) {
          var p = Field.map.get(x, y);
          if (p.puyo === Constants.Puyo.Sun) {
            // Only redraw sun puyo
            this.parent.renderer.drawPuyo(x, y, p);
          }
        }
      }

      $("#puyo-selection .puyo.puyo-sun").css(
        "background-position",
        "0 -" + 7 * this.parent.puyoSize + "px"
      );
    },
  },
};
