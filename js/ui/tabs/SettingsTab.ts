import $ from "jquery";
import { PuyoSim } from "../../PuyoSim";
import { content } from "../../data/content";

export class SettingsTab {
  constructor(readonly sim: PuyoSim) {}

  init() {
    const self = this;

    // Initalizes this tab
    // Animation
    $("#animate-puyo") // Puyo animation
      .click(function () {
        const checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.puyo = checked;
        localStorage.setItem("chainsim.animate.puyo", checked ? "yes" : "no");

        // See if we need to enable or disable the animation
        if (
          checked &&
          !self.sim.puyoDisplay.puyoAnimation.running &&
          self.sim.puyoDisplay.puyoSkin.frames !== undefined &&
          self.sim.puyoDisplay.puyoSkin.frames > 0
        ) {
          self.sim.puyoDisplay.puyoAnimation.start(
            self.sim.puyoDisplay.puyoSkin.frames
          );
        } else if (!checked && self.sim.puyoDisplay.puyoAnimation.running) {
          self.sim.puyoDisplay.puyoAnimation.stop();
        }
      })
      .prop("checked", self.sim.puyoDisplay.animate.puyo);

    $("#animate-sun-puyo") // Sun Puyo animation
      .click(function () {
        const checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.sunPuyo = checked;
        localStorage.setItem(
          "chainsim.animate.sunPuyo",
          checked ? "yes" : "no"
        );

        // See if we need to enable or disable the animation
        if (checked && !self.sim.puyoDisplay.sunPuyoAnimation.running) {
          self.sim.puyoDisplay.sunPuyoAnimation.start();
        } else if (!checked && self.sim.puyoDisplay.sunPuyoAnimation.running) {
          self.sim.puyoDisplay.sunPuyoAnimation.stop();
        }
      })
      .prop("checked", this.sim.puyoDisplay.animate.sunPuyo);

    $("#animate-nuisance-tray") // Nuisance Tray animation
      .click(function () {
        const checked = $(this).prop("checked");

        self.sim.puyoDisplay.animate.nuisanceTray = checked;
        localStorage.setItem(
          "chainsim.animate.nuisanceTray",
          checked ? "yes" : "no"
        );
      })
      .prop("checked", this.sim.puyoDisplay.animate.puyo);

    // Field Style
    $("#field-style")
      .change(function () {
        $(this).prop("disabled", true);
        self.sim.fieldDisplay.load(String($(this).val()));
        localStorage.setItem("chainsim.fieldStyle", String($(this).val()));
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
        "<h3>" +
          content.Field.EyeCandy.CharacterBackgrounds[i].name +
          "</h3>"
      );
      const category = $("<ul>");

      // Loop through each of the powers in the category
      for (
        let j = 0;
        j <
        content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds.length;
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

    $("#character-background .dropdown-menu a").click(function () {
      // TODO: remove usages of this
      const category = parseInt($(this).parent().attr("data-category")!, 10);
      const value = parseInt($(this).parent().attr("data-value")!, 10);
      const id = parseInt($(this).parent().attr("data-id")!, 10);

      $("#character-background .dropdown-menu li.selected").removeClass(
        "selected"
      );
      $(this).parent().addClass("selected");

      if (self.sim.fieldDisplay.fieldContent === content.Field.EyeCandy) {
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
    });
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
          ).attr("data-category")!,
          10
        ) || 0;
      boardBackgroundValue =
        parseInt(
          $(
            `#character-background .dropdown-menu li[data-id='${boardBackgroundId}']`
          ).attr("data-value")!,
          10
        ) || 0;
    }

    $("#character-background-game").text(
      content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory]
        .name
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

    $.each(this.sim.puyoDisplay.puyoSkins, (i, value) => {
      $("<li>")
        .attr("data-value", value.id)
        .append(
          $("<a>").append(
            $("<span>")
              .addClass("puyo-skin")
              .css(
                "background-position",
                "0px -" + i * this.sim.puyoDisplay.puyoSize + "px"
              )
          )
        )
        .appendTo("#puyo-skins .dropdown-menu");
    });

    $("#puyo-skins .dropdown-menu a").click(function () {
      $("#puyo-skins li.selected").removeClass("selected");
      $($(this).parent()).addClass("selected");

      self.sim.puyoDisplay.setPuyoSkin($(this).parent().attr("data-value")!);
      localStorage.setItem(
        "chainsim.puyoSkin",
        $(this).parent().attr("data-value")!
      );

      $("#puyo-skins .dropdown-toggle .puyo-skin").css(
        "background-position",
        "0px -" +
          self.sim.puyoDisplay.getSkinIndex(self.sim.puyoDisplay.puyoSkin.id) *
            self.sim.puyoDisplay.puyoSize +
          "px"
      );
    });
    $(
      "#puyo-skins li[data-value='" + this.sim.puyoDisplay.puyoSkin.id + "']"
    ).addClass("selected");
    $("#puyo-skins .dropdown-toggle .puyo-skin").css(
      "background-position",
      "0px -" +
        this.sim.puyoDisplay.getSkinIndex(this.sim.puyoDisplay.puyoSkin.id) *
          this.sim.puyoDisplay.puyoSize +
        "px"
    );
  }
}
