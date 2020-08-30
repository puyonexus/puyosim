import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../../PuyoSim";
import { default as chainsJson } from "../../data/chains.json";
import {
  FieldDefaultWidth,
  FieldDefaultHeight,
  FieldDefaultHiddenRows,
  SimulationDefaultPuyoToClear,
} from "../../constants";

interface Props {
  sim: PuyoSim;
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

  componentDidMount() {
    Promise.resolve().then(() => this.initLegacy());
  }

  initLegacy() {
    const { sim } = this.props;

    // Categories
    for (let i = 0; i < chainsJson.length; i++) {
      $("#preset-chains .dropdown-menu").append(
        "<h3>" + chainsJson[i].name + "</h3>"
      );
      const category = $("<ul>");

      // Sub-categories
      for (let j = 0; j < chainsJson[i].categories.length; j++) {
        $("<li>")
          .attr("data-category", i)
          .attr("data-value", j)
          .html("<a>" + chainsJson[i].categories[j].name + "</a>")
          .appendTo(category);
      }

      $("#preset-chains .dropdown-menu").append(category);
    }

    $("#preset-chains .dropdown-menu a").on("click", ({ currentTarget }) => {
      const category = parseInt(
        String($(currentTarget).parent().attr("data-category")),
        10
      );
      const value = parseInt(
        String($(currentTarget).parent().attr("data-value")),
        10
      );

      $("#preset-chains .dropdown-menu li.selected").removeClass("selected");
      $(currentTarget).parent().addClass("selected");

      $("#preset-chains-series").text(chainsJson[category].name);
      $("#preset-chains-group").text(
        chainsJson[category].categories[value].name
      );

      this.displaySubCategory(category, value);
    });

    $(document).on(
      "change",
      "#preset-chains-list select",
      ({ currentTarget }) => {
        if ($(currentTarget).prop("selectedIndex") === 0) {
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
        const type = parseInt(String($(currentTarget).attr("data-type")), 10);
        const colors = parseInt(
          String($(currentTarget).attr("data-colors")),
          10
        );
        const length = parseInt(String($(currentTarget).val()), 10);

        sim.field.setChain(
          chainsJson[category].categories[subCategory].types[type].colors[
            colors
          ].chains[length].chain, // Chain
          chainsJson[category].categories[subCategory].fieldWidth ||
            FieldDefaultWidth, // Field width
          chainsJson[category].categories[subCategory].fieldHeight ||
            FieldDefaultHeight, // Field height
          FieldDefaultHiddenRows // Hidden rows (It's always 1 with these chains)
        );

        sim.simulation.puyoToClear =
          chainsJson[category].categories[subCategory].puyoToClear ||
          SimulationDefaultPuyoToClear;
        $("#puyo-to-clear").val(sim.simulation.puyoToClear);

        $(currentTarget).prop("selectedIndex", 0);
      }
    );

    $(
      "#preset-chains .dropdown-menu li[data-category='0'][data-value='1'] a"
    ).trigger("click");
  }

  displaySubCategory(category: number, subCategory: number) {
    $("#preset-chains-list").empty(); // Empty the list so we can put new stuff in it

    // Chain types
    for (
      let i = 0;
      i < chainsJson[category].categories[subCategory].types.length;
      i++
    ) {
      const row = $("<dl>");
      const dd = $("<dd>");

      // Name of the chain type
      $("<dt>")
        .text(chainsJson[category].categories[subCategory].types[i].name)
        .appendTo(row);

      // Select boxes for each color
      for (
        let j = 0;
        j <
        chainsJson[category].categories[subCategory].types[i].colors.length;
        j++
      ) {
        const select = $("<select>")
          .attr("data-type", i)
          .attr("data-colors", j);

        // Add color amount as the first index
        $("<option>")
          .text(
            chainsJson[category].categories[subCategory].types[i].colors[j]
              .amount + " Col"
          )
          .appendTo(select);

        // Add the list of chains
        for (
          let k = 0;
          k <
          chainsJson[category].categories[subCategory].types[i].colors[j]
            .chains.length;
          k++
        ) {
          $("<option>")
            .attr("value", k)
            .text(
              chainsJson[category].categories[subCategory].types[i].colors[j]
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
