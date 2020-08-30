/*
 * Puyo Display
 *
 * Controls the style of the puyo and displays it on the field.
 */

import $ from "jquery";
import { PuyoType } from "../../constants";
import { PuyoSim } from "../../PuyoSim";
import { CanvasRenderer } from "./CanvasRenderer";
import { PuyoAnimation } from "./PuyoAnimation";
import { SunPuyoAnimation } from "./SunPuyoAnimation";

interface IPuyoSkin {
  id: string;
  image: string;
  frames?: number;
}

export class PuyoDisplay {
  renderer: CanvasRenderer;
  puyoAnimation: PuyoAnimation;
  sunPuyoAnimation: SunPuyoAnimation;

  // Puyo size in pixels (always 32)
  readonly puyoSize = 32;

  // The current puyo skin
  puyoSkin: IPuyoSkin;

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
  readonly puyoSkins = [
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
    this.puyoSkin = this.puyoSkins[0];
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

  private getXPosition(x: number, y: number, p: PuyoType): number {
    // Returns the X position of the puyo
    let pos = 0;

    if (p === PuyoType.Sun) {
      // Sun Puyo
      if (this.sunPuyoAnimation.running) {
        return this.sunPuyoAnimation.frame;
      } else {
        return 0;
      }
    }
    if (this.puyoSkin.frames !== undefined && this.puyoSkin.frames > 0) {
      // Animated Puyo
      if (this.puyoAnimation.running) {
        return this.puyoAnimation.frame;
      } else {
        return 0;
      }
    }

    if (y < this.sim.field.hiddenRows) return 0;
    if (p === PuyoType.Nuisance || p === PuyoType.Point) return 0;

    const L = x > 0 && this.sim.field.map.puyo(x - 1, y) === p;
    const R =
      x < this.sim.field.width - 1 && this.sim.field.map.puyo(x + 1, y) === p;
    const U =
      y > this.sim.field.hiddenRows && this.sim.field.map.puyo(x, y - 1) === p;
    const D =
      y < this.sim.field.totalHeight - 1 &&
      this.sim.field.map.puyo(x, y + 1) === p;

    if (L) pos += 8;
    if (R) pos += 4;
    if (U) pos += 2;
    if (D) pos += 1;

    return pos;
  }

  getImagePosition(x: number, y: number, p: PuyoType) {
    // Returns the position of the image for background-image (p = puyo object)
    let posX = 0;
    let posY = 0;

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
        posX = this.getXPosition(x, y, p);
        posY = 0;
        break;
      case PuyoType.Green:
        posX = this.getXPosition(x, y, p);
        posY = 1;
        break;
      case PuyoType.Blue:
        posX = this.getXPosition(x, y, p);
        posY = 2;
        break;
      case PuyoType.Yellow:
        posX = this.getXPosition(x, y, p);
        posY = 3;
        break;
      case PuyoType.Purple:
        posX = this.getXPosition(x, y, p);
        posY = 4;
        break;

      case PuyoType.Nuisance:
        posX = this.getXPosition(x, y, p);
        posY = 5;
        break;
      case PuyoType.Point:
        posX = this.getXPosition(x, y, p);
        posY = 6;
        break;
      case PuyoType.Sun:
        posX = this.getXPosition(x, y, p);
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
    for (const it of this.puyoSkins) {
      if (it.id === skin) {
        this.puyoSkin = it;
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
        "url('/images/puyo/" + this.puyoSkin.image + "')"
      );
  }

  getSkinIndex(id: string) {
    for (let i = 0; i < this.puyoSkins.length; i++) {
      if (this.puyoSkins[i].id === id) return i;
    }

    return -1;
  }
}
