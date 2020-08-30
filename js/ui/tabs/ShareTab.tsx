import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../../PuyoSim";
import { config } from "../../config";
import { Utils } from "../../Utils";

interface Props {
  sim: PuyoSim|null;
  active: boolean;
}

export class ShareTab extends Component<Props> {
  render() {
    return (
      <div id="tab-share" className={this.props.active ? "tab-content content-active" : "tab-content"}>
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
            <input type="text" id="share-animated-image" readOnly />
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
    );
  }
  
  componentDidMount() {
    Promise.resolve().then(() => this.initLegacy());
  }

  initLegacy() {
    const { sim } = this.props;
    if (!sim) {
      return;
    }

    $("#get-links").on("click", () => {
      const data = {
        title: $("#share-chain-title").val(),
        chain: sim.field.mapToString(),
        width: sim.field.width,
        height: sim.field.height,
        hiddenRows: sim.field.hiddenRows,
        popLimit: sim.simulation.puyoToClear,
      };

      $.post(
        "/api/save",
        data,
        (response) => {
          if (response.success) {
            $("#share-link").val(
              config.baseUrl +
                Utils.stringFormat(config.shareLinkUrl, response.data.id)
            );
            $("#share-image").val(
              config.baseUrl +
                Utils.stringFormat(config.shareImageUrl, response.data.id)
            );
            $("#share-animated-image").val(
              config.baseUrl +
                Utils.stringFormat(
                  config.shareAnimatedImageUrl,
                  response.data.id
                )
            );

            // Hide elements that shouldn't be shown for shared chains, and show elements that should
            $(".hide-on-shared-chain").hide();
            $(".show-on-shared-chain").show();
          }
        },
        "json"
      );
    });

    if (window.chainData !== undefined) {
      if (window.chainData.id !== undefined) {
        $("#share-link").val(
          config.baseUrl +
            Utils.stringFormat(config.shareLinkUrl, String(window.chainData.id))
        );
        $("#share-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareImageUrl,
              String(window.chainData.id)
            )
        );
        $("#share-animated-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareAnimatedImageUrl,
              String(window.chainData.id)
            )
        );
      } else if (window.chainData.legacyQueryString !== undefined) {
        $("#share-link").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareLegacyLinkUrl,
              window.chainData.legacyQueryString
            )
        );
        $("#share-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareLegacyImageUrl,
              window.chainData.legacyQueryString
            )
        );
      }
    }
  }
}
