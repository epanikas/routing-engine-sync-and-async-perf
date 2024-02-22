import React, {CSSProperties, JSX} from "react";
import {CellRoute, CellRouteSegment} from "../../../data/cell-route";
import {LayoutPosition} from "../../../data/layout-position";
import {CanvasPosition} from "../../../data/canvas-position";
import {BoxSize} from "../../../data/box-size";
import {prettyFormat} from "@testing-library/react";


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

export enum CornerMarker {
    // straight, top_left, top_right, bottom_left, bottom_right
    top_left, bottom_right
}

export class Vector {
    xDirection: number;
    yDirection: number;

    constructor(p1: LayoutPosition, p2: LayoutPosition) {
        this.xDirection = Math.sign(p2.x - p1.x);
        this.yDirection = Math.sign(p2.y - p1.y);
    }
}

export class AbsoluteRectangle {
    // top: number;
    // left: number;
    // width: number;
    // height: number;
    p1: CanvasPosition;
    p2: CanvasPosition;

    toStyle(additionalCssProperties: Map<string, string> = undefined): CSSProperties {
        const top = CanvasPosition.topLeft(this.p1, this.p2).y;
        const left = CanvasPosition.topLeft(this.p1, this.p2).x;
        const width = Math.abs(this.p1.x - this.p2.x);
        const height = Math.abs(this.p1.y - this.p2.y);
        const res: CSSProperties = {
            position: "absolute",
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: height + "px",
        };
        if (additionalCssProperties) {
            for (let entry of additionalCssProperties.entries()) {
                res[entry[0]] = entry[1];
            }
        }
        return res;
    }
}

export class RadiusPlacement {
    innerRadiusRectangle: AbsoluteRectangle;
    outerRadiusRectangle: AbsoluteRectangle;
    borderStyle: Map<string, string>;

}

export class RouteSegmentPlacement {
    main: AbsoluteRectangle;
    radius: RadiusPlacement;
    radi
    // radius: {
    //     innerRadiusRectangle: AbsoluteRectangle,
    //     outerRadiusRectangle: AbsoluteRectangle,
    //     borderStyle: Map<string, string>
    // };

    constructor() {
        this.main = new AbsoluteRectangle();
    }

}

export class RouteWireSegment extends React.Component<RouteWireSegmentProps> {

    private static minInnerRadius: number = 10;


    public override render(): JSX.Element {
        const {routeId, routeSegment} = this.props;

        const key: string = routeId + routeSegment.getP1() + routeSegment.getP2();

        const segmentPlacement: RouteSegmentPlacement = this.calculateRouteSegmentPlacement();

        const border = new Map<string, string>();
        border.set("border", "1px solid " + (routeSegment.isVertical() ? "red" : "blue"));

        let innerRadiusDiv: JSX.Element, outerRadiusDiv: JSX.Element;

        if (segmentPlacement.radius) {
            const innerBorder: Map<string, string> = new Map(segmentPlacement.radius.borderStyle);
            innerBorder.set("borderWidth", "1px")
            innerBorder.set("borderColor", "green")
            const outerBorder: Map<string, string> = new Map(segmentPlacement.radius.borderStyle);
            outerBorder.set("borderWidth", "1px")
            outerBorder.set("borderColor", "black")
            innerRadiusDiv = <div key={key + "-inner-radius"} style={segmentPlacement.radius.innerRadiusRectangle.toStyle(innerBorder)}></div>;
            outerRadiusDiv = <div key={key + "-outer-radius"} style={segmentPlacement.radius.outerRadiusRectangle.toStyle(outerBorder)}></div>;
        }

        return (
            <div>
                <div key={key + "-main"} style={segmentPlacement.main.toStyle(border)}></div>
                {innerRadiusDiv}
                {outerRadiusDiv}
            </div>
        );
    }

