/*
 * Simulation
 *
 * The *heart* of the simulator. Controls the simulation aspect of it (aka it runs it)
 */

import $ from "jquery";
import { PuyoType, SimulationDefaultPuyoToClear, SimulationDefaultPointPuyoBonus, SimulationDefaultTargetPoints, SimulationDefaultSpeed } from "./constants";
import { FieldMap } from "./fieldmap";
import { PuyoSim } from "./puyosim";

export class Simulation {
  // Simulator is running
  running = false;

  // Simulator is paused
  paused = false;

  // Simulator is in step mode
  stepMode = false;

  // Simulator is in skip mode (skips right to the end of the chain)
  skipMode = false;

  // Current action
  action = -1;

  // The simulation timer
  timer?: number;

  // Score
  score = 0;

  // Chains
  chains = 0;

  // Nuisance
  nuisance = 0;

  // How many puyos are cleared in each chain
  cleared: number[] = [];

  // Leftover nuisance puyo
  leftoverNuisance = 0;

  // Previous chain power
  prevChainPower = 0;

  // Color bonuses (Classic, Fever)
  colorBonus = [
    [0, 3, 6, 12, 24],
    [0, 2, 4, 8, 16],
  ];
  
  // Group bonuses (Classic, Fever)
  groupBonus = [
    [0, 2, 3, 4, 5, 6, 7, 10],
    [0, 1, 2, 3, 4, 5, 6, 8],
  ];

