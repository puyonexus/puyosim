/*!
 * PuyoSim 4.3.0
 * https://github.com/puyonexus/puyosim/
 */

import './common.js';
import $ from 'jquery';
import Clipboard from 'clipboard';
import {default as attackPowersJson} from './attackPowers.json';
import {default as chainsJson} from './chains.json';
import {default as contentHtml} from './content.html';
window.jQuery = $;
require('bootstrap/js/dropdown.js');

(function () {
"use strict";

/*
 * Constants
 *
 * Contains constants used for the simulator.
 */

var Constants = {};
Constants.Puyo = {
	None:   0,
	Red:    1,
	Green:  2,
	Blue:   3,
	Yellow: 4,
	Purple: 5,

	Nuisance: 6,
	Point:    7,
	Sun:      8,
	Hard:     9,
	Iron:     10,
	Block:    11,

	Delete: 12
};

Constants.Puyo.Cleared = {
	Red:    13,
	Green:  14,
	Blue:   15,
	Yellow: 16,
	Purple: 17,
	
	Nuisance: 18,
	Point:    19,
	Sun:      20
};

Constants.Field = {
	DefaultWidth:      6,
	DefaultHeight:     12,
	DefaultHiddenRows: 1
};

Constants.Simulation = {
	DefaultSpeed:          500,
	DefaultPuyoToClear:    4,
	DefaultTargetPoints:   70,
	DefaultPointPuyoBonus: 50
};

/*
 * Config
 * 
 * Contains configuration values used throughout the simulator
 */
var Config = {
	baseUrl: "https://puyonexus.com/chainsim",
	shareLinkUrl: "/chain/{0}",
	shareImageUrl: "/image/{0}.png",
	shareAnimatedImageUrl: "/image/{0}.gif",
	shareLegacyLinkUrl: "/?{0}",
	shareLegacyImageUrl: "/chainimage.php?{0}",
};

/*
 * Puyo
 *
 * Contains methods dealing with Puyo, which include getting puyo state
 * and URL conversions.
 */
 
function Puyo(p) {
	if (p !== undefined && this.isValid(p)) { // Is this a valid puyo?
		this.puyo = p;
	} else {
		this.puyo = Constants.Puyo.None;
	}
}

Puyo.prototype = {
	isValid: function(p) { // Returns if puyo p is a valid puyo
		return (
			p === Constants.Puyo.Red    || p === Constants.Puyo.Green  || p === Constants.Puyo.Blue ||
			p === Constants.Puyo.Yellow || p === Constants.Puyo.Purple ||

			p === Constants.Puyo.Nuisance || p === Constants.Puyo.Hard  || p === Constants.Puyo.Point ||
			p === Constants.Puyo.Sun      || p === Constants.Puyo.Iron  || p === Constants.Puyo.Block ||
			
			p === Constants.Puyo.Cleared.Red    || p === Constants.Puyo.Cleared.Green  || p === Constants.Puyo.Cleared.Blue ||
			p === Constants.Puyo.Cleared.Yellow || p === Constants.Puyo.Cleared.Purple ||
			
			p === Constants.Puyo.Cleared.Nuisance || p === Constants.Puyo.Cleared.Point ||
			p === Constants.Puyo.Cleared.Sun
		);
	},
	
	isColored: function() { // Returns if puyo is a colored puyo (not nuisance or other type)
		return (
			this.puyo === Constants.Puyo.Red    || this.puyo === Constants.Puyo.Green  || this.puyo === Constants.Puyo.Blue ||
			this.puyo === Constants.Puyo.Yellow || this.puyo === Constants.Puyo.Purple
		);
	},
	
	isNuisance: function() { // Returns if puyo is a nuisance puyo
		return (this.puyo === Constants.Puyo.Nuisance || this.puyo === Constants.Puyo.Hard || this.puyo === Constants.Puyo.Point);
	},
	
	isCleared: function() { // Returns if puyo has been cleared
		return (
			this.puyo === Constants.Puyo.Cleared.Red    || this.puyo === Constants.Puyo.Cleared.Green  || 
			this.puyo === Constants.Puyo.Cleared.Blue   || this.puyo === Constants.Puyo.Cleared.Yellow ||
			this.puyo === Constants.Puyo.Cleared.Purple ||
			
			this.puyo === Constants.Puyo.Cleared.Nuisance || this.puyo === Constants.Puyo.Cleared.Point ||
			this.puyo === Constants.Puyo.Cleared.Sun
		);
	},
	
	hasAnimation: function() { // Returns if the current puyo can have animation (excludes sun puyo)
		return (
			this.puyo === Constants.Puyo.Red    || this.puyo === Constants.Puyo.Green  || this.puyo === Constants.Puyo.Blue ||
			this.puyo === Constants.Puyo.Yellow || this.puyo === Constants.Puyo.Purple ||

			this.puyo === Constants.Puyo.Nuisance || this.puyo === Constants.Puyo.Hard  || this.puyo === Constants.Puyo.Point
		);
	},
	
	setPuyo: function(p) { // Set the puyo
		if (this.isValid(p)) {
			this.puyo = p;
		} else {
			this.puyo = Constants.Puyo.None;
		}
	}
};

/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */
 
var Field = {
	width      : Constants.Field.DefaultWidth,      // Field Width (Default = 6)
	height     : Constants.Field.DefaultHeight,     // Field Height (Default = 12)
	hiddenRows : Constants.Field.DefaultHiddenRows, // Hidden Rows (Default = 1)
	totalHeight: Constants.Field.DefaultHeight + Constants.Field.DefaultHiddenRows, // Total height (height + hidden rows)

	chainInURL   : false,     // A chain is in the URL and can be successfully set
	map          : undefined, // Map that contains the puyo
	mapEditor    : undefined, // The map used during the "editing" portion of the simulator
	mapSimulation: undefined, // The map used during the simulation

	init: function() { // Initalize
		this.mapEditor = new this.Map(this.width, this.totalHeight);
		this.map = this.mapEditor;

		if (window.chainData) { // We have a chain in the URL. Attempt to use it.
			this.setChainFromURL();
		}
	},
	
	setChain: function(chain, w, h, hr) { // Sets the chain with the specified width and height
		var pos;
		w  = w  || Constants.Field.DefaultWidth;
		h  = h  || Constants.Field.DefaultHeight;
		hr = hr || Constants.Field.DefaultHiddenRows;
		
		if (Simulation.running) { // Stop the simulation
			Simulation.back();
		}

		if (w !== this.width || h !== this.height || hr !== this.hiddenRows) {
			this.width = w;
			this.height = h;
			this.hiddenRows = hr;
			this.totalHeight = h + hr;

			this.mapEditor = new this.Map(this.width, this.totalHeight);
			this.map = this.mapEditor;

			if (PuyoDisplay.renderer) { // If we have a render, draw up the new field
				PuyoDisplay.renderer.uninit();
				$("#field").css({ width: this.width * PuyoDisplay.puyoSize + "px", height: (this.totalHeight) * PuyoDisplay.puyoSize + "px" });
				$("#field-bg-2").css("top", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
				$("#field-bg-3").css("height", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
				Tabs.fieldWidthChanged();
				PuyoDisplay.renderer.init();
			}
			
			$("#field-size-width").val(this.width);
			$("#field-size-height").val(this.height);
			$("#field-hidden-rows").val(this.hiddenRows);
		}

		pos = chain.length - 1;
		for (var y = this.totalHeight - 1; y >= 0; y--) {
			for (var x = this.width - 1; x >= 0; x--) {
				if (pos < 0) {
					this.map.set(x, y, Constants.Puyo.None);
				} else {
					this.map.set(x, y, parseInt(chain.charAt(pos), 36));
					pos--;
					
					if (!PuyoDisplay.renderer) {
						continue;
					}
					
					PuyoDisplay.renderer.drawPuyo(x, y, this.map.get(x, y));
					if (!PuyoDisplay.puyoAnimation.running) { // Redraw all puyo around us
						if (y > 0) { PuyoDisplay.renderer.drawPuyo(x, y - 1, this.map.get(x, y - 1)); }
						if (x > 0) { PuyoDisplay.renderer.drawPuyo(x - 1, y, this.map.get(x - 1, y)); }
						if (y < this.totalHeight - 1) { PuyoDisplay.renderer.drawPuyo(x, y + 1, this.map.get(x, y + 1)); }
						if (x < this.width - 1)       { PuyoDisplay.renderer.drawPuyo(x + 1, y, this.map.get(x + 1, y)); }
					}
				}
			}
		}
	},

	setChainFromURL: function() { // Attempts to set the chain from the URL
		if (!window.chainData) {
			return;
		}

		// Set the chain. setChain takes care of providing default values if they are passed as undefined
		this.setChain(
			window.chainData.chain,
			window.chainData.width,
			window.chainData.height,
			window.chainData.hiddenRows
		);

		Simulation.puyoToClear = window.chainData.popLimit || Constants.Simulation.DefaultPuyoToClear;
		$("#puyo-to-clear").val(Simulation.puyoToClear);

		this.chainInURL = true;
	},
	
	mapToString: function() { // Converts mapEditor to a string that can be shared
		var
			addZeros = false, // Add zeros to the front
			chainString = ""; // The chain string
		for (var y = 0; y < this.totalHeight; y++) {
			for (var x = 0; x < this.width; x++) {
				if (this.mapEditor.puyo(x, y) === Constants.Puyo.None && !addZeros) {
					continue; // Don't need to add zeros to the front of the string
				}
				
				addZeros = true;
				chainString += this.mapEditor.puyo(x, y).toString(16);
			}
		}
		
		return chainString;
	}
};

Field.Map = function(w, h, m) { // Creates a puyo map, either a new one or from an existing one
	this.map = [];
	this.width = w;
	this.height = h; // This is the total height (height + hidden rows)

	var x, y;
	if (m !== undefined) {
		for (x = 0; x < this.width; x++) {
			this.map[x] = [];
			for (y = 0; y < this.height; y++) {
				this.map[x][y] = new Puyo(m.puyo(x, y));
			}
		}
	} else {
		for (x = 0; x < this.width; x++) {
			this.map[x] = [];
			for (y = 0; y < this.height; y++) {
				this.map[x][y] = new Puyo(Constants.Puyo.None);
			}
		}
	}
};

Field.Map.prototype = {
	puyo: function(x, y) { // Returns puyo at position (x,y)
		return this.map[x][y].puyo;
	},
	
	get: function(x, y) { // Returns the puyo object at position (x,y)
		return this.map[x][y];
	},
	
	set: function(x, y, p) { // Sets the puyo at position (x,y)
		this.map[x][y].setPuyo(p);
		
		if (!PuyoDisplay.renderer) {
			return;
		}

		PuyoDisplay.renderer.drawPuyo(x, y, this.map[x][y]);
		
		if (!PuyoDisplay.puyoAnimation.running) { // Redraw all puyo around us
			if (y > 0) { PuyoDisplay.renderer.drawPuyo(x, y - 1, this.map[x][y - 1]); }
			if (x > 0) { PuyoDisplay.renderer.drawPuyo(x - 1, y, this.map[x - 1][y]); }
			if (y < this.height - 1) { PuyoDisplay.renderer.drawPuyo(x, y + 1, this.map[x][y + 1]); }
			if (x < this.width - 1)  { PuyoDisplay.renderer.drawPuyo(x + 1, y, this.map[x + 1][y]); }
		}
	}
};

/*
 * Simulation
 *
 * The *heart* of the simulator. Controls the simulation aspect of it (aka it runs it)
 */

var Simulation = {
	running : false, // Simulator is running
	paused  : false, // Simulator is paused
	stepMode: false, // Simulator is in step mode
	skipMode: false, // Simulator is in skip mode (skips right to the end of the chain)
	action  : -1,    // Current action
	timer   : undefined, // The simulation timer

	score   : 0, // Score
	chains  : 0, // Chains
	nuisance: 0, // Nuisance
	cleared: [], // How many puyos are cleared in each chain

	leftoverNuisance: 0, // Leftover nuisance puyo
	prevChainPower  : 0, // Previous chain power

	colorBonus: [[0, 3, 6, 12, 24], [0, 2, 4, 8, 16]], // Color bonuses (Classic, Fever)
	groupBonus: [[0, 2, 3, 4, 5, 6, 7, 10], [0, 1, 2, 3, 4, 5, 6, 8]], // Group bonuses (Classic, Fever)

	positions: [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}], // Positions around us
	chainPowers: [   0,   8,  16,  32,  64,  96, 128, 160, 192, 224, 256, 288, // Default chain power
	   320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672],
	chainPowerInc:  0, // Chain power increment
	puyoToClear:    Constants.Simulation.DefaultPuyoToClear,    // Puyo To Clear (Default = 4)
	pointPuyoBonus: Constants.Simulation.DefaultPointPuyoBonus, // Point Puyo Bonus (Default = 50)
	targetPoints:   Constants.Simulation.DefaultTargetPoints,   // Target Points (Default = 70)
	speed: Constants.Simulation.DefaultSpeed, // Speed that the simulator runs at (lower = faster; Default = 500)
	scoreMode: 0, // Score Mode (0 = Classic, 1 = Fever)
	
	back: function() { // Stops the chain
		// Reset all variables
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
			this.timer = undefined;
		}

		this.running  = false;
		this.paused   = false;
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
		$("#field-cleared").text('0');

		PuyoDisplay.renderer.drawNuisanceTray(this.nuisance);
		
		// Display the "editor" chain on the puyo display and set the simulation buttons
		ControlsDisplay.toggleSimulationButtons(false, true, false, true, true);
		$("#tab-simulator input, #tab-simulator select, #tab-simulator button").prop("disabled", false); // Disable simulator options
		
		Field.map = Field.mapEditor;
		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				PuyoDisplay.renderer.drawPuyo(x, y, Field.map.get(x, y));
			}
		}
	},
	
	start: function() { // Starts the chain
		if (!this.running) {
			ControlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select, #tab-simulator button").prop("disabled", true); // Disable simulator options

			// Set all variables
			this.running = true;
			Field.mapSimulation = new Field.Map(Field.width, Field.totalHeight, Field.mapEditor);
			Field.map = Field.mapSimulation;
			
			// Check to see if the puyo can fall and go from there
			this.action = 0;
			
			if (!this.dropPuyo()) { // No puyo dropped, start chaining
				this.chain();
			} else { // Puyo dropped, delay chaining
				var self = this;
				this.timer = setTimeout(function() { self.chain(); }, this.speed);
			}
		} else if (this.running && (this.paused || this.stepMode)) {
			ControlsDisplay.toggleSimulationButtons(true, false, true, false, false); // Toggle simulation buttons

			this.paused = false;
			this.stepMode = false;
			
			this.chain();
		}
	},
	
	pause: function() { // Pauses the chain
		if (this.running && !this.paused && !this.stepMode && !this.skipMode) {
			if (this.timer !== undefined) {
				clearTimeout(this.timer);
				this.timer = undefined;
			}
		
			this.paused = true;
			
			ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
		}
	},
	
	step: function() { // Advances a step in the chain
		if (!this.running) {
			ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select, #tab-simulator button").prop("disabled", true); // Disable simulator options

			// Set all variables
			this.running = true;
			this.stepMode = true;
			Field.mapSimulation = new Field.Map(Field.width, Field.totalHeight, Field.mapEditor);
			Field.map = Field.mapSimulation;
			
			// Check to see if the puyo can fall and go from there
			this.action = 0;
			if (!this.dropPuyo()) { // No puyo dropped, start chaining
				this.chain();
			}
		} else if (this.running && !this.skipMode && this.action !== -1) {
			ControlsDisplay.toggleSimulationButtons(true, true, false, true, true); // Toggle simulation buttons

			this.paused = false;
			this.stepMode = true;
			
			this.chain();
		}
	},
	
	skip: function() { // Skips right to the end of the chain
		if (!this.running) {
			ControlsDisplay.toggleSimulationButtons(true, false, false, false, false); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select, #tab-simulator button").prop("disabled", true); // Disable simulator options

			// Set all variables
			this.running = true;
			this.skipMode = true;
			Field.mapSimulation = new Field.Map(Field.width, Field.totalHeight, Field.mapEditor);
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
	
	chain: function() { // This preforms the chain
		var self = this, // References to this object
		    i, j, x, y;  // Loop variables

		if (this.action === 0) { // Preform the chain
			var check = [], // "Check" array (will be filled in right after this)
			    chainMade = false, // Indiciates if a chain has been made
			    puyoCleared      = 0, // Number of puyo that were cleared in the chain
			    pointPuyoCleared = 0, // Number of point puyo cleared
			    sunPuyoCleared   = 0, // Number of sun puyo cleared
			    groups = [ [], [], [], [], [] ]; // Groups to sort the colors


			// Create the "check" array
			for (x = 0; x < Field.width; x++) {
				check[x] = [];
				for (y = 0; y < Field.totalHeight; y++) {
					check[x][y] = false;
				}
			}
			
			// Check to see which puyo have been cleared
			for (y = Field.hiddenRows; y < Field.totalHeight; y++) { // Don't check the hidden row
				for (x = 0; x < Field.width; x++) {
					if (!check[x][y] && Field.map.get(x, y).isColored()) { // Is a colored puyo
						var cleared   = 1, // Amount of puyo cleared
						    checked   = 1, // Amount of puyo checked
						    puyo      = Field.map.puyo(x, y), // Puyo currently being checked
						    list      = [{x: x, y: y}], // List of puyo to clear
						    pos, checkX, checkY;

						check[x][y]   = true;

						while (checked <= cleared) {
							pos = list[checked - 1];
							// Check the puyo to see if we can make a chain
							for (i = 0; i < 4; i++) {
								// Check for out of bounds
								if (this.positions[i].y === -1 && pos.y <= Field.hiddenRows)      continue;
								if (this.positions[i].x === -1 && pos.x <= 0)                     continue;
								if (this.positions[i].y ===  1 && pos.y >= Field.totalHeight - 1) continue;
								if (this.positions[i].x ===  1 && pos.x >= Field.width - 1)       continue;
								
								// Check to see if the puyo match
								checkX = pos.x + this.positions[i].x; // Shortcuts
								checkY = pos.y + this.positions[i].y; // Shortcuts
								if (!check[checkX][checkY] && Field.map.puyo(checkX, checkY) === puyo) {
									cleared++;
									check[checkX][checkY] = true;
									list.push({x: checkX, y: checkY});
								}
							}

							checked++;
						}

						if (cleared >= this.puyoToClear) { // A chain was made
							chainMade   = true;
							puyoCleared += cleared;
							
							// Add the erased puyo to the group list
							switch (puyo) {
								case Constants.Puyo.Red:    groups[0].push(cleared); break;
								case Constants.Puyo.Green:  groups[1].push(cleared); break;
								case Constants.Puyo.Blue:   groups[2].push(cleared); break;
								case Constants.Puyo.Yellow: groups[3].push(cleared); break;
								case Constants.Puyo.Purple: groups[4].push(cleared); break;
							}

							for (i = 0; i < cleared; i++) { // Set the cleared sprite for the cleared puyo
								pos = list[i];
								switch (Field.map.puyo(pos.x, pos.y)) {
									case Constants.Puyo.Red:    Field.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Red);    break;
									case Constants.Puyo.Green:  Field.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Green);  break;
									case Constants.Puyo.Blue:   Field.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Blue);   break;
									case Constants.Puyo.Yellow: Field.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Yellow); break;
									case Constants.Puyo.Purple: Field.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Purple); break;
								}
								
								// Check the nuisance/point/hard puyo around the current puyo
								for (j = 0; j < 4; j++) {
									// Check for out of bounds
									if (this.positions[j].y === -1 && pos.y <= Field.hiddenRows)         continue;
									if (this.positions[j].x === -1 && pos.x <= 0)                        continue;
									if (this.positions[j].y ===  1 && pos.y >= Field.totalHeight - 1)    continue;
									if (this.positions[j].x ===  1 && pos.x >= Field.width - 1)          continue;
									
									// Check to see if the puyo match
									checkX = pos.x + this.positions[j].x; // Shortcuts
									checkY = pos.y + this.positions[j].y; // Shortcuts
									if (Field.map.puyo(checkX, checkY) === Constants.Puyo.Nuisance) { // Nuisance Puyo
										Field.map.set(checkX, checkY, Constants.Puyo.Cleared.Nuisance);
									} else if (Field.map.puyo(checkX, checkY) === Constants.Puyo.Point) { // Point Puyo
										Field.map.set(checkX, checkY, Constants.Puyo.Cleared.Point);
										pointPuyoCleared++;
									} else if (Field.map.puyo(checkX, checkY) === Constants.Puyo.Sun) { // Sun Puyo
										Field.map.set(checkX, checkY, Constants.Puyo.Cleared.Sun);
										sunPuyoCleared++;
									} else if (Field.map.puyo(checkX, checkY) === Constants.Puyo.Hard) { // Hard Puyo
										Field.map.set(checkX, checkY, Constants.Puyo.Nuisance);
									}
								}
							}
						}
					}
				}
			}

			if (chainMade) { // Has a chain been made?
				// Calculate the clear bonus (whhich requires it's own function)
				var clearBonus = (function(groups, self) {
					var clearBonus = 0, // Clear Bonus
					    colors     = 0, // Colors erased
					    total      = 0; // Amount of groups erased

					for (var color = 0; color < groups.length; color++) { // Loop through all the colors.
						if (groups[color].length > 0) colors++;
						for (var i = 0; i < groups[color].length; i++) { // Loop through all the groups
							total++;

							// Add the group bonus
							// When Puyo to clear is < 4, we have to use the value at (Puyo in group - puyo to clear)
							// When Puyo to clear is >= 4, we have to use the value at (Puyo in group - 4)
							var puyoOffset = Math.min(4, self.puyoToClear);
							if (groups[color][i] > 6 + puyoOffset) {
								clearBonus += self.groupBonus[self.scoreMode][7];
							} else {
								clearBonus += self.groupBonus[self.scoreMode][groups[color][i] - puyoOffset];
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
				var bonus = ((puyoCleared * 10) * clearBonus);
				bonus += (pointPuyoCleared * this.pointPuyoBonus);

				this.chains++;
				this.score += bonus;

				// Store how many puyos are cleared in this chain
				this.cleared.push(puyoCleared);

				var nuisanceCalculated = (bonus / this.targetPoints) + this.leftoverNuisance; // Calculate nuisance
				this.nuisance += Math.floor(nuisanceCalculated); // Round down and add to nuisance
				this.leftoverNuisance = nuisanceCalculated % 1; // Save leftover nuisance for the next chain
				
				if (sunPuyoCleared > 0) { // If we cleared any sun puyo, we need to add nuisance
					if (this.chains === 1) {
						this.nuisance += (3 * sunPuyoCleared);
					} else {
						this.nuisance += (6 * (this.chains - 1) * sunPuyoCleared);
					}
				}
				
				// Now that we did that, move onto the next action
				this.action = 1;
				
				if (this.skipMode) { // If we are in skip mode, move directly onto the next step of the chain
					this.chain();
				} else {
					$("#field-chains").text(this.chains);
					$("#field-score").text(((puyoCleared * 10) + (pointPuyoCleared * this.pointPuyoBonus)) + " x " + clearBonus);
					$("#field-nuisance").text(this.nuisance);
					var clearedChain = this.cleared.map(function(i) { return i.toString() }).join(', ');
					var clearedTotal = this.cleared.reduce(function(a, b) { return a + b; });
					$("#field-cleared").text(clearedChain + ' (' + clearedTotal + ')');

					PuyoDisplay.renderer.drawNuisanceTray(this.nuisance);
					
					if (!this.stepMode) { // Set the timer if we aren't in step mode
						this.timer = setTimeout(function() { self.chain(); }, this.speed);
					}
				}
			} else { // No chain was made, stop the chain.
				this.action = -1;

				if (this.skipMode) { // If we are in skip mode, stop
					for (y = 0; y < Field.totalHeight; y++) {
						for (x = 0; x < Field.width; x++) {
							PuyoDisplay.renderer.drawPuyo(x, y, Field.map.get(x, y));
						}
					}
					
					$("#field-chains").text(this.chains);
					$("#field-score").text(this.score);
					$("#field-nuisance").text(this.nuisance);
					var clearedChain = this.cleared.map(function(i) { return i.toString() }).join(', ');
					var clearedTotal = this.cleared.reduce(function(a, b) { return a + b; });
					$("#field-cleared").text(clearedChain + ' (' + clearedTotal + ')');

					PuyoDisplay.renderer.drawNuisanceTray(this.nuisance);
				} else { // Just toggle the buttons
					ControlsDisplay.toggleSimulationButtons(true, false, false, false, false);
				}
			}

		} else if (this.action === 1) { // Erase & drop puyo
			$("#field-score").text(this.score); // Set the score to it's real value now
			
			// Remove any cleared puyo
			for (y = Field.hiddenRows; y < Field.totalHeight; y++) { // Can start at 1 since you can't clear puyo in the hidden row
				for (x = 0; x < Field.width; x++) {
					if (Field.map.get(x, y).isCleared()) {
						Field.map.set(x, y, Constants.Puyo.None);
					}
				}
			}
			
			// Drop the puyo and see if we can continue the chain
			if (this.dropPuyo()) { // Puyo dropped, continue with the chain
				this.action = 0;

				if (this.skipMode) { // If we are in skip mode, move directly onto the next step of the chain
					this.chain();
				} else if (!this.stepMode) { // Set the timer if we aren't in step mode
					this.timer = setTimeout(function() { self.chain(); }, this.speed);
				}
			} else { // No puyo dropped, stop the chain
				this.action = -1;

				if (this.skipMode) { // If we are in skip mode, stop
					for (y = 0; y < Field.totalHeight; y++) {
						for (x = 0; x < Field.width; x++) {
							PuyoDisplay.renderer.drawPuyo(x, y, Field.map.get(x, y));
						}
					}
					
					$("#field-chains").text(this.chains);
					$("#field-score").text(this.score);
					$("#field-nuisance").text(this.nuisance);
					var clearedChain = this.cleared.map(function(i) { return i.toString() }).join(', ');
					var clearedTotal = this.cleared.reduce(function(a, b) { return a + b; });
					$("#field-cleared").text(clearedChain + ' (' + clearedTotal + ')');

					PuyoDisplay.renderer.drawNuisanceTray(this.nuisance);
				} else { // Just toggle the buttons
					ControlsDisplay.toggleSimulationButtons(true, false, false, false, false);
				}
			}
		}
	},
	
	dropPuyo: function() { // Makes the puyo fall in place and returns if any puyo changed position
		var dropped = false;

		for (var x = 0; x < Field.width; x++) {
			for (var y = Field.totalHeight - 2; y >= 0; y--) { // No need to check the bottom row
				if (Field.map.puyo(x, y) !== Constants.Puyo.None && Field.map.puyo(x, y) !== Constants.Puyo.Block &&
				    Field.map.puyo(x, y + 1) === Constants.Puyo.None) { // There's an empty space below this puyo!
					dropped = true;
					
					var y2 = y;
					while (y2 < Field.totalHeight - 1 && Field.map.puyo(x, y2 + 1) === Constants.Puyo.None) {
						y2++;
					}
					
					Field.map.set(x, y2, Field.map.puyo(x, y));
					Field.map.set(x, y, Constants.Puyo.None);
				}
			}
		}

		return dropped;
	}
};

/*
 * Field Display
 *
 * Controls the display and the style of the field.
 */

var FieldDisplay = {
	fieldContent: undefined,           // A reference to the content of the field
	selectedPuyo: Constants.Puyo.None, // Current Puyo that is selected
	insertPuyo  : false,               // Indicates if we are going to insert Puyo (the insert box is checked)
		
	init: function() { // Initalize
		PuyoDisplay.init();
		this.load(localStorage.getItem("chainsim.fieldStyle") || "standard", true);
	},
	
	load: function(style, init) { // Loads the display and the style (need to do this after DOM ready)
		// Init specifies if this is the simulator is being loaded (aka style isn't being changed)
		init = init || false;
		
		// Set the field content reference
		switch (style) {
			case "standard": this.fieldContent = Content.Field.Standard; break;
			case "eyecandy": this.fieldContent = Content.Field.EyeCandy; break;
			default:         this.fieldContent = Content.Field.Basic;    break;
		}
		
		if (!init) { // Only fade out & fade in if we are switching styles
			var self = this;
			$("#simulator-field, #nuisance-tray").fadeOut(200, function() { // Fade out the simulator and display the new one
				$("#field-bg-1, #field-bg-2, #field-bg-3").removeAttr("style");
				$("#simulator").removeClass("field-basic field-standard field-eyecandy");
				$("#simulator").addClass(self.fieldContent.CSSClass);

				if (self.fieldContent.Script !== undefined) {
					self.fieldContent.Script.call(self);
				}

				$("#field").css({ width: Field.width * PuyoDisplay.puyoSize + "px", height: (Field.totalHeight) * PuyoDisplay.puyoSize + "px" });
				$("#field-bg-2").css("top", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
				$("#field-bg-3").css("height", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
				Tabs.fieldWidthChanged();
				
				$("#simulator-field, #nuisance-tray").fadeIn(200);
				$("#field-style").prop("disabled", false);
			});
		}
	},
	
	display: function() { // Displays the field
		$("#simulator").removeClass("field-basic field-standard field-eyecandy");
		$("#simulator").addClass(this.fieldContent.CSSClass);

		if (this.fieldContent.Script !== undefined) {
			this.fieldContent.Script.call(this);
		}
		
		$("#field").css({ width: Field.width * PuyoDisplay.puyoSize + "px", height: (Field.totalHeight) * PuyoDisplay.puyoSize + "px" });
		$("#field-bg-2").css("top", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
		$("#field-bg-3").css("height", Field.hiddenRows * PuyoDisplay.puyoSize + "px");
		Tabs.fieldWidthChanged();
		
		// Set up the field cursor
		var self = this;
		(function() { // Wrap in a function call
			var
				mouseDown      = false, // A mouse button is pressed
				leftMouseDown  = false, // Left mouse button is pressed
				rightMouseDown = false, // Right mouse button is pressed
				offsetX, // X offset in the DOM
				offsetY, // Y offset in the DOM
				fieldX,  // X position in the field
				fieldY,  // Y position in the field
				y;       // Loop variable

			$("#field").mouseenter(function(e) {
				if (Simulation.running) { // Don't allow placing puyo when the simulator is running
					return;
				}

				offsetX = e.pageX - $(this).offset().left;
				offsetY = e.pageY - $(this).offset().top;
				fieldX  = Math.floor(offsetX / PuyoDisplay.puyoSize);
				fieldY  = Math.floor(offsetY / PuyoDisplay.puyoSize);

				$("<div>").attr("id", "field-cursor").css({
					top:  fieldY * PuyoDisplay.puyoSize + "px",
					left: fieldX * PuyoDisplay.puyoSize + "px"
				}).appendTo(this);
			}).mousemove(function(e) {
				if (Simulation.running) { // Don't allow placing puyo when the simulator is running
					return;
				}

				var newFieldX, newFieldY;
				offsetX = e.pageX - $(this).offset().left;
				offsetY = e.pageY - $(this).offset().top;
				
				if (offsetX < 0 || offsetX >= $(this).width() || offsetY < 0 || offsetY >= $(this).height()) { // Check for out of bounds before continuing
					$(this).mouseleave();
					return;
				}
				
				newFieldX = Math.floor(offsetX / PuyoDisplay.puyoSize);
				newFieldY = Math.floor(offsetY / PuyoDisplay.puyoSize);
				
				if (newFieldX !== fieldX || newFieldY !== fieldY) { // Are we hovering over another puyo now?
					fieldX = newFieldX;
					fieldY = newFieldY;

					if (mouseDown) { // Place puyo
						$(this).mousedown();
					}

					$("#field-cursor").css({
						top:  fieldY * PuyoDisplay.puyoSize + "px",
						left: fieldX * PuyoDisplay.puyoSize + "px"
					});
				}
			}).mouseleave(function() {
				$(this).mouseup();
				$("#field-cursor").remove();
			}).mousedown(function(e) {
				e.preventDefault();

				if (Simulation.running) { // Don't allow placing puyo when the simulator is running
					return;
				}
				
				if (!mouseDown && (e.which === 1 || e.which === 3)) {
					mouseDown = true;
					if (e.which === 1) {
						leftMouseDown = true;
						$("#field-cursor").addClass("left-mouse-down");
					} else if (e.which === 3) {
						rightMouseDown = true;
						$("#field-cursor").addClass("right-mouse-down");
					}
				}

				if (leftMouseDown) { // Left click, place puyo
					if (self.selectedPuyo === Constants.Puyo.Delete) { // Delete this puyo and shift the ones on top down one row
						for (y = fieldY; y > 0; y--) {
							Field.map.set(fieldX, y, Field.map.puyo(fieldX, y - 1));
						}
						Field.map.set(fieldX, 0, Constants.Puyo.None);
					} else {
						if (self.insertPuyo) { // Insert puyo
							for (y = 0; y < fieldY; y++) {
								Field.map.set(fieldX, y, Field.map.puyo(fieldX, y + 1));
							}
						}

						Field.map.set(fieldX, fieldY, self.selectedPuyo);
					}
				} else if (rightMouseDown) { // Right click, delete puyo
					Field.map.set(fieldX, fieldY, Constants.Puyo.None);
				}
			}).mouseup(function() {
				mouseDown = false;

				if (leftMouseDown) {
					leftMouseDown = false;
					$("#field-cursor").removeClass("left-mouse-down");
				} else if (rightMouseDown) {
					rightMouseDown = false;
					$("#field-cursor").removeClass("right-mouse-down");
				}
			}).on("contextmenu", function() {
				return false;
			});
		}());
	}
};

/*
 * Puyo Display
 *
 * Controls the style of the puyo and displays it on the field.
 */

var PuyoDisplay = {
	// We're going to start out with our constants
	puyoSize     : 32, // Puyo size in pixels (always 32)
	
	// Next we're going to set up our variables
	renderer         : undefined, // The renderer object to use to display the puyo (Will always be set to CanvasRenderer)
	puyoSkin         : undefined, // The current puyo skin
	nuisanceTrayTimer: undefined, // The timer for the nuisance tray
	puyoAnimation    : undefined, // Puyo animation
	sunPuyoAnimation : undefined, // Sun Puyo animation
	
	animate: { // Animation settings
		puyo        : true, // Animate Puyo (only the chalk puyo skin is animated)
		sunPuyo     : true, // Animate Sun Puyo
		nuisanceTray: true  // Animate the nuisance tray
	},
	
	// Finally, we will list the available puyo skins here
	puyoSkins: [
		{ id : "classic",   image : "classic.png"   },
		{ id : "puyo4",     image : "puyo4.png"     },
		{ id : "fever",     image : "fever.png"     },
		{ id : "shiki",     image : "shiki.png"     },
		{ id : "aqua",      image : "aqua.png"      },
		{ id : "beta",      image : "beta.png"      },
		{ id : "block",     image : "block.png"     },
		{ id : "board",     image : "board.png"     },
		{ id : "box",       image : "box.png"       },
		{ id : "capsule",   image : "capsule.png"   },
		{ id : "chalk",     image : "chalk.png",  frames : 4 },
		{ id : "chalk2",    image : "chalk2.png", frames : 4 },
		{ id : "clear",     image : "clear.png"     },
		{ id : "cube",      image : "cube.png"      },
		{ id : "cube2",     image : "cube2.png"     },
		{ id : "degi",      image : "degi.png"      },
		{ id : "fever2",    image : "fever2.png"    },
		{ id : "gyakko",    image : "gyakko.png"    },
		{ id : "human",     image : "human.png"     },
		{ id : "moji",      image : "moji.png"      },
		{ id : "moji2",     image : "moji2.png"     },
		{ id : "moro",      image : "moro.png"      },
		{ id : "msx",       image : "msx.png"       },
		{ id : "real",      image : "real.png"      },
		{ id : "shiki2",    image : "shiki2.png"    },
		{ id : "sonic",     image : "sonic.png"     }
	],
	
	init: function() { // Initalize the puyo display
		// Set the parents of our children
		this.CanvasRenderer.parent   = this;
		this.puyoAnimation.parent    = this;
		this.sunPuyoAnimation.parent = this;

		// Set the renderer
		this.renderer = this.CanvasRenderer;
		
		// Set the puyo skin
		this.setPuyoSkin(localStorage.getItem("chainsim.puyoSkin") || "classic");
		
		// Set our animation settings
		this.animate.puyo         = ((localStorage.getItem("chainsim.animate.puyo")         || "yes") === "yes");
		this.animate.sunPuyo      = ((localStorage.getItem("chainsim.animate.sunPuyo")      || "yes") === "yes");
		this.animate.nuisanceTray = ((localStorage.getItem("chainsim.animate.nuisanceTray") || "yes") === "yes");
	},

	getImagePosition: function(x, y, p) { // Returns the position of the image for background-image (p = puyo object)
		var posX, posY, self = this;

		function getXPosition(x, y, p) { // Returns the X position of the puyo
			var pos = 0;

			if (p === Constants.Puyo.Sun) { // Sun Puyo
				if (self.sunPuyoAnimation.running) {
					return self.sunPuyoAnimation.frame;
				} else {
					return 0;
				}
			}
			if (self.puyoSkin.frames !== undefined && self.puyoSkin.frames > 0) { // Animated Puyo
				if (self.puyoAnimation.running) {
					return self.puyoAnimation.frame;
				} else {
					return 0;
				}
			}

			if (y < Field.hiddenRows) return 0;
			if (p === Constants.Puyo.Nuisance || p === Constants.Puyo.Point) return 0;
			
			var L = (x > 0                     && Field.map.puyo(x - 1, y) === p),
			    R = (x < Field.width - 1       && Field.map.puyo(x + 1, y) === p),
			    U = (y > Field.hiddenRows      && Field.map.puyo(x, y - 1) === p),
				D = (y < Field.totalHeight - 1 && Field.map.puyo(x, y + 1) === p);
			
			if (L) pos += 8;
			if (R) pos += 4;
			if (U) pos += 2;
			if (D) pos += 1;
			
			return pos;
		}

		switch (p) {
			case Constants.Puyo.None:   posX = 0; posY = 0; break;
			case Constants.Puyo.Delete: posX = 0; posY = 0; break;
			
			case Constants.Puyo.Red:    posX = getXPosition(x, y, p); posY = 0; break;
			case Constants.Puyo.Green:  posX = getXPosition(x, y, p); posY = 1; break;
			case Constants.Puyo.Blue:   posX = getXPosition(x, y, p); posY = 2; break;
			case Constants.Puyo.Yellow: posX = getXPosition(x, y, p); posY = 3; break;
			case Constants.Puyo.Purple: posX = getXPosition(x, y, p); posY = 4; break;
			
			case Constants.Puyo.Nuisance: posX = getXPosition(x, y, p); posY = 5; break;
			case Constants.Puyo.Point:    posX = getXPosition(x, y, p); posY = 6; break;
			case Constants.Puyo.Sun:      posX = getXPosition(x, y, p); posY = 7; break;
			case Constants.Puyo.Hard:     posX = 0; posY = 8; break;
			case Constants.Puyo.Iron:     posX = 1; posY = 8; break;
			case Constants.Puyo.Block:    posX = 2; posY = 8; break;

			case Constants.Puyo.Cleared.Red:    posX = 3; posY = 8; break;
			case Constants.Puyo.Cleared.Green:  posX = 4; posY = 8; break;
			case Constants.Puyo.Cleared.Blue:   posX = 5; posY = 8; break;
			case Constants.Puyo.Cleared.Yellow: posX = 6; posY = 8; break;
			case Constants.Puyo.Cleared.Purple: posX = 7; posY = 8; break;

			case Constants.Puyo.Cleared.Nuisance: posX = 8;  posY = 8; break;
			case Constants.Puyo.Cleared.Point:    posX = 9;  posY = 8; break;
			case Constants.Puyo.Cleared.Sun:      posX = 10; posY = 8; break;
		}

		return {x: posX, y: posY};
	},
	
	display: function() { // Display (in other words, initalize the renderer)
		this.renderer.init();
		
		// Display the Puyo selection
		this.displayPuyoSelection();
	},
	
	setPuyoSkin: function(skin) { // Sets the puyo skin
		for (var i = 0; i < this.puyoSkins.length; i++) {
			if (this.puyoSkins[i].id === skin) {
				this.puyoSkin = this.puyoSkins[i];
				this.renderer.setPuyoSkin();
				
				return;
			}
		}
		
		this.puyoSkin = this.puyoSkins[0];
		this.renderer.setPuyoSkin();
	},
	
	displayPuyoSelection: function() {
		$("#puyo-selection .puyo").not(".puyo-none, .puyo-delete").css("background-image", "url('/images/puyo/" + this.puyoSkin.image + "')");
	},

	getSkinIndex: function(id) {
		for (var i = 0; i < this.puyoSkins.length; i++) {
			if (this.puyoSkins[i].id === id)
				return i;
		}
		
		return -1;
	}
};

PuyoDisplay.CanvasRenderer = { // CanvasRenderer (uses HTML5 Canvas to display the puyo on the field)
	ctx            : undefined, // Field canvas context
	nuisanceTrayCtx: undefined, // Nuisance tray canvas context
	puyoImage      : undefined, // Puyo Image sheet
	parent         : undefined, // Parent object (will be filled in when parent class is initalized)
	name           : "CanvasRenderer", // Name of the renderer

	init: function() { // Initalize the Canvas Renderer
		if ((Field.width !== Constants.Field.DefaultWidth || Field.height !== Constants.Field.DefaultHeight) && !$("#field-content").hasClass("alternate")) {
			$("#field-content").addClass("alternate");
		} else if (Field.width === Constants.Field.DefaultWidth && Field.height === Constants.Field.DefaultHeight && $("#field-content").hasClass("alternate")) {
			$("#field-content").removeClass("alternate");
		}
		
		if (Field.hiddenRows !== Constants.Field.DefaultHiddenRows && !$("#field-bg-1").hasClass("alternate")) {
			$("#field-bg-1").addClass("alternate");
		} else if (Field.hiddenRows === Constants.Field.DefaultHiddenRows && $("#field-bg-1").hasClass("alternate")) {
			$("#field-bg-1").removeClass("alternate");
		}

		$("<canvas>").attr({ id: "field-canvas", width: Field.width * this.parent.puyoSize, height: (Field.totalHeight) * this.parent.puyoSize }).appendTo("#field");
		this.ctx = document.getElementById("field-canvas").getContext("2d");
		
		// Now draw everything
		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				this.drawPuyo(x, y, Field.map.get(x, y));
			}
		}
		
		// Set up the nuisance tray
		$("<canvas>").attr({
			id    : "nuisance-tray-canvas",
			width : 224,
			height: 64
		}).css({
			"margin-left": "-16px",
			"margin-top" : "-15px"
		}).appendTo("#nuisance-tray");
		this.nuisanceTrayCtx = document.getElementById("nuisance-tray-canvas").getContext("2d");
		
		this.drawNuisanceTray(Simulation.nuisance, false);
	},

	uninit: function() { // Uninitalize the Canvas Renderer
		$("#field-canvas").remove();
		$("#nuisance-tray-canvas").remove();
		
		if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
			clearTimeout(this.parent.nuisanceTrayTimer);
		}
	},

	drawPuyo: function(x, y, p) { // Draws the puyo at x, y
		var pos;
		if (this.ctx === undefined) return;

		this.ctx.clearRect(x * this.parent.puyoSize, y * this.parent.puyoSize, this.parent.puyoSize, this.parent.puyoSize);

		if (p.puyo !== Constants.Puyo.None && this.puyoImage !== undefined) {
			pos = this.parent.getImagePosition(x, y, p.puyo);
			if (y < Field.hiddenRows) { // Puyo in hidden row are partially transparent
				this.ctx.globalAlpha = 0.5;
				this.ctx.drawImage(this.puyoImage, pos.x * this.parent.puyoSize, pos.y * this.parent.puyoSize, this.parent.puyoSize, this.parent.puyoSize,
					x * this.parent.puyoSize, y * this.parent.puyoSize, this.parent.puyoSize, this.parent.puyoSize);
				this.ctx.globalAlpha = 1;
			} else {
				this.ctx.drawImage(this.puyoImage, pos.x * this.parent.puyoSize, pos.y * this.parent.puyoSize, this.parent.puyoSize, this.parent.puyoSize,
					x * this.parent.puyoSize, y * this.parent.puyoSize, this.parent.puyoSize, this.parent.puyoSize);
			}
		}
	},

	setPuyoSkin: function() { // Sets the puyo skin
		var newPuyoImage = new Image(), self = this;
		newPuyoImage.src = "/images/puyo/" + this.parent.puyoSkin.image;
		newPuyoImage.onload = function() {
			if (self.parent.puyoAnimation.running) { // Stop the animation if it is running
				self.parent.puyoAnimation.stop();
			}
			if (self.parent.sunPuyoAnimation.running) { // Stop the sun puyo animation if it is running
				self.parent.sunPuyoAnimation.stop();
			}

			self.puyoImage = newPuyoImage;
			
			if (self.parent.animate.puyo && self.parent.puyoSkin.frames !== undefined && self.parent.puyoSkin.frames > 0) { // Is this puyo skin animated?
				self.parent.puyoAnimation.start(self.parent.puyoSkin.frames);
			}
			if (self.parent.animate.sunPuyo) { // Animate sun puyo?
				self.parent.sunPuyoAnimation.start();
			}
			
			if ($("#field-canvas").length > 0) { // Can we draw the puyo?
				for (var y = 0; y < Field.totalHeight; y++) {
					for (var x = 0; x < Field.width; x++) {
						self.drawPuyo(x, y, Field.map.get(x, y));
					}
				}
			}

			$("#puyo-selection .puyo").not(".puyo-none, .puyo-delete").css("background-image", "url('/images/puyo/" + self.parent.puyoSkin.image + "')");
			
			if (self.parent.nuisanceTrayTimer === undefined) {
				self.drawNuisanceTray(Simulation.nuisance, false);
			}
		};
	},
	
	drawNuisanceTray: function(n, animate) { // Draws nuisance in the nuisance tray
		var
			amounts = [1, 6, 30, 180, 360, 720, 1440],
			pos = [],
			nuisance = n,
			i;

		for (i = 0; i < 6; i++) {
			if (nuisance <= 0) { // No nuisance = no image
				pos[i] = -1;
			} else {
				for (var am = amounts.length - 1; am >= 0; am--) {
					if (nuisance >= amounts[am]) {
						nuisance -= amounts[am];
						pos[i] = am;
						break;
					}
				}
			}
		}
		
		if (this.parent.animate.nuisanceTray && animate !== false && n !== 0) { // Make it nice and animate it
			this.animateNuisanceTray(0, pos);
		} else {
			if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
				clearTimeout(this.parent.nuisanceTrayTimer);
				this.parent.nuisanceTrayTimer = undefined;
			}

			this.nuisanceTrayCtx.clearRect(0, 0, 224, 64);
			for (i = 5; i >= 0; i--) {
				if (pos[i] !== -1 && this.puyoImage !== undefined) {
					this.nuisanceTrayCtx.drawImage(this.puyoImage, pos[i] * 64, 288, 64, 64, i * 32, 0, 64, 64);
				}
			}
		}
	},
	
	animateNuisanceTray: function(step, pos) { // Animates the nuisance tray
		if (step === 0) { // Step not initalized, so we are just starting the animation
			if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
				clearTimeout(this.parent.nuisanceTrayTimer);
			}
		} else if (step > 80) { // Stop animating
			this.parent.nuisanceTrayTimer = undefined;
			return;
		}

		this.nuisanceTrayCtx.clearRect(0, 0, 224, 64);
		this.nuisanceTrayCtx.globalAlpha = step / 80;

		for (var i = 5; i >= 0; i--) {
			if (pos[i] !== -1 && this.puyoImage !== undefined) {
				this.nuisanceTrayCtx.drawImage(this.puyoImage, pos[i] * 64, 288, 64, 64, (80 - step) + (i * 32 * (step / 80)), 0, 64, 64);
			}
		}

		this.nuisanceTrayCtx.globalAlpha = 1;
		
		var self = this;
		this.parent.nuisanceTrayTimer = setTimeout(function() { self.animateNuisanceTray(step + 5, pos); }, 1000 / 60);
	}
};

