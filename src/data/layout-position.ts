import { BoxSize } from "./box-size";
import {CanvasPosition} from "./canvas-position";

export class LayoutPosition {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toString(): string {
    return this.x + "," + this.y;
  }

  public equals(pos: LayoutPosition): boolean {
    return this.x == pos.x && this.y == pos.y;
  }

  public static topLeft(p1: LayoutPosition, p2: LayoutPosition): LayoutPosition {
    return new LayoutPosition(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y))
  }

  public static bottomRight(p1: LayoutPosition, p2: LayoutPosition): LayoutPosition {
    return new LayoutPosition(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y))
  }

  public toCanvasPosition(cellSize: BoxSize): CanvasPosition {
    return new CanvasPosition(
        cellSize.sizeX / 2 + this.x * cellSize.sizeX,
        cellSize.sizeY / 2 + this.y * cellSize.sizeY)
  }

}
