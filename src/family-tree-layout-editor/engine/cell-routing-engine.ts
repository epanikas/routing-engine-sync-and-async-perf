import { BoxSize } from "../../data/box-size";
import { LayoutPosition } from "../../data/layout-position";
import { CellRoute } from "../../data/cell-route";
import { RoutingEngine } from "./routing-engine";
import { Family, Individual } from "../../data/gedcom-data";
import { WritableLayoutStore } from "../store/writable-layout-store";
import { RouteLayoutPosition } from "../../family-tree-layout/route-layout-position";

export class CellRoutingEngine implements RoutingEngine {

  private static readonly timeoutDelay = 1;

  private readonly layoutFactor: number;
  private readonly layoutStore: WritableLayoutStore;
  private readonly families: Family[];

  private routesCache: Map<string, CellRoute[]> = new Map<string, CellRoute[]>();
  private nonCompletedRoutesCache: Map<string, CellRoute[]> = new Map<string, CellRoute[]>();

  public pointToRoutesCache: Map<string, Map<RouteLayoutPosition, CellRoute[]>> = new Map<string, Map<RouteLayoutPosition, CellRoute[]>>;

  constructor(families: Family[], layoutStore: WritableLayoutStore, layoutFactor: number) {
    this.families = families.slice();
    this.layoutStore = layoutStore;
    // this.step = new BoxSize(wiringCellSize.sizeX / cellSize.sizeX, wiringCellSize.sizeY / cellSize.sizeY);
    this.layoutFactor = layoutFactor;
  }

  public calculateCellRoutes1(startBoxId: string,
                              endBoxId: string,
                              start: LayoutPosition,
                              end: LayoutPosition): CellRoute[] {

    return this.doCalculateCellRoutes1(startBoxId, endBoxId,
      RouteLayoutPosition.ofLayoutPosition(start, this.layoutFactor),
      RouteLayoutPosition.ofLayoutPosition(end, this.layoutFactor));
  }

  public doCalculateCellRoutes1(startBoxId: string,
                               endBoxId: string,
                               start: RouteLayoutPosition,
                               end: RouteLayoutPosition): CellRoute[] {

    const key: string = startBoxId + "-" + endBoxId;

    this.routesCache.set(key, []);
    const completedRoutes: CellRoute[] = this.routesCache.get(key);

    const initial = new Map<RouteLayoutPosition, CellRoute[]>();
    // this.pointToRoutesCache.set(key, initial);

    const directionX: number = Math.sign(end.x - start.x);
    const directionY: number = Math.sign(end.y - start.y);

    if (directionX != 0) {
      const prevPos: RouteLayoutPosition = RouteLayoutPosition.of(end.x - directionX, end.y, this.layoutFactor);
      initial.set(prevPos, [new CellRoute([prevPos, end])])
    }
    if (directionY != 0) {
      const prevPos: RouteLayoutPosition = RouteLayoutPosition.of(end.x, end.y - directionY, this.layoutFactor);
      initial.set(prevPos, [new CellRoute([prevPos, end])])
    }

    while(initial.size > 0) {

      const p: RouteLayoutPosition = Array.from(initial.keys())[0];
      const pRoutes = initial.get(p);
      initial.delete(p);

      const directionX: number = Math.sign(p.x - start.x);
      const directionY: number = Math.sign(p.y - start.y);

      if (directionX != 0) {
        const prevPos: RouteLayoutPosition = RouteLayoutPosition.of(p.x - directionX, p.y, this.layoutFactor);
        const prevPosRoutes = pRoutes.map(cr => new CellRoute([prevPos, ...cr.cells]));
        if (prevPos.x == start.x && prevPos.y == start.y) {
          prevPosRoutes.forEach((r: CellRoute) => completedRoutes.push(r));
        } else {
          initial.set(prevPos, prevPosRoutes);
        }
      }

      if (directionY != 0) {
        const prevPos: RouteLayoutPosition = RouteLayoutPosition.of(p.x, p.y - directionY, this.layoutFactor);
        const prevPosRoutes = pRoutes.map(cr => new CellRoute([prevPos, ...cr.cells]));
        if (prevPos.x == start.x && prevPos.y == start.y) {
          prevPosRoutes.forEach((r: CellRoute) => completedRoutes.push(r));
        } else {
          initial.set(prevPos, prevPosRoutes);
        }
      }

    }

    return completedRoutes;
  }

