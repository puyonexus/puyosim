import $ from "jquery";
import { h, Component } from "preact";
import { PuyoSim } from "../../PuyoSim";
import { content } from "../../data/content";

interface Props {
  sim: PuyoSim;
  active: boolean;
}

export class SettingsTab extends Component<Props> {
  render() {
    return (
      <div id="tab-settings" className={this.props.active ? "tab-content content-active" : "tab-content"}>
        <dl>
          <dt>Animation</dt>
          <dd>
            <label className="checkbox">
              <input type="checkbox" id="animate-puyo" />
              Puyo
            </label>
            <label className="checkbox">
              <input type="checkbox" id="animate-sun-puyo" />
              Sun Puyo
            </label>
            <label className="checkbox">
              <input type="checkbox" id="animate-nuisance-tray" />
              Garbage Tray
            </label>
          </dd>
        </dl>
        <dl>
          <dt>Board Style</dt>
          <dd>
            <select id="field-style">
              <option value="basic">Basic</option>
              <option value="standard" selected>
                Standard
              </option>
              <option value="eyecandy">Eye Candy</option>
            </select>
          </dd>
        </dl>
        <dl>
          <dt>
            Board Background
            <br />
            (Eye Candy)
          </dt>
          <dd id="character-background-outer">
            <div id="character-background" className="dropdown">
              <button
                className="dropdown-toggle dropdown-toggle-block"
                data-toggle="dropdown"
              >
                <div className="dropdown-toggle-inner">
                  <strong>
                    <span id="character-background-game"></span>
                  </strong>
                  <br />
                  <span id="character-background-character"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <div className="dropdown-menu" role="menu"></div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>Puyo Skin</dt>
          <dd>
            <div id="puyo-skins" className="dropdown">
              <button className="dropdown-toggle" data-toggle="dropdown">
                <div className="dropdown-toggle-inner">
                  <span className="puyo-skin"></span>
                  <span className="caret"></span>
                </div>
              </button>
              <ul className="dropdown-menu" role="menu"></ul>
            </div>
          </dd>
        </dl>
      </div>
    );
  }

  componentDidMount() {
    Promise.resolve().then(() => this.initLegacy());
  }

