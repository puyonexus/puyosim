import { h, Component } from "preact";

export class SettingsTab extends Component {
  render() {
    return (
      <div id="tab-settings" className="tab-content">
        <dl>
          <dt>Animation</dt>
          <dd>
            <label className="checkbox">
              <input type="checkbox" id="animate-puyo" />
              Puyo
            </label>
            <label className="checkbox">
              <input type="checkbox" id="animate-sun-puyo" />
              Sun Puyo
            </label>
            <label className="checkbox">
              <input type="checkbox" id="animate-nuisance-tray" />
              Garbage Tray
            </label>
          </dd>
        </dl>
        <dl>
          <dt>Board Style</dt>
          <dd>
            <select id="field-style">
              <option value="basic">Basic</option>
              <option value="standard" selected>
                Standard
              </option>
              <option value="eyecandy">Eye Candy</option>
            </select>
          </dd>
        </dl>
        <dl>
          <dt>
            Board Background
            <br />
            (Eye Candy)
          </dt>
          <dd id="character-background-outer">
            <div id="character-background" className="dropdown">
              <button
                className="dropdown-toggle dropdown-toggle-block"
                data-toggle="dropdown"
              >
                <div className="dropdown-toggle-inner">
                  <strong>
                    <span id="character-background-game"></span>
                  </strong>
                  <br />
                  <span id="character-background-character"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <div className="dropdown-menu" role="menu"></div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>Puyo Skin</dt>
          <dd>
            <div id="puyo-skins" className="dropdown">
              <button className="dropdown-toggle" data-toggle="dropdown">
                <div className="dropdown-toggle-inner">
                  <span className="puyo-skin"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <ul className="dropdown-menu" role="menu"></ul>
            </div>
          </dd>
        </dl>
      </div>
    );
  }
}