  // Positions around us
  positions = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ];

  chainPowers = [
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
  ];

  // Chain power increment
  chainPowerInc = 0;

  // Puyo To Clear (Default = 4)
  puyoToClear = SimulationDefaultPuyoToClear;

  // Point Puyo Bonus (Default = 50)
  pointPuyoBonus = SimulationDefaultPointPuyoBonus;

  // Target Points (Default = 70)
  targetPoints = SimulationDefaultTargetPoints;

  // Speed that the simulator runs at (lower = faster; Default = 500)
  speed = SimulationDefaultSpeed;

  // Score Mode (0 = Classic, 1 = Fever)
  scoreMode = 0;

  constructor(readonly sim: PuyoSim) {}

  back() {
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

    this.sim.puyoDisplay.renderer!.drawNuisanceTray(this.nuisance);

    // Display the "editor" chain on the puyo display and set the simulation buttons
    this.sim.controlsDisplay.toggleSimulationButtons(false, true, false, true, true);
    $(
      "#tab-simulator input, #tab-simulator select, #tab-simulator button"
    ).prop("disabled", false); // Disable simulator options

    this.sim.field.map = this.sim.field.mapEditor;
    for (var y = 0; y < this.sim.field.totalHeight; y++) {
      for (var x = 0; x < this.sim.field.width; x++) {
        this.sim.puyoDisplay.renderer!.drawPuyo(x, y, this.sim.field.map!.get(x, y));
      }
    }
  }

  start() {
    // Starts the chain
    if (!this.running) {
      this.sim.controlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      this.sim.field.mapSimulation = new FieldMap(
        this.sim,
        this.sim.field.width,
        this.sim.field.totalHeight,
        this.sim.field.mapEditor
      );
      this.sim.field.map = this.sim.field.mapSimulation;

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
      this.sim.controlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = false;

      this.chain();
    }
  }

  pause() {
    // Pauses the chain
    if (this.running && !this.paused && !this.stepMode && !this.skipMode) {
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }

      this.paused = true;

      this.sim.controlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
    }
  }

  step() {
    // Advances a step in the chain
    if (!this.running) {
      this.sim.controlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      this.stepMode = true;
      this.sim.field.mapSimulation = new FieldMap(
        this.sim,
        this.sim.field.width,
        this.sim.field.totalHeight,
        this.sim.field.mapEditor
      );
      this.sim.field.map = this.sim.field.mapSimulation;

      // Check to see if the puyo can fall and go from there
      this.action = 0;
      if (!this.dropPuyo()) {
        // No puyo dropped, start chaining
        this.chain();
      }
    } else if (this.running && !this.skipMode && this.action !== -1) {
      this.sim.controlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = true;

      this.chain();
    }
  }

  skip() {
    // Skips right to the end of the chain
    if (!this.running) {
      this.sim.controlsDisplay.toggleSimulationButtons(true, false, false, false, false); // Toggle simulation buttons
      $(
        "#tab-simulator input, #tab-simulator select, #tab-simulator button"
      ).prop("disabled", true); // Disable simulator options

      // Set all variables
      this.running = true;
      this.skipMode = true;
      this.sim.field.mapSimulation = new FieldMap(
        this.sim,
        this.sim.field.width,
        this.sim.field.totalHeight,
        this.sim.field.mapEditor
      );
      this.sim.field.map = this.sim.field.mapSimulation;

      // Drop the puyo and start chaining
      this.action = 0;
      this.dropPuyo();
      this.chain();
    } else if (this.running && !this.skipMode && this.action !== -1) {
      this.sim.controlsDisplay.toggleSimulationButtons(true, false, false, false, false); // Toggle simulation buttons

      this.paused = false;
      this.stepMode = false;
      this.skipMode = true;

      this.chain();
    }
  }

  chain() {
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
      for (x = 0; x < this.sim.field.width; x++) {
        check[x] = [];
        for (y = 0; y < this.sim.field.totalHeight; y++) {
          check[x][y] = false;
        }
      }

      // Check to see which puyo have been cleared
      for (y = this.sim.field.hiddenRows; y < this.sim.field.totalHeight; y++) {
        // Don't check the hidden row
        for (x = 0; x < this.sim.field.width; x++) {
          if (!check[x][y] && this.sim.field.map!.get(x, y).isColored()) {
            // Is a colored puyo
            var cleared = 1, // Amount of puyo cleared
              checked = 1, // Amount of puyo checked
              puyo = this.sim.field.map!.puyo(x, y), // Puyo currently being checked
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
                if (this.positions[i].y === -1 && pos.y <= this.sim.field.hiddenRows)
                  continue;
                if (this.positions[i].x === -1 && pos.x <= 0) continue;
                if (this.positions[i].y === 1 && pos.y >= this.sim.field.totalHeight - 1)
                  continue;
                if (this.positions[i].x === 1 && pos.x >= this.sim.field.width - 1)
                  continue;

                // Check to see if the puyo match
                checkX = pos.x + this.positions[i].x; // Shortcuts
                checkY = pos.y + this.positions[i].y; // Shortcuts
                if (
                  !check[checkX][checkY] &&
                  this.sim.field.map!.puyo(checkX, checkY) === puyo
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
                case PuyoType.Red:
                  groups[0].push(cleared);
                  break;
                case PuyoType.Green:
                  groups[1].push(cleared);
                  break;
                case PuyoType.Blue:
                  groups[2].push(cleared);
                  break;
                case PuyoType.Yellow:
                  groups[3].push(cleared);
                  break;
                case PuyoType.Purple:
                  groups[4].push(cleared);
                  break;
              }

              for (i = 0; i < cleared; i++) {
                // Set the cleared sprite for the cleared puyo
                pos = list[i];
                switch (this.sim.field.map!.puyo(pos.x, pos.y)) {
                  case PuyoType.Red:
                    this.sim.field.map!.set(pos.x, pos.y, PuyoType.ClearedRed);
                    break;
                  case PuyoType.Green:
                    this.sim.field.map!.set(pos.x, pos.y, PuyoType.ClearedGreen);
                    break;
                  case PuyoType.Blue:
                    this.sim.field.map!.set(pos.x, pos.y, PuyoType.ClearedBlue);
                    break;
                  case PuyoType.Yellow:
                    this.sim.field.map!.set(pos.x, pos.y, PuyoType.ClearedYellow);
                    break;
                  case PuyoType.Purple:
                    this.sim.field.map!.set(pos.x, pos.y, PuyoType.ClearedPurple);
                    break;
                }

                // Check the nuisance/point/hard puyo around the current puyo
                for (j = 0; j < 4; j++) {
                  // Check for out of bounds
                  if (this.positions[j].y === -1 && pos.y <= this.sim.field.hiddenRows)
                    continue;
                  if (this.positions[j].x === -1 && pos.x <= 0) continue;
                  if (
                    this.positions[j].y === 1 &&
                    pos.y >= this.sim.field.totalHeight - 1
                  )
                    continue;
                  if (this.positions[j].x === 1 && pos.x >= this.sim.field.width - 1)
                    continue;

                  // Check to see if the puyo match
                  checkX = pos.x + this.positions[j].x; // Shortcuts
                  checkY = pos.y + this.positions[j].y; // Shortcuts
                  if (
                    this.sim.field.map!.puyo(checkX, checkY) === PuyoType.Nuisance
                  ) {
                    // Nuisance Puyo
                    this.sim.field.map!.set(
                      checkX,
                      checkY,
                      PuyoType.ClearedNuisance
                    );
                  } else if (
                    this.sim.field.map!.puyo(checkX, checkY) === PuyoType.Point
                  ) {
                    // Point Puyo
                    this.sim.field.map!.set(checkX, checkY, PuyoType.ClearedPoint);
                    pointPuyoCleared++;
                  } else if (
                    this.sim.field.map!.puyo(checkX, checkY) === PuyoType.Sun
                  ) {
                    // Sun Puyo
                    this.sim.field.map!.set(checkX, checkY, PuyoType.ClearedSun);
                    sunPuyoCleared++;
                  } else if (
                    this.sim.field.map!.puyo(checkX, checkY) === PuyoType.Hard
                  ) {
                    // Hard Puyo
                    this.sim.field.map!.set(checkX, checkY, PuyoType.Nuisance);
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

          this.sim.puyoDisplay.renderer!.drawNuisanceTray(this.nuisance);

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
          for (y = 0; y < this.sim.field.totalHeight; y++) {
            for (x = 0; x < this.sim.field.width; x++) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x, y, this.sim.field.map!.get(x, y));
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

          this.sim.puyoDisplay.renderer!.drawNuisanceTray(this.nuisance);
        } else {
          // Just toggle the buttons
          this.sim.controlsDisplay.toggleSimulationButtons(
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
      for (y = this.sim.field.hiddenRows; y < this.sim.field.totalHeight; y++) {
        // Can start at 1 since you can't clear puyo in the hidden row
        for (x = 0; x < this.sim.field.width; x++) {
          if (this.sim.field.map!.get(x, y).isCleared()) {
            this.sim.field.map!.set(x, y, PuyoType.None);
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
          for (y = 0; y < this.sim.field.totalHeight; y++) {
            for (x = 0; x < this.sim.field.width; x++) {
              this.sim.puyoDisplay.renderer!.drawPuyo(x, y, this.sim.field.map!.get(x, y));
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

          this.sim.puyoDisplay.renderer!.drawNuisanceTray(this.nuisance);
        } else {
          // Just toggle the buttons
          this.sim.controlsDisplay.toggleSimulationButtons(
            true,
            false,
            false,
            false,
            false
          );
        }
      }
    }
  }

  dropPuyo() {
    // Makes the puyo fall in place and returns if any puyo changed position
    var dropped = false;

    for (var x = 0; x < this.sim.field.width; x++) {
      for (var y = this.sim.field.totalHeight - 2; y >= 0; y--) {
        // No need to check the bottom row
        if (
          this.sim.field.map!.puyo(x, y) !== PuyoType.None &&
          this.sim.field.map!.puyo(x, y) !== PuyoType.Block &&
          this.sim.field.map!.puyo(x, y + 1) === PuyoType.None
        ) {
          // There's an empty space below this puyo!
          dropped = true;

          var y2 = y;
          while (
            y2 < this.sim.field.totalHeight - 1 &&
            this.sim.field.map!.puyo(x, y2 + 1) === PuyoType.None
          ) {
            y2++;
          }

          this.sim.field.map!.set(x, y2, this.sim.field.map!.puyo(x, y));
          this.sim.field.map!.set(x, y, PuyoType.None);
        }
      }
    }

    return dropped;
  }
};