PuyoDisplay.puyoAnimation = { // Puyo animation object
	parent      : undefined, // Parent object (will be filled in when parent class is initalized)
	frame       : 0,         // Current frame the animation is on
	totalFrames : 0,         // Total number of frames in the animation
	timer       : undefined, // Timer for setInterval
	running     : false,     // If the animation is running

	animate: function() { // Animates the puyo
		this.frame++;
		if (this.frame >= this.totalFrames) {
			this.frame = 0;
		}

		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				var p = Field.map.get(x, y);
				if (p.hasAnimation()) { // Only redraw puyo that can have animation
					this.parent.renderer.drawPuyo(x, y, p);
				}
			}
		}
		
		$("#puyo-selection .puyo.puyo-red"     ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px 0");
		$("#puyo-selection .puyo.puyo-green"   ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (1 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-blue"    ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (2 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-yellow"  ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (3 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-purple"  ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (4 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-nuisance").css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (5 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-point"   ).css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (6 * this.parent.puyoSize) + "px");

		var self = this;
		this.timer = setTimeout(function() { self.animate(); }, 200);
	},
		
	start: function(n) { // Starts the animation (n = total number of frames)
		this.running = true;

		this.frame = 0;
		this.totalFrames = n;

		var self = this;
		this.timer = setTimeout(function() { self.animate(); }, 200);
	},

	stop: function() { // Stops the animation
		this.running = false;
		this.frame = 0;
		clearTimeout(this.timer);

		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				var p = Field.map.get(x, y);
				if (p.hasAnimation()) { // Only redraw puyo that can have animation
					this.parent.renderer.drawPuyo(x, y, p);
				}
			}
		}

		$("#puyo-selection .puyo.puyo-red"     ).css("background-position", "0 0");
		$("#puyo-selection .puyo.puyo-green"   ).css("background-position", "0 -" + (1 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-blue"    ).css("background-position", "0 -" + (2 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-yellow"  ).css("background-position", "0 -" + (3 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-purple"  ).css("background-position", "0 -" + (4 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-nuisance").css("background-position", "0 -" + (5 * this.parent.puyoSize) + "px");
		$("#puyo-selection .puyo.puyo-point"   ).css("background-position", "0 -" + (6 * this.parent.puyoSize) + "px");
	}
};

PuyoDisplay.sunPuyoAnimation = { // Sun Puyo animation object
	parent      : undefined, // Parent object (will be filled in when parent class is initalized)
	frame       : 0,         // Current frame the animation is on
	totalFrames : 8,         // Total number of frames in the animation (always 8)
	timer       : undefined, // Timer for setInterval
	running     : false,     // If the animation is running

	animate: function() { // Animates the puyo
		this.frame++;
		if (this.frame >= this.totalFrames) {
			this.frame = 0;
		}

		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				var p = Field.map.get(x, y);
				if (p.puyo === Constants.Puyo.Sun) { // Only redraw sun puyo
					this.parent.renderer.drawPuyo(x, y, p);
				}
			}
		}

		$("#puyo-selection .puyo.puyo-sun").css("background-position", "-" + (this.frame * this.parent.puyoSize) + "px -" + (7 * this.parent.puyoSize) + "px");

		var self = this;
		this.timer = setTimeout(function() { self.animate(); }, 120);
	},

	start: function() { // Starts the animation (n = total number of frames)
		this.running = true;

		this.frame = 0;

		var self = this;
		this.timer = setTimeout(function() { self.animate(); }, 120);
	},

	stop: function() { // Stops the animation
		this.running = false;
		this.frame = 0;
		clearTimeout(this.timer);

		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				var p = Field.map.get(x, y);
				if (p.puyo === Constants.Puyo.Sun) { // Only redraw sun puyo
					this.parent.renderer.drawPuyo(x, y, p);
				}
			}
		}

		$("#puyo-selection .puyo.puyo-sun").css("background-position", "0 -" + (7 * this.parent.puyoSize) + "px");
	}
};

