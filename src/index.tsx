import React from "react";
import * as ReactDOMClient from "react-dom/client";
import {Provider} from "mobx-react";
import {BoxSize} from "./data/box-size";
import {RecursiveSyncRoutingEngine} from "./routing-engine/impl/sync/recursive-sync-routing-engine";
import {ForwardBfsSyncRoutingEngine} from "./routing-engine/impl/sync/forward-bfs-sync-routing-engine";
import {BackwardBfsSyncRoutingEngine} from "./routing-engine/impl/sync/backward-bfs-sync-routing-engine";
import {BackwardBfsAsyncRoutingEngine} from "./routing-engine/impl/async/backward-bfs-async-routing-engine";
import {ForwardBfsAsyncRoutingEngine} from "./routing-engine/impl/async/forward-bfs-async-routing-engine";
import {RecursiveAsyncRoutingEngine} from "./routing-engine/impl/async/recursive-async-routing-engine";
import {SyncEngineView} from "./family-tree-layout-editor/view/sync-engine-view";
import {AsyncEngineView} from "./family-tree-layout-editor/view/async-engine-view";
import {ComparisonPanel} from "./family-tree-layout-editor/view/comparison-panel";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

const cellSize: BoxSize = new BoxSize(50, 50);

const recursiveSyncRoutingEngine: RecursiveSyncRoutingEngine = new RecursiveSyncRoutingEngine();
const forwardBfsSyncRoutingEngine: ForwardBfsSyncRoutingEngine = new ForwardBfsSyncRoutingEngine();
const backwardBfsSyncRoutingEngine: BackwardBfsSyncRoutingEngine = new BackwardBfsSyncRoutingEngine();

const recursiveAsyncRoutingEngine: RecursiveAsyncRoutingEngine = new RecursiveAsyncRoutingEngine();
const forwardBfsAsyncRoutingEngine: ForwardBfsAsyncRoutingEngine = new ForwardBfsAsyncRoutingEngine();
const backwardBfsAsyncRoutingEngine: BackwardBfsAsyncRoutingEngine = new BackwardBfsAsyncRoutingEngine();

root.render(
    // <Provider layoutEditorStore={layoutEditorStore}>
        <ComparisonPanel>
            <AsyncEngineView asyncEngine={recursiveAsyncRoutingEngine} name={"recursiveSyncRoutingEngine"} cellSize={cellSize} layoutSizeX={10} layoutSizeY={10}/>
            <AsyncEngineView asyncEngine={forwardBfsAsyncRoutingEngine} name={"forwardBfsSyncRoutingEngine"} cellSize={cellSize} layoutSizeX={10} layoutSizeY={10}/>
            <AsyncEngineView asyncEngine={backwardBfsAsyncRoutingEngine} name={"backwardBfsSyncRoutingEngine"} cellSize={cellSize} layoutSizeX={10} layoutSizeY={10}/>
            <SyncEngineView syncEngine={recursiveSyncRoutingEngine} name={"recursiveSyncRoutingEngine"} cellSize={cellSize}/>
            <SyncEngineView syncEngine={forwardBfsSyncRoutingEngine} name={"forwardBfsSyncRoutingEngine"} cellSize={cellSize}/>
            <SyncEngineView syncEngine={backwardBfsSyncRoutingEngine} name={"backwardBfsSyncRoutingEngine"} cellSize={cellSize}/>
        </ComparisonPanel>
    // </Provider>
);
