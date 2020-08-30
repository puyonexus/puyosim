import { h, Component } from "preact";

export class ShareTab extends Component {
  render() {
    return (
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
}
