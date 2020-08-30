import { h, Component } from "preact";
import { ShareTab } from "./tabs/ShareTab";
import { SavedChainsTab } from "./tabs/SavedChainsTab";
import { ChainsTab } from "./tabs/ChainsTab";
import { SimulatorTab } from "./tabs/SimulatorTab";
import { SettingsTab } from "./tabs/SettingsTab";

export class SimulatorTabs extends Component {
  render() {
    return (
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
          <ShareTab />
          <SavedChainsTab />
          <ChainsTab />
          <SimulatorTab />
          <SettingsTab />
        </div>
      </div>
    );
  }
}
