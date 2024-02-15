import {LayoutPosition} from "../data/layout-position";
import {CellRoute} from "../data/cell-route";

export interface SyncRoutingEngine {

    calculateRoutes(startPos: LayoutPosition, endPos: LayoutPosition): CellRoute[];

}