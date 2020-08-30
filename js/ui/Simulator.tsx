import { h, Component } from "preact";
import { SimulatorControls } from "./SimulatorControls";
import { SimulatorTabs } from "./SimulatorTabs";
import { SimulatorField } from "./SimulatorField";
import { PuyoSim } from "../PuyoSim";

interface Props {
  sim: PuyoSim;
}

export class Simulator extends Component<Props> {
  render() {
    const { sim } = this.props;
    return (
      <div id="simulator">
        <SimulatorField sim={sim} />
        <SimulatorControls sim={sim} />
        <SimulatorTabs sim={sim} />
      </div>
    );
  }
}
