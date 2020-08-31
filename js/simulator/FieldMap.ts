import { PuyoType } from "../constants";
import { Puyo } from "./Puyo";

export class FieldMap {
  map: Puyo[][];
  width: number;
  height: number;

  // Creates a puyo map, either a new one or from an existing one
  constructor(w: number, h: number, m?: FieldMap) {
    this.map = [];
    this.width = w;
    this.height = h; /* This is the total height (height + hidden rows) */

    if (m !== undefined) {
      for (let x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (let y = 0; y < this.height; y++) {
          this.map[x][y] = new Puyo(m.puyo(x, y));
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (let y = 0; y < this.height; y++) {
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
  }
}