/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

var ControlsDisplay = {
	display: function() { // Displays the controls
		$("#puyo-insertion").change(function() {
			FieldDisplay.insertPuyo = $(this).prop("checked");
		});
		
		$("#field-erase-all").click(function() {
			Field.setChain("", Field.width, Field.height, Field.hiddenRows);
		});
		
		if (Field.chainInURL) { // Make the "Set from URL" button function if a chain can be set from the URL
			$("#field-set-from-url").click(function() {
				Field.setChainFromURL();
			});
		} else { // Otherwise hide it, because it is useless (it would essentially be the same as the "Erase All" button)
			$("#field-set-from-url").hide();
		}

		$("#puyo-selection .puyo.puyo-none"    ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.None;     });
		$("#puyo-selection .puyo.puyo-delete"  ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Delete;   });
		$("#puyo-selection .puyo.puyo-red"     ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Red;      });
		$("#puyo-selection .puyo.puyo-green"   ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Green;    });
		$("#puyo-selection .puyo.puyo-blue"    ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Blue;     });
		$("#puyo-selection .puyo.puyo-yellow"  ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Yellow;   });
		$("#puyo-selection .puyo.puyo-purple"  ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Purple;   });
		$("#puyo-selection .puyo.puyo-nuisance").click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Nuisance; });
		$("#puyo-selection .puyo.puyo-point"   ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Point;    });
		$("#puyo-selection .puyo.puyo-hard"    ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Hard;     });
		$("#puyo-selection .puyo.puyo-iron"    ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Iron;     });
		$("#puyo-selection .puyo.puyo-block"   ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Block;    });
		$("#puyo-selection .puyo.puyo-sun"     ).click(function() { FieldDisplay.selectedPuyo = Constants.Puyo.Sun;      });
		$("#puyo-selection .puyo").click(function() {
			$("#puyo-selection .selected").removeClass("selected");
			$(this).parent().addClass("selected");
		});
		$("#puyo-selection .puyo.puyo-none").parent().addClass("selected");
		
		$("#simulation-back" ).click(function() { Simulation.back();  });
		$("#simulation-start").click(function() { Simulation.start(); });
		$("#simulation-pause").click(function() { Simulation.pause(); });
		$("#simulation-step" ).click(function() { Simulation.step();  });
		$("#simulation-skip" ).click(function() { Simulation.skip();  });

		$.each(["1 (Slowest)", "2", "3", "4", "5 (Normal)", "6", "7", "8", "9 (Fastest)"], function(index, value) {
			$("#simulation-speed").append("<option value=\"" + ((9 - index) * 100) + "\">" + value + "</option>");
		});
		$("#simulation-speed").change(function() {
			Simulation.speed = parseInt($(this).val(), 10);
		}).val(Constants.Simulation.DefaultSpeed);
		
		this.toggleSimulationButtons(false, true, false, true, true);

		$("#field-score").text("0");
		$("#field-chains").text("0");
		$("#field-nuisance").text("0");
		$("#field-cleared").text("0");
	},
	
	toggleSimulationButtons: function(back, start, pause, step, skip) { // Controls the display of the simulator control buttons
		$("#simulation-back" ).prop("disabled", !back);
		$("#simulation-start").prop("disabled", !start);
		$("#simulation-pause").prop("disabled", !pause);
		$("#simulation-step" ).prop("disabled", !step);
		$("#simulation-skip" ).prop("disabled", !skip);
	}
};

