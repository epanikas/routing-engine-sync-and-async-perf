import {LayoutPosition} from "../data/layout-position";
import {CellRoute} from "../data/cell-route";

export interface AsyncRoutingEngine {

    calculateRoutes(routeKey: string, startPos: LayoutPosition, endPos: LayoutPosition): void;

    getRoutes(routeKey: string): CellRoute[];

}