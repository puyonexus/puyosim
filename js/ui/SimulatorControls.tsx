import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../PuyoSim";
import { PuyoType, SimulationDefaultSpeed } from "../constants";

interface Props {
  sim: PuyoSim;
  insertPuyo: boolean;
  setInsertPuyo: (insertPuyo: boolean) => void;
  selectedPuyo: PuyoType;
  setSelectedPuyo: (selectedPuyo: PuyoType) => void;
}

interface State {
  back: boolean;
  start: boolean;
  pause: boolean;
  step: boolean;
  skip: boolean;
}

export class SimulatorControls extends Component<Props, State> {
  constructor(props?: Props) {
    super(props);
    this.state = {
      back: false,
      start: true,
      pause: false,
      step: true,
      skip: true,
    };
  }

  updateButtonState = () => {
    const {running, paused, stepMode, finished} = this.props.sim.simulation;
    this.setState({
      back: running,
      start: !running || paused || stepMode && !finished,
      pause: running && !paused && !stepMode && !finished,
      step: !running || paused || stepMode && !finished,
      skip: !running || paused || stepMode && !finished,
    });
  }

  componentDidMount() {
    this.props.sim.simulation.addEventListener("statechange", this.updateButtonState);
    Promise.resolve().then(() => this.initLegacy());
  }

  componentWillUnmount() {
    this.props.sim.simulation.removeEventListener("statechange", this.updateButtonState);
  }

  clearBoard() {
    this.props.sim.field.setChain(
      "",
      this.props.sim.field.width,
      this.props.sim.field.height,
      this.props.sim.field.hiddenRows
    );
  }

  render() {
    const {sim, insertPuyo, setInsertPuyo, selectedPuyo, setSelectedPuyo} = this.props;
    const {back, start, pause, step, skip} = this.state;

    return (
      <div id="simulator-controls">
        <div id="controls-puyo-selection">
          <div className="box-inner-header">
            <label className="checkbox">
              <input
                type="checkbox"
                id="puyo-insertion"
                checked={insertPuyo}
                onChange={e => setInsertPuyo((e.target as HTMLInputElement)?.checked)} />
              Insert
            </label>
          </div>
          <div id="puyo-selection" className="center">
            <ul>
              <li className={selectedPuyo === PuyoType.None ? "selected" : undefined}>
                <a className="puyo puyo-none" onClick={() => setSelectedPuyo(PuyoType.None)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Delete ? "selected" : undefined}>
                <a className="puyo puyo-delete" onClick={() => setSelectedPuyo(PuyoType.Delete)}></a>
              </li>
            </ul>
            <ul>
              <li className={selectedPuyo === PuyoType.Red ? "selected" : undefined}>
                <a className="puyo puyo-red" onClick={() => setSelectedPuyo(PuyoType.Red)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Green ? "selected" : undefined}>
                <a className="puyo puyo-green" onClick={() => setSelectedPuyo(PuyoType.Green)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Blue ? "selected" : undefined}>
                <a className="puyo puyo-blue" onClick={() => setSelectedPuyo(PuyoType.Blue)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Yellow ? "selected" : undefined}>
                <a className="puyo puyo-yellow" onClick={() => setSelectedPuyo(PuyoType.Yellow)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Purple ? "selected" : undefined}>
                <a className="puyo puyo-purple" onClick={() => setSelectedPuyo(PuyoType.Purple)}></a>
              </li>
            </ul>
            <ul>
              <li className={selectedPuyo === PuyoType.Nuisance ? "selected" : undefined}>
                <a className="puyo puyo-nuisance" onClick={() => setSelectedPuyo(PuyoType.Nuisance)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Point ? "selected" : undefined}>
                <a className="puyo puyo-point" onClick={() => setSelectedPuyo(PuyoType.Point)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Sun ? "selected" : undefined}>
                <a className="puyo puyo-sun" onClick={() => setSelectedPuyo(PuyoType.Sun)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Hard ? "selected" : undefined}>
                <a className="puyo puyo-hard" onClick={() => setSelectedPuyo(PuyoType.Hard)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Iron ? "selected" : undefined}>
                <a className="puyo puyo-iron" onClick={() => setSelectedPuyo(PuyoType.Iron)}></a>
              </li>
              <li className={selectedPuyo === PuyoType.Block ? "selected" : undefined}>
                <a className="puyo puyo-block" onClick={() => setSelectedPuyo(PuyoType.Block)}></a>
              </li>
            </ul>
          </div>
          <div className="box-inner-footer">
            <button id="field-erase-all" onClick={() => this.clearBoard()}>
              <img src="/images/puyo_eraseall.png" alt="Erase All" />
            </button>
            {sim.field.chainInURL ? <button id="field-set-from-url" onClick={() => sim.field.setChainFromURL()}>
              <img src="/images/import_from_url.png" alt="Import from URL" />
            </button> : undefined}
          </div>
        </div>
        <div id="controls-simulation">
          <div className="button-group">
            <button id="simulation-back" disabled={!back} onClick={() => sim.simulation.back()}>Back</button>
            <button id="simulation-start" disabled={!start} onClick={() => sim.simulation.start()}>Start</button>
            <button id="simulation-pause" disabled={!pause} onClick={() => sim.simulation.pause()}>Pause</button>
            <button id="simulation-step" disabled={!step} onClick={() => sim.simulation.step()}>Step</button>
            <button id="simulation-skip" disabled={!skip} onClick={() => sim.simulation.skip()}>Skip</button>
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

  initLegacy() {
    const { sim } = this.props;

    $.each(
      [
        "1 (Slowest)",
        "2",
        "3",
        "4",
        "5 (Normal)",
        "6",
        "7",
        "8",
        "9 (Fastest)",
      ],
      (index, value) => {
        $("#simulation-speed").append(
          '<option value="' + (9 - index) * 100 + '">' + value + "</option>"
        );
      }
    );
    $("#simulation-speed")
      .on("change", ({ currentTarget }) => {
        sim.simulation.speed = parseInt(
          String($(currentTarget).val()),
          10
        );
      })
      .val(SimulationDefaultSpeed);

    $("#field-score").text("0");
    $("#field-chains").text("0");
    $("#field-nuisance").text("0");
    $("#field-cleared").text("0");
  }
}
