import {LayoutPosition} from "./layout-position";

export class CellRouteSegment {
  private readonly p1: LayoutPosition;
  private readonly p2: LayoutPosition;
  private readonly vertical: boolean;

  public constructor(p1: LayoutPosition, p2: LayoutPosition) {
    this.p1 = p1;
    this.p2 = p2;

    if (p1.x != p2.x && p1.y != p2.y) {
      throw new Error("wrong segment: " + p1 + ": " + p2)
    }

    if (p1.x == p2.x && p1.y == p2.y) {
      throw new Error("degenerated segment: " + p1 + ": " + p2)
    }

    this.vertical = p1.x == p2.x
  }

  getP1(): LayoutPosition {
    return this.p1;
  }
  getP2(): LayoutPosition {
    return this.p2;
  }
  isVertical(): boolean {
    return this.vertical;
  }

  toString(): string {
    return "<" + this.p1 + "-" + this.p2 + ">"
  }
}

export class CellRoute {
  // private readonly startBoxId: string;
  // private readonly endBoxId: string
  readonly cells: LayoutPosition[] = [];

  constructor(/*startBoxId: string, endBoxId: string, */cells: LayoutPosition[]) {
    // this.startBoxId = startBoxId;
    // this.endBoxId = endBoxId;
    // cells.forEach((c: LayoutPosition) => this.addPoint(c));
    this.cells = cells;
  }

  // getStartBoxId(): string {
  //   return this.startBoxId;
  // }

  // getEndBoxId(): string {
  //   return this.endBoxId;
  // }

  public cloneRoute(): CellRoute {
    return new CellRoute(this.cells);
  }

  public addPoint(point: LayoutPosition): void {
    this.cells.push(point);
  }

  public addPoints(points: LayoutPosition[]): void {
    points.forEach(p => this.addPoint(p));
  }

  public addPointsFromRoute(route: CellRoute): void {
    this.addPoints(route.cells);
  }

  public getRouteSegments(): CellRouteSegment[] {
    if (this.cells.length < 2) {
      return [];
    }
    const res: CellRouteSegment[] = [];
    let prev: LayoutPosition = this.cells[0];
    for (let i = 1; i < this.cells.length; ++i) {
      res.push(new CellRouteSegment(prev, this.cells[i]))
      prev = this.cells[i]
    }
    return res;
  }

  public toString(): string {
    return "route " + this.cells;
  }

  public validate(): CellRoute {
    const segments = this.getRouteSegments();
    // console.log(segments[0])
    return this;
  }

  getCells(): LayoutPosition[] {
    return this.cells;
  }

  getRouteStartPosition(): LayoutPosition {
    return this.cells[0];
  }

  getRouteEndPosition(): LayoutPosition {
    return this.cells[this.cells.length - 1];
  }

  getNumStairs(): number {
    let prev = this.getRouteSegments()[0];
    let numStairs = 0;
    this.getRouteSegments().forEach(rs => {
      const dirPrev = [Math.sign(prev.getP2().x - prev.getP1().x), Math.sign(prev.getP2().y - prev.getP1().y)]
      const dirRs = [Math.sign(rs.getP2().x - rs.getP1().x), Math.sign(rs.getP2().y - rs.getP1().y)]
      if (Math.abs(dirPrev[0]) != Math.abs(dirRs[0]) || Math.abs(dirPrev[1]) != Math.abs(dirRs[1])) {
        numStairs++;
      }
      prev = rs;
    });
    // console.log("for route " + this + " num stairs " + numStairs);
    return numStairs;
  }


}
