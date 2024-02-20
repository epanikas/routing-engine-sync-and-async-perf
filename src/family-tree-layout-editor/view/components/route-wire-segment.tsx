import React, {CSSProperties, JSX} from "react";
import {CellRoute, CellRouteSegment} from "../../../data/cell-route";
import {LayoutPosition} from "../../../data/layout-position";
import {CanvasPosition} from "../../../data/canvas-position";
import {BoxSize} from "../../../data/box-size";


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

export enum RadiusDirection {
    straight, top_left, top_right, bottom_left, bottom_right;
}

export class AbsoluteRectangle {
    top: number;
    left: number;
    width: number;
    height: number;

    toStyle(additoinalCssProperties: Map<string, string> = undefined): CSSProperties {
        const res: CSSProperties = {
            position: "absolute",
            top: this.top + "px",
            left: this.left + "px",
            width: this.width + "px",
            height: this.height + "px",
        };
        if (additoinalCssProperties) {
            for (let entry of additoinalCssProperties.entries()) {
                res[entry[0]] = entry[1];
            }
        }
        return res;
    }
}

export class RouteSegmentPlacement {
    main: AbsoluteRectangle;
    // borderRadius: {
    //     topLeft: number;
    //     topRight: number;
    //     bottomLeft: number;
    //     bottomRight: number;
    // }
    topLeft: AbsoluteRectangle;
    topRight: AbsoluteRectangle;
    bottomLeft: AbsoluteRectangle;
    bottomRight: AbsoluteRectangle;

    // constructor() {
    //     this.borderRadius = {topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0}
    // }
}

export class RouteWireSegment extends React.Component<RouteWireSegmentProps> {


    public override render(): JSX.Element {
        const {prevSegment, nextSegment, cellSize, routeId, routeSegment, color} = this.props;


        const key: string = routeId + routeSegment.getP1() + routeSegment.getP2();

        const segmentPlacement: RouteSegmentPlacement = this.calculateRouteSegmentPlacement();

        // if (routeSegment.isVertical()) {
        //     return this.drawVerticalSegment(key, prevSegment, nextSegment, topLeftCanvas, bottomRightCanvas);
        // } else {
        //     return this.drawHorizontalSegment(key, prevSegment, nextSegment, topLeftCanvas, bottomRightCanvas);
        // }

        // const mainStyle: CSSProperties = {
        //     position: "absolute",
        //     top: segmentPlacement.top + "px",
        //     left: segmentPlacement.left + "px",
        //     width: segmentPlacement.width + "px",
        //     height: segmentPlacement.height + "px",
        //     border: "1px solid " + (routeSegment.isVertical() ? "red" : "blue"),
        //     // backgroundColor: color
        // };
        const border = new Map<string, string>();
        border.set("border", "1px solid " + (routeSegment.isVertical() ? "red" : "blue"));
        // const mainStyle: CSSProperties = segmentPlacement.main.toStyle(border);
        // mainStyle.border = "1px solid " + (routeSegment.isVertical() ? "red" : "blue");

        let radiusDiv: JSX.Element;

        if (segmentPlacement.topLeft) {
            radiusDiv = <div key={key + "-radius"} style={segmentPlacement.topLeft.toStyle(border)}></div>;
        } else if (segmentPlacement.topRight) {
            radiusDiv = <div key={key + "-radius"} style={segmentPlacement.topRight.toStyle(border)}></div>;
        } else if (segmentPlacement.bottomLeft) {
            radiusDiv = <div key={key + "-radius"} style={segmentPlacement.bottomLeft.toStyle(border)}></div>;
        } else if (segmentPlacement.bottomRight) {
            radiusDiv = <div key={key + "-radius"} style={segmentPlacement.bottomRight.toStyle(border)}></div>;
        }

        return (
            <div>
                <div key={key + "-main"} style={segmentPlacement.main.toStyle(border)}></div>
                {radiusDiv}
            </div>
        );
    }

