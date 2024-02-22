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
    straight, top_left, top_right, bottom_left, bottom_right
}

export class AbsoluteRectangle {
    top: number;
    left: number;
    width: number;
    height: number;

    toStyle(additionalCssProperties: Map<string, string> = undefined): CSSProperties {
        const res: CSSProperties = {
            position: "absolute",
            top: this.top + "px",
            left: this.left + "px",
            width: this.width + "px",
            height: this.height + "px",
        };
        if (additionalCssProperties) {
            for (let entry of additionalCssProperties.entries()) {
                res[entry[0]] = entry[1];
            }
        }
        return res;
    }
}

export class RouteSegmentPlacement {
    main: AbsoluteRectangle;
    radius: {
        innerRadiusRectangle: AbsoluteRectangle,
        outerRadiusRectangle: AbsoluteRectangle,
        borderStyle: Map<string, string>
    };

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
        // const innerBorder = new Map<string, string>();
        // innerBorder.set("borderStyle", "solid solid none none");
        // innerBorder.set("borderWidth", "1px")
        // innerBorder.set("borderColor", "green")
        // innerBorder.set("borderRadius", "0 100% 0 0");
        // const outerBorder = new Map<string, string>();
        // outerBorder.set("borderStyle", "solid solid none none");
        // outerBorder.set("borderWidth", "1px")
        // outerBorder.set("borderColor", "black")
        // outerBorder.set("borderRadius", "0 100% 0 0");

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

        // const p1: LayoutPosition = routeSegment.getP1();
        // const p2: LayoutPosition = routeSegment.getP2();

        // const topLeft: LayoutPosition = LayoutPosition.topLeft(p1, p2);
        // const bottomRight: LayoutPosition = LayoutPosition.bottomRight(p1, p2);
        const topLeft: LayoutPosition = routeSegment.topLeft();
        const bottomRight: LayoutPosition = routeSegment.bottomRight();

        const {topLeftAdjacentSegment, bottomRightAdjacentSegment } =
            this.calculateAdjacentSegments(prevSegment, nextSegment, routeSegment);

        const topLeftRadiusDirection =
            this.calculateTopLeftRadiusDirection(topLeftAdjacentSegment, routeSegment);

        const topLeftCanvas: CanvasPosition = topLeft.toCanvasPosition(cellSize);
        const bottomRightCanvas: CanvasPosition = bottomRight.toCanvasPosition(cellSize);

