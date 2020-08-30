/*
 * Puyo
 *
 * Contains methods dealing with Puyo, which include getting puyo state
 * and URL conversions.
 */

import { PuyoType } from "../constants";

export class Puyo {
  puyo: PuyoType;

  constructor(p: PuyoType) {
    if (p !== undefined && this.isValid(p)) {
      // Is this a valid puyo?
      this.puyo = p;
    } else {
      this.puyo = PuyoType.None;
    }
  }

  // Returns if puyo p is a valid puyo
  isValid(p: PuyoType) {
    return (
      p === PuyoType.Red ||
      p === PuyoType.Green ||
      p === PuyoType.Blue ||
      p === PuyoType.Yellow ||
      p === PuyoType.Purple ||
      p === PuyoType.Nuisance ||
      p === PuyoType.Hard ||
      p === PuyoType.Point ||
      p === PuyoType.Sun ||
      p === PuyoType.Iron ||
      p === PuyoType.Block ||
      p === PuyoType.ClearedRed ||
      p === PuyoType.ClearedGreen ||
      p === PuyoType.ClearedBlue ||
      p === PuyoType.ClearedYellow ||
      p === PuyoType.ClearedPurple ||
      p === PuyoType.ClearedNuisance ||
      p === PuyoType.ClearedPoint ||
      p === PuyoType.ClearedSun
    );
  }

  // Returns if puyo is a colored puyo (not nuisance or other type)
  isColored() {
    return (
      this.puyo === PuyoType.Red ||
      this.puyo === PuyoType.Green ||
      this.puyo === PuyoType.Blue ||
      this.puyo === PuyoType.Yellow ||
      this.puyo === PuyoType.Purple
    );
  }

  // Returns if puyo is a nuisance puyo
  isNuisance() {
    return (
      this.puyo === PuyoType.Nuisance ||
      this.puyo === PuyoType.Hard ||
      this.puyo === PuyoType.Point
    );
  }

  // Returns if puyo has been cleared
  isCleared() {
    return (
      this.puyo === PuyoType.ClearedRed ||
      this.puyo === PuyoType.ClearedGreen ||
      this.puyo === PuyoType.ClearedBlue ||
      this.puyo === PuyoType.ClearedYellow ||
      this.puyo === PuyoType.ClearedPurple ||
      this.puyo === PuyoType.ClearedNuisance ||
      this.puyo === PuyoType.ClearedPoint ||
      this.puyo === PuyoType.ClearedSun
    );
  }

  // Returns if the current puyo can have animation (excludes sun puyo)
  hasAnimation() {
    return (
      this.puyo === PuyoType.Red ||
      this.puyo === PuyoType.Green ||
      this.puyo === PuyoType.Blue ||
      this.puyo === PuyoType.Yellow ||
      this.puyo === PuyoType.Purple ||
      this.puyo === PuyoType.Nuisance ||
      this.puyo === PuyoType.Hard ||
      this.puyo === PuyoType.Point
    );
  }

  // Set the puyo
  setPuyo(p: PuyoType) {
    if (this.isValid(p)) {
      this.puyo = p;
    } else {
      this.puyo = PuyoType.None;
    }
  }
}