/*
 * Tabs
 *
 * Deals with the tabs (Saved Chains, Chains, etc...)
 */

var Tabs = {
	display: function() { // Displays the tab content and initalizes all of the tabs
		// Set up the tabs for the options
		$("#simulator-tabs-select > li a[data-target]").click(function() {
			var $this = $(this),
			    $dataTarget = $this.attr("data-target"),
				$parent = $this.parent();

			$("#simulator-tabs-select > li.tab-active").removeClass("tab-active");
			$("#simulator-tabs .content-active").removeClass("content-active");
			
			if (!$("#simulator-tabs").hasClass("float") || !$parent.hasClass("tab-active")) {
				$parent.addClass("tab-active");
				$($dataTarget).addClass("content-active");
				localStorage.setItem("chainsim.lastTab", $dataTarget.substr(1)); // Don't need to get the #
			}
		});
		$("#simulator-tabs-select > li a[data-target='#" + (localStorage.getItem("chainsim.lastTab") || "tab-share") + "']").click();

		$(".simulator-tabs-toggle").click(function () {
			var $simulatorTabs = $("#simulator-tabs");

			if ($simulatorTabs.hasClass("toggled")) {
				$simulatorTabs.removeClass("toggled");
			} else {
				$simulatorTabs.addClass("toggled");
			}
		});

		this.SavedChains.init();
		this.Chains.init();
		this.Simulator.init();
		this.Links.init();
		this.Settings.init();
	},
	
	fieldWidthChanged: function() { // Called when the field width changes
		var $simulatorTabs = $("#simulator-tabs"),
		    $simulatorTabsWidth = $simulatorTabs.outerWidth(true),
			$simulatorTabsMinWidth = $simulatorTabs.data("min-width");

		if ($simulatorTabsWidth <= $simulatorTabsMinWidth && !$simulatorTabs.hasClass("float")) {
			$simulatorTabs.addClass("float");
			
			$(document).on("click.simulatorTabs", function(e) {
				var clicked = $(e.target);
				if (!clicked.parents().is("#simulator-tabs, #simulator-tabs-select")) {
					$simulatorTabs.removeClass("toggled");
				}
			});
		} else if ($simulatorTabsWidth > $simulatorTabsMinWidth && $simulatorTabs.hasClass("float")) {
			$simulatorTabs.removeClass("float toggled");
			$(document).off("click.simulatorTabs");
		}
	},
};