  public calculateCellRoutes(startBoxId: string,
                              endBoxId: string,
                              start: LayoutPosition,
                              end: LayoutPosition): CellRoute[] {

    return this.doCalculateCellRoutes(startBoxId, endBoxId,
      RouteLayoutPosition.ofLayoutPosition(start, this.layoutFactor),
      RouteLayoutPosition.ofLayoutPosition(end, this.layoutFactor));
  }

  public doCalculateCellRoutes(startBoxId: string,
                              endBoxId: string,
                              start: RouteLayoutPosition,
                              end: RouteLayoutPosition): CellRoute[] {

    // if (startBoxId == '@F0003@' && endBoxId == '@Marge_Simpson@') {
      console.log("calculating route for " + startBoxId + " - " + endBoxId);
    // }

    const key: string = startBoxId + "-" + endBoxId;

    this.routesCache.set(key, []);
    const completedRoutes: CellRoute[] = this.routesCache.get(key);
    this.nonCompletedRoutesCache.set(key, [new CellRoute([start])]);
    const nonCompletedRoutes: CellRoute[] = this.nonCompletedRoutesCache.get(key);
    while (nonCompletedRoutes.length > 0) {
      const r: CellRoute = nonCompletedRoutes.splice(0, 1)[0];
      this.calculateCellRouteStep(r, end, completedRoutes, nonCompletedRoutes);
    }

    return completedRoutes;

  }

  private calculateCellRouteStep(route: CellRoute, end: RouteLayoutPosition, completedRoutes: CellRoute[], nonCompletedRoutes: CellRoute[]): void {

    const start: RouteLayoutPosition = route.getRouteEndPosition();

    const directionX: number = Math.sign(end.x - start.x);
    const directionY: number = Math.sign(end.y - start.y);

    if (directionX != 0) {
      const nextPos: RouteLayoutPosition = RouteLayoutPosition.of(start.x + directionX, start.y, this.layoutFactor);
      const resRoute: CellRoute = new CellRoute([...route.cells, nextPos]);
      if (nextPos.x == end.x && nextPos.y == end.y) {
        completedRoutes.push(resRoute);
      } else {
        nonCompletedRoutes.push(resRoute);
      }
    }

    if (directionY != 0) {
      const nextPos: RouteLayoutPosition = RouteLayoutPosition.of(start.x, start.y + directionY, this.layoutFactor);
      const resRoute: CellRoute = new CellRoute([...route.cells, nextPos]);
      if (nextPos.x == end.x && nextPos.y == end.y) {
        completedRoutes.push(resRoute);
      } else {
        nonCompletedRoutes.push(resRoute);
      }
    }

  }

  public calculateCellRoutes_recursive(start: LayoutPosition, end: LayoutPosition): CellRoute[] {
    return this.doCalculateCellRoutes_recursive(
      RouteLayoutPosition.ofLayoutPosition(start, this.layoutFactor),
      RouteLayoutPosition.ofLayoutPosition(end, this.layoutFactor));
  }

  private doCalculateCellRoutes_recursive(start: RouteLayoutPosition, end: RouteLayoutPosition): CellRoute[] {

    // if (startBoxId == "@F0002@" && endBoxId == "@Homer_Simpson@") {
    //   console.log("searching for route " + startBoxId + " - " + endBoxId);
    // }

    if (start.x == end.x && start.y == end.y) {
      return [];
    }

    if ((start.x == end.x && Math.abs(start.y - end.y) == 1) || (start.y == end.y && Math.abs(start.x - end.x) == 1)) {
      return [new CellRoute([start, end])];
    }
    const directionX: number = Math.sign(end.x - start.x);
    const directionY: number = Math.sign(end.y - start.y);

    let resHorizontal: CellRoute[] = [];
    let resVertical: CellRoute[] = [];

    if (directionX != 0) {
      const nextPos: RouteLayoutPosition = RouteLayoutPosition.of(start.x + directionX, start.y, this.layoutFactor);
      resHorizontal = this.doCalculateCellRoutes_recursive(nextPos, end)
        .map((route: CellRoute) => {
          return new CellRoute([start, ...route.cells]);
        });
    }

    if (directionY != 0) {
      const nextPos: RouteLayoutPosition = RouteLayoutPosition.of(start.x, start.y + directionY, this.layoutFactor);
      resVertical = this.doCalculateCellRoutes_recursive(nextPos, end)
        .map((route: CellRoute) => {
          return new CellRoute([start, ...route.cells]);
        });
    }

    return [...resHorizontal, ...resVertical];
  }

