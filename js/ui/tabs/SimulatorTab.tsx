import { h, Component } from "preact";

interface Props {
  active: boolean;
}

export class SimulatorTab extends Component<Props> {
  render() {
    return (
      <div id="tab-simulator" className={this.props.active ? "tab-content content-active" : "tab-content"}>
        <dl>
          <dt>Scoring</dt>
          <dd>
            <label className="radio">
              <input type="radio" name="score-mode" value="classic" />
              Classic
            </label>
            <label className="radio">
              <input type="radio" name="score-mode" value="fever" />
              Fever
            </label>
          </dd>
        </dl>
        <dl>
          <dt>Pop Limit</dt>
          <dd>
            <select id="puyo-to-clear"></select>
          </dd>
        </dl>
        <dl>
          <dt>Garbage Rate</dt>
          <dd>
            <select id="target-points"></select>
          </dd>
        </dl>
        <dl>
          <dt>Point Puyo</dt>
          <dd>
            <select id="point-puyo-bonus"></select>
          </dd>
        </dl>
        <dl>
          <dt>Attack Power</dt>
          <dd id="attack-powers-outer">
            <div id="attack-powers" className="dropdown">
              <button
                className="dropdown-toggle dropdown-toggle-block"
                data-toggle="dropdown"
              >
                <div className="dropdown-toggle-inner">
                  <strong>
                    <span id="attack-powers-game"></span>
                  </strong>
                  <br />
                  <span id="attack-powers-character"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <div className="dropdown-menu" role="menu"></div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>Board Size</dt>
          <dd>
            <select id="field-size-width"></select>&nbsp;&times;&nbsp;
            <select id="field-size-height"></select>&nbsp;&nbsp;
            <button id="set-field-size">Set</button>
          </dd>
        </dl>
        <dl>
          <dt>Hidden Rows</dt>
          <dd>
            <select id="field-hidden-rows"></select>&nbsp;&nbsp;
            <button id="set-hidden-rows">Set</button>
          </dd>
        </dl>
      </div>
    );
  }
}
