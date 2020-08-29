import { PuyoType } from "./constants";
import { Puyo } from "./puyo";
import { PuyoDisplay } from "./puyodisplay";

export class FieldMap {
  map: Puyo[][];
  width: number;
  height: number;

  // Creates a puyo map, either a new one or from an existing one
  constructor(w: number, h: number, m?: FieldMap) {
    this.map = [];
    this.width = w;
    this.height = h; /* This is the total height (height + hidden rows) */

    var x, y;
    if (m !== undefined) {
      for (x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (y = 0; y < this.height; y++) {
          this.map[x][y] = new Puyo(m.puyo(x, y));
        }
      }
    } else {
      for (x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (y = 0; y < this.height; y++) {
          this.map[x][y] = new Puyo(PuyoType.None);
        }
      }
    }
  }

  // Returns puyo at position (x,y)
  puyo(x: number, y: number) {
    return this.map[x][y].puyo;
  }

  // Returns the puyo object at position (x,y)
  get(x: number, y: number) {
    return this.map[x][y];
  }

  // Sets the puyo at position (x,y)
  set(x: number, y: number, p: PuyoType) {
    this.map[x][y].setPuyo(p);

    if (!PuyoDisplay.renderer) {
      return;
    }

    PuyoDisplay.renderer.drawPuyo(x, y, this.map[x][y]);

    if (!PuyoDisplay.puyoAnimation.running) {
      // Redraw all puyo around us
      if (y > 0) {
        PuyoDisplay.renderer.drawPuyo(x, y - 1, this.map[x][y - 1]);
      }
      if (x > 0) {
        PuyoDisplay.renderer.drawPuyo(x - 1, y, this.map[x - 1][y]);
      }
      if (y < this.height - 1) {
        PuyoDisplay.renderer.drawPuyo(x, y + 1, this.map[x][y + 1]);
      }
      if (x < this.width - 1) {
        PuyoDisplay.renderer.drawPuyo(x + 1, y, this.map[x + 1][y]);
      }
    }
  }
}
