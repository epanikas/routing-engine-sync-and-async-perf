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

  public static topLeft(p1: CanvasPosition, p2: CanvasPosition): CanvasPosition {
    return new CanvasPosition(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
  }
}
