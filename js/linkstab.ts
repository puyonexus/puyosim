import $ from "jquery";
import { PuyoSim } from "./puyosim";
import { config } from "./config";
import { Utils } from "./utils";

export class LinksTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalizes this tab
    $("#get-links").click(() => {
      const data = {
        title: $("#share-chain-title").val(),
        chain: this.sim.field.mapToString(),
        width: this.sim.field.width,
        height: this.sim.field.height,
        hiddenRows: this.sim.field.hiddenRows,
        popLimit: this.sim.simulation.puyoToClear,
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
            Utils.stringFormat(config.shareLinkUrl, window.chainData.id)
        );
        $("#share-image").val(
          config.baseUrl +
            Utils.stringFormat(config.shareImageUrl, window.chainData.id)
        );
        $("#share-animated-image").val(
          config.baseUrl +
            Utils.stringFormat(
              config.shareAnimatedImageUrl,
              window.chainData.id
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
