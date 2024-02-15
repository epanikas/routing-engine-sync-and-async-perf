import React, {JSX} from "react";
import {SyncRoutingEngine} from "../../routing-engine/sync-routing-engine";
import {BoxSize} from "../../data/box-size";


export class SyncEngineViewProps {
    syncEngine: SyncRoutingEngine;
    name: string;
    cellSize: BoxSize;
}

export class SyncEngineView extends React.Component<SyncEngineViewProps> {

    override render(): JSX.Element {
        return <h3>{this.props.name}</h3>;
    }

}