    private calculateRouteSegmentPlacement(): RouteSegmentPlacement {

        const { routeSegment, cellSize, prevSegment, nextSegment } = this.props;

        // const p1: LayoutPosition = routeSegment.getP1();
        // const p2: LayoutPosition = routeSegment.getP2();

        // const topLeft: LayoutPosition = LayoutPosition.topLeft(p1, p2);
        // const bottomRight: LayoutPosition = LayoutPosition.bottomRight(p1, p2);
        const topLeft: LayoutPosition = routeSegment.topLeft();
        const bottomRight: LayoutPosition = routeSegment.bottomRight();


        const {topLeftAdjacentSegment, bottomRightAdjacentSegment} = this.calculateAdjacentSegments(prevSegment, nextSegment, routeSegment);

        const { topLeftRadiusDirection, bottomRightRadiusDirection } =
            this.calculateRadiusDirections(topLeftAdjacentSegment, bottomRightAdjacentSegment, routeSegment);


        // let topLeftRadiusDirection: RadiusDirection = RadiusDirection.straight;
        // let bottomRightRadiusDirection: RadiusDirection = RadiusDirection.straight;
        //
        // if (topLeftAdjacentSegment != undefined) {
        //     // topLeftRadiusDirection = this.calculateRadiusDirection(routeSegment.topLeft(), true, topLeftAdjacentSegment, routeSegment.isVertical());
        //     if (routeSegment.isVertical()) {
        //         if (topLeftAdjacentSegment.topLeft().x < routeSegment.topLeft().x) {
        //             topLeftRadiusDirection = RadiusDirection.top_left;
        //         } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
        //             topLeftRadiusDirection = RadiusDirection.top_right;
        //         }
        //     } else {
        //         if (topLeftAdjacentSegment.topLeft().y < routeSegment.topLeft().y) {
        //             topLeftRadiusDirection = RadiusDirection.top_left;
        //         } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
        //             topLeftRadiusDirection = RadiusDirection.top_right;
        //         }
        //     }
        // }
        // if (bottomRightAdjacentSegment != undefined) {
        //     // bottomRightRadiusDirection = this.calculateRadiusDirection(routeSegment.bottomRight(), false, bottomRightAdjacentSegment, routeSegment.isVertical());
        //     if (routeSegment.isVertical()) {
        //         if (bottomRightAdjacentSegment.topLeft().x < routeSegment.bottomRight().x) {
        //             bottomRightRadiusDirection = RadiusDirection.top_left;
        //         } else if (bottomRightAdjacentSegment.bottomRight().x > routeSegment.bottomRight().x) {
        //             bottomRightRadiusDirection = RadiusDirection.top_right;
        //         }
        //     } else {
        //         if (bottomRightAdjacentSegment.topLeft().y < routeSegment.bottomRight().y) {
        //             bottomRightRadiusDirection = RadiusDirection.top_left;
        //         } else if (bottomRightAdjacentSegment.bottomRight().x > routeSegment.bottomRight().x) {
        //             bottomRightRadiusDirection = RadiusDirection.top_right;
        //         }
        //     }
        // }




        // if (prevSegment != undefined) {
        //     const prevTopLeft: LayoutPosition = prevSegment.topLeft();
        //     const prevBottomRight: LayoutPosition = prevSegment.bottomRight();
        // }


        const topLeftCanvas: CanvasPosition = topLeft.toCanvasPosition(cellSize);
        const bottomRightCanvas: CanvasPosition = bottomRight.toCanvasPosition(cellSize);


        if (routeSegment.isVertical()) {
            return this.calculateRouteSegmentPlacementForVertical(topLeftCanvas, bottomRightCanvas, radiusDirection);
        } else {
            return this.calculateRouteSegmentPlacementForHorizontal(topLeftCanvas, bottomRightCanvas, radiusDirection);
        }

    }

    private calculateAdjacentSegments(prevSegment: CellRouteSegment,
                                      nextSegment: CellRouteSegment,
                                      routeSegment: CellRouteSegment): { topLeftAdjacentSegment: CellRouteSegment, bottomRightAdjacentSegment: CellRouteSegment} {
        let topLeftAdjacentSegment: CellRouteSegment = undefined;
        let bottomRightAdjacentSegment: CellRouteSegment = undefined;

        if (prevSegment != undefined) {
            if (prevSegment.topLeft().x <= routeSegment.topLeft().x && prevSegment.topLeft().y <= routeSegment.topLeft().y) {
                topLeftAdjacentSegment = prevSegment;
            } else {
                bottomRightAdjacentSegment = prevSegment;
            }
        }

        if (nextSegment != undefined) {
            if (nextSegment.topLeft().x <= routeSegment.topLeft().x && nextSegment.topLeft().y <= routeSegment.topLeft().y) {
                topLeftAdjacentSegment = nextSegment;
            } else {
                bottomRightAdjacentSegment = nextSegment;
            }
        }

        return {topLeftAdjacentSegment, bottomRightAdjacentSegment};

    }