        if (routeSegment.isVertical()) {
            return this.calculateRouteSegmentPlacementForVertical(topLeftCanvas, bottomRightCanvas, topLeftRadiusDirection, bottomRightAdjacentSegment != undefined);
        } else {
            return this.calculateRouteSegmentPlacementForHorizontal(topLeftCanvas, bottomRightCanvas, topLeftRadiusDirection, bottomRightAdjacentSegment != undefined);
        }

    }

    private calculateAdjacentSegments(prevSegment: CellRouteSegment,
                                      nextSegment: CellRouteSegment,
                                      routeSegment: CellRouteSegment): {topLeftAdjacentSegment: CellRouteSegment, bottomRightAdjacentSegment: CellRouteSegment} {

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

    private calculateTopLeftRadiusDirection(topLeftAdjacentSegment: CellRouteSegment, routeSegment: CellRouteSegment): RadiusDirection {

        let topLeftRadiusDirection: RadiusDirection = RadiusDirection.straight;

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

        return topLeftRadiusDirection;
    }

    private calculateRouteSegmentPlacementForVertical(topLeftCanvas: CanvasPosition,
                                                      bottomRightCanvas: CanvasPosition,
                                                      topLeftRadiusDirection: RadiusDirection,
                                                      hasBottomRightAdjacentSegment: boolean): RouteSegmentPlacement {

        const { lineWidth, radius} = this.props;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.main.top = topLeftCanvas.y - lineWidth / 2;
        placement.main.left = topLeftCanvas.x - lineWidth / 2;
        placement.main.width = lineWidth;
        placement.main.height = bottomRightCanvas.y - topLeftCanvas.y + lineWidth;

        return placement;

        const outerRadius: number = Math.max(radius, lineWidth + RouteWireSegment.minInnerRadius);

        if (hasBottomRightAdjacentSegment) {
            placement.main.height -= outerRadius;
        }

        if (topLeftRadiusDirection) {
            placement.radius = {
                innerRadiusRectangle: new AbsoluteRectangle(),
                outerRadiusRectangle: new AbsoluteRectangle(),
                borderStyle: new Map<string, string>()
            };

            const innerRadius: number = Math.max(radius - lineWidth, RouteWireSegment.minInnerRadius);
            placement.radius.innerRadiusRectangle.top = placement.main.top + lineWidth;
            placement.radius.innerRadiusRectangle.width = innerRadius;
            placement.radius.innerRadiusRectangle.height = innerRadius;
            if (topLeftRadiusDirection == RadiusDirection.top_left) {
                placement.radius.innerRadiusRectangle.left = placement.main.left - innerRadius;
                placement.radius.borderStyle.set("borderStyle", "solid solid none none");
                placement.radius.borderStyle.set("borderRadius", "0 100% 0 0");
            } else {
                placement.radius.innerRadiusRectangle.left = placement.main.left + placement.main.width;
                placement.radius.borderStyle.set("borderStyle", "solid none none solid");
                placement.radius.borderStyle.set("borderRadius", "100% 0 0 0");
            }

            placement.radius.outerRadiusRectangle.top = placement.main.top;
            placement.radius.outerRadiusRectangle.width = outerRadius;
            placement.radius.outerRadiusRectangle.height = outerRadius;
            if (topLeftRadiusDirection == RadiusDirection.top_left) {
                placement.radius.outerRadiusRectangle.left = placement.main.left + placement.main.width - outerRadius;
            } else {
                placement.radius.outerRadiusRectangle.left = placement.main.left;
            }

            placement.main.top += outerRadius;
            placement.main.height -= outerRadius;

        }

        return placement;

    }

    private calculateRouteSegmentPlacementForHorizontal(topLeftCanvas: CanvasPosition,
                                                        bottomRightCanvas: CanvasPosition,
                                                        topLeftRadiusDirection: RadiusDirection,
                                                        hasBottomRightAdjacentSegment: boolean): RouteSegmentPlacement {

        const {prevSegment, nextSegment, cellSize, routeId, routeSegment, lineWidth, radius} = this.props;

        let placement: RouteSegmentPlacement = new RouteSegmentPlacement();
        placement.main.top = topLeftCanvas.y - lineWidth / 2;
        placement.main.left = topLeftCanvas.x - lineWidth / 2;
        placement.main.width = bottomRightCanvas.x - topLeftCanvas.x + lineWidth;
        placement.main.height = lineWidth;

        const outerRadius: number = Math.max(radius, lineWidth + RouteWireSegment.minInnerRadius);

        if (hasBottomRightAdjacentSegment) {
            placement.main.width -= outerRadius;
        }

        if (topLeftRadiusDirection) {
            placement.radius = {
                innerRadiusRectangle: new AbsoluteRectangle(),
                outerRadiusRectangle: new AbsoluteRectangle(),
                borderStyle: new Map<string, string>()
            };

            const innerRadius: number = Math.max(radius - lineWidth, RouteWireSegment.minInnerRadius);


            if (topLeftRadiusDirection == RadiusDirection.top_left) {
                placement.radius.innerRadiusRectangle.top = placement.main.top + placement.main.height - outerRadius;
                placement.radius.borderStyle.set("borderStyle", "none none solid solid");
                placement.radius.borderStyle.set("borderRadius", "0 0 0 100%");
            } else {
                placement.radius.innerRadiusRectangle.top = placement.main.top - innerRadius;
                placement.radius.borderStyle.set("borderStyle", "none none solid solid");
                placement.radius.borderStyle.set("borderRadius", "0 0 0 0");
            }
            placement.radius.innerRadiusRectangle.left = placement.main.left + outerRadius - innerRadius;
            placement.radius.innerRadiusRectangle.width = innerRadius;
            placement.radius.innerRadiusRectangle.height = innerRadius;

            if (topLeftRadiusDirection == RadiusDirection.top_left) {
                placement.radius.outerRadiusRectangle.top = placement.main.top + placement.main.height - outerRadius;
            } else {

            }
            placement.radius.outerRadiusRectangle.left = placement.main.left;
            placement.radius.outerRadiusRectangle.width = outerRadius;
            placement.radius.outerRadiusRectangle.height = outerRadius;

            placement.main.left += outerRadius;
            placement.main.width -= outerRadius;

        }

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