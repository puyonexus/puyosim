import $ from "jquery";
import { PuyoSim } from "./puyosim";
import { default as chainsJson } from "./data/chains.json";
import { FieldDefaultWidth, FieldDefaultHeight, FieldDefaultHiddenRows, SimulationDefaultPuyoToClear } from "./constants";

export class ChainsTab {
  chains: typeof chainsJson = [];

  constructor(readonly sim: PuyoSim) {}

  init() {
    // Initalizes this tab
    const self = this;

    this.chains = chainsJson;

    // Categories
    for (let i = 0; i < this.chains.length; i++) {
      $("#preset-chains .dropdown-menu").append(
        "<h3>" + this.chains[i].name + "</h3>"
      );
      const category = $("<ul>");

      // Sub-categories
      for (let j = 0; j < this.chains[i].categories.length; j++) {
        $("<li>")
          .attr("data-category", i)
          .attr("data-value", j)
          .html("<a>" + this.chains[i].categories[j].name + "</a>")
          .appendTo(category);
      }

      $("#preset-chains .dropdown-menu").append(category);
    }

    $("#preset-chains .dropdown-menu a").click(function () {
      const category = parseInt(
        String($(this).parent().attr("data-category")),
        10
      );
      const value = parseInt(String($(this).parent().attr("data-value")), 10);

      $("#preset-chains .dropdown-menu li.selected").removeClass("selected");
      $(this).parent().addClass("selected");

      $("#preset-chains-series").text(self.chains[category].name);
      $("#preset-chains-group").text(
        self.chains[category].categories[value].name
      );

      self.displaySubCategory(category, value);
    });

    $(document).on("change", "#preset-chains-list select", function () {
      if ($(this).prop("selectedIndex") === 0) {
        return;
      }

      const category = parseInt(
        String(
          $("#preset-chains .dropdown-menu .selected").attr("data-category")
        ),
        10
      );
      const subCategory = parseInt(
        String(
          $("#preset-chains .dropdown-menu .selected").attr("data-value")
        ),
        10
      );
      const type = parseInt(String($(this).attr("data-type")), 10);
      const colors = parseInt(String($(this).attr("data-colors")), 10);
      const length = parseInt(String($(this).val()), 10);

      self.sim.field.setChain(
        self.chains[category].categories[subCategory].types[type].colors[colors]
          .chains[length].chain, // Chain
        self.chains[category].categories[subCategory].fieldWidth ||
          FieldDefaultWidth, // Field width
        self.chains[category].categories[subCategory].fieldHeight ||
          FieldDefaultHeight, // Field height
        FieldDefaultHiddenRows // Hidden rows (It's always 1 with these chains)
      );

      self.sim.simulation.puyoToClear =
        self.chains[category].categories[subCategory].puyoToClear ||
        SimulationDefaultPuyoToClear;
      $("#puyo-to-clear").val(self.sim.simulation.puyoToClear);

      $(this).prop("selectedIndex", 0);
    });

    $(
      "#preset-chains .dropdown-menu li[data-category='0'][data-value='1'] a"
    ).click();
  }

  displaySubCategory(category: number, subCategory: number) {
    $("#preset-chains-list").empty(); // Empty the list so we can put new stuff in it

    // Chain types
    for (
      let i = 0;
      i < this.chains[category].categories[subCategory].types.length;
      i++
    ) {
      const row = $("<dl>");
      const dd = $("<dd>");

      // Name of the chain type
      $("<dt>")
        .text(this.chains[category].categories[subCategory].types[i].name)
        .appendTo(row);

      // Select boxes for each color
      for (
        let j = 0;
        j <
        this.chains[category].categories[subCategory].types[i].colors.length;
        j++
      ) {
        const select = $("<select>").attr("data-type", i).attr("data-colors", j);

        // Add color amount as the first index
        $("<option>")
          .text(
            this.chains[category].categories[subCategory].types[i].colors[j]
              .amount + " Col"
          )
          .appendTo(select);

        // Add the list of chains
        for (
          let k = 0;
          k <
          this.chains[category].categories[subCategory].types[i].colors[j]
            .chains.length;
          k++
        ) {
          $("<option>")
            .attr("value", k)
            .text(
              this.chains[category].categories[subCategory].types[i].colors[j]
                .chains[k].length
            )
            .appendTo(select);
        }

        select.appendTo(dd);
        dd.appendTo(row);
      }

      $("<li>").append(row).appendTo("#preset-chains-list");
    }
  }
}