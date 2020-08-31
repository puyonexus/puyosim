import { h, Component } from "preact";

export enum TabID {
  Share = "tab-share",
  SavedChains = "tab-saved-chains",
  Chains = "tab-preset-chains",
  Simulator = "tab-simulator",
  Settings = "tab-settings",
}

export type Tab = [TabID, string, h.JSX.Element];

interface Props {
  tabs: Tab[];
  currentTab: TabID;
  setCurrentTab: (currentTab: TabID) => void;
}

interface State {
  float: boolean;
  toggle: boolean;
}

export class SimulatorTabs extends Component<Props, State> {
  constructor(props?: Props) {
    super(props);
    this.state = {
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
    const { tabs, currentTab, setCurrentTab } = this.props;

    return (
      <div id="simulator-tabs" className={this.getTabClassName()}>
        <div className="simulator-tabs-toggle" onClick={() => this.toggle()}>
          <a>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div className="tab-container">
          <ul id="simulator-tabs-select">
            {tabs.map(([id, name]) =>
              <li className={currentTab === id ? "tab-active" : undefined}>
                <a onClick={() => setCurrentTab(id)}>{name}</a>
              </li>
            )}
            <li className="simulator-tabs-toggle" onClick={() => this.toggle()}>
              <a>
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          {tabs.filter(([id]) => id === currentTab).map(([,,component]) => component)}
        </div>
      </div>
    );
  }
}