    private calculateRadiusDirections(topLeftAdjacentSegment: CellRouteSegment, bottomRightAdjacentSegment: CellRouteSegment, routeSegment: CellRouteSegment): {topLeftRadiusDirection: RadiusDirection, bottomRightRadiusDirection: RadiusDirection} {

        let topLeftRadiusDirection: RadiusDirection = RadiusDirection.straight;
        let bottomRightRadiusDirection: RadiusDirection = RadiusDirection.straight;

        if (topLeftAdjacentSegment != undefined) {
            // topLeftRadiusDirection = this.calculateRadiusDirection(routeSegment.topLeft(), true, topLeftAdjacentSegment, routeSegment.isVertical());
            if (routeSegment.isVertical()) {
                if (topLeftAdjacentSegment.topLeft().x < routeSegment.topLeft().x) {
                    topLeftRadiusDirection = RadiusDirection.top_left;
                } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
                    topLeftRadiusDirection = RadiusDirection.top_right;
                }
            } else {
                if (topLeftAdjacentSegment.topLeft().y < routeSegment.topLeft().y) {
                    topLeftRadiusDirection = RadiusDirection.top_left;
                } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
                    topLeftRadiusDirection = RadiusDirection.top_right;
                }
            }
        }
        if (bottomRightAdjacentSegment != undefined) {
            // bottomRightRadiusDirection = this.calculateRadiusDirection(routeSegment.bottomRight(), false, bottomRightAdjacentSegment, routeSegment.isVertical());
            if (routeSegment.isVertical()) {
                if (bottomRightAdjacentSegment.topLeft().x < routeSegment.bottomRight().x) {
                    bottomRightRadiusDirection = RadiusDirection.top_left;
                } else if (bottomRightAdjacentSegment.bottomRight().x > routeSegment.bottomRight().x) {
                    bottomRightRadiusDirection = RadiusDirection.top_right;
                }
            } else {
                if (bottomRightAdjacentSegment.topLeft().y < routeSegment.bottomRight().y) {
                    bottomRightRadiusDirection = RadiusDirection.top_left;
                } else if (bottomRightAdjacentSegment.bottomRight().x > routeSegment.bottomRight().x) {
                    bottomRightRadiusDirection = RadiusDirection.top_right;
                }
            }
        }

        return {topLeftRadiusDirection, bottomRightRadiusDirection};
    }

    // private calculateRadiusDirection(routeCorner: LayoutPosition, isTopLeft: boolean, adjacentSegment: CellRouteSegment, isVertical: boolean): RadiusDirection {
    //     if (routeSegment.isVertical()) {
    //         if (topLeftAdjacentSegment.topLeft().x < routeSegment.topLeft().x) {
    //             topLeftRadiusDirection = RadiusDirection.top_left;
    //         } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
    //             topLeftRadiusDirection = RadiusDirection.top_right;
    //         }
    //     } else {
    //         if (topLeftAdjacentSegment.topLeft().y < routeSegment.topLeft().y) {
    //             topLeftRadiusDirection = RadiusDirection.top_left;
    //         } else if (topLeftAdjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
    //             topLeftRadiusDirection = RadiusDirection.top_right;
    //         }
    //     }
    //
    // }

    private calculateRouteSegmentPlacementForVertical(topLeftCanvas: CanvasPosition,
                                                      bottomRightCanvas: CanvasPosition,
                                                      radiusDirection: RadiusDirection): RouteSegmentPlacement {

        const {prevSegment, nextSegment, cellSize, routeId, routeSegment, lineWidth, radius} = this.props;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.top = topLeftCanvas.y - lineWidth / 2;
        placement.left = topLeftCanvas.x - lineWidth / 2;
        placement.width = lineWidth;
        placement.height = bottomRightCanvas.y - topLeftCanvas.y + lineWidth;

        if (!prevSegment) {
            placement.borderRadius.topLeft = lineWidth / 2;
            placement.borderRadius.topRight = lineWidth / 2;
        } else {
            if (!prevSegment.isVertical()) {
                placement.top += radius;
                placement.height -= radius;
            }
        }

        if (!nextSegment) {
            placement.top -= lineWidth / 2;
            placement.height += lineWidth;
            placement.borderRadius.bottomLeft = lineWidth / 2;
            placement.borderRadius.bottomRight = lineWidth / 2;
        } else {
            if (!nextSegment.isVertical()) {
                placement.height = topLeftCanvas.y - radius;
            }
        }

        return placement;

    }

    private calculateRouteSegmentPlacementForHorizontal(topLeftCanvas: CanvasPosition,
                                                        bottomRightCanvas: CanvasPosition,
                                                        radiusDirection: RadiusDirection): RouteSegmentPlacement {

        const {prevSegment, nextSegment, cellSize, routeId, routeSegment, lineWidth, radius} = this.props;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.top = topLeftCanvas.y - lineWidth / 2;
        placement.left = topLeftCanvas.x - lineWidth / 2;
        placement.width = bottomRightCanvas.x - topLeftCanvas.x + lineWidth;
        placement.height = lineWidth;

        return placement;
    }

    private drawVerticalSegment(key: string,
                                prevSegment: CellRouteSegment,
                                nextSegment: CellRouteSegment,
                                topLeftCanvas: CanvasPosition,
                                bottomRightCanvas: CanvasPosition): JSX.Element {

        const {cellSize, routeId, routeSegment, color, lineWidth, radius} = this.props;

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

        const {cellSize, routeId, routeSegment, color, lineWidth, radius} = this.props;

        const style: CSSProperties = {
            position: "absolute",
            top: (topLeftCanvas.y - lineWidth / 2) + "px",
            left: (topLeftCanvas.x - lineWidth / 2) + "px",
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