import { BoxSize } from "./box-size";

export class CanvasPosition {
  readonly x: number;
  readonly y: number;

  constructor(x: number = undefined, y: number = undefined) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return "{" + this.x + "; " + this.y + "}";
  }
}