Tabs.SavedChains = {
	chains: [], // Saved chains array

	init: function() { // Initalizes this tab
		var self = this;

		// Use the name of the shared chain if we are viewing one
		if (window.chainData !== undefined && window.chainData.title !== undefined) {
			$("#save-chain-name").val(window.chainData.title);
		}

		// Save chain
		$("#save-chain-save").click(function() {
			if ($("#save-chain-name").val() !== "") {
				self.add($("#save-chain-name").val());
				$("#save-chain-name").val("");
			}
		});

		// The chains are stored as a JSON object in localStorage.chainsim.savedChains as follows:
		// name   = the name of the chain
		// width  = width of chain
		// height = height of chain
		// chain  = the actual chain itself
		var data = localStorage.getItem("chainsim.savedChains") || "";
		if (data !== "") {
			try {
				this.chains = $.parseJSON(data);
			} catch (e) {
				this.chains = [];
			}
		}
		
		this.display();
	},
	
	load: function(index) { // Load a chain
		var chain = this.chains[index].chain;
		
		// If this chain is saved in a legacy format, convert it to base36
		if ((this.chains[index].format || "legacy") === "legacy") {
			var oldChars = "0475681BCA32";
			var oldChain = chain;
			chain = "";

			for (var i = 0; i < oldChain.length; i++) {
				var charIndex = oldChars.indexOf(oldChain[i]);
				chain += charIndex !== -1
					? charIndex.toString(36)
					: "0";
			}
		}

		Field.setChain(
			chain,
			this.chains[index].width      || Constants.Field.DefaultWidth,
			this.chains[index].height     || Constants.Field.DefaultHeight,
			this.chains[index].hiddenRows || Constants.Field.DefaultHiddenRows
		);
	},
	
	add: function(name) { // Add a chain to the chains list
		if (name === "") { // No name was set
			return;
		}
		
		this.chains.push({
			name:       name,
			width:      Field.width,
			height:     Field.height,
			hiddenRows: Field.hiddenRows,
			chain:      Field.mapToString(),
			format:     "base36"
		});
		
		this.saveChains();
		this.addToDisplay(this.chains.length - 1);
	},
	
	remove: function(index) { // Removes the chain at the specified index
		this.chains.splice(index, 1);
		
		this.saveChains();
		this.removeFromDisplay(index);
	},
	
	saveChains: function() { // Saves the chains
		localStorage.setItem("chainsim.savedChains", JSON.stringify(this.chains));
	},

	display: function() { // Display the chains that are saved
		var self = this;

		$("#saved-chains-list").empty(); // Delete any entries that might be displayed
		
		if (this.chains.length === 0) { // No saved chains
			$(".hide-on-saved-chains").show();
		} else {
			for (var i = 0; i < this.chains.length; i++) {
				this.addToDisplay(i);
			}
		}
		
		$("#saved-chains-list").on("click", "li .chain-name a", function() {
			self.load(parseInt($(this).parents("#saved-chains-list li").attr("data-value"), 10));
		}).on("click", "li .icon-delete", function() {
			self.remove(parseInt($(this).parents("#saved-chains-list li").attr("data-value"), 10));
		});
	},
	
	addToDisplay: function(index) { // Adds the chain with the specified index to the end of the displayed list
		if ($("#saved-chains-list").children("li[data-value]").length === 0) { // Remove the "You have no saved chains" message
			$(".hide-on-saved-chains").hide();
			$(".show-on-saved-chains").show();
		}

		$("<li>").attr("data-value", index)
			.html("<a class=\"icon-delete\" title=\"Delete Chain\"></a><span class=\"chain-name\"><a class=\"link\">" + Utils.escape(this.chains[index].name) + "</a></span>")
			.appendTo("#saved-chains-list");
	},
	
	removeFromDisplay: function(index) { // Removes the chain with the specified index from the list
		$("#saved-chains-list li[data-value='" + index + "']").remove();
		
		if ($("#saved-chains-list").children("li[data-value]").length === 0) { // If there is nothing left then display the "You have no saved chains" message
			$(".show-on-saved-chains").hide();
			$(".hide-on-saved-chains").show();
		}
	}
};