  public calculateCellRoutes_recursive1(startBoxId: string, endBoxId: string, start: LayoutPosition, end: LayoutPosition): CellRoute[] {

    const key: string = startBoxId + "-" + endBoxId;

    const initial: Map<RouteLayoutPosition, CellRoute[]> = new Map<RouteLayoutPosition, CellRoute[]>();
    this.pointToRoutesCache.set(key, initial);

    const rStart: RouteLayoutPosition = RouteLayoutPosition.ofLayoutPosition(start, this.layoutFactor);
    const rEnd: RouteLayoutPosition = RouteLayoutPosition.ofLayoutPosition(end, this.layoutFactor);
    setTimeout(() => this.doCalculateCellRoutes_recursive1(key, rStart, rEnd), CellRoutingEngine.timeoutDelay);

    return initial.get(rStart);
  }

  private doCalculateCellRoutes_recursive1(key: string, start: RouteLayoutPosition, end: RouteLayoutPosition): void {

    // if (startBoxId == "@F0002@" && endBoxId == "@Homer_Simpson@") {
    //   console.log("searching for route " + startBoxId + " - " + endBoxId);
    // }

    const initial: Map<RouteLayoutPosition, CellRoute[]> = this.pointToRoutesCache.get(key);

    // if (initial.get(start)) {
    //   return;
    // }

    if (start.x == end.x && start.y == end.y) {
      // return [];
      initial.set(start, []);
      return;
    }

    if ((start.x == end.x && Math.abs(start.y - end.y) == 1) || (start.y == end.y && Math.abs(start.x - end.x) == 1)) {
      // return [new CellRoute([start, end])];
      initial.set(start, [new CellRoute([start, end])]);
      return;
    }

    const directionX: number = Math.sign(end.x - start.x);
    const directionY: number = Math.sign(end.y - start.y);

    let nextPosVertical: RouteLayoutPosition = undefined;
    let nextPosHorizontal: RouteLayoutPosition = undefined;

    if (directionX != 0) {
      nextPosHorizontal = RouteLayoutPosition.of(start.x + directionX, start.y, this.layoutFactor);
      setTimeout(() => this.doCalculateCellRoutes_recursive1(key, nextPosHorizontal, end), CellRoutingEngine.timeoutDelay);
    }

    if (directionY != 0) {
      nextPosVertical = RouteLayoutPosition.of(start.x, start.y + directionY, this.layoutFactor);
      setTimeout(() => this.doCalculateCellRoutes_recursive1(key, nextPosVertical, end), CellRoutingEngine.timeoutDelay);
    }

    this.waitAndUpdate(key, start, nextPosHorizontal, nextPosVertical);

  }

  private waitAndUpdate(key: string,
                        start: RouteLayoutPosition,
                        nextPosHorizontal: RouteLayoutPosition,
                        nextPosVertical: RouteLayoutPosition): void {

    const initial: Map<RouteLayoutPosition, CellRoute[]> = this.pointToRoutesCache.get(key);

    let nextPosHorizontalRoutes: CellRoute[] = undefined;
    let nextPosVerticalRoutes: CellRoute[] = undefined;

    if (nextPosHorizontal) {
      nextPosHorizontalRoutes = initial.get(nextPosHorizontal);
    } else {
      nextPosHorizontalRoutes = [];
    }

    if (nextPosVertical) {
      nextPosVerticalRoutes = initial.get(nextPosVertical);
    } else {
      nextPosVerticalRoutes = [];
    }

    if (!nextPosHorizontalRoutes || !nextPosVerticalRoutes) {
      setTimeout(() => this.waitAndUpdate(key, start, nextPosHorizontal, nextPosVertical), CellRoutingEngine.timeoutDelay)
      return;
    }

    let resHorizontal: CellRoute[] = [];
    let resVertical: CellRoute[] = [];

    if (nextPosHorizontal) {
      initial.delete(nextPosHorizontal);
      resHorizontal = nextPosHorizontalRoutes.map((route: CellRoute) => new CellRoute([start, ...route.cells]));
    }

    if (nextPosVertical) {
      initial.delete(nextPosVertical);
      resVertical = nextPosVerticalRoutes.map((route: CellRoute) => new CellRoute([start, ...route.cells]));
    }

    initial.set(start, [...resHorizontal, ...resVertical]);

  }


