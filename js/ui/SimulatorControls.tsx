import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../PuyoSim";
import { PuyoType, SimulationDefaultSpeed } from "../constants";

interface Props {
  sim: PuyoSim;
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

  render() {
    const {back, start, pause, step, skip} = this.state;

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
            <button id="simulation-back" disabled={!back}>Back</button>
            <button id="simulation-start" disabled={!start}>Start</button>
            <button id="simulation-pause" disabled={!pause}>Pause</button>
            <button id="simulation-step" disabled={!step}>Step</button>
            <button id="simulation-skip" disabled={!skip}>Skip</button>
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

    $("#field-erase-all").on("click", () => {
      sim.field.setChain(
        "",
        sim.field.width,
        sim.field.height,
        sim.field.hiddenRows
      );
    });

    if (sim.field.chainInURL) {
      // Make the "Set from URL" button function if a chain can be set from the URL
      $("#field-set-from-url").on("click", () => {
        sim.field.setChainFromURL();
      });
    } else {
      // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
      $("#field-set-from-url").hide();
    }

    $("#puyo-selection .puyo.puyo-none").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.None;
    });
    $("#puyo-selection .puyo.puyo-delete").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Delete;
    });
    $("#puyo-selection .puyo.puyo-red").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Red;
    });
    $("#puyo-selection .puyo.puyo-green").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Green;
    });
    $("#puyo-selection .puyo.puyo-blue").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Blue;
    });
    $("#puyo-selection .puyo.puyo-yellow").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Yellow;
    });
    $("#puyo-selection .puyo.puyo-purple").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Purple;
    });
    $("#puyo-selection .puyo.puyo-nuisance").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Nuisance;
    });
    $("#puyo-selection .puyo.puyo-point").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Point;
    });
    $("#puyo-selection .puyo.puyo-hard").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Hard;
    });
    $("#puyo-selection .puyo.puyo-iron").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Iron;
    });
    $("#puyo-selection .puyo.puyo-block").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Block;
    });
    $("#puyo-selection .puyo.puyo-sun").on("click", () => {
      sim.fieldDisplay.selectedPuyo = PuyoType.Sun;
    });
    $("#puyo-selection .puyo").on("click", ({ currentTarget }) => {
      $("#puyo-selection .selected").removeClass("selected");
      $(currentTarget).parent().addClass("selected");
    });
    $("#puyo-selection .puyo.puyo-none").parent().addClass("selected");

    $("#simulation-back").on("click", () => {
      sim.simulation.back();
    });
    $("#simulation-start").on("click", () => {
      sim.simulation.start();
    });
    $("#simulation-pause").on("click", () => {
      sim.simulation.pause();
    });
    $("#simulation-step").on("click", () => {
      sim.simulation.step();
    });
    $("#simulation-skip").on("click", () => {
      sim.simulation.skip();
    });

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