Tabs.Chains = {
	chains: [], // Chains

	init: function () { // Initalizes this tab
		var self = this;

		this.chains = chainsJson;
		
		// Categories
		for (var i = 0; i < this.chains.length; i++) {
			$("#preset-chains .dropdown-menu").append("<h3>" + this.chains[i].name + "</h3>");
			var category = $("<ul>");
			
			// Sub-categories
			for (var j = 0; j < this.chains[i].categories.length; j++) {
				$("<li>")
					.attr("data-category", i)
					.attr("data-value", j)
					.html("<a>" + this.chains[i].categories[j].name + "</a>")
					.appendTo(category);
			}
			
			$("#preset-chains .dropdown-menu").append(category);
		}
			
		$("#preset-chains .dropdown-menu a").click(function() {
			var category = parseInt($(this).parent().attr("data-category"), 10),
				value    = parseInt($(this).parent().attr("data-value"),    10);
			
			$("#preset-chains .dropdown-menu li.selected").removeClass("selected");
			$(this).parent().addClass("selected");

			$("#preset-chains-series").text(self.chains[category].name);
			$("#preset-chains-group").text(self.chains[category].categories[value].name);
			
			self.displaySubCategory(category, value);
		});

		$(document).on("change", "#preset-chains-list select", function() {
			if ($(this).prop("selectedIndex") === 0) {
				return;
			}
			
			var category    = parseInt($("#preset-chains .dropdown-menu .selected").attr("data-category"), 10),
			    subCategory = parseInt($("#preset-chains .dropdown-menu .selected").attr("data-value"),    10),
				type        = parseInt($(this).attr("data-type"),   10),
				colors      = parseInt($(this).attr("data-colors"), 10),
				length      = parseInt($(this).val(), 10);
			
			Field.setChain(
				self.chains[category].categories[subCategory].types[type].colors[colors].chains[length].chain, // Chain
				self.chains[category].categories[subCategory].fieldWidth  || Constants.Field.DefaultWidth,     // Field width
				self.chains[category].categories[subCategory].fieldHeight || Constants.Field.DefaultHeight,    // Field height
				Constants.Field.DefaultHiddenRows // Hidden rows (It's always 1 with these chains)
			);
			
			Simulation.puyoToClear = self.chains[category].categories[subCategory].puyoToClear || Constants.Simulation.DefaultPuyoToClear;
			$("#puyo-to-clear").val(Simulation.puyoToClear);

			$(this).prop("selectedIndex", 0);
		});
		
		$("#preset-chains .dropdown-menu li[data-category='0'][data-value='1'] a").click();
	},

	displaySubCategory: function(category, subCategory) {
		$("#preset-chains-list").empty(); // Empty the list so we can put new stuff in it
		
		// Chain types
		for (var i = 0; i < this.chains[category].categories[subCategory].types.length; i++) {
			var row = $("<dl>"),
				dd  = $("<dd>");
			
			// Name of the chain type
			$("<dt>")
				.text(this.chains[category].categories[subCategory].types[i].name)
				.appendTo(row);
			
			// Select boxes for each color
			for (var j = 0; j < this.chains[category].categories[subCategory].types[i].colors.length; j++) {
				var select = $("<select>").attr("data-type", i).attr("data-colors", j);
				
				// Add color amount as the first index
				$("<option>")
					.text(this.chains[category].categories[subCategory].types[i].colors[j].amount + " Col")
					.appendTo(select);
				
				// Add the list of chains
				for (var k = 0; k < this.chains[category].categories[subCategory].types[i].colors[j].chains.length; k++) {
					$("<option>")
						.attr("value", k)
						.text(this.chains[category].categories[subCategory].types[i].colors[j].chains[k].length)
						.appendTo(select);
				}
				
				select.appendTo(dd);
				dd.appendTo(row);
			}
			
			$("<li>")
				.append(row)
				.appendTo("#preset-chains-list");
		}
	}
};

