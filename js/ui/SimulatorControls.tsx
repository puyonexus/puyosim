import { h, Component } from "preact";

export class SimulatorControls extends Component {
  render() {
    return (
      <div id="simulator-controls">
        <div id="controls-puyo-selection">
          <div className="box-inner-header">
            <label className="checkbox">
              <input type="checkbox" id="puyo-insertion" />
              Insert
            </label>
          </div>
          <div id="puyo-selection" className="center">
            <ul>
              <li>
                <a className="puyo puyo-none"></a>
              </li>
              <li>
                <a className="puyo puyo-delete"></a>
              </li>
            </ul>
            <ul>
              <li>
                <a className="puyo puyo-red"></a>
              </li>
              <li>
                <a className="puyo puyo-green"></a>
              </li>
              <li>
                <a className="puyo puyo-blue"></a>
              </li>
              <li>
                <a className="puyo puyo-yellow"></a>
              </li>
              <li>
                <a className="puyo puyo-purple"></a>
              </li>
            </ul>
            <ul>
              <li>
                <a className="puyo puyo-nuisance"></a>
              </li>
              <li>
                <a className="puyo puyo-point"></a>
              </li>
              <li>
                <a className="puyo puyo-sun"></a>
              </li>
              <li>
                <a className="puyo puyo-hard"></a>
              </li>
              <li>
                <a className="puyo puyo-iron"></a>
              </li>
              <li>
                <a className="puyo puyo-block"></a>
              </li>
            </ul>
          </div>
          <div className="box-inner-footer">
            <button id="field-erase-all">
              <img src="/images/puyo_eraseall.png" alt="Erase All" />
            </button>
            <button id="field-set-from-url">
              <img src="/images/import_from_url.png" alt="Import from URL" />
            </button>
          </div>
        </div>
        <div id="controls-simulation">
          <div className="button-group">
            <button id="simulation-back">Back</button>
            <button id="simulation-start">Start</button>
            <button id="simulation-pause">Pause</button>
            <button id="simulation-step">Step</button>
            <button id="simulation-skip">Skip</button>
          </div>
          <div className="box-inner-footer">
            Speed:
            <select id="simulation-speed"></select>
          </div>
        </div>
        <div id="controls-score-display">
          <div id="nuisance-tray"></div>
          <dl>
            <dt>Score:</dt>
            <dd>
              <span id="field-score"></span>
            </dd>
          </dl>
          <dl>
            <dt>Chains:</dt>
            <dd>
              <span id="field-chains"></span>
            </dd>
          </dl>
          <dl>
            <dt>Cleared:</dt>
            <dd>
              <span id="field-cleared"></span>
            </dd>
          </dl>
          <dl>
            <dt>Garbage:</dt>
            <dd>
              <span id="field-nuisance"></span>
            </dd>
          </dl>
        </div>
      </div>
    );
  }
}
