export class BoxSize {
  readonly sizeX: number;
  readonly sizeY: number;

  constructor(sizeX: number, sizeY: number) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  public multiplyBy(factor: number): BoxSize {
    return new BoxSize(this.sizeX * factor, this.sizeY * factor);
  }
}
