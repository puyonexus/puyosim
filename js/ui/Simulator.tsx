import { h, Component } from "preact";
import { SimulatorControls } from "./SimulatorControls";
import { SimulatorTabs } from "./SimulatorTabs";
import { SimulatorField } from "./SimulatorField";

export class Simulator extends Component {
  render() {
    return (
      <div id="simulator">
        <SimulatorField />
        <SimulatorControls />
        <SimulatorTabs />
      </div>
    );
  }
}
