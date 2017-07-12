/*!
 * Puyo Puyo Chain Simulator
 * Version 4.2.0
 * http://puyonexus.net/chainsim/
 *
 * By Nick Woronekin
 */

(function() {
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

Constants.Puyo.URL = {
	None:   "0",
	Red:    "4",
	Green:  "7",
	Blue:   "5",
	Yellow: "6",
	Purple: "8",
	
	Nuisance: "1",
	Point:    "B",
	Sun:      "C",
	Hard:     "A",
	Iron:     "3",
	Block:    "2"
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
 * Puyo
 *
 * Contains methods dealing with Puyo, which include getting puyo state
 * and URL conversions.
 */
 
function Puyo(p, element) {
	if (p !== undefined && this.isValid(p)) { // Is this a valid puyo?
		this.puyo = p;
	} else {
		this.puyo = Constants.Puyo.None;
	}
	
	// Set DOM element (if set)
	if (element !== undefined) {
		this.DOM = element;
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
	
	getURL: function() { // Gets the URL for this puyo
		switch (this.puyo) {
			case Constants.Puyo.None:   return Constants.Puyo.URL.None;
			case Constants.Puyo.Red:    return Constants.Puyo.URL.Red;
			case Constants.Puyo.Green:  return Constants.Puyo.URL.Green;
			case Constants.Puyo.Blue:   return Constants.Puyo.URL.Blue;
			case Constants.Puyo.Yellow: return Constants.Puyo.URL.Yellow;
			case Constants.Puyo.Purple: return Constants.Puyo.URL.Purple;

			case Constants.Puyo.Nuisance: return Constants.Puyo.URL.Nuisance;
			case Constants.Puyo.Point:    return Constants.Puyo.URL.Point;
			case Constants.Puyo.Sun:      return Constants.Puyo.URL.Sun;
			case Constants.Puyo.Hard:     return Constants.Puyo.URL.Hard;
			case Constants.Puyo.Iron:     return Constants.Puyo.URL.Iron;
			case Constants.Puyo.Block:    return Constants.Puyo.URL.Block;

			default: return Constants.Puyo.URL.None;
		}
	},
	
	setFromURL: function(p) { // Sets puyo from the URL
		switch (p) {
			case Constants.Puyo.URL.None:   this.puyo = Constants.Puyo.None;   break;
			case Constants.Puyo.URL.Red:    this.puyo = Constants.Puyo.Red;    break;
			case Constants.Puyo.URL.Green:  this.puyo = Constants.Puyo.Green;  break;
			case Constants.Puyo.URL.Blue:   this.puyo = Constants.Puyo.Blue;   break;
			case Constants.Puyo.URL.Yellow: this.puyo = Constants.Puyo.Yellow; break;
			case Constants.Puyo.URL.Purple: this.puyo = Constants.Puyo.Purple; break;

			case Constants.Puyo.URL.Nuisance: this.puyo = Constants.Puyo.Nuisance; break;
			case Constants.Puyo.URL.Point:    this.puyo = Constants.Puyo.Point;    break;
			case Constants.Puyo.URL.Sun:      this.puyo = Constants.Puyo.Sun;      break;
			case Constants.Puyo.URL.Hard:     this.puyo = Constants.Puyo.Hard;     break;
			case Constants.Puyo.URL.Iron:     this.puyo = Constants.Puyo.Iron;     break;
			case Constants.Puyo.URL.Block:    this.puyo = Constants.Puyo.Block;    break;

			default: this.puyo = Constants.Puyo.None; break;
		}
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

		if (location.search) { // We have a chain in the URL. Attempt to use it.
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
					this.map.get(x, y).setFromURL(chain.charAt(pos));
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
		if (!location.search) return;
		if (Simulation.running) Simulation.back(); // Stop the simulator if it is running

		if (location.search.length > 2 && location.search.charAt(1) === "?") // Old Style Chain Query (v1 & v2)
		{
			var matches = /(?:\((\d+),(\d+)(?:,(\d+))?\))?(\w+)/.exec(decodeURIComponent(location.search));
			if (matches !== null && matches.index === 2) { // Looks like a chain we can load
				this.setChain(
					matches[4], // The chain
					(matches[1] === undefined ? Constants.Field.DefaultWidth      : (parseInt(matches[1], 10) || Constants.Field.DefaultWidth)),     // Chain width
					(matches[2] === undefined ? Constants.Field.DefaultHeight     : (parseInt(matches[2], 10) || Constants.Field.DefaultHeight)),    // Chain height
					(matches[3] === undefined ? Constants.Field.DefaultHiddenRows : (parseInt(matches[3], 10) || Constants.Field.DefaultHiddenRows)) // Hidden rows
				);
			
				this.chainInURL = true;
			}
		}
		else // New Style Chain Query (v3)
		{
			var query = {},
			    queryString = location.search.substring(1),
			    re = /([^&=]+)=([^&]*)/g, m;
			
			while ((m = re.exec(queryString)) !== null) {
				query[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
			}

			if (query.chain !== undefined) { // If a chain exists in the query, use it
				this.setChain(
					query.chain, // The chain
					(query.w  === undefined ? Constants.Field.DefaultWidth      : (parseInt(query.w,  10) || Constants.Field.DefaultWidth)),     // Chain width
					(query.h  === undefined ? Constants.Field.DefaultHeight     : (parseInt(query.h,  10) || Constants.Field.DefaultHeight)),    // Chain height
					(query.hr === undefined ? Constants.Field.DefaultHiddenRows : (parseInt(query.hr, 10) || Constants.Field.DefaultHiddenRows)) // Hidden rows
				);
			
				this.chainInURL = true;
			}
		}
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
				chainString += this.mapEditor.get(x, y).getURL();
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
				this.map[x][y] = new Puyo(m.puyo(x, y), m.get(x, y).DOM);
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
		this.leftoverNuisance = 0;
		this.prevChainPower = 0;
		
		$("#field-chains").text(this.chains);
		$("#field-score").text(this.score);
		$("#field-nuisance").text(this.nuisance);
		
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

		// Add field borders for browsers which don't support border-image
		// I"m looking at you IE
		if (document.body.style.borderImage === undefined &&
			document.body.style.OBorderImage === undefined &&
			document.body.style.webkitBorderImage === undefined)
		{
			$("#simulator-field").addClass("alternate-border");
			$.each(["top-left", "top", "top-right", "bottom-left", "bottom", "bottom-right", "left", "right"], function() {
				$("<span>").addClass("border-" + this).appendTo("#simulator-field");
			});
		}
		
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
 * Controls the style of the puyo and displays it on the field (using either HTML5 Canvas or DOM).
 */

var PuyoDisplay = {
	// We're going to start out with our constants
	puyoSize     : 32, // Puyo size in pixels (always 32)
	puyoSkinsPath: "images/puyo/32x32", // Path the puyo skins are located in
	
	// Next we're going to set up our variables
	renderer         : undefined, // The renderer object to use to display the puyo (CanvasRenderer or DOMRenderer)
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
		this.DOMRenderer.parent      = this;
		this.puyoAnimation.parent    = this;
		this.sunPuyoAnimation.parent = this;

		// Set the renderer
		this.setRenderer((document.createElement("canvas").getContext ? (localStorage.getItem("chainsim.puyoRenderer") || "CanvasRenderer") : "DOMRenderer"));
		
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

	setRenderer: function(r) { // Sets the render to use
		if (r === "CanvasRenderer") { // Set to CanvasRenderer
			this.renderer = this.CanvasRenderer;
		} else {
			this.renderer = this.DOMRenderer; // Set to DOMRenderer
		}
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
		$("#puyo-selection .puyo").not(".puyo-none, .puyo-delete").css("background-image", "url('" + this.puyoSkinsPath + "/" + this.puyoSkin.image + "')");
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
		newPuyoImage.src = this.parent.puyoSkinsPath + "/" + this.parent.puyoSkin.image;
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

			$("#puyo-selection .puyo").not(".puyo-none, .puyo-delete").css("background-image", "url('" + self.parent.puyoSkinsPath + "/" + self.parent.puyoSkin.image + "')");
			
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

PuyoDisplay.DOMRenderer = { // DOMRenderer (uses the DOM to display the Puyo. Slower but more compatable)
	parent   : undefined, // Parent object (will be filled in when parent class is initalized
	name     : "DOMRenderer", // Name of the renderer

	init: function() { // Initalize the DOM Renderer
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

		$("<div>").attr({ id: "field-DOM", width: Field.width * this.parent.puyoSize, height: (Field.totalHeight) * this.parent.puyoSize }).appendTo("#field");
		
		// Now create all the DOM elements
		for (var y = 0; y < Field.totalHeight; y++) {
			for (var x = 0; x < Field.width; x++) {
				Field.map.get(x, y).DOM = ($("<span>").addClass("puyo")
					.css({ top: y * this.parent.puyoSize, left: x * this.parent.puyoSize })
					.appendTo("#field-DOM"));
				
				if (Simulation.running) {
					Field.mapEditor.get(x, y).DOM = Field.map.get(x, y).DOM;
				}
				
				if (y < Field.hiddenRows) { // Set opacity for top row
					Field.map.get(x, y).DOM.css("opacity", 0.5);
				}
				
				this.drawPuyo(x, y, Field.map.get(x, y));
			}
		}
		
		// Set up the images in the nuisance tray
		// Start from the right and work our way to the left to get the order correct
		for (var i = 5; i >= 0; i--) {
			$("<span>").css("left", ((5 - i) * 32) + "px").appendTo("#nuisance-tray");
		}
		
		this.drawNuisanceTray(Simulation.nuisance, false);
	},

	uninit: function() { // Uninitalize the DOM Renderer
		$("#field-DOM").remove();
		$("#nuisance-tray span").remove();

		if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
			clearTimeout(this.parent.nuisanceTrayTimer);
		}
	},

	drawPuyo: function(x, y, p) { // Draws the puyo at x, y
		var pos;
		
		if (!p.DOM) { // If there isn't a DOM attached to the puyo, don't do anything
			return;
		}

		if (p.puyo === Constants.Puyo.None && p.DOM.css("background-image") !== "none") { // Remove image if puyo is blank
			p.DOM.css("background-image", "none");
		} else if (p.puyo !== Constants.Puyo.None) {
			if (p.DOM.css("background-image") === "none") { // Set background image
				p.DOM.css("background-image", "url('" + this.parent.puyoSkinsPath + "/" + this.parent.puyoSkin.image + "')");
			}
			
			pos = this.parent.getImagePosition(x, y, p.puyo);
			p.DOM.css("background-position", "-" + (pos.x * this.parent.puyoSize) + "px -" + (pos.y * this.parent.puyoSize) + "px");
		}
	},
	
	setPuyoSkin: function() { // Sets the puyo skin
		var newPuyoImage = new Image(), self = this;
		newPuyoImage.src = this.parent.puyoSkinsPath + "/" + this.parent.puyoSkin.image;
		newPuyoImage.onload = function() { // Do it like this so the puyo don't dissapear while the image is loading
			if (self.parent.puyoAnimation.running) { // Stop the animation if it is running
				self.parent.puyoAnimation.stop();
			}
			if (self.parent.sunPuyoAnimation.running) { // Stop the sun puyo animation if it is running
				self.parent.sunPuyoAnimation.stop();
			}

			if (self.parent.animate.puyo && self.parent.puyoSkin.frames !== undefined && self.parent.puyoSkin.frames > 0) { // Is this puyo skin animated?
				self.parent.puyoAnimation.start(self.parent.puyoSkin.frames);
			}
			if (self.parent.animate.sunPuyo) { // Animate sun puyo?
				self.parent.sunPuyoAnimation.start();
			}

			if ($("#field-DOM").length > 0) { // Can we draw the puyo?
				for (var y = 0; y < Field.totalHeight; y++) {
					for (var x = 0; x < Field.width; x++) {
						var p = Field.map.get(x, y);

						if  (p.DOM.css("background-image") !== "none") { // Set the puyo to the new skin
							p.DOM.css("background-image", "url('" + self.parent.puyoSkinsPath + "/" + self.parent.puyoSkin.image + "')");
						}
					}
				}
			}

			$("#puyo-selection .puyo").not(".puyo-none, .puyo-delete").css("background-image", "url('" + self.parent.puyoSkinsPath + "/" + self.parent.puyoSkin.image + "')");
			
			var nuisanceTrayImages = $("#nuisance-tray span");
			for (var i = 0; i < 6; i++) { // Update the images of the nuisance tray images
				if (nuisanceTrayImages.eq(i).css("background-image") !== "none") {
					nuisanceTrayImages.eq(i).css("background-image", "url('" + self.parent.puyoSkinsPath + "/" + self.parent.puyoSkin.image + "')");
				}
			}
		};
	},
	
	drawNuisanceTray: function(n, animate) { // Draws nuisance in the nuisance tray
		var
			amounts = [1, 6, 30, 180, 360, 720, 1440],
			images = $("#nuisance-tray span"),
			nuisance = n,
			i;

		for (i = 0; i < 6; i++) {
			if (nuisance <= 0) { // No nuisance = no image
				images.eq(i).css("background-image", "none");
			} else {
				for (var am = amounts.length - 1; am >= 0; am--) {
					if (nuisance >= amounts[am]) {
						nuisance -= amounts[am];
						if (images.eq(i).css("background-image") === "none")
							images.eq(i).css("background-image", "url('" + this.parent.puyoSkinsPath + "/" + this.parent.puyoSkin.image + "')");
							
						images.eq(i).css("background-position", "-" + (am * 64) + "px -288px");
						break;
					}
				}
			}
		}
		
		if (this.parent.animate.nuisanceTray && animate !== false && n !== 0) { // Make it nice and animate it
			this.animateNuisanceTray(0, images);
		} else {
			if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
				clearTimeout(this.parent.nuisanceTrayTimer);
				this.parent.nuisanceTrayTimer = undefined;
			}

			for (i = 5; i >= 0; i--) {
				images.eq(i).css("left", ((5 - i) * 32) + "px");
			}
		}
			
	},
	
	animateNuisanceTray: function(step, images) { // Animates the nuisance tray
		if (step === 0) { // Step not initalized, so we are just starting the animation
			if (this.parent.nuisanceTrayTimer !== undefined) { // Stop the timer if it is running
				clearTimeout(this.parent.nuisanceTrayTimer);
			}
		} else if (step > 80) { // Stop animating
			this.parent.nuisanceTrayTimer = undefined;
			return;
		}

		for (var i = 5; i >= 0; i--) {
			images.eq(i).css("left", (80 - step) + ((5 - i) * 32 * (step / 80)) + "px");
		}
		
		var self = this;
		this.parent.nuisanceTrayTimer = setTimeout(function() { self.animateNuisanceTray(step + 5, images); }, 1000 / 60);
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
		$("#simulator-tabs-select").html(
			"<li><a rel=\"tab-saved-chains\">Saved Chains</a></li>" +
			"<li><a rel=\"tab-preset-chains\">Chains</a></li>" +
			"<li><a rel=\"tab-simulator\">Simulator</a></li>" +
			"<li><a rel=\"tab-links\">Links</a></li>" +
			"<li><a rel=\"tab-settings\">Settings</a></li>" +
			"<li><a rel=\"tab-about\">About</a></li>"
		);

		$("#simulator-tabs-select > li a").click(function() {
			var isActiveTab = $(this).parent().hasClass("tab-active");

			$("#simulator-tabs-select > li.tab-active").removeClass("tab-active");
			$("#simulator-tabs .content-active").removeClass("content-active");
			
			if (!$("#simulator-tabs").hasClass("float") || !isActiveTab) {
				$(this).parent().addClass("tab-active");
				$("#" + this.rel).addClass("content-active");
				localStorage.setItem("chainsim.lastTab", this.rel);
			}
			
			if ($("#simulator-tabs").hasClass("float")) {
				if (isActiveTab) {
					$("#simulator-tabs").removeClass("toggled");
				} else {
					$("#simulator-tabs").addClass("toggled");
				}
			}
		});
		if (!$("#simulator-tabs").hasClass("float")) {
			$("#simulator-tabs-select > li a[rel='" + (localStorage.getItem("chainsim.lastTab") || "tab-saved-chains") + "']").click();
		}

		this.SavedChains.init();
		this.Chains.init();
		this.Simulator.init();
		this.Links.init();
		this.Settings.init();
	},
	
	fieldWidthChanged: function() { // Called when the field width changes
		if (Field.width > 6 && !$("#simulator-tabs").hasClass("float")) {
			$("#simulator-tabs").addClass("float");
			$("#simulator-tabs-select .tab-active").removeClass("tab-active");
			$("#simulator-tabs .content-active").removeClass("content-active");
			
			$(document).on("click.options", function(e) {
				var clicked = $(e.target);
				if (!clicked.parents().is("#simulator-tabs, #simulator-tabs-select")) {
					$("#simulator-tabs").removeClass("toggled");
					$("#simulator-tabs-select .tab-active").removeClass("tab-active");
				}
			});
		} else if (Field.width <= 6 && $("#simulator-tabs").hasClass("float")) {
			$("#simulator-tabs").removeClass("float toggled");
			$(document).off("click.options");
			
			if ($("#simulator-tabs-select .tab-active").length === 0) {
				$("#simulator-tabs-select > li a[rel='" + (localStorage.getItem("chainsim.lastTab") || "tab-saved-chains") + "']").click();
			}
		}
	}
};

Tabs.SavedChains = {
	chains: [], // Saved chains array

	init: function() { // Initalizes this tab
		var self = this;

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
		Field.setChain(
			this.chains[index].chain,
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
			chain:      Field.mapToString()
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
			$("#saved-chains-list").append("<li class=\"center\">You have no saved chains.</li>");
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
			$("#saved-chains-list").empty();
		}

		$("<li>").attr("data-value", index)
			.html("<a class=\"icon-delete\" title=\"Delete Chain\"></a><span class=\"chain-name\"><a class=\"link\">" + this.chains[index].name + "</a></span>")
			.appendTo("#saved-chains-list");
	},
	
	removeFromDisplay: function(index) { // Removes the chain with the specified index from the list
		$("#saved-chains-list li[data-value='" + index + "']").remove();
		
		if ($("#saved-chains-list").children("li[data-value]").length === 0) { // If there is nothing left then display the "You have no saved chains" message
			$("#saved-chains-list").append("<li class=\"center\">You have no saved chains.</li>");
		}
	}
};

Tabs.Chains = {
	chains: [], // Chains

	init: function() { // Initalizes this tab
		var self = this;
		
		$("#preset-chains-outer").hide();

		$.getJSON("json/chains.json", function(data) {
			self.chains = data;
			self.display();
		});
	},
	
	display: function() {
		var self = this;
		
		$("#tab-preset-chains .loading").remove();
		$("#preset-chains-outer").show();
		
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
			.html(this.range(2, 6, 1))
			.val(Simulation.puyoToClear); // Default to 4
			
		// Target Points
		$("#target-points")
			.change(function() {
				Simulation.targetPoints = parseInt($(this).val(), 10);
			})
			.html(this.range(10, 990, 10))
			.val(Simulation.targetPoints); // Default to 70
		
		// Point Puyo bonus
		$("#point-puyo-bonus")
			.change(function() {
				Simulation.pointPuyoBonus = parseInt($(this).val(), 10);
			})
			.html(this.values(
				["50", "100", "300", "500", "1K", "10K", "100K", "500K", "1M"],
				[50, 100, 300, 500, 1000, 10000, 100000, 500000, 1000000]
			))
			.val(Simulation.pointPuyoBonus); // Default to 50
		
		// Field Size
		$("#field-size-width")
			.html(this.range(3, 16, 1))
			.val(Field.width); // Default to 6
		$("#field-size-height")
			.html(this.range(6, 26, 1))
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
			.html(this.range(1, 2, 1))
			.val(Field.hiddenRows); // Default to 1

		$("#set-hidden-rows").click(function() {
			var hr = parseInt($("#field-hidden-rows").val(), 10);

			if (hr !== Field.hiddenRows) {
				Field.setChain("", Field.width, Field.height, hr);
			}
		});
		
		// Attack Powers
		(function() {
			$("#attack-powers").hide();

			// Load attack powers
			$.getJSON("json/attackpowers.json", function(data) {
				$("#attack-powers-outer .loading").remove();
				$("#attack-powers").show();
				
				// Loop through each of the powers
				for (var i = 0; i < data.length; i++) {
					$("#attack-powers .dropdown-menu").append("<h3>" + data[i].name + "</h3>");
					var category = $("<ul>");
					
					// Loop through each of the powers in the category
					for (var j = 0; j < data[i].powers.length; j++) {
						$("<li>")
							.attr("data-category", i)
							.attr("data-value", j)
							.html("<a>" + data[i].powers[j].name + "</a>")
							.appendTo(category);
					}
					
					$("#attack-powers .dropdown-menu").append(category);
				}

				$("#attack-powers .dropdown-menu a").click(function() {
					var category = parseInt($(this).parent().attr("data-category"), 10),
					    value    = parseInt($(this).parent().attr("data-value"),    10);

					$("#attack-powers .dropdown-menu li.selected").removeClass("selected");
					$(this).parent().addClass("selected");
					
					Simulation.chainPowers   = data[category].powers[value].values;
					Simulation.chainPowerInc = data[category].powers[value].increment || 0;

					$("#attack-powers-game").text(data[category].name);
					$("#attack-powers-character").text(data[category].powers[value].name);
					
					$("input[name='score-mode'][value='" + (data[category].scoreMode || "classic") + "']").prop("checked", true).change();
					$("#target-points").val((data[category].targetPoints || Constants.Simulator.DefaultTargetPoints)).change();
				});
				$("#attack-powers .dropdown-menu li[data-category='0'][data-value='1'] a").click();
			});
		}());
	},

	range: function(min, max, step) { // Creates options for a select with the specified min and max values in increments of step
		var content = "";
		
		for (var i = min; i <= max; i += step) {
			content += "<option value=\"" + i + "\">" + i + "</option>";
		}
		
		return content;
	},
	
	values: function(text, values) { // Creates options for a select with the specified text and values
		var content = "";
		
		for (var i = 0; i < values.length; i++) {
			content += "<option value=\"" + values[i] + "\">" + text[i] + "</option>";
		}
		
		return content;
	}
};

Tabs.Links = {
	init: function() { // Initalizes this tab
		var self = this;

		$("#get-links").click(function() {
			var chain = Field.mapToString(),
			    url = "http://www.puyonexus.net/chainsim/",
				query    = "?", // Query string
				queryAlt = "";  // Alternate query string
			
			// If the field is not 6x12, we need to include the width and height
			if (Field.width !== Constants.Field.DefaultWidth || Field.height !== Constants.Field.DefaultHeight) {
				query += "w=" + Field.width + "&h=" + Field.height + "&";

				if (Field.hiddenRows !== Constants.Field.DefaultHiddenRows) { // Only fill in the alt query right now if the hidden rows are the same
					query += "hr=" + Field.hiddenRows + "&";
					queryAlt += "(" + Field.width + "," + Field.height + "," + Field.hiddenRows + ")";
				} else {
					queryAlt += "(" + Field.width + "," + Field.height + ")";
				}
			}

			// If the field doesn't have only 1 hidden row, we need to include that information
			else if (Field.hiddenRows !== Constants.Field.DefaultHiddenRows) {
				query += "hr=" + Field.hiddenRows + "&";
				queryAlt += "(" + Field.width + "," + Field.height + "," + Field.hiddenRows + ")";
			}
			
			// Now append the chain to the query
			query += "chain=" + chain;
			queryAlt += chain;
			
			// URL
			if ($("#shorten-link-url").prop("checked")) { // Shorten URL
				self.shortenURL(url + query);
			} else {
				$("#link-url").text(url + query);
			}
			
			// Image
			$("#link-image").text(url + "chainimage.php" + query);
			
			// BBCode
			$("#link-bbcode").text("[puyochain]" + queryAlt + "[/puyochain]");
		});
	},
	
	shortenURL: function(url) { // Shortens the url using bitly
		$.getJSON("https://api-ssl.bitly.com/v3/shorten", {
			access_token: "0df650b84098302cdfbe0375790d6ab334e4fe06",
			longUrl: url
		}, function(json) {
			if (json.status_code === 200 && json.status_txt === "OK") { // Seems like we have the shortened URL now.
				$("#link-url").text(json.data.url);
			} else { // Something happened, just use the link we were originally going to use
				$("#link-url").text(url);
			}
		});
	}
};

Tabs.Settings = {
	init: function() { // Initalizes this tab
		// Puyo Renderer
		if (!document.createElement("canvas").getContext) { // If the browser doesn't support canvas, disable the canvas option
			$("input[name='puyo-renderer'][value='CanvasRenderer']").prop("disabled", true);
		}

		$("input[type='radio'][name='puyo-renderer']")
			.change(function() { // Switch to a different Puyo renderer
				var value = $(this).filter(":checked").val();
				
				if (PuyoDisplay.renderer.name !== value) { // Switch to a different renderer
					PuyoDisplay.renderer.uninit();
					PuyoDisplay.setRenderer(value);
					PuyoDisplay.renderer.init();
					PuyoDisplay.renderer.setPuyoSkin();
					
					localStorage.setItem("chainsim.puyoRenderer", value);
				}
			})
			.filter("[value='" + PuyoDisplay.renderer.name + "']").prop("checked", true); // Set the default renderer to the best one the browser can support.
		
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
 * Dropdown menus
 *
 * Code for the dropdown menus
 * Original code from bootstrap
 */
(function() {
	var toggle = '[data-toggle=dropdown]',
	    Dropdown = function (element) {
			var $el = $(element).on('click.dropdown.data-api', this.toggle);
			$('html').on('click.dropdown.data-api', function () {
				$el.parent().removeClass('open');
			});
		};

	Dropdown.prototype = {

		constructor: Dropdown,

		toggle: function () {
			var $this = $(this),
			    $parent,
			    isActive;

			if ($this.is('.disabled, :disabled')) {
				return;
			}

			$parent = getParent($this);
			isActive = $parent.hasClass('open');

			clearMenus();

			if (!isActive) {
				$parent.toggleClass('open');
				
				$parent.find(".dropdown-menu").css("min-width", $parent.find(toggle).innerWidth() + "px");

				if ($parent.find(".dropdown-menu .selected").length > 0) {
					$parent.find(".dropdown-menu").scrollTop(0); // We need to scroll back to the top first
					$parent.find(".dropdown-menu").scrollTop($parent.find(".dropdown-menu .selected").offset().top - $parent.find(".dropdown-menu").offset().top);
				}
			}

			$this.focus();

			return false;
		}
	};

	function clearMenus() {
		$(toggle).each(function () {
			getParent($(this)).removeClass('open');
		});
	}

	function getParent($this) {
		var selector = $this.attr('data-target'),
		    $parent;

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
		}

		$parent = $(selector);
		if (!$parent.length) {
			$parent = $this.parent();
		}

		return $parent;
	}

   // Apply to dropdown menus
	$(document)
		.on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
		.on('click.dropdown touchstart.dropdown.data-api', '.dropdown form, .dropdown-menu h3', function (e) { e.stopPropagation(); })
		.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation(); })
		.on('click.dropdown.data-api touchstart.dropdown.data-api', toggle, Dropdown.prototype.toggle);
}());

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
			
			Script: function() {
				var stagebg = [ // Stage Backgrounds
					"pp7/physics_club.png", "pp7/classroom.png", "pp7/gymnasium.png", "pp7/schoolyard.png",
					"pp7/rooftop.png", "pp7/shopping_district.png", "pp7/fish_store.png", "pp7/farmers_market.png",
					"pp7/lottery.png", "pp7/station_square.png", "pp7/loch_ness.png", "pp7/egypt.png",
					"pp7/himalayas.png", "pp7/easter_island.png", "pp7/area51.png", "pp7/bermuda_triangle.png",
					"pp7/stonehenge.png", "pp7/magic_school.png", "pp7/park.png", "pp7/forest.png",
					"pp7/dark_space.png", "pp7/sight_of_the_galaxy.png"
				];

				$("#field-bg-1").css("background-image", "url('images/eyecandy/field_stage_bg/" + stagebg[Math.floor(Math.random() * stagebg.length)] + "')");
				
				var charbg = [ // Character Backgrounds
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
					"pp20th/yellow_satan.png", "pp20th/yu_rei.png"
				];

				$("#field-bg-2").css("background-image", "url('images/eyecandy/field_char_bg/" + charbg[Math.floor(Math.random() * charbg.length)] + "')");
			}
		}
	},
	
	HTML: "<div id=\"simulator-field\"><div id=\"field-content\"><div id=\"field-bg-1\"></div><div id=\"field-bg-2\"></div><div id=\"field-bg-3\"></div><div id=\"field\"></div></div></div><div id=\"simulator-controls\"><div id=\"controls-puyo-selection\"><div class=\"box-inner-header\"><label class=\"checkbox\"><input id=\"puyo-insertion\" type=\"checkbox\">Insert</label></div><div id=\"puyo-selection\" class=\"center\"><ul><li><a class=\"puyo puyo-none\"></a></li><li><a class=\"puyo puyo-delete\"></a></li></ul><ul><li><a class=\"puyo puyo-red\"></a></li><li><a class=\"puyo puyo-green\"></a></li><li><a class=\"puyo puyo-blue\"></a></li><li><a class=\"puyo puyo-yellow\"></a></li><li><a class=\"puyo puyo-purple\"></a></li></ul><ul><li><a class=\"puyo puyo-nuisance\"></a></li><li><a class=\"puyo puyo-point\"></a></li><li><a class=\"puyo puyo-sun\"></a></li><li><a class=\"puyo puyo-hard\"></a></li><li><a class=\"puyo puyo-iron\"></a></li><li><a class=\"puyo puyo-block\"></a></li></ul></div><div class=\"box-inner-footer\"><button id=\"field-erase-all\"><img src=\"images/puyo_eraseall.png\" alt=\"Erase All\"></button><button id=\"field-set-from-url\"><img src=\"images/import_from_url.png\" alt=\"Import from URL\"></button></div></div><div id=\"controls-simulation\"><ul class=\"button-group\"><li><input value=\"Back\" id=\"simulation-back\" class=\"first\" type=\"button\"></li><li><input value=\"Start\" id=\"simulation-start\" type=\"button\"></li><li><input value=\"Pause\" id=\"simulation-pause\" type=\"button\"></li><li><input value=\"Step\" id=\"simulation-step\" type=\"button\"></li><li><input value=\"Skip\" id=\"simulation-skip\" class=\"last\" type=\"button\"></li></ul><div class=\"box-inner-footer\">Speed: <select id=\"simulation-speed\"></select></div></div><div id=\"controls-score-display\"><div id=\"nuisance-tray\"></div><dl><dt>Score:</dt><dd><span id=\"field-score\"></span></dd></dl><dl><dt>Chains:</dt><dd><span id=\"field-chains\"></span></dd></dl><dl><dt>Nuisance:</dt><dd><span id=\"field-nuisance\"></span></dd></dl></div></div><div id=\"simulator-tabs\" class=\"tab-container\"><div id=\"tab-saved-chains\" class=\"tab-content\"><div class=\"box-inner-header\"><div class=\"input-append input-append-block\"><input id=\"save-chain-name\" placeholder=\"Enter a name for the chain\" type=\"text\"><input id=\"save-chain-save\" value=\"Save\" type=\"button\"></div></div><ul id=\"saved-chains-list\"></ul></div><div id=\"tab-preset-chains\" class=\"tab-content\"><div class=\"loading center\"></div><div id=\"preset-chains-outer\"><div class=\"box-inner-header\"><div id=\"preset-chains\" class=\"dropdown\"><button class=\"dropdown-toggle dropdown-toggle-block\" data-toggle=\"dropdown\"><div class=\"dropdown-toggle-inner\"><strong><span id=\"preset-chains-series\"></span></strong><br><span id=\"preset-chains-group\"></span><span class=\"caret\"></span></div></button><div class=\"dropdown-menu\" role=\"menu\"></div></div></div><ul id=\"preset-chains-list\"></ul></div></div><div id=\"tab-simulator\" class=\"tab-content\"><dl><dt>Scoring:</dt><dd><label class=\"radio\"><input name=\"score-mode\" value=\"classic\" type=\"radio\">Classic</label><label class=\"radio\"><input name=\"score-mode\" value=\"fever\" type=\"radio\">Fever</label></dd></dl><dl><dt>Puyo to Clear:</dt><dd><select id=\"puyo-to-clear\"></select></dd></dl><dl><dt>Target Points:</dt><dd><select id=\"target-points\"></select></dd></dl><dl><dt>Point Puyo:</dt><dd><select id=\"point-puyo-bonus\"></select></dd></dl><dl><dt>Attack Power:</dt><dd id=\"attack-powers-outer\"><div class=\"loading\"></div><div id=\"attack-powers\" class=\"dropdown\"><button class=\"dropdown-toggle dropdown-toggle-block\" data-toggle=\"dropdown\"><div class=\"dropdown-toggle-inner\"><strong><span id=\"attack-powers-game\"></span></strong><br><span id=\"attack-powers-character\"></span><span class=\"caret\"></span></div></button><div class=\"dropdown-menu\" role=\"menu\"></div></div></dd></dl><dl><dt>Field Size:</dt><dd><select id=\"field-size-width\"></select>&nbsp;x&nbsp;<select id=\"field-size-height\"></select>&nbsp;&nbsp;<input id=\"set-field-size\" value=\"Set\" type=\"button\"></dd></dl><dl><dt>Hidden Rows:</dt><dd><select id=\"field-hidden-rows\"></select>&nbsp;&nbsp;<input id=\"set-hidden-rows\" value=\"Set\" type=\"button\"></dd></dl></div><div id=\"tab-links\" class=\"tab-content\"><div class=\"center\"><input id=\"get-links\" value=\"Get Links\" type=\"button\"></div><div><p id=\"shorten-links\"><label class=\"checkbox\"><input id=\"shorten-link-url\" type=\"checkbox\">Shorten</label></p><p>URL:</p></div><textarea id=\"link-url\" readonly=\"readonly\"></textarea><p>Image:</p><textarea id=\"link-image\" readonly=\"readonly\"></textarea><p>BBCode:</p><textarea id=\"link-bbcode\" readonly=\"readonly\"></textarea></div><div id=\"tab-settings\" class=\"tab-content\"><dl><dt>Puyo Renderer:</dt><dd><label class=\"radio\"><input name=\"puyo-renderer\" value=\"CanvasRenderer\" type=\"radio\">Canvas</label><label class=\"radio\"><input name=\"puyo-renderer\" value=\"DOMRenderer\" type=\"radio\">DOM</label></dd></dl><dl><dt>Animation:</dt><dd><label class=\"checkbox\"><input id=\"animate-puyo\" type=\"checkbox\">Puyo</label><label class=\"checkbox\"><input id=\"animate-sun-puyo\" type=\"checkbox\">Sun Puyo</label><label class=\"checkbox\"><input id=\"animate-nuisance-tray\" type=\"checkbox\">Nuisance Tray</label></dd></dl><dl><dt>Field Style:</dt><dd><select id=\"field-style\"><option value=\"basic\">Basic</option><option value=\"standard\" selected=\"selected\">Standard</option><option value=\"eyecandy\">Eye Candy</option></select></dd><dl><dt>Puyo Skin:</dt><dd><div id=\"puyo-skins\" class=\"dropdown\"><button class=\"dropdown-toggle\" data-toggle=\"dropdown\"><div class=\"dropdown-toggle-inner\"><span class=\"puyo-skin\"></span><span class=\"caret\"></span></div></button><ul class=\"dropdown-menu\" role=\"menu\"></ul></div></dd></dl></dl></div><div id=\"tab-about\" class=\"tab-content\"><div class=\"box-inner-header\"><h3 class=\"center\">Puyo Puyo Chain Simulator</h3><h4 class=\"center\">Version 4.2.0</h4></div><fieldset id=\"release-archive\"><legend>Release Archive:</legend><ul><li><a href=\"/chainsim/versions/v4.2.0/\">v4.2.0</a></li><li><a href=\"/chainsim/versions/v4.1.0/\">v4.1.0</a></li><li><a href=\"/chainsim/versions/v4.0.0/\">v4.0.0</a></li><li><a href=\"/chainsim/versions/v3.0.2/\">v3.0.2</a></li><li><a href=\"/chainsim/versions/v3.0.1/\">v3.0.1</a></li><li><a href=\"/chainsim/versions/v3/\">v3</a></li><li><a href=\"/chainsim/versions/v2.2.1/\">v2.2.1</a></li><li><a href=\"/chainsim/versions/v2.2/\">v2.2</a></li><li><a href=\"/chainsim/versions/v2.1/\">v2.1</a></li><li><a href=\"/chainsim/versions/v2/\">v2</a></li><li><a href=\"/chainsim/versions/v1/\">v1</a></li></ul></fieldset><p class=\"center\"><a href=\"changelog.html\">Changelog</a></p><p class=\"box-inner-footer\">By <strong>Nick Woronekin</strong>.</p></div></div>"
};

/*
 * Initalize
 *
 * Initalizes the simulator.
 */

$(document).ready(function() {
	Field.init();            // Initalize the Field
	FieldDisplay.init();     // Initalize the Field Display
	
	// Display the contents of the simulator
	$("#simulator").html(Content.HTML);

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
				"674747776576475547454744667667744745654475574457467675" +
				"676576475564766565774566777654565744564447467547655745" +
				"567665647574756475476656475747564754556475747564754764" +
				"647574756475474756475647564766756475647564755647564756" +
				"475647544756475647564746656475647564756466564756475647" +
				"567564756475647564456475647564756474564756475647567456" +
				"475647564756456475647564754674564756475647547564756475" +
				"647564475647564756475647564756475647564756475647564756",
				16, 26 // Set to the 108 chain from Puyo~n
			);
			Simulation.puyoToClear = 4;
			$("#puyo-to-clear").val(Simulation.puyoToClear);
		});
	}());
});

}());