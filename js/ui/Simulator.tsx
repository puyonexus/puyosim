import { h, Component } from "preact";

export class Simulator extends Component {
  render() {
    return (
      <div id="simulator">
        <div id="simulator-field">
          <div id="field-content">
            <div id="field-bg-1"></div>
            <div id="field-bg-2"></div>
            <div id="field-bg-3"></div>
            <div id="field"></div>
          </div>
        </div>
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
        <div id="simulator-tabs" data-min-width="400">
          <div className="simulator-tabs-toggle">
            <a>
              <i className="fa fa-bars" aria-hidden="true"></i>
            </a>
          </div>
          <div className="tab-container">
            <ul id="simulator-tabs-select">
              <li>
                <a data-target="#tab-share">Share</a>
              </li>
              <li>
                <a data-target="#tab-saved-chains">Saved Chains</a>
              </li>
              <li>
                <a data-target="#tab-preset-chains">Chains</a>
              </li>
              <li>
                <a data-target="#tab-simulator">Simulator</a>
              </li>
              <li>
                <a data-target="#tab-settings">Settings</a>
              </li>
              <li className="simulator-tabs-toggle">
                <a>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
            <div id="tab-share" className="tab-content">
              <div className="box-inner-header">
                <div className="input-group">
                  <input
                    type="text"
                    id="share-chain-title"
                    placeholder="(Optional) Give this chain a title"
                    maxLength={128}
                  />
                  <button id="get-links">Share</button>
                </div>
              </div>
              <div className="show-on-shared-chain">
                <p>Link</p>
                <div className="input-group">
                  <input type="text" id="share-link" readOnly />
                  <button
                    className="clipboard-button"
                    data-clipboard-target="#share-link"
                    title="Copy to clipboard"
                  >
                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                </div>
                <p>Image</p>
                <div className="input-group">
                  <input type="text" id="share-image" readOnly />
                  <button
                    className="clipboard-button"
                    data-clipboard-target="#share-image"
                    title="Copy to clipboard"
                  >
                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                </div>
                <p>Animated Image</p>
                <div className="input-group">
                  <input
                    type="text"
                    id="share-animated-image"
                    readOnly
                  />
                  <button
                    className="clipboard-button"
                    data-clipboard-target="#share-animated-image"
                    title="Copy to clipboard"
                  >
                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div className="hide-on-shared-chain">
                <p className="tab-content-message">
                  Links will appear here once you share a chain.
                </p>
              </div>
            </div>
            <div id="tab-saved-chains" className="tab-content">
              <div className="box-inner-header">
                <div className="input-group">
                  <input
                    type="text"
                    id="save-chain-name"
                    placeholder="Give this chain a title"
                    maxLength={128}
                  />
                  <button id="save-chain-save">Save</button>
                </div>
              </div>
              <ul id="saved-chains-list" className="show-on-saved-chains"></ul>
              <div className="hide-on-saved-chains">
                <p className="tab-content-message">You have no saved chains.</p>
              </div>
            </div>
            <div id="tab-preset-chains" className="tab-content">
              <div id="preset-chains-outer">
                <div className="box-inner-header">
                  <div id="preset-chains" className="dropdown">
                    <button
                      className="dropdown-toggle dropdown-toggle-block"
                      data-toggle="dropdown"
                    >
                      <div className="dropdown-toggle-inner">
                        <strong>
                          <span id="preset-chains-series"></span>
                        </strong>
                        <br />
                        <span id="preset-chains-group"></span>
                        <span className="caret"></span>
                      </div>
                    </button>
                    <div className="dropdown-menu" role="menu"></div>
                  </div>
                </div>
                <ul id="preset-chains-list"></ul>
              </div>
            </div>
            <div id="tab-simulator" className="tab-content">
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
          </div>
        </div>
      </div>
    );
  }
}
