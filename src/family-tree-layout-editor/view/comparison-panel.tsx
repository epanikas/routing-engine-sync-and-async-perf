import React, {JSX} from "react";

export class ComparisonPanelProps {

}

export class ComparisonPanel extends React.Component<React.PropsWithChildren<ComparisonPanelProps>> {

    public override render(): JSX.Element {
        return (
            <div>
                <h1>this is my panel</h1>
                {this.props.children}
            </div>
        );
    }

}