    private calculateRouteSegmentPlacement(): RouteSegmentPlacement {

        const { routeSegment, cellSize, prevSegment, nextSegment } = this.props;

        const topLeft: LayoutPosition = routeSegment.topLeft();
        const bottomRight: LayoutPosition = routeSegment.bottomRight();

        // const {topLeftAdjacentSegment, bottomRightAdjacentSegment } =
        //     this.calculateAdjacentSegments(prevSegment, nextSegment, routeSegment);

        const prevCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector} =
            this.calculateAdjacentSegmentRadiusDirection(prevSegment, routeSegment);
        const nextCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector} =
            this.calculateAdjacentSegmentRadiusDirection(prevSegment, routeSegment);

        // const topLeftRadiusDirection= this.calculatePrevRadiusDirection(prevSegment, routeSegment);

        const topLeftCanvas: CanvasPosition = topLeft.toCanvasPosition(cellSize);
        const bottomRightCanvas: CanvasPosition = bottomRight.toCanvasPosition(cellSize);

        if (routeSegment.isVertical()) {
            return this.calculateRouteSegmentPlacementForVertical(topLeftCanvas, bottomRightCanvas, prevCornerPlacement, nextCornerPlacement);
        } else {
            return this.calculateRouteSegmentPlacementForHorizontal(topLeftCanvas, bottomRightCanvas, prevCornerPlacement, nextCornerPlacement);
        }

    }

    // private calculateAdjacentSegmentRadiusDirection(adjacentSegment: CellRouteSegment,
    //                                                 routeSegment: CellRouteSegment): RadiusDirection {
    //
    //
    //     if (adjacentSegment != undefined) {
    //         if (adjacentSegment.topLeft().x < routeSegment.topLeft().x) {
    //             if (adjacentSegment.topLeft().y < routeSegment.topLeft().y) {
    //                 return RadiusDirection.top_left;
    //             } else {
    //
    //             }
    //             topLeftAdjacentSegment = adjacentSegment;
    //         } else {
    //             bottomRightAdjacentSegment = adjacentSegment;
    //         }
    //     }
    //
    //     if (nextSegment != undefined) {
    //         if (nextSegment.topLeft().x <= routeSegment.topLeft().x && nextSegment.topLeft().y <= routeSegment.topLeft().y) {
    //             topLeftAdjacentSegment = nextSegment;
    //         } else {
    //             bottomRightAdjacentSegment = nextSegment;
    //         }
    //     }
    //
    //     return {topLeftAdjacentSegment, bottomRightAdjacentSegment};
    //
    // }

    private calculateAdjacentSegmentRadiusDirection(adjacentSegment: CellRouteSegment, routeSegment: CellRouteSegment): {commonPointCorner: CornerMarker, adjacentVector: Vector} {

        if (!adjacentSegment) {
            return undefined;
        }

        // let topLeftRadiusDirection: CornerMarker = CornerMarker.straight;

        let commonPoint, adjacentOtherPoint/*, routeOtherPoint*/;
        let commonPointCornerMarker: CornerMarker;
        if (routeSegment.topLeft().equals(adjacentSegment.topLeft())) {
            commonPoint = adjacentSegment.topLeft();
            adjacentOtherPoint = adjacentSegment.bottomRight();
            // routeOtherPoint = routeSegment.bottomRight();
            commonPointCornerMarker = CornerMarker.top_left;
        } else if (routeSegment.topLeft().equals(adjacentSegment.bottomRight())) {
            commonPoint = adjacentSegment.bottomRight();
            adjacentOtherPoint = adjacentSegment.topLeft();
            // routeOtherPoint = routeSegment.bottomRight();
            commonPointCornerMarker = CornerMarker.top_left;
        } else if (routeSegment.bottomRight().equals(adjacentSegment.topLeft())) {
            commonPoint = adjacentSegment.topLeft();
            adjacentOtherPoint = adjacentSegment.bottomRight();
            // routeOtherPoint = routeSegment.topLeft();
            commonPointCornerMarker = CornerMarker.bottom_right;
        } else if (routeSegment.bottomRight().equals(adjacentSegment.bottomRight())) {
            commonPoint = adjacentSegment.bottomRight();
            adjacentOtherPoint = adjacentSegment.topLeft();
            // routeOtherPoint = routeSegment.topLeft();
            commonPointCornerMarker = CornerMarker.bottom_right;
        }



        const adjacentVector: Vector = new Vector(commonPoint, adjacentOtherPoint);

        return {commonPointCorner: commonPointCornerMarker, adjacentVector: adjacentVector}

        // if (adjacentSegment != undefined) {
        //     if (routeSegment.isVertical()) {
        //         if (adjacentSegment.topLeft().y < routeSegment.topLeft().y) {
        //             if (adjacentSegment.topLeft().x < routeSegment.topLeft().x) {
        //                 return RadiusDirection.top_left;
        //             } else if (adjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
        //                 return RadiusDirection.top_right;
        //             }
        //         } else {
        //             if (adjacentSegment.topLeft().x < routeSegment.topLeft().x) {
        //                 return RadiusDirection.bottom_left;
        //             } else if (adjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
        //                 return RadiusDirection.bottom_right;
        //             }
        //         }
        //     } else {
        //         if (adjacentSegment.topLeft().y < routeSegment.topLeft().y) {
        //             if (adjacentSegment.topLeft().x < routeSegment.topLeft().)
        //             return RadiusDirection.top_left;
        //         } else if (adjacentSegment.bottomRight().x > routeSegment.topLeft().x) {
        //             return RadiusDirection.top_right;
        //         }
        //     }
        // }
        //
        // return RadiusDirection.straight;
    }

    private calculateRouteSegmentPlacementForVertical(topLeftCanvas: CanvasPosition,
                                                      bottomRightCanvas: CanvasPosition,
                                                      prevCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector},
                                                      nextCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector}): RouteSegmentPlacement {

        const { lineWidth, radius} = this.props;
        const halfLineWidth = lineWidth / 2;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.main.p1 = new CanvasPosition(topLeftCanvas.x - halfLineWidth, topLeftCanvas.y - halfLineWidth);
        placement.main.p2 = new CanvasPosition(bottomRightCanvas.x + halfLineWidth, bottomRightCanvas.y + halfLineWidth);

        const innerRadius: number = Math.max(radius - lineWidth, RouteWireSegment.minInnerRadius);
        const outerRadius: number = Math.max(radius, lineWidth + RouteWireSegment.minInnerRadius);

        // if (nextCornerPlacement) {
        //     if (nextCornerPlacement.commonPointCorner == CornerMarker.top_left) {
        //         placement.main.p1 = new CanvasPosition(placement.main.p1.x, placement.main.p1.y + outerRadius);
        //     } else {
        //         placement.main.p2 = new CanvasPosition(placement.main.p1.x, placement.main.p1.y - outerRadius);
        //     }
        // }

        if (prevCornerPlacement) {

            // if (prevCornerPlacement.commonPointCorner == CornerMarker.top_left) {
            //     placement.main.p1 = new CanvasPosition(placement.main.p1.x, placement.main.p1.y + outerRadius);
            // } else {
            //     placement.main.p2 = new CanvasPosition(placement.main.p1.x, placement.main.p1.y - outerRadius);
            // }

            placement.radius = {
                innerRadiusRectangle: new AbsoluteRectangle(),
                outerRadiusRectangle: new AbsoluteRectangle(),
                borderStyle: new Map<string, string>()
            };

            const commonPoint = prevCornerPlacement.commonPointCorner == CornerMarker.top_left ? topLeftCanvas : bottomRightCanvas;
            const commonPointYDirection: number = prevCornerPlacement.commonPointCorner == CornerMarker.top_left ? 1 : -1;
            const adjacentVector: Vector = prevCornerPlacement.adjacentVector;

            placement.radius.innerRadiusRectangle.p1 = new CanvasPosition(
                commonPoint.x + adjacentVector.xDirection * halfLineWidth,
                commonPoint.y + commonPointYDirection * halfLineWidth);
            placement.radius.innerRadiusRectangle.p2 = new CanvasPosition(
                placement.radius.innerRadiusRectangle.p1.x + adjacentVector.xDirection * innerRadius,
                placement.radius.innerRadiusRectangle.p1.y + commonPointYDirection * innerRadius);

            placement.radius.outerRadiusRectangle.p1 = new CanvasPosition(
                commonPoint.x + adjacentVector.xDirection * halfLineWidth,
                commonPoint.y + commonPointYDirection * halfLineWidth);
            placement.radius.outerRadiusRectangle.p2 = new CanvasPosition(
                placement.radius.outerRadiusRectangle.p1.x + adjacentVector.xDirection * outerRadius,
                placement.radius.outerRadiusRectangle.p1.y + commonPointYDirection * outerRadius);

            placement.radius.borderStyle.set("borderStyle", "solid solid solid solid");
            placement.radius.borderStyle.set("borderRadius", "0 0 0 0");

        }

        return placement;

    }

    private calculateRouteSegmentPlacementForHorizontal(topLeftCanvas: CanvasPosition,
                                                        bottomRightCanvas: CanvasPosition,
                                                        prevCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector},
                                                        nextCornerPlacement: {commonPointCorner: CornerMarker, adjacentVector: Vector}): RouteSegmentPlacement {

        const { lineWidth, radius} = this.props;
        const halfLineWidth = lineWidth / 2;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.main.p1 = new CanvasPosition(topLeftCanvas.x - halfLineWidth, topLeftCanvas.y - halfLineWidth);
        placement.main.p2 = new CanvasPosition(bottomRightCanvas.x + halfLineWidth, bottomRightCanvas.y + halfLineWidth);

        const innerRadius: number = Math.max(radius - lineWidth, RouteWireSegment.minInnerRadius);
        const outerRadius: number = Math.max(radius, lineWidth + RouteWireSegment.minInnerRadius);

        // if (nextCornerPlacement) {
        //     if (nextCornerPlacement.commonPointCorner == CornerMarker.top_left) {
        //         placement.main.p1 = new CanvasPosition(placement.main.p1.x + outerRadius, placement.main.p1.y);
        //     } else {
        //         placement.main.p2 = new CanvasPosition(placement.main.p1.x - outerRadius, placement.main.p1.y);
        //     }
        // }

        if (prevCornerPlacement) {

            // if (prevCornerPlacement.commonPointCorner == CornerMarker.top_left) {
            //     placement.main.p1 = new CanvasPosition(placement.main.p1.x + outerRadius, placement.main.p1.y);
            // } else {
            //     placement.main.p2 = new CanvasPosition(placement.main.p1.x - outerRadius, placement.main.p1.y);
            // }

            placement.radius = {
                innerRadiusRectangle: new AbsoluteRectangle(),
                outerRadiusRectangle: new AbsoluteRectangle(),
                borderStyle: new Map<string, string>()
            };

            const commonPoint = prevCornerPlacement.commonPointCorner == CornerMarker.top_left ? topLeftCanvas : bottomRightCanvas;
            const commonPointXDirection: number = prevCornerPlacement.commonPointCorner == CornerMarker.top_left ? 1 : -1;
            const adjacentVector: Vector = prevCornerPlacement.adjacentVector;

            placement.radius.innerRadiusRectangle.p1 = new CanvasPosition(
                commonPoint.x + commonPointXDirection * halfLineWidth,
                commonPoint.y + adjacentVector.yDirection * halfLineWidth);
            placement.radius.innerRadiusRectangle.p2 = new CanvasPosition(
                placement.radius.innerRadiusRectangle.p1.x + commonPointXDirection * innerRadius,
                placement.radius.innerRadiusRectangle.p1.y + adjacentVector.yDirection * innerRadius);

            placement.radius.outerRadiusRectangle.p1 = new CanvasPosition(
                commonPoint.x + commonPointXDirection * halfLineWidth,
                commonPoint.y + adjacentVector.yDirection * halfLineWidth);
            placement.radius.outerRadiusRectangle.p2 = new CanvasPosition(
                placement.radius.outerRadiusRectangle.p1.x + commonPointXDirection * outerRadius,
                placement.radius.outerRadiusRectangle.p1.y + adjacentVector.yDirection * outerRadius);

            placement.radius.borderStyle.set("borderStyle", "solid solid solid solid");
            placement.radius.borderStyle.set("borderRadius", "0 0 0 0");

        }

        return placement;

    }

    // private drawVerticalSegment(key: string,
    //                             prevSegment: CellRouteSegment,
    //                             nextSegment: CellRouteSegment,
    //                             topLeftCanvas: CanvasPosition,
    //                             bottomRightCanvas: CanvasPosition): JSX.Element {
    //
    //     const {cellSize, routeId, routeSegment, color, lineWidth, radius} = this.props;
    //
    //     const style: CSSProperties = {
    //         position: "absolute",
    //         top: (topLeftCanvas.y - lineWidth / 2) + "px",
    //         left: (topLeftCanvas.x - lineWidth / 2) + "px",
    //         width: lineWidth + "px",
    //         height: (bottomRightCanvas.y - topLeftCanvas.y + lineWidth) + "px",
    //         border: "1px solid " + color,
    //         // backgroundColor: color
    //     };
    //
    //     if (!prevSegment) {
    //         style['borderTopLeftRadius'] = lineWidth / 2;
    //         style['borderTopRightRadius'] = lineWidth / 2;
    //     } else {
    //         if (!prevSegment.isVertical()) {
    //             style['top'] = (topLeftCanvas.y - radius) + "px";
    //         }
    //     }
    //
    //     if (!nextSegment) {
    //         style['borderBottomLeftRadius'] = lineWidth / 2;
    //         style['borderBottomRightRadius'] = lineWidth / 2;
    //     } else {
    //         if (!nextSegment.isVertical()) {
    //             style
    //         }
    //     }
    //
    //     return <div key={key} style={style}></div>
    //
    // }
    //
    // private drawHorizontalSegment(key: string,
    //                               prevSegment: CellRouteSegment,
    //                               nextSegment: CellRouteSegment,
    //                               topLeftCanvas: CanvasPosition,
    //                               bottomRightCanvas: CanvasPosition): JSX.Element {
    //
    //     const {cellSize, routeId, routeSegment, color, lineWidth, radius} = this.props;
    //
    //     const style: CSSProperties = {
    //         position: "absolute",
    //         top: (topLeftCanvas.y - lineWidth / 2) + "px",
    //         left: (topLeftCanvas.x - lineWidth / 2) + "px",
    //         width: (bottomRightCanvas.x - topLeftCanvas.x + lineWidth) + "px",
    //         height: lineWidth + "px",
    //         border: "1px solid " + "red",
    //         // backgroundColor: color
    //     };
    //
    //     if (!prevSegment) {
    //         style['borderTopLeftRadius'] = lineWidth / 2;
    //         style['borderBottomLeftRadius'] = lineWidth / 2;
    //     } else {
    //         if (prevSegment.isVertical()) {
    //             style['left'] = (topLeftCanvas.x - radius) + "px";
    //         }
    //     }
    //
    //     if (!nextSegment) {
    //         style['borderTopRightRadius'] = lineWidth / 2;
    //         style['borderBottomRightRadius'] = lineWidth / 2;
    //     } else {
    //         if (nextSegment.isVertical()) {
    //             style['width'] = (bottomRightCanvas.x - topLeftCanvas.x - radius) + "px";
    //         }
    //     }
    //
    //     return <div key={key} style={style}></div>
    //
    // }

}