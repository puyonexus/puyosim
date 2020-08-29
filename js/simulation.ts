/*
 * Simulation
 *
 * The *heart* of the simulator. Controls the simulation aspect of it (aka it runs it)
 */

import $ from "jquery";
import { Constants } from "./constants";
import { ControlsDisplay } from "./controlsdisplay";
import { PuyoDisplay } from "./puyodisplay";
import { FieldMap } from "./fieldmap";
import { Field } from "./field";

export const Simulation = {
  running: false, // Simulator is running
  paused: false, // Simulator is paused
  stepMode: false, // Simulator is in step mode
  skipMode: false, // Simulator is in skip mode (skips right to the end of the chain)
  action: -1, // Current action
  timer: undefined as number|undefined, // The simulation timer

  score: 0, // Score
  chains: 0, // Chains
  nuisance: 0, // Nuisance
  cleared: [] as number[], // How many puyos are cleared in each chain

  leftoverNuisance: 0, // Leftover nuisance puyo
  prevChainPower: 0, // Previous chain power

  colorBonus: [
    [0, 3, 6, 12, 24],
    [0, 2, 4, 8, 16],
  ], // Color bonuses (Classic, Fever)
  groupBonus: [
    [0, 2, 3, 4, 5, 6, 7, 10],
    [0, 1, 2, 3, 4, 5, 6, 8],
  ], // Group bonuses (Classic, Fever)

  positions: [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ], // Positions around us
  chainPowers: [
    0,
    8,
    16,
    32,
    64,
    96,
    128,
    160,
    192,
    224,
    256,
    288, // Default chain power
    320,
    352,
    384,
    416,
    448,
    480,
    512,
    544,
    576,
    608,
    640,
    672,
  ],
  chainPowerInc: 0, // Chain power increment
  puyoToClear: Constants.Simulation.DefaultPuyoToClear, // Puyo To Clear (Default = 4)
  pointPuyoBonus: Constants.Simulation.DefaultPointPuyoBonus, // Point Puyo Bonus (Default = 50)
  targetPoints: Constants.Simulation.DefaultTargetPoints, // Target Points (Default = 70)
  speed: Constants.Simulation.DefaultSpeed, // Speed that the simulator runs at (lower = faster; Default = 500)
  scoreMode: 0, // Score Mode (0 = Classic, 1 = Fever)

  back: function () {
    // Stops the chain
    // Reset all variables
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.running = false;
    this.paused = false;
    this.stepMode = false;
    this.skipMode = false;
    this.action = -1;

    this.chains = 0;
    this.score = 0;
    this.nuisance = 0;
    this.cleared = [];
    this.leftoverNuisance = 0;
    this.prevChainPower = 0;

    $("#field-chains").text(this.chains);
    $("#field-score").text(this.score);
    $("#field-nuisance").text(this.nuisance);
    $("#field-cleared").text("0");

    PuyoDisplay.renderer!.drawNuisanceTray(this.nuisance);

    // Display the "editor" chain on the puyo display and set the simulation buttons
    ControlsDisplay.toggleSimulationButtons(false, true, false, true, true);
    $(
      "#tab-simulator input, #tab-simulator select, #tab-simulator button"
    ).prop("disabled", false); // Disable simulator options

    Field.map = Field.mapEditor;
    for (var y = 0; y < Field.totalHeight; y++) {
      for (var x = 0; x < Field.width; x++) {
        PuyoDisplay.renderer!.drawPuyo(x, y, Field.map!.get(x, y));
      }
    }
  },

  start: function () {
    // Starts the chain
    if (!this.running) {
      ControlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      Field.mapSimulation = new FieldMap(
        Field.width,
        Field.totalHeight,
        Field.mapEditor
      );
      Field.map = Field.mapSimulation;

      // Check to see if the puyo can fall and go from there
      this.action = 0;

      if (!this.dropPuyo()) {
        // No puyo dropped, start chaining
        this.chain();
      } else {
        // Puyo dropped, delay chaining
        var self = this;
        this.timer = window.setTimeout(function () {
          self.chain();
        }, this.speed);
      }
    } else if (this.running && (this.paused || this.stepMode)) {
      ControlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = false;

      this.chain();
    }
  },

  pause: function () {
    // Pauses the chain
    if (this.running && !this.paused && !this.stepMode && !this.skipMode) {
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }

      this.paused = true;

      ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
    }
  },

  step: function () {
    // Advances a step in the chain
    if (!this.running) {
      ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      this.stepMode = true;
      Field.mapSimulation = new FieldMap(
        Field.width,
        Field.totalHeight,
        Field.mapEditor
      );
      Field.map = Field.mapSimulation;

      // Check to see if the puyo can fall and go from there
      this.action = 0;
      if (!this.dropPuyo()) {
        // No puyo dropped, start chaining
        this.chain();
      }
    } else if (this.running && !this.skipMode && this.action !== -1) {
      ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = true;

      this.chain();
    }
  },

  skip: function () {
    // Skips right to the end of the chain
    if (!this.running) {
      ControlsDisplay.toggleSimulationButtons(true, false, false, false, false); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      this.skipMode = true;
      Field.mapSimulation = new FieldMap(
        Field.width,
        Field.totalHeight,
        Field.mapEditor
      );
      Field.map = Field.mapSimulation;

      // Drop the puyo and start chaining
      this.action = 0;
      this.dropPuyo();
      this.chain();
    } else if (this.running && !this.skipMode && this.action !== -1) {
      ControlsDisplay.toggleSimulationButtons(true, false, false, false, false); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = false;
      this.skipMode = true;

      this.chain();
    }
  },

  chain: function () {
    // This preforms the chain
    var self = this, // References to this object
      i,
      j,
      x,
      y; // Loop variables

    if (this.action === 0) {
      // Preform the chain
      var check: boolean[][] = [], // "Check" array (will be filled in right after this)
        chainMade = false, // Indiciates if a chain has been made
        puyoCleared = 0, // Number of puyo that were cleared in the chain
        pointPuyoCleared = 0, // Number of point puyo cleared
        sunPuyoCleared = 0, // Number of sun puyo cleared
        groups: number[][] = [[], [], [], [], []]; // Groups to sort the colors

      // Create the "check" array
      for (x = 0; x < Field.width; x++) {
        check[x] = [];
        for (y = 0; y < Field.totalHeight; y++) {
          check[x][y] = false;
        }
      }

      // Check to see which puyo have been cleared
      for (y = Field.hiddenRows; y < Field.totalHeight; y++) {
        // Don't check the hidden row
        for (x = 0; x < Field.width; x++) {
          if (!check[x][y] && Field.map!.get(x, y).isColored()) {
            // Is a colored puyo
            var cleared = 1, // Amount of puyo cleared
              checked = 1, // Amount of puyo checked
              puyo = Field.map!.puyo(x, y), // Puyo currently being checked
              list = [{ x: x, y: y }], // List of puyo to clear
              pos,
              checkX,
              checkY;

            check[x][y] = true;

            while (checked <= cleared) {
              pos = list[checked - 1];
              // Check the puyo to see if we can make a chain
              for (i = 0; i < 4; i++) {
                // Check for out of bounds
                if (this.positions[i].y === -1 && pos.y <= Field.hiddenRows)
                  continue;
                if (this.positions[i].x === -1 && pos.x <= 0) continue;
                if (this.positions[i].y === 1 && pos.y >= Field.totalHeight - 1)
                  continue;
                if (this.positions[i].x === 1 && pos.x >= Field.width - 1)
                  continue;

                // Check to see if the puyo match
                checkX = pos.x + this.positions[i].x; // Shortcuts
                checkY = pos.y + this.positions[i].y; // Shortcuts
                if (
                  !check[checkX][checkY] &&
                  Field.map!.puyo(checkX, checkY) === puyo
                ) {
                  cleared++;
                  check[checkX][checkY] = true;
                  list.push({ x: checkX, y: checkY });
                }
              }

              checked++;
            }

            if (cleared >= this.puyoToClear) {
              // A chain was made
              chainMade = true;
              puyoCleared += cleared;

              // Add the erased puyo to the group list
              switch (puyo) {
                case Constants.Puyo.Red:
                  groups[0].push(cleared);
                  break;
                case Constants.Puyo.Green:
                  groups[1].push(cleared);
                  break;
                case Constants.Puyo.Blue:
                  groups[2].push(cleared);
                  break;
                case Constants.Puyo.Yellow:
                  groups[3].push(cleared);
                  break;
                case Constants.Puyo.Purple:
                  groups[4].push(cleared);
                  break;
              }

              for (i = 0; i < cleared; i++) {
                // Set the cleared sprite for the cleared puyo
                pos = list[i];
                switch (Field.map!.puyo(pos.x, pos.y)) {
                  case Constants.Puyo.Red:
                    Field.map!.set(pos.x, pos.y, Constants.Puyo.Cleared.Red);
                    break;
                  case Constants.Puyo.Green:
                    Field.map!.set(pos.x, pos.y, Constants.Puyo.Cleared.Green);
                    break;
                  case Constants.Puyo.Blue:
                    Field.map!.set(pos.x, pos.y, Constants.Puyo.Cleared.Blue);
                    break;
                  case Constants.Puyo.Yellow:
                    Field.map!.set(pos.x, pos.y, Constants.Puyo.Cleared.Yellow);
                    break;
                  case Constants.Puyo.Purple:
                    Field.map!.set(pos.x, pos.y, Constants.Puyo.Cleared.Purple);
                    break;
                }

                // Check the nuisance/point/hard puyo around the current puyo
                for (j = 0; j < 4; j++) {
                  // Check for out of bounds
                  if (this.positions[j].y === -1 && pos.y <= Field.hiddenRows)
                    continue;
                  if (this.positions[j].x === -1 && pos.x <= 0) continue;
                  if (
                    this.positions[j].y === 1 &&
                    pos.y >= Field.totalHeight - 1
                  )
                    continue;
                  if (this.positions[j].x === 1 && pos.x >= Field.width - 1)
                    continue;

                  // Check to see if the puyo match
                  checkX = pos.x + this.positions[j].x; // Shortcuts
                  checkY = pos.y + this.positions[j].y; // Shortcuts
                  if (
                    Field.map!.puyo(checkX, checkY) === Constants.Puyo.Nuisance
                  ) {
                    // Nuisance Puyo
                    Field.map!.set(
                      checkX,
                      checkY,
                      Constants.Puyo.Cleared.Nuisance
                    );
                  } else if (
                    Field.map!.puyo(checkX, checkY) === Constants.Puyo.Point
                  ) {
                    // Point Puyo
                    Field.map!.set(checkX, checkY, Constants.Puyo.Cleared.Point);
                    pointPuyoCleared++;
                  } else if (
                    Field.map!.puyo(checkX, checkY) === Constants.Puyo.Sun
                  ) {
                    // Sun Puyo
                    Field.map!.set(checkX, checkY, Constants.Puyo.Cleared.Sun);
                    sunPuyoCleared++;
                  } else if (
                    Field.map!.puyo(checkX, checkY) === Constants.Puyo.Hard
                  ) {
                    // Hard Puyo
                    Field.map!.set(checkX, checkY, Constants.Puyo.Nuisance);
                  }
                }
              }
            }
          }
        }
      }

      if (chainMade) {
        // Has a chain been made?
        // Calculate the clear bonus (whhich requires it's own function)
        var clearBonus = (function (groups, self) {
          var clearBonus = 0, // Clear Bonus
            colors = 0, // Colors erased
            total = 0; // Amount of groups erased

          for (var color = 0; color < groups.length; color++) {
            // Loop through all the colors.
            if (groups[color].length > 0) colors++;
            for (var i = 0; i < groups[color].length; i++) {
              // Loop through all the groups
              total++;

              // Add the group bonus
              // When Puyo to clear is < 4, we have to use the value at (Puyo in group - puyo to clear)
              // When Puyo to clear is >= 4, we have to use the value at (Puyo in group - 4)
              var puyoOffset = Math.min(4, self.puyoToClear);
              if (groups[color][i] > 6 + puyoOffset) {
                clearBonus += self.groupBonus[self.scoreMode][7];
              } else {
                clearBonus +=
                  self.groupBonus[self.scoreMode][
                    groups[color][i] - puyoOffset
                  ];
              }
            }
          }

          clearBonus += self.colorBonus[self.scoreMode][colors - 1]; // Add the color bonus

          // Add the chain power now
          var power = 0;
          if (self.chains >= self.chainPowers.length) {
            power = self.prevChainPower + self.chainPowerInc;
          } else {
            power = self.chainPowers[self.chains];
          }

          self.prevChainPower = power;
          clearBonus += power;

          clearBonus = Math.min(Math.max(clearBonus, 1), 999); // Limit the clear bonus to between 1 to 999.

          return clearBonus;
        })(groups, this);

        // Calculate the scoring
        var bonus = puyoCleared * 10 * clearBonus;
        bonus += pointPuyoCleared * this.pointPuyoBonus;

        this.chains++;
        this.score += bonus;

        // Store how many puyos are cleared in this chain
        this.cleared.push(puyoCleared);

        var nuisanceCalculated =
          bonus / this.targetPoints + this.leftoverNuisance; // Calculate nuisance
        this.nuisance += Math.floor(nuisanceCalculated); // Round down and add to nuisance
        this.leftoverNuisance = nuisanceCalculated % 1; // Save leftover nuisance for the next chain

        if (sunPuyoCleared > 0) {
          // If we cleared any sun puyo, we need to add nuisance
          if (this.chains === 1) {
            this.nuisance += 3 * sunPuyoCleared;
          } else {
            this.nuisance += 6 * (this.chains - 1) * sunPuyoCleared;
          }
        }

        // Now that we did that, move onto the next action
        this.action = 1;

        if (this.skipMode) {
          // If we are in skip mode, move directly onto the next step of the chain
          this.chain();
        } else {
          $("#field-chains").text(this.chains);
          $("#field-score").text(
            puyoCleared * 10 +
              pointPuyoCleared * this.pointPuyoBonus +
              " x " +
              clearBonus
          );
          $("#field-nuisance").text(this.nuisance);
          var clearedChain = this.cleared
            .map(function (i) {
              return i.toString();
            })
            .join(", ");
          var clearedTotal = this.cleared.reduce(function (a, b) {
            return a + b;
          });
          $("#field-cleared").text(clearedChain + " (" + clearedTotal + ")");

          PuyoDisplay.renderer!.drawNuisanceTray(this.nuisance);

          if (!this.stepMode) {
            // Set the timer if we aren't in step mode
            this.timer = window.setTimeout(function () {
              self.chain();
            }, this.speed);
          }
        }
      } else {
        // No chain was made, stop the chain.
        this.action = -1;

        if (this.skipMode) {
          // If we are in skip mode, stop
          for (y = 0; y < Field.totalHeight; y++) {
            for (x = 0; x < Field.width; x++) {
              PuyoDisplay.renderer!.drawPuyo(x, y, Field.map!.get(x, y));
            }
          }

          $("#field-chains").text(this.chains);
          $("#field-score").text(this.score);
          $("#field-nuisance").text(this.nuisance);
          var clearedChain = this.cleared
            .map(function (i) {
              return i.toString();
            })
            .join(", ");
          var clearedTotal = this.cleared.reduce(function (a, b) {
            return a + b;
          });
          $("#field-cleared").text(clearedChain + " (" + clearedTotal + ")");

          PuyoDisplay.renderer!.drawNuisanceTray(this.nuisance);
        } else {
          // Just toggle the buttons
          ControlsDisplay.toggleSimulationButtons(
            true,
            false,
            false,
            false,
            false
          );
        }
      }
    } else if (this.action === 1) {
      // Erase & drop puyo
      $("#field-score").text(this.score); // Set the score to it's real value now

      // Remove any cleared puyo
      for (y = Field.hiddenRows; y < Field.totalHeight; y++) {
        // Can start at 1 since you can't clear puyo in the hidden row
        for (x = 0; x < Field.width; x++) {
          if (Field.map!.get(x, y).isCleared()) {
            Field.map!.set(x, y, Constants.Puyo.None);
          }
        }
      }

      // Drop the puyo and see if we can continue the chain
      if (this.dropPuyo()) {
        // Puyo dropped, continue with the chain
        this.action = 0;

        if (this.skipMode) {
          // If we are in skip mode, move directly onto the next step of the chain
          this.chain();
        } else if (!this.stepMode) {
          // Set the timer if we aren't in step mode
          this.timer = window.setTimeout(function () {
            self.chain();
          }, this.speed);
        }
      } else {
        // No puyo dropped, stop the chain
        this.action = -1;

        if (this.skipMode) {
          // If we are in skip mode, stop
          for (y = 0; y < Field.totalHeight; y++) {
            for (x = 0; x < Field.width; x++) {
              PuyoDisplay.renderer!.drawPuyo(x, y, Field.map!.get(x, y));
            }
          }

          $("#field-chains").text(this.chains);
          $("#field-score").text(this.score);
          $("#field-nuisance").text(this.nuisance);
          var clearedChain = this.cleared
            .map(function (i) {
              return i.toString();
            })
            .join(", ");
          var clearedTotal = this.cleared.reduce(function (a, b) {
            return a + b;
          });
          $("#field-cleared").text(clearedChain + " (" + clearedTotal + ")");

          PuyoDisplay.renderer!.drawNuisanceTray(this.nuisance);
        } else {
          // Just toggle the buttons
          ControlsDisplay.toggleSimulationButtons(
            true,
            false,
            false,
            false,
            false
          );
        }
      }
    }
  },

  dropPuyo: function () {
    // Makes the puyo fall in place and returns if any puyo changed position
    var dropped = false;

    for (var x = 0; x < Field.width; x++) {
      for (var y = Field.totalHeight - 2; y >= 0; y--) {
        // No need to check the bottom row
        if (
          Field.map!.puyo(x, y) !== Constants.Puyo.None &&
          Field.map!.puyo(x, y) !== Constants.Puyo.Block &&
          Field.map!.puyo(x, y + 1) === Constants.Puyo.None
        ) {
          // There's an empty space below this puyo!
          dropped = true;

          var y2 = y;
          while (
            y2 < Field.totalHeight - 1 &&
            Field.map!.puyo(x, y2 + 1) === Constants.Puyo.None
          ) {
            y2++;
          }

          Field.map!.set(x, y2, Field.map!.puyo(x, y));
          Field.map!.set(x, y, Constants.Puyo.None);
        }
      }
    }

    return dropped;
  },
};
