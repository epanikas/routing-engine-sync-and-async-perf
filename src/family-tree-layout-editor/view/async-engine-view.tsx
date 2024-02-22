import React, {JSX} from "react";
import {SyncRoutingEngine} from "../../routing-engine/sync-routing-engine";
import {AsyncRoutingEngine} from "../../routing-engine/async-routing-engine";
import {BoxSize} from "../../data/box-size";
import {Grid} from "./components/grid";
import {RouteWire} from "./components/route-wire";
import {CellRoute} from "../../data/cell-route";
import {LayoutPosition} from "../../data/layout-position";


export class AsyncEngineViewProps {
    asyncEngine: AsyncRoutingEngine;
    name: string;
    layoutSizeX: number;
    layoutSizeY: number;
    cellSize: BoxSize;
}

export class AsyncEngineView extends React.Component<AsyncEngineViewProps> {


    override render(): JSX.Element {

        const { cellSize , layoutSizeX, layoutSizeY} = this.props;

        const route: CellRoute = new CellRoute([
            new LayoutPosition(0, 1),
            new LayoutPosition(1, 1),
            new LayoutPosition(1, 2),
            new LayoutPosition(2, 2),
            new LayoutPosition(2, 3),
            new LayoutPosition(3, 3),
            new LayoutPosition(3, 4),
            new LayoutPosition(5, 4),
            new LayoutPosition(5, 3),
            new LayoutPosition(6, 3),
            new LayoutPosition(6, 2),
        ]);

        return (
            <div>
                <h3>{this.props.name}</h3>
                <div style={{width: cellSize.sizeX * layoutSizeX, height: cellSize.sizeY * layoutSizeY, position: 'relative'}}>
                    <Grid layoutSizeX={layoutSizeX} layoutSizeY={layoutSizeY} cellSize={cellSize} />
                    <RouteWire cellSize={cellSize} route={route} color={"blue"} lineWidth={14} radius={10} />
                </div>
            </div>
        );
    }

}