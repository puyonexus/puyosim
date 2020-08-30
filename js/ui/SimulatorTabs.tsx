import { h, Component } from "preact";
import { ShareTab } from "./tabs/ShareTab";
import { SavedChainsTab } from "./tabs/SavedChainsTab";
import { ChainsTab } from "./tabs/ChainsTab";
import { SimulatorTab } from "./tabs/SimulatorTab";
import { SettingsTab } from "./tabs/SettingsTab";

enum Tab {
  Share = "tab-share",
  SavedChains = "tab-saved-chains",
  Chains = "tab-preset-chains",
  Simulator = "tab-simulator",
  Settings = "tab-settings",
}

const tabNames: { [id in Tab]: string } = {
  [Tab.Share]: "Share",
  [Tab.SavedChains]: "Saved Chains",
  [Tab.Chains]: "Chains",
  [Tab.Simulator]: "Simulator",
  [Tab.Settings]: "Settings",
};

type TabComponentType =
  | typeof ShareTab
  | typeof SavedChainsTab
  | typeof ChainsTab
  | typeof SimulatorTab
  | typeof SettingsTab;

const tabs: { [id in Tab]: TabComponentType } = {
  [Tab.Share]: ShareTab,
  [Tab.SavedChains]: SavedChainsTab,
  [Tab.Chains]: ChainsTab,
  [Tab.Simulator]: SimulatorTab,
  [Tab.Settings]: SettingsTab,
};

interface SimulatorTabsState {
  activeTab: Tab;
}

export class SimulatorTabs extends Component<{}, SimulatorTabsState> {
  private static getLastTab(): Tab | null {
    const tab = localStorage.getItem("chainsim.lastTab");
    if (!tab) {
      return null;
    }
    if (Object.keys(tabs).indexOf(tab) === -1) {
      return null;
    }
    return tab as Tab;
  }

  private static setLastTab(tab: Tab) {
    localStorage.setItem("chainsim.lastTab", tab);
  }

  constructor(props?: {}) {
    super(props);
    this.state = {
      activeTab: SimulatorTabs.getLastTab() ?? Tab.Share,
    };
  }

  setTab(activeTab: Tab) {
    this.setState({ activeTab });
    SimulatorTabs.setLastTab(activeTab);
  }

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
            {Object.keys(tabs).map(id => (
              <li className={id === this.state.activeTab ? "tab-active" : undefined}>
                <a data-target={id} onClick={() => this.setTab(id as Tab)}>{tabNames[id as Tab]}</a>
              </li>
            ))}
            <li className="simulator-tabs-toggle">
              <a>
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          {Object.entries(tabs).map(([id, TabComponent]) => (
            <TabComponent active={id === this.state.activeTab} />
          ))}
        </div>
      </div>
    );
  }
}