Tabs.Simulator = {
	init: function() { // Initalizes this tab
		// Scoring
		$("input[type='radio'][name='score-mode']")
			.change(function() {
				switch ($(this).filter(":checked").val()) {
					case "classic": Simulation.scoreMode = 0; break; // 0 = Classic scoring
					case "fever":   Simulation.scoreMode = 1; break; // 1 = Fever scoring
				}
			})
			.filter("[value='classic']").prop("checked", true); // Default to classic scoring
		
		// Puyo to Clear
		$("#puyo-to-clear")
			.change(function() {
				Simulation.puyoToClear = parseInt($(this).val(), 10);
			})
			.html(Utils.createDropDownListOptions(Utils.range(2, 6, 1)))
			.val(Simulation.puyoToClear); // Default to 4
			
		// Target Points
		$("#target-points")
			.change(function() {
				Simulation.targetPoints = parseInt($(this).val(), 10);
			})
			.html(Utils.createDropDownListOptions(Utils.range(10, 990, 10)))
			.val(Simulation.targetPoints); // Default to 70
		
		// Point Puyo bonus
		$("#point-puyo-bonus")
			.change(function() {
				Simulation.pointPuyoBonus = parseInt($(this).val(), 10);
			})
			.html(Utils.createDropDownListOptions({
				50: "50",
				100: "100",
				300: "300",
				500: "500",
				1000: "1K",
				10000: "10K",
				100000: "100K",
				500000: "500K",
				1000000: "1M"
			}))
			.val(Simulation.pointPuyoBonus); // Default to 50
		
		// Field Size
		$("#field-size-width")
			.html(Utils.createDropDownListOptions(Utils.range(3, 16, 1)))
			.val(Field.width); // Default to 6
		$("#field-size-height")
			.html(Utils.createDropDownListOptions(Utils.range(6, 26, 1)))
			.val(Field.height); // Default to 12

		$("#set-field-size").click(function() {
			var w = parseInt($("#field-size-width").val(),  10),
			    h = parseInt($("#field-size-height").val(), 10);

			if (w !== Field.width || h !== Field.height) {
				Field.setChain("", w, h, Field.hiddenRows);
			}
		});
		
		// Hidden Rows
		$("#field-hidden-rows")
			.html(Utils.createDropDownListOptions(Utils.range(1, 2, 1)))
			.val(Field.hiddenRows); // Default to 1

		$("#set-hidden-rows").click(function() {
			var hr = parseInt($("#field-hidden-rows").val(), 10);

			if (hr !== Field.hiddenRows) {
				Field.setChain("", Field.width, Field.height, hr);
			}
		});
		
		// Attack Powers
		(function () {
			var attackPowers = attackPowersJson;
			
			// Loop through each of the powers
			for (var i = 0; i < attackPowers.length; i++) {
				$("#attack-powers .dropdown-menu").append("<h3>" + attackPowers[i].name + "</h3>");
				var category = $("<ul>");
				
				// Loop through each of the powers in the category
				for (var j = 0; j < attackPowers[i].powers.length; j++) {
					$("<li>")
						.attr("data-category", i)
						.attr("data-value", j)
						.html("<a>" + attackPowers[i].powers[j].name + "</a>")
						.appendTo(category);
				}
				
				$("#attack-powers .dropdown-menu").append(category);
			}

			$("#attack-powers .dropdown-menu a").click(function() {
				var category = parseInt($(this).parent().attr("data-category"), 10),
					value    = parseInt($(this).parent().attr("data-value"),    10);

				$("#attack-powers .dropdown-menu li.selected").removeClass("selected");
				$(this).parent().addClass("selected");
				
				Simulation.chainPowers   = attackPowers[category].powers[value].values;
				Simulation.chainPowerInc = attackPowers[category].powers[value].increment || 0;

				$("#attack-powers-game").text(attackPowers[category].name);
				$("#attack-powers-character").text(attackPowers[category].powers[value].name);
				
				$("input[name='score-mode'][value='" + (attackPowers[category].scoreMode || "classic") + "']").prop("checked", true).change();
				$("#target-points").val((attackPowers[category].targetPoints || Constants.Simulator.DefaultTargetPoints)).change();
			});
			$("#attack-powers .dropdown-menu li[data-category='0'][data-value='1'] a").click();
		}());
	},
};

Tabs.Links = {
	init: function() { // Initalizes this tab
		var self = this;

		$("#get-links").click(function() {
			var data = {
				title: $("#share-chain-title").val(),
				chain: Field.mapToString(),
				width: Field.width,
				height: Field.height,
				hiddenRows: Field.hiddenRows,
				popLimit: Simulation.puyoToClear,
			};

			$.post("/api/save", data, function (response) {
				if (response.success) {
					$("#share-link").val(Config.baseUrl + Utils.stringFormat(Config.shareLinkUrl, response.data.id));
					$("#share-image").val(Config.baseUrl + Utils.stringFormat(Config.shareImageUrl, response.data.id));
					$("#share-animated-image").val(Config.baseUrl + Utils.stringFormat(Config.shareAnimatedImageUrl, response.data.id));

					// Hide elements that shouldn't be shown for shared chains, and show elements that should
					$(".hide-on-shared-chain").hide();
					$(".show-on-shared-chain").show();
				}
			}, "json");
		});

		if (window.chainData !== undefined) {
			if (window.chainData.id !== undefined) {
				$("#share-link").val(Config.baseUrl + Utils.stringFormat(Config.shareLinkUrl, window.chainData.id));
				$("#share-image").val(Config.baseUrl + Utils.stringFormat(Config.shareImageUrl, window.chainData.id));
				$("#share-animated-image").val(Config.baseUrl + Utils.stringFormat(Config.shareAnimatedImageUrl, window.chainData.id));
			} else if (window.chainData.legacyQueryString !== undefined) {
				$("#share-link").val(Config.baseUrl + Utils.stringFormat(Config.shareLegacyLinkUrl, window.chainData.legacyQueryString));
				$("#share-image").val(Config.baseUrl + Utils.stringFormat(Config.shareLegacyImageUrl, window.chainData.legacyQueryString));
			}
		}
	},
};

Tabs.Settings = {
	init: function() { // Initalizes this tab
		// Animation
		$("#animate-puyo") // Puyo animation
			.click(function() {
				var checked = $(this).prop("checked");
				
				PuyoDisplay.animate.puyo = checked;
				localStorage.setItem("chainsim.animate.puyo", (checked ? "yes" : "no"));
				
				// See if we need to enable or disable the animation
				if (checked && !PuyoDisplay.puyoAnimation.running && PuyoDisplay.puyoSkin.frames !== undefined && PuyoDisplay.puyoSkin.frames > 0) {
					PuyoDisplay.puyoAnimation.start(PuyoDisplay.puyoSkin.frames);
				} else if (!checked && PuyoDisplay.puyoAnimation.running) {
					PuyoDisplay.puyoAnimation.stop();
				}
			})
			.prop("checked", PuyoDisplay.animate.puyo);
		
		$("#animate-sun-puyo") // Sun Puyo animation
			.click(function() {
				var checked = $(this).prop("checked");
				
				PuyoDisplay.animate.sunPuyo = checked;
				localStorage.setItem("chainsim.animate.sunPuyo", (checked ? "yes" : "no"));

				// See if we need to enable or disable the animation
				if (checked && !PuyoDisplay.sunPuyoAnimation.running) {
					PuyoDisplay.sunPuyoAnimation.start();
				} else if (!checked && PuyoDisplay.sunPuyoAnimation.running) {
					PuyoDisplay.sunPuyoAnimation.stop();
				}
			})
			.prop("checked", PuyoDisplay.animate.sunPuyo);

		$("#animate-nuisance-tray") // Nuisance Tray animation
			.click(function() {
				var checked = $(this).prop("checked");
				
				PuyoDisplay.animate.nuisanceTray = checked;
				localStorage.setItem("chainsim.animate.nuisanceTray", (checked ? "yes" : "no"));
			})
			.prop("checked", PuyoDisplay.animate.puyo);
		
		// Field Style
		$("#field-style")
			.change(function() {
				$(this).prop("disabled", true);
				FieldDisplay.load($(this).val());
				localStorage.setItem("chainsim.fieldStyle", $(this).val());
			})
			.val(localStorage.getItem("chainsim.fieldStyle") || "standard"); // Default to Standard

		// Character Background
		(function() {
			// Loop through each of the backgrounds
			var index = 0;
			for (var i = 0; i < Content.Field.EyeCandy.CharacterBackgrounds.length; i++) {
				$("#character-background .dropdown-menu").append("<h3>" + Content.Field.EyeCandy.CharacterBackgrounds[i].name + "</h3>");
				var category = $("<ul>");
				
				// Loop through each of the powers in the category
				for (var j = 0; j < Content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds.length; j++) {
					$("<li>")
						.attr("data-category", i)
						.attr("data-value", j)
						.attr("data-id", index)
						.html("<a>" + Content.Field.EyeCandy.CharacterBackgrounds[i].backgrounds[j] + "</a>")
						.appendTo(category);
					index++;
				}
				
				$("#character-background .dropdown-menu").append(category);
			}

			$("#character-background .dropdown-menu a").click(function() {
				var category = parseInt($(this).parent().attr("data-category"), 10),
					value    = parseInt($(this).parent().attr("data-value"),    10),
					id       = parseInt($(this).parent().attr("data-id"),       10);

				$("#character-background .dropdown-menu li.selected").removeClass("selected");
				$(this).parent().addClass("selected");

				if (FieldDisplay.fieldContent === Content.Field.EyeCandy) {
					if (id === 0) {
						$("#field-bg-2").css("background-image", "url('/images/eyecandy/field_char_bg/" + Content.Field.EyeCandy.CharaBGs[Math.floor(Math.random() * Content.Field.EyeCandy.CharaBGs.length)] + "')");
					} else {
						$("#field-bg-2").css("background-image", "url('/images/eyecandy/field_char_bg/" + Content.Field.EyeCandy.CharaBGs[id - 1] + "')");
					}
				}

				$("#character-background-game").text(Content.Field.EyeCandy.CharacterBackgrounds[category].name);
				$("#character-background-character").text(Content.Field.EyeCandy.CharacterBackgrounds[category].backgrounds[value]);

				localStorage.setItem("chainsim.boardBackgroundId", id);
			});
			var boardBackgroundId = localStorage.getItem("chainsim.boardBackgroundId");
			var boardBackgroundCategory = 0;
			var boardBackgroundValue = 0;
			if (boardBackgroundId !== null) {
				boardBackgroundCategory = parseInt($("#character-background .dropdown-menu li[data-id='" + boardBackgroundId + "']").attr("data-category"), 10) || 0;
				boardBackgroundValue = parseInt($("#character-background .dropdown-menu li[data-id='" + boardBackgroundId + "']").attr("data-value"), 10) || 0;
			}

			$("#character-background-game").text(Content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory].name);
			$("#character-background-character").text(Content.Field.EyeCandy.CharacterBackgrounds[boardBackgroundCategory].backgrounds[boardBackgroundValue]);
			$("#character-background .dropdown-menu li[data-id='" + boardBackgroundId + "']").addClass("selected");
		}());

		$.each(PuyoDisplay.puyoSkins, function(index, value) {
			$('<li>')
				.attr("data-value", value.id)
				.append($("<a>")
					.append($("<span>")
						.addClass("puyo-skin")
						.css("background-position", "0px -" + (index * PuyoDisplay.puyoSize) + "px")
					)
				).appendTo("#puyo-skins .dropdown-menu");
		});
		
		$("#puyo-skins .dropdown-menu a").click(function() {
			$("#puyo-skins li.selected").removeClass("selected");
			$($(this).parent()).addClass("selected");

			PuyoDisplay.setPuyoSkin($(this).parent().attr("data-value"));
			localStorage.setItem("chainsim.puyoSkin", $(this).parent().attr("data-value"));
			
			$("#puyo-skins .dropdown-toggle .puyo-skin").css("background-position", "0px -" + (PuyoDisplay.getSkinIndex(PuyoDisplay.puyoSkin.id) * PuyoDisplay.puyoSize) + "px");
		});
		$("#puyo-skins li[data-value='" + PuyoDisplay.puyoSkin.id + "']").addClass("selected");
		$("#puyo-skins .dropdown-toggle .puyo-skin").css("background-position", "0px -" + (PuyoDisplay.getSkinIndex(PuyoDisplay.puyoSkin.id) * PuyoDisplay.puyoSize) + "px");
	}
};

