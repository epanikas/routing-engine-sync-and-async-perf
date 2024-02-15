import React, {JSX} from "react";
import { BoxSize } from "../../../data/box-size";

export class GridProps {

  layoutSizeX: number;
  layoutSizeY: number;
  cellSize: BoxSize;

}

export class Grid extends React.Component<GridProps>{

  public override render(): JSX.Element {

    const {layoutSizeX, layoutSizeY, cellSize } = this.props


    let cells: JSX.Element[] = [];
    for (let i: number = 0; i < layoutSizeX; ++i) {
      for (let j: number = 0; j < layoutSizeY; ++j) {
        const left: number = i * cellSize.sizeX;
        const top: number = j * cellSize.sizeY;
        cells.push(
          <div key={"grid-cell-" + i + "-" + j}
               style={{
                 position: "absolute",
                 top: top + "px",
                 left: left + "px",
                 width: cellSize.sizeX + "px",
                 height: cellSize.sizeY + "px",
                 border: "1px solid lightgrey",
               }}
          ></div>
        );
      }
    }

    return <div>{cells}</div>;
  }

}