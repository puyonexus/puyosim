import { h, Component } from "preact";
import { SimulatorControls } from "./SimulatorControls";
import { SimulatorTabs, Tab, TabID } from "./SimulatorTabs";
import { SimulatorField } from "./SimulatorField";
import { PuyoSim } from "../PuyoSim";
import { content } from "../data/content";
import { PuyoType } from "../constants";
import { ShareTab } from "./tabs/ShareTab";
import { SavedChainsTab } from "./tabs/SavedChainsTab";
import { ChainsTab } from "./tabs/ChainsTab";
import { SimulatorTab } from "./tabs/SimulatorTab";
import { SettingsTab } from "./tabs/SettingsTab";

interface Props {
  sim: PuyoSim;
}

interface State {
  // Currently selected tab.
  currentTab: TabID;

  // Indicates if we are going to insert Puyo (the insert box is checked)
  insertPuyo: boolean;

  // Current Puyo that is selected
  selectedPuyo: PuyoType;

  // The field style to use.
  style: string;
}

export class Simulator extends Component<Props, State> {
  constructor(props?: Props) {
    super(props);
    this.state = {
      currentTab: localStorage.getItem("chainsim.lastTab") as TabID ?? TabID.Share,
      insertPuyo: false,
      selectedPuyo: PuyoType.None,
      style: localStorage.getItem("chainsim.fieldStyle") ?? "standard",
    }
  }

  setCurrentTab = (currentTab: TabID) => {
    this.setState({ currentTab });
    localStorage.setItem("chainsim.lastTab", currentTab);
  }

  setInsertPuyo = (insertPuyo: boolean) => {
    this.setState({ insertPuyo });
  }

  setStyle = (style: string) => {
    this.setState({ style });
  }

  setSelectedPuyo = (selectedPuyo: PuyoType) => {
    this.setState({ selectedPuyo });
  }

  get fieldContent() {
    switch (this.state.style) {
      case "standard":
        return content.Field.Standard;
      case "eyecandy":
        return content.Field.EyeCandy;
      default:
        return content.Field.Basic;
    }
  }

  render() {
    const { sim } = this.props;
    const { currentTab, insertPuyo, selectedPuyo, style } = this.state;

    const tabs: Tab[] = [
      [TabID.Share, "Share", <ShareTab sim={sim} />],
      [TabID.SavedChains, "Saved Chains", <SavedChainsTab sim={sim} />],
      [TabID.Chains, "Chains", <ChainsTab sim={sim} />],
      [TabID.Simulator, "Simulator", <SimulatorTab sim={sim} />],
      [TabID.Settings, "Settings", <SettingsTab sim={sim} style={style} setStyle={this.setStyle} />],
    ]

    return (
      <div id="simulator">
        <SimulatorField
          sim={sim}
          insertPuyo={insertPuyo}
          fieldContent={this.fieldContent}
          selectedPuyo={selectedPuyo} />
        <SimulatorControls
          sim={sim}
          insertPuyo={insertPuyo}
          setInsertPuyo={this.setInsertPuyo}
          selectedPuyo={selectedPuyo}
          setSelectedPuyo={this.setSelectedPuyo} />
        <SimulatorTabs
          tabs={tabs}
          currentTab={currentTab}
          setCurrentTab={this.setCurrentTab} />
      </div>
    );
  }
}
