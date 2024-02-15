import { LayoutPosition } from "../../data/layout-position";
import { CellRoute } from "../../data/cell-route";

export interface RoutingEngine {

  calculateCellRoutes(startBoxId: string,
                      endBoxId: string,
                      start: LayoutPosition,
                      end: LayoutPosition): CellRoute[];

  calculateCellRoutes1(startBoxId: string,
                      endBoxId: string,
                      start: LayoutPosition,
                      end: LayoutPosition): CellRoute[];

  calculateCellRoutes_recursive(start: LayoutPosition, end: LayoutPosition): CellRoute[];
  calculateCellRoutes_recursive1(startBoxId: string,
                                 endBoxId: string, start: LayoutPosition, end: LayoutPosition): CellRoute[];

  recalculateRoutesIfRequired(): void;

}