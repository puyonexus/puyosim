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

interface State {
  activeTab: Tab;
  float: boolean;
  toggle: boolean;
}

export class SimulatorTabs extends Component<{}, State> {
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
      float: false,
      toggle: false,
    };
  }

  onResize = () => {
    if (this.base instanceof HTMLElement) {
      const float = this.base.clientWidth < 400;
      this.setState(prevState => {
        if (prevState.float !== float) {
          return {
            float,
            toggle: false,
          };
        }
        return null;
      });
    }
  };

  componentDidMount() {
    // TODO: Maybe consider resize observer.
    window.addEventListener("resize", this.onResize);
    Promise.resolve().then(() => this.onResize());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  setTab(activeTab: Tab) {
    this.setState({ activeTab });
    SimulatorTabs.setLastTab(activeTab);
  }

  toggle() {
    this.setState({ toggle: !this.state.toggle });
  }

  getTabClassName(): string | undefined {
    if (!this.state.float) {
      return undefined;
    }
    let className = "float";
    if (this.state.toggle) {
      className += " toggled";
    }
    return className;
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div id="simulator-tabs" className={this.getTabClassName()}>
        <div className="simulator-tabs-toggle" onClick={() => this.toggle()}>
          <a>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div className="tab-container">
          <ul id="simulator-tabs-select">
            {Object.keys(tabs).map((id) => (
              <li className={id === activeTab ? "tab-active" : undefined}>
                <a data-target={id} onClick={() => this.setTab(id as Tab)}>
                  {tabNames[id as Tab]}
                </a>
              </li>
            ))}
            <li className="simulator-tabs-toggle" onClick={() => this.toggle()}>
              <a>
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          {Object.entries(tabs).map(([id, TabComponent]) => (
            <TabComponent active={id === activeTab} />
          ))}
        </div>
      </div>
    );
  }
}
