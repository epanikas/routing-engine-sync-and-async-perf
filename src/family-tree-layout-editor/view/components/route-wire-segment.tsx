import React, {CSSProperties, JSX} from "react";
import { CellRouteSegment } from "../../../data/cell-route";
import { LayoutPosition } from "../../../data/layout-position";
import { CanvasPosition } from "../../../data/canvas-position";
import { BoxSize } from "../../../data/box-size";


export class RouteWireSegmentProps {
  routeId: string
  cellSize: BoxSize;
  routeSegment: CellRouteSegment;
  lineWidth: number;
  radius: number;
  color: string;
  prevSegment?: CellRouteSegment;
  nextSegment?: CellRouteSegment;
}

export class RouteWireSegment extends React.Component<RouteWireSegmentProps> {


  public override render(): JSX.Element {
    const { prevSegment, nextSegment, cellSize, routeId, routeSegment } = this.props;

    const p1: LayoutPosition = routeSegment.getP1();
    const p2: LayoutPosition = routeSegment.getP2();

    const topLeft: LayoutPosition = LayoutPosition.topLeft(p1, p2);
    const bottomRight: LayoutPosition = LayoutPosition.bottomRight(p1, p2);

    const topLeftCanvas: CanvasPosition = topLeft.toCanvasPosition(cellSize);
    const bottomRightCanvas: CanvasPosition = bottomRight.toCanvasPosition(cellSize);

    const key: string = routeId + p1 + p2;

    if (routeSegment.isVertical()) {
        return this.drawVerticalSegment(key, prevSegment, nextSegment, topLeftCanvas, bottomRightCanvas);
    } else {
        return this.drawHorizontalSegment(key, prevSegment, nextSegment, topLeftCanvas, bottomRightCanvas);
    }
  }

  private drawVerticalSegment(key: string,
                              prevSegment: CellRouteSegment,
                              nextSegment: CellRouteSegment,
                              topLeftCanvas: CanvasPosition,
                              bottomRightCanvas: CanvasPosition): JSX.Element {

      const { cellSize, routeId, routeSegment, color, lineWidth, radius } = this.props;

      const style: CSSProperties = {
          position: "absolute",
          top: (topLeftCanvas.y - lineWidth / 2) + "px",
          left: (topLeftCanvas.x - lineWidth / 2) + "px",
          width: lineWidth + "px",
          height: (bottomRightCanvas.y - topLeftCanvas.y + lineWidth) + "px",
          border: "1px solid " + color,
          // backgroundColor: color
      };

      if (!prevSegment) {
          style['borderTopLeftRadius'] = lineWidth / 2;
          style['borderTopRightRadius'] = lineWidth / 2;
      } else {
          if (!prevSegment.isVertical()) {
              style['top'] = (topLeftCanvas.y - radius) + "px";
          }
      }

      if (!nextSegment) {
          style['borderBottomLeftRadius'] = lineWidth / 2;
          style['borderBottomRightRadius'] = lineWidth / 2;
      } else {
          if (!nextSegment.isVertical()) {
              style
          }
      }

      return <div key={key} style={style}></div>

  }

  private drawHorizontalSegment(key: string,
                                prevSegment: CellRouteSegment,
                                nextSegment: CellRouteSegment,
                                topLeftCanvas: CanvasPosition,
                                bottomRightCanvas: CanvasPosition): JSX.Element {

      const { cellSize, routeId, routeSegment, color, lineWidth, radius } = this.props;

      const style: CSSProperties = {
          position: "absolute",
          top: (topLeftCanvas.y - lineWidth / 2) + "px",
          left: (topLeftCanvas.x - lineWidth / 2)  + "px",
          width: (bottomRightCanvas.x - topLeftCanvas.x + lineWidth) + "px",
          height: lineWidth + "px",
          border: "1px solid " + "red",
          // backgroundColor: color
      };

      if (!prevSegment) {
          style['borderTopLeftRadius'] = lineWidth / 2;
          style['borderBottomLeftRadius'] = lineWidth / 2;
      } else {
          if (prevSegment.isVertical()) {
              style['left'] = (topLeftCanvas.x - radius) + "px";
          }
      }

      if (!nextSegment) {
          style['borderTopRightRadius'] = lineWidth / 2;
          style['borderBottomRightRadius'] = lineWidth / 2;
      } else {
          if (nextSegment.isVertical()) {
              style['width'] = (bottomRightCanvas.x - topLeftCanvas.x - radius) + "px";
          }
      }

      return <div key={key} style={style}></div>

  }

}