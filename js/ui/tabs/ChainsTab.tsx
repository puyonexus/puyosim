import { h, Component } from "preact";

interface Props {
  active: boolean;
}

export class ChainsTab extends Component<Props> {
  render() {
    return (
      <div id="tab-preset-chains" className={this.props.active ? "tab-content content-active" : "tab-content"}>
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
    );
  }
}