/*
 * Content
 *
 * This contains all the HTML used within the simulator. Unlike v3.x and v4.0, we will
 * be storing all the HTML used in this file rather than seperate XML files.
 */

var Content = {
	Field: {
		Basic: {
			CSSClass: "field-basic"
		},
		
		Standard: {
			CSSClass: "field-standard"
		},
		
		EyeCandy: {
			CSSClass: "field-eyecandy",

			StageBGs: [ // Stage Backgrounds
				"pp7/physics_club.png", "pp7/classroom.png", "pp7/gymnasium.png", "pp7/schoolyard.png",
				"pp7/rooftop.png", "pp7/shopping_district.png", "pp7/fish_store.png", "pp7/farmers_market.png",
				"pp7/lottery.png", "pp7/station_square.png", "pp7/loch_ness.png", "pp7/egypt.png",
				"pp7/himalayas.png", "pp7/easter_island.png", "pp7/area51.png", "pp7/bermuda_triangle.png",
				"pp7/stonehenge.png", "pp7/magic_school.png", "pp7/park.png", "pp7/forest.png",
				"pp7/dark_space.png", "pp7/sight_of_the_galaxy.png"
			],

			CharaBGs: [ // Character Backgrounds
				"black.png",

				"pp15th/amitie.png", "pp15th/raffine.png", "pp15th/sig.png", "pp15th/rider.png",
				"pp15th/klug.png", "pp15th/accord.png", "pp15th/oshare_bones.png", "pp15th/yu.png",
				"pp15th/ocean_prince.png", "pp15th/onion_pixy.png", "pp15th/dongurigaeru.png", "pp15th/lemres.png",
				"pp15th/feli.png", "pp15th/baldanders.png", "pp15th/akuma.png", "pp15th/arle.png",
				"pp15th/nasu_grave.png", "pp15th/suketoudara.png", "pp15th/zoh.png", "pp15th/schezo.png",
				"pp15th/rulue.png", "pp15th/satan.png",

				"pp7/ringo.png", "pp7/amitie.png", "pp7/sig.png", "pp7/raffine.png",
				"pp7/klug.png", "pp7/lemres.png", "pp7/feli.png", "pp7/maguro.png",
				"pp7/risukuma.png", "pp7/arle.png", "pp7/dark_arle.png", "pp7/carbuncle.png",
				"pp7/skeleton_t.png", "pp7/suketoudara.png", "pp7/draco.png", "pp7/schezo.png",
				"pp7/rulue.png", "pp7/satan.png", "pp7/trio.png", "pp7/ecolo.png",
				
				"pp20th/accord.png", "pp20th/amitie.png", "pp20th/arle.png", "pp20th/black_sig.png",
				"pp20th/carbuncle.png", "pp20th/dongurigaeru.png", "pp20th/draco.png", "pp20th/ecolo.png",
				"pp20th/feli.png", "pp20th/klug.png", "pp20th/lemres.png", "pp20th/maguro.png",
				"pp20th/ocean_prince.png", "pp20th/onion_pixy.png", "pp20th/raffine.png", "pp20th/red_amitie.png",
				"pp20th/rider.png", "pp20th/ringo.png", "pp20th/risukuma.png", "pp20th/rulue.png",
				"pp20th/satan.png", "pp20th/schezo.png", "pp20th/sig.png", "pp20th/strange_klug.png",
				"pp20th/suketoudara.png", "pp20th/unusual_ecolo.png", "pp20th/white_feli.png", "pp20th/witch.png", 
				"pp20th/yellow_satan.png", "pp20th/yu_rei.png",

				"ppt/ai.png", "ppt/amitie.png", "ppt/arle.png", "ppt/draco.png",
				"ppt/ecolo.png", "ppt/ess.png", "ppt/ex.png", "ppt/feli.png",
				"ppt/jay_ellie.png", "ppt/klug.png", "ppt/lemres.png", "ppt/maguro.png",
				"ppt/o.png", "ppt/raffine.png", "ppt/ringo.png", "ppt/risukuma.png",
				"ppt/rulue.png", "ppt/satan.png", "ppt/schezo.png", "ppt/sig.png",
				"ppt/suketoudara.png", "ppt/tee.png", "ppt/witch.png", "ppt/zed.png"
			],
			
			Script: function() {
				$("#field-bg-1").css("background-image", "url('/images/eyecandy/field_stage_bg/" + Content.Field.EyeCandy.StageBGs[Math.floor(Math.random() * Content.Field.EyeCandy.StageBGs.length)] + "')");

				var boardBackgroundId = parseInt(localStorage.getItem("chainsim.boardBackgroundId"), 10) || 0;
				if (boardBackgroundId === 0) {
					$("#field-bg-2").css("background-image", "url('/images/eyecandy/field_char_bg/" + Content.Field.EyeCandy.CharaBGs[Math.floor(Math.random() * Content.Field.EyeCandy.CharaBGs.length)] + "')");
				} else {
					$("#field-bg-2").css("background-image", "url('/images/eyecandy/field_char_bg/" + Content.Field.EyeCandy.CharaBGs[boardBackgroundId - 1] + "')");
				}
			},

			CharacterBackgrounds: [
				{
					name: "General",
					backgrounds: [
						"Random", "None"
					]
				},
				{
					name: "Puyo Puyo!! 15th Anniversary",
					backgrounds: [
						"Amitie", "Raffina", "Sig", "Lidelle",
						"Klug", "Ms. Accord", "Oshare Bones", "Yu & Rei",
						"Ocean Prince", "Onion Pixie", "Donguri Gaeru", "Lemres",
						"Feli", "Baldanders", "Akuma", "Arle",
						"Nasu Grave", "Suketoudara", "Zoh Daimaoh", "Schezo",
						"Rulue", "Satan"
					]
				},
				{
					name: "Puyo Puyo 7",
					backgrounds: [
						"Ringo", "Amitie", "Sig", "Raffina",
						"Klug", "Lemres", "Feli", "Maguro",
						"Risukuma", "Arle", "Dark Arle", "Carbuncle",
						"Skeleton-T", "Suketoudara", "Draco", "Schezo",
						"Rulue", "Satan", "Trio", "Ecolo"
					]
				},
				{
					name: "Puyo Puyo!! 20th Anniversary",
					backgrounds: [
						"Ms. Accord", "Amitie", "Arle", "Black Sig",
						"Carbuncle", "Donguri Gaeru", "Draco", "Ecolo",
						"Feli", "Klug", "Lemres", "Maguro",
						"Ocean Prince", "Onion Pixy", "Raffina", "Red Amitie",
						"Lidelle", "Ringo", "Risukuma", "Rulue",
						"Satan", "Schezo", "Sig", "Strange Klug",
						"Suketoudara", "Unusual Ecolo", "White Feli", "Witch",
						"Yellow Satan", "Yu & Rei"
					]
				},
				{
					name: "Puyo Puyo Tetris",
					backgrounds: [
						"Ai", "Amitie", "Arle", "Draco",
						"Ecolo", "Ess", "Ex", "Feli",
						"Jay & Elle", "Klug", "Lemres", "Maguro",
						"O", "Raffina", "Ringo", "Risukuma",
						"Rulue", "Satan", "Schezo", "Sig",
						"Suketoudara", "Tee", "Witch", "Zed"
					]
				}
			]
		}
	}
};

/*
 * Utils
 *
 * Useful utility functions
 */
var Utils = {
	stringFormat: function (format) {
    	var args = Array.prototype.slice.call(arguments, 1);
    	return format.replace(/{(\d+)}/g, function(match, number) { 
     		return typeof args[number] != 'undefined'
        		? args[number] 
        		: match;
    		});
	},

	escape: function (s) {
		var escapeMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;'
		};

		return s.replace(/&(?!\w+;)|[<>"']/g, function (s) {
			return escapeMap[s] || s;
		});
	},

	createDropDownListOptions: function (items) {
		var html = '';

		if (Array.isArray(items)) {
			for (var i = 0; i < items.length; i++) {
				html += $("<option>")
					.val(items[i])
					.text(items[i])[0]
					.outerHTML;
			}
		} else { // Assume it's an object contains keys & values
			$.each(items, function (key, value) {
				html += $("<option>")
					.val(key)
					.text(value)[0]
					.outerHTML;
			});
		}

		return html;
	},

	range: function (start, end, step) {
		if (step === undefined) {
			step = 1;
		}

		var array = [];
		var totalSteps = Math.floor((end - start) / step);
		for (var i = 0; i <= totalSteps; i++) {
			array.push(start + (i * step));
		}

		return array;
	}
}

/*
 * Initalize
 *
 * Initalizes the simulator.
 */

$(document).ready(function() {
	// Set up config values
	Config.basePath = $("body").attr("data-base-path");

	Field.init();            // Initalize the Field
	FieldDisplay.init();     // Initalize the Field Display
	
	// Display the contents of the simulator
	$("#simulator").html(Utils.stringFormat(contentHtml, "/assets"));

	// Enable auto-copying to clipboard
	if (Clipboard.isSupported()) {
		new Clipboard(".clipboard-button");
	} else {
		$(".clipboard-button").hide();
	}

	// Handle resizing for #simulator
	$(window).resize(function () {
		Tabs.fieldWidthChanged();
	});

	// Show/hide elements depending on if we are viewing a shared chain
	if (window.chainData) {
		$(".show-on-shared-chain").show();
	} else {
		$(".hide-on-shared-chain").show();
	}

	FieldDisplay.display();    // Display the Field
	ControlsDisplay.display(); // Display the Controls Display
	PuyoDisplay.display();     // Display the Puyo Display
	Tabs.display();            // Display the tabs

	(function() { // Easter eggs :D
		function easteregg(keys, surprise) { // Set up the main easter egg function
			var key = 0;
			
			$(document).keydown(function(e) {
				if (e.which === keys[key]) {
					key++;
					if (key === keys.length) {
						surprise.call();
						key = 0;
					}
				} else {
					key = 0;
				}
			});
		}
		
		// Puyo Puyo~n 108 chain secret
		// It's simply the Konami code, silly!
		// Code: Up, Up, Down, Down, Left, Right, B, A, Enter
		easteregg([38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13], function() {
			Field.setChain(
				"421212224324123312131211442442211213431123321132142423" +
				"424324123341244343221344222431343211341112142312433213" +
				"342443412321234123124434123212341231334123212341231241" +
				"412321234123121234123412341244234123412341233412341234" +
				"123412311234123412341214434123412341234144341234123412" +
				"342341234123412341134123412341234121341234123412342134" +
				"123412341234134123412341231421341234123412312341234123" +
				"412341123412341234123412341234123412341234123412341234",
				16, 26 // Set to the 108 chain from Puyo~n
			);
			Simulation.puyoToClear = 4;
			$("#puyo-to-clear").val(Simulation.puyoToClear);
		});
	}());
});

}());