  selectOptimalRoute(routes: CellRoute[]): CellRoute {
    
    const freeRoutes: CellRoute[] = routes.filter((route: CellRoute) => this.isRouteEmpty(route))

    if (freeRoutes.length > 0) {
      // console.log("found empty route for " + freeRoutes[0] + "[" + freeRoutes[0].getStartBoxId() + " - " + freeRoutes[0].getEndBoxId() + "]")
      return freeRoutes.sort((r1: CellRoute, r2: CellRoute) => r2.getNumStairs() - r1.getNumStairs())[0];
    }

    // console.log("couldn't find empty route for " + routes[0].getCells()[0].x + "; " + routes[0].getCells()[0].y + " - " +
    //   routes[0].getCells()[routes[0].getCells().length - 1].x + "; " + routes[0].getCells()[routes[0].getCells().length - 1].y)
    console.log("couldn't find empty route for " + routes[0]/* + "[" + routes[0].getStartBoxId() + " - " + routes[0].getEndBoxId() + "]"*/)

    return routes[0];
  }

  isRouteEmpty(route: CellRoute): boolean {
    const routeLength: number = route.getCells().length;
    const offset = Math.trunc(1 / this.layoutFactor);
    // if (route.getStartBoxId() == "@F0002@" && route.getEndBoxId() == "@Homer_Simpson@") {
    //   console.log("searching for route " + route.getStartBoxId() + " - " + route.getEndBoxId());
    // }
    return route.getCells().slice(offset, routeLength - offset)
      .filter((cell: RouteLayoutPosition) =>
        this.layoutStore.isCellEmpty(cell.toLayoutPosition())).length == Math.max(routeLength - 2 * offset, 0);
  }

  public calculateFamilyRoute(familyId: string, familyMemberId: string): CellRoute {
    let familyPos: LayoutPosition = this.layoutStore.getPosition(familyId);
    let familyMemberPos: LayoutPosition = this.layoutStore.getPosition(familyMemberId);
    // if (familyId == "@F0002@" && familyMemberId == "@Homer_Simpson@") {
    //   console.log("searching for route " + familyId + " - " + familyMemberId);
    // }

    const cellRoutes: CellRoute[] = this.doCalculateCellRoutes(familyId, familyMemberId,
      RouteLayoutPosition.ofLayoutPosition(familyPos, this.layoutFactor),
      RouteLayoutPosition.ofLayoutPosition(familyMemberPos, this.layoutFactor));
    return this.selectOptimalRoute(cellRoutes);
  }

  public recalculateRoutesIfRequired(immediately: boolean = false): void {
    if (immediately) {
      this.doRecalculateRoutesIfRequired();
    } else {
      setTimeout(this.doRecalculateRoutesIfRequired.bind(this), 500);
    }
  }

  private doRecalculateRoutesIfRequired(): void {

    console.log("this.families " + this.families);

    this.families.forEach((fam: Family): void => {
      this.recalculateRouteIfRequired(fam.Id, fam.getHusband().Id);
      this.recalculateRouteIfRequired(fam.Id, fam.getWife().Id);
      fam.getChildren().map((child: Individual) => {
        this.recalculateRouteIfRequired(fam.Id, child.Id);
      });
    });

  }

  private recalculateRouteIfRequired(startBoxId: string, endBoxId: string): void {
    let cellRoute: CellRoute = this.layoutStore.getCellRoute(startBoxId, endBoxId);
    if (cellRoute == undefined) {
      console.log("route " + startBoxId + " - " + endBoxId + " doesn't exist, calculating...");
      this.layoutStore.setCellRoute(startBoxId, endBoxId, this.calculateFamilyRoute(startBoxId, endBoxId));
    } else {
      const startPos: LayoutPosition = this.layoutStore.getPosition(startBoxId);
      const endPos: LayoutPosition = this.layoutStore.getPosition(endBoxId);

      const routeOk: boolean = (startPos.equals(cellRoute.getRouteStartPosition().toLayoutPosition()) && endPos.equals(cellRoute.getRouteEndPosition().toLayoutPosition())) ||
        (endPos.equals(cellRoute.getRouteStartPosition().toLayoutPosition()) && startPos.equals(cellRoute.getRouteEndPosition().toLayoutPosition()));

      if (!routeOk) {
        console.log("recalculating route " + startBoxId + " - " + endBoxId);
        this.layoutStore.setCellRoute(startBoxId, endBoxId, this.calculateFamilyRoute(startBoxId, endBoxId));
      }
    }


  }


}