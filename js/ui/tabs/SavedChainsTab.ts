import $ from "jquery";
import { PuyoSim } from "../../PuyoSim";
import { FieldDefaultWidth, FieldDefaultHeight, FieldDefaultHiddenRows } from "../../constants";
import { Utils } from "../../Utils";

interface ISavedChain {
  name: string;
  width: number;
  height: number;
  hiddenRows: number;
  chain: string;
  format: "base36" | "legacy";
}

export class SavedChainsTab {
  // Saved chains array
  chains: ISavedChain[] = [];

  constructor(readonly sim: PuyoSim) {}

  // Initalizes this tab
  init() {
    // Use the name of the shared chain if we are viewing one
    if (
      window.chainData !== undefined &&
      window.chainData.title !== undefined
    ) {
      $("#save-chain-name").val(window.chainData.title);
    }

    // Save chain
    $("#save-chain-save").click(() => {
      if ($("#save-chain-name").val() !== "") {
        this.add(String($("#save-chain-name").val()));
        $("#save-chain-name").val("");
      }
    });

    // The chains are stored as a JSON object in localStorage.chainsim.savedChains as follows:
    // name   = the name of the chain
    // width  = width of chain
    // height = height of chain
    // chain  = the actual chain itself
    const data = localStorage.getItem("chainsim.savedChains") || "";
    if (data !== "") {
      try {
        this.chains = JSON.parse(data);
      } catch (e) {
        this.chains = [];
      }
    }

    this.display();
  }

  load(index: number) {
    // Load a chain
    let chain = this.chains[index].chain;

    // If this chain is saved in a legacy format, convert it to base36
    if ((this.chains[index].format || "legacy") === "legacy") {
      const oldChars = "0475681BCA32";
      const oldChain = chain;
      chain = "";

      for (const ch of oldChain) {
        const charIndex = oldChars.indexOf(ch);
        chain += charIndex !== -1 ? charIndex.toString(36) : "0";
      }
    }

    this.sim.field.setChain(
      chain,
      this.chains[index].width || FieldDefaultWidth,
      this.chains[index].height || FieldDefaultHeight,
      this.chains[index].hiddenRows || FieldDefaultHiddenRows
    );
  }

  add(name: string) {
    // Add a chain to the chains list
    if (name === "") {
      // No name was set
      return;
    }

    this.chains.push({
      name,
      width: this.sim.field.width,
      height: this.sim.field.height,
      hiddenRows: this.sim.field.hiddenRows,
      chain: this.sim.field.mapToString(),
      format: "base36",
    });

    this.saveChains();
    this.addToDisplay(this.chains.length - 1);
  }

  remove(index: number) {
    // Removes the chain at the specified index
    this.chains.splice(index, 1);

    this.saveChains();
    this.removeFromDisplay(index);
  }

  saveChains() {
    // Saves the chains
    localStorage.setItem("chainsim.savedChains", JSON.stringify(this.chains));
  }

  display() {
    // Display the chains that are saved
    const self = this;

    $("#saved-chains-list").empty(); // Delete any entries that might be displayed

    if (this.chains.length === 0) {
      // No saved chains
      $(".hide-on-saved-chains").show();
    } else {
      for (let i = 0; i < this.chains.length; i++) {
        this.addToDisplay(i);
      }
    }

    $("#saved-chains-list")
      .on("click", "li .chain-name a", function () {
        self.load(
          parseInt(
            $(this).parents("#saved-chains-list li").attr("data-value")!,
            10
          )
        );
      })
      .on("click", "li .icon-delete", function () {
        self.remove(
          parseInt(
            $(this).parents("#saved-chains-list li").attr("data-value")!,
            10
          )
        );
      });
  }

  addToDisplay(index: number) {
    // Adds the chain with the specified index to the end of the displayed list
    if ($("#saved-chains-list").children("li[data-value]").length === 0) {
      // Remove the "You have no saved chains" message
      $(".hide-on-saved-chains").hide();
      $(".show-on-saved-chains").show();
    }

    $("<li>")
      .attr("data-value", index)
      .html(
        '<a class="icon-delete" title="Delete Chain"></a><span class="chain-name"><a class="link">' +
          Utils.escape(this.chains[index].name) +
          "</a></span>"
      )
      .appendTo("#saved-chains-list");
  }

  removeFromDisplay(index: number) {
    // Removes the chain with the specified index from the list
    $("#saved-chains-list li[data-value='" + index + "']").remove();

    if ($("#saved-chains-list").children("li[data-value]").length === 0) {
      // If there is nothing left then display the "You have no saved chains" message
      $(".show-on-saved-chains").hide();
      $(".hide-on-saved-chains").show();
    }
  }
}
