import {AsyncRoutingEngine} from "../../async-routing-engine";
import {LayoutPosition} from "../../../data/layout-position";
import {CellRoute} from "../../../data/cell-route";

export class ForwardBfsAsyncRoutingEngine implements AsyncRoutingEngine {

    calculateRoutes(routeKey: string, startPos: LayoutPosition, endPos: LayoutPosition): void {
    }

    getRoutes(routeKey: string): CellRoute[] {
        return [];
    }


}