/*
 * Content
 *
 * This contains all the HTML used within the simulator. Unlike v3.x and v4.0, we will
 * be storing all the HTML used in this file rather than seperate XML files.
 */

import $ from "jquery";

export interface IFieldType {
  CSSClass: string;
  StageBGs?: string[];
  CharaBGs?: string[];
  Script?: () => void;
  CharacterBackgrounds?: {
    name: string;
    backgrounds: string[];
  }[];
}

export const content = {
  Field: {
    Basic: <IFieldType>{
      CSSClass: "field-basic",
    },

    Standard: <IFieldType>{
      CSSClass: "field-standard",
    },

    EyeCandy: <IFieldType>{
      CSSClass: "field-eyecandy",

      StageBGs: [
        // Stage Backgrounds
        "pp7/physics_club.png",
        "pp7/classroom.png",
        "pp7/gymnasium.png",
        "pp7/schoolyard.png",
        "pp7/rooftop.png",
        "pp7/shopping_district.png",
        "pp7/fish_store.png",
        "pp7/farmers_market.png",
        "pp7/lottery.png",
        "pp7/station_square.png",
        "pp7/loch_ness.png",
        "pp7/egypt.png",
        "pp7/himalayas.png",
        "pp7/easter_island.png",
        "pp7/area51.png",
        "pp7/bermuda_triangle.png",
        "pp7/stonehenge.png",
        "pp7/magic_school.png",
        "pp7/park.png",
        "pp7/forest.png",
        "pp7/dark_space.png",
        "pp7/sight_of_the_galaxy.png",
      ],

      CharaBGs: [
        // Character Backgrounds
        "black.png",

        "pp15th/amitie.png",
        "pp15th/raffine.png",
        "pp15th/sig.png",
        "pp15th/rider.png",
        "pp15th/klug.png",
        "pp15th/accord.png",
        "pp15th/oshare_bones.png",
        "pp15th/yu.png",
        "pp15th/ocean_prince.png",
        "pp15th/onion_pixy.png",
        "pp15th/dongurigaeru.png",
        "pp15th/lemres.png",
        "pp15th/feli.png",
        "pp15th/baldanders.png",
        "pp15th/akuma.png",
        "pp15th/arle.png",
        "pp15th/nasu_grave.png",
        "pp15th/suketoudara.png",
        "pp15th/zoh.png",
        "pp15th/schezo.png",
        "pp15th/rulue.png",
        "pp15th/satan.png",

        "pp7/ringo.png",
        "pp7/amitie.png",
        "pp7/sig.png",
        "pp7/raffine.png",
        "pp7/klug.png",
        "pp7/lemres.png",
        "pp7/feli.png",
        "pp7/maguro.png",
        "pp7/risukuma.png",
        "pp7/arle.png",
        "pp7/dark_arle.png",
        "pp7/carbuncle.png",
        "pp7/skeleton_t.png",
        "pp7/suketoudara.png",
        "pp7/draco.png",
        "pp7/schezo.png",
        "pp7/rulue.png",
        "pp7/satan.png",
        "pp7/trio.png",
        "pp7/ecolo.png",

        "pp20th/accord.png",
        "pp20th/amitie.png",
        "pp20th/arle.png",
        "pp20th/black_sig.png",
        "pp20th/carbuncle.png",
        "pp20th/dongurigaeru.png",
        "pp20th/draco.png",
        "pp20th/ecolo.png",
        "pp20th/feli.png",
        "pp20th/klug.png",
        "pp20th/lemres.png",
        "pp20th/maguro.png",
        "pp20th/ocean_prince.png",
        "pp20th/onion_pixy.png",
        "pp20th/raffine.png",
        "pp20th/red_amitie.png",
        "pp20th/rider.png",
        "pp20th/ringo.png",
        "pp20th/risukuma.png",
        "pp20th/rulue.png",
        "pp20th/satan.png",
        "pp20th/schezo.png",
        "pp20th/sig.png",
        "pp20th/strange_klug.png",
        "pp20th/suketoudara.png",
        "pp20th/unusual_ecolo.png",
        "pp20th/white_feli.png",
        "pp20th/witch.png",
        "pp20th/yellow_satan.png",
        "pp20th/yu_rei.png",

        "ppt/ai.png",
        "ppt/amitie.png",
        "ppt/arle.png",
        "ppt/draco.png",
        "ppt/ecolo.png",
        "ppt/ess.png",
        "ppt/ex.png",
        "ppt/feli.png",
        "ppt/jay_ellie.png",
        "ppt/klug.png",
        "ppt/lemres.png",
        "ppt/maguro.png",
        "ppt/o.png",
        "ppt/raffine.png",
        "ppt/ringo.png",
        "ppt/risukuma.png",
        "ppt/rulue.png",
        "ppt/satan.png",
        "ppt/schezo.png",
        "ppt/sig.png",
        "ppt/suketoudara.png",
        "ppt/tee.png",
        "ppt/witch.png",
        "ppt/zed.png",
      ],

      Script: function () {
        $("#field-bg-1").css(
          "background-image",
          "url('/images/eyecandy/field_stage_bg/" +
            content.Field.EyeCandy.StageBGs![
              Math.floor(
                Math.random() * content.Field.EyeCandy.StageBGs!.length
              )
            ] +
            "')"
        );

        var boardBackgroundId =
          parseInt(
            localStorage.getItem("chainsim.boardBackgroundId") || "",
            10
          ) || 0;
        if (boardBackgroundId === 0) {
          $("#field-bg-2").css(
            "background-image",
            "url('/images/eyecandy/field_char_bg/" +
              content.Field.EyeCandy.CharaBGs![
                Math.floor(
                  Math.random() * content.Field.EyeCandy.CharaBGs!.length
                )
              ] +
              "')"
          );
        } else {
          $("#field-bg-2").css(
            "background-image",
            "url('/images/eyecandy/field_char_bg/" +
              content.Field.EyeCandy.CharaBGs![boardBackgroundId - 1] +
              "')"
          );
        }
      },

      CharacterBackgrounds: [
        {
          name: "General",
          backgrounds: ["Random", "None"],
        },
        {
          name: "Puyo Puyo!! 15th Anniversary",
          backgrounds: [
            "Amitie",
            "Raffina",
            "Sig",
            "Lidelle",
            "Klug",
            "Ms. Accord",
            "Oshare Bones",
            "Yu & Rei",
            "Ocean Prince",
            "Onion Pixie",
            "Donguri Gaeru",
            "Lemres",
            "Feli",
            "Baldanders",
            "Akuma",
            "Arle",
            "Nasu Grave",
            "Suketoudara",
            "Zoh Daimaoh",
            "Schezo",
            "Rulue",
            "Satan",
          ],
        },
        {
          name: "Puyo Puyo 7",
          backgrounds: [
            "Ringo",
            "Amitie",
            "Sig",
            "Raffina",
            "Klug",
            "Lemres",
            "Feli",
            "Maguro",
            "Risukuma",
            "Arle",
            "Dark Arle",
            "Carbuncle",
            "Skeleton-T",
            "Suketoudara",
            "Draco",
            "Schezo",
            "Rulue",
            "Satan",
            "Trio",
            "Ecolo",
          ],
        },
        {
          name: "Puyo Puyo!! 20th Anniversary",
          backgrounds: [
            "Ms. Accord",
            "Amitie",
            "Arle",
            "Black Sig",
            "Carbuncle",
            "Donguri Gaeru",
            "Draco",
            "Ecolo",
            "Feli",
            "Klug",
            "Lemres",
            "Maguro",
            "Ocean Prince",
            "Onion Pixy",
            "Raffina",
            "Red Amitie",
            "Lidelle",
            "Ringo",
            "Risukuma",
            "Rulue",
            "Satan",
            "Schezo",
            "Sig",
            "Strange Klug",
            "Suketoudara",
            "Unusual Ecolo",
            "White Feli",
            "Witch",
            "Yellow Satan",
            "Yu & Rei",
          ],
        },
        {
          name: "Puyo Puyo Tetris",
          backgrounds: [
            "Ai",
            "Amitie",
            "Arle",
            "Draco",
            "Ecolo",
            "Ess",
            "Ex",
            "Feli",
            "Jay & Elle",
            "Klug",
            "Lemres",
            "Maguro",
            "O",
            "Raffina",
            "Ringo",
            "Risukuma",
            "Rulue",
            "Satan",
            "Schezo",
            "Sig",
            "Suketoudara",
            "Tee",
            "Witch",
            "Zed",
          ],
        },
      ],
    },
  },
};
