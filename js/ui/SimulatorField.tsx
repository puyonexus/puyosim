import { h, Component } from "preact";

export class SimulatorField extends Component {
  render() {
    return (
      <div id="simulator-field">
        <div id="field-content">
          <div id="field-bg-1"></div>
          <div id="field-bg-2"></div>
          <div id="field-bg-3"></div>
          <div id="field"></div>
        </div>
      </div>
    );
  }
}