  initLegacy() {
    const { sim } = this.props;

    // Initalizes this tab
    // Animation
    $("#animate-puyo") // Puyo animation
      .on("click", ({ currentTarget }) => {
        const checked = $(currentTarget).prop("checked");

        sim.puyoDisplay.animate.puyo = checked;
        localStorage.setItem("chainsim.animate.puyo", checked ? "yes" : "no");

        // See if we need to enable or disable the animation
        if (
          checked &&
          !sim.puyoDisplay.puyoAnimation.running &&
          sim.puyoDisplay.puyoSkin.frames !== undefined &&
          sim.puyoDisplay.puyoSkin.frames > 0
        ) {
          sim.puyoDisplay.puyoAnimation.start(
            sim.puyoDisplay.puyoSkin.frames
          );
        } else if (!checked && sim.puyoDisplay.puyoAnimation.running) {
          sim.puyoDisplay.puyoAnimation.stop();
        }
      })
      .prop("checked", sim.puyoDisplay.animate.puyo);

    $("#animate-sun-puyo") // Sun Puyo animation
      .on("click", ({ currentTarget }) => {
        const checked = $(currentTarget).prop("checked");

        sim.puyoDisplay.animate.sunPuyo = checked;
        localStorage.setItem(
          "chainsim.animate.sunPuyo",
          checked ? "yes" : "no"
        );

        // See if we need to enable or disable the animation
        if (checked && !sim.puyoDisplay.sunPuyoAnimation.running) {
          sim.puyoDisplay.sunPuyoAnimation.start();
        } else if (!checked && sim.puyoDisplay.sunPuyoAnimation.running) {
          sim.puyoDisplay.sunPuyoAnimation.stop();
        }
      })
      .prop("checked", sim.puyoDisplay.animate.sunPuyo);

    $("#animate-nuisance-tray") // Nuisance Tray animation
      .on("click", ({ currentTarget }) => {
        const checked = $(currentTarget).prop("checked");

        sim.puyoDisplay.animate.nuisanceTray = checked;
        localStorage.setItem(
          "chainsim.animate.nuisanceTray",
          checked ? "yes" : "no"
        );
      })
      .prop("checked", sim.puyoDisplay.animate.puyo);

    // Field Style
    $("#field-style")
      .on("change", ({ currentTarget }) => {
        $(currentTarget).prop("disabled", true);
        sim.fieldDisplay.load(String($(currentTarget).val()));
        localStorage.setItem(
          "chainsim.fieldStyle",
          String($(currentTarget).val())
        );
      })
      .val(localStorage.getItem("chainsim.fieldStyle") || "standard"); // Default to Standard

    // Character Background
    // Loop through each of the backgrounds
    let index = 0;
    for (
      let i = 0;
      i < content.Field.EyeCandy.CharacterBackgrounds.length;
      i++
    ) {
      $("#character-background .dropdown-menu").append(
        "<h3>" + content.Field.EyeCandy.CharacterBackgrounds[i].name + "</h3>"
      );
      const category = $("<ul>");

      // Loop through each of the powers in the category
      for (
        let j = 0;
        j < content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds.length;
        j++
      ) {
        $("<li>")
          .attr("data-category", i)
          .attr("data-value", j)
          .attr("data-id", index)
          .html(
            "<a>" +
              content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds[j] +
              "</a>"
          )
          .appendTo(category);
        index++;
      }

      $("#character-background .dropdown-menu").append(category);
    }

    $("#character-background .dropdown-menu a").on(
      "click",
      ({ currentTarget }) => {
        const category = parseInt(
          $(currentTarget).parent().attr("data-category") || "",
          10
        );
        const value = parseInt(
          $(currentTarget).parent().attr("data-value") || "",
          10
        );
        const id = parseInt(
          $(currentTarget).parent().attr("data-id") || "",
          10
        );

        $("#character-background .dropdown-menu li.selected").removeClass(
          "selected"
        );
        $(currentTarget).parent().addClass("selected");

        if (sim.fieldContent === content.Field.EyeCandy) {
          if (id === 0) {
            $("#field-bg-2").css(
              "background-image",
              "url('/images/eyecandy/field_char_bg/" +
                content.Field.EyeCandy.CharaBGs[
                  Math.floor(
                    Math.random() * content.Field.EyeCandy.CharaBGs.length
                  )
                ] +
                "')"
            );
          } else {
            $("#field-bg-2").css(
              "background-image",
              "url('/images/eyecandy/field_char_bg/" +
                content.Field.EyeCandy.CharaBGs[id - 1] +
                "')"
            );
          }
        }

        $("#character-background-game").text(
          content.Field.EyeCandy.CharacterBackgrounds[category].name
        );
        $("#character-background-character").text(
          content.Field.EyeCandy.CharacterBackgrounds[category].backgrounds[
            value
          ]
        );

        localStorage.setItem("chainsim.boardBackgroundId", String(id));
      }
    );
    const boardBackgroundId = localStorage.getItem(
      "chainsim.boardBackgroundId"
    );
    let boardBackgroundCategory = 0;
    let boardBackgroundValue = 0;
    if (boardBackgroundId !== null) {
      boardBackgroundCategory =
        parseInt(
          $(
            `#character-background .dropdown-menu li[data-id='${boardBackgroundId}']`
          ).attr("data-category") || "",
          10
        ) || 0;
      boardBackgroundValue =
        parseInt(
          $(
            `#character-background .dropdown-menu li[data-id='${boardBackgroundId}']`
          ).attr("data-value") || "",
          10
        ) || 0;
    }

    $("#character-background-game").text(
      content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory].name
    );
    $("#character-background-character").text(
      content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory]
        .backgrounds[boardBackgroundValue]
    );
    $(
      "#character-background .dropdown-menu li[data-id='" +
        boardBackgroundId +
        "']"
    ).addClass("selected");

    $.each(sim.puyoDisplay.puyoSkins, (i, value) => {
      $("<li>")
        .attr("data-value", value.id)
        .append(
          $("<a>").append(
            $("<span>")
              .addClass("puyo-skin")
              .css(
                "background-position",
                "0px -" + i * sim.puyoDisplay.puyoSize + "px"
              )
          )
        )
        .appendTo("#puyo-skins .dropdown-menu");
    });

    $("#puyo-skins .dropdown-menu a").on("click", ({ currentTarget }) => {
      $("#puyo-skins li.selected").removeClass("selected");
      $($(currentTarget).parent()).addClass("selected");

      sim.puyoDisplay.setPuyoSkin(
        $(currentTarget).parent().attr("data-value") || ""
      );
      localStorage.setItem(
        "chainsim.puyoSkin",
        $(currentTarget).parent().attr("data-value") || ""
      );

      $("#puyo-skins .dropdown-toggle .puyo-skin").css(
        "background-position",
        "0px -" +
          sim.puyoDisplay.getSkinIndex(sim.puyoDisplay.puyoSkin.id) *
            sim.puyoDisplay.puyoSize +
          "px"
      );
    });
    $(
      "#puyo-skins li[data-value='" + sim.puyoDisplay.puyoSkin.id + "']"
    ).addClass("selected");
    $("#puyo-skins .dropdown-toggle .puyo-skin").css(
      "background-position",
      "0px -" +
        sim.puyoDisplay.getSkinIndex(sim.puyoDisplay.puyoSkin.id) *
          sim.puyoDisplay.puyoSize +
        "px"
    );
  }
}
