/*!
 * Puyo Puyo Chain Simulator
 * Version 4.0.0
 * http://puyonexus.net/chainsim/
 *
 * Written by Nick Woronekin
 */

var Simulator = (function() {

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
	Hard:     8,
	Iron:     9,
	Wall:     10,

	Delete: 11
};

Constants.Puyo.Cleared = {
	Red:    12,
	Green:  13,
	Blue:   14,
	Yellow: 15,
	Purple: 16,
	
	Nuisance: 17,
	Point:    18
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
	Hard:     "A",
	Iron:     "3",
	Wall:     "2"
};

Constants.Field = {
	DefaultWidth:  6,
	DefaultHeight: 12
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

var Puyo = function(p, element) {

	var
		puyo, // Current puyo
		DOM;  // DOM element used for this puyo (only set if using DOM for field display)

	function isValid(p) { // Returns if puyo p is a valid puyo
		return (
			p === Constants.Puyo.Red    || p === Constants.Puyo.Green  || p === Constants.Puyo.Blue ||
			p === Constants.Puyo.Yellow || p === Constants.Puyo.Purple ||

			p === Constants.Puyo.Nuisance || p === Constants.Puyo.Hard || p === Constants.Puyo.Point ||
			p === Constants.Puyo.Iron     || p === Constants.Puyo.Wall ||
			
			p === Constants.Puyo.Cleared.Red    || p === Constants.Puyo.Cleared.Green  || p === Constants.Puyo.Cleared.Blue ||
			p === Constants.Puyo.Cleared.Yellow || p === Constants.Puyo.Cleared.Purple ||
			
			p === Constants.Puyo.Cleared.Nuisance || p === Constants.Puyo.Cleared.Point
		);
	}
	
	function isColored() { // Returns if puyo is a colored puyo (not nuisance or other type)
		return (
			puyo === Constants.Puyo.Red    || puyo === Constants.Puyo.Green  || puyo === Constants.Puyo.Blue ||
			puyo === Constants.Puyo.Yellow || puyo === Constants.Puyo.Purple
		);
	}
	
	function isNuisance() { // Returns if puyo is a nuisance puyo
		return (puyo === Constants.Puyo.Nuisance || puyo === Constants.Puyo.Hard || puyo === Constants.Puyo.Point);
	}
	
	function isCleared() { // Returns if puyo has been cleared
		return (
			puyo === Constants.Puyo.Cleared.Red    || puyo === Constants.Puyo.Cleared.Green  || 
			puyo === Constants.Puyo.Cleared.Blue   || puyo === Constants.Puyo.Cleared.Yellow ||
			puyo === Constants.Puyo.Cleared.Purple ||
			
			puyo === Constants.Puyo.Cleared.Nuisance || puyo === Constants.Puyo.Cleared.Point
		);
	}
	
	function getURL() { // Gets the URL for this puyo
		switch (puyo) {
			case Constants.Puyo.None:   return Constants.Puyo.URL.None;
			case Constants.Puyo.Red:    return Constants.Puyo.URL.Red;
			case Constants.Puyo.Green:  return Constants.Puyo.URL.Green;
			case Constants.Puyo.Blue:   return Constants.Puyo.URL.Blue;
			case Constants.Puyo.Yellow: return Constants.Puyo.URL.Yellow;
			case Constants.Puyo.Purple: return Constants.Puyo.URL.Purple;

			case Constants.Puyo.Nuisance: return Constants.Puyo.URL.Nuisance;
			case Constants.Puyo.Point:    return Constants.Puyo.URL.Point;
			case Constants.Puyo.Hard:     return Constants.Puyo.URL.Hard;
			case Constants.Puyo.Iron:     return Constants.Puyo.URL.Iron;
			case Constants.Puyo.Wall:     return Constants.Puyo.URL.Wall;

			default: return Constants.Puyo.URL.None;
		}
	}
	
	function setFromURL(p) { // Sets puyo from the URL
		puyo = (function(p) {
			switch (p) {
				case Constants.Puyo.URL.None:   return Constants.Puyo.None;
				case Constants.Puyo.URL.Red:    return Constants.Puyo.Red;
				case Constants.Puyo.URL.Green:  return Constants.Puyo.Green;
				case Constants.Puyo.URL.Blue:   return Constants.Puyo.Blue;
				case Constants.Puyo.URL.Yellow: return Constants.Puyo.Yellow;
				case Constants.Puyo.URL.Purple: return Constants.Puyo.Purple;

				case Constants.Puyo.URL.Nuisance: return Constants.Puyo.Nuisance;
				case Constants.Puyo.URL.Point:    return Constants.Puyo.Point;
				case Constants.Puyo.URL.Hard:     return Constants.Puyo.Hard;
				case Constants.Puyo.URL.Iron:     return Constants.Puyo.Iron;
				case Constants.Puyo.URL.Wall:     return Constants.Puyo.Wall;

				default: return Constants.Puyo.None;
			}
		})(p);
	}
	
	function getPuyo() { // Returns the puyo
		return puyo;
	}
	
	function setPuyo(p) { // Set the puyo
		if (isValid(p)) {
			puyo = p;
		} else {
			puyo = Constants.Puyo.None;
		}
	}
	
	function getDOM() { // Returns the DOM
		return DOM;
	}
	
	function setDOM(element) { // Sets the DOM
		DOM = element;
	}
	
	// Set the puyo
	if (p !== undefined && isValid(p)) { // Is this a valid puyo?
		puyo = p;
	} else {
		puyo = Constants.Puyo.None;
	}
	
	// Set DOM element (if set)
	if (element !== undefined) {
		DOM = element;
	}
	
	return { // Public API
		isColored:  isColored,
		isNuisance: isNuisance,
		isCleared:  isCleared,
		getURL:     getURL,
		setFromURL: setFromURL,
		getPuyo:    getPuyo,
		setPuyo:    setPuyo,
		getDOM:     getDOM,
		setDOM:     setDOM
	};
};

/*
 * Field
 *
 * Controls the aspects of the field, but doesn't display it
 */

var Field = (function() {

	var
		width  = Constants.Field.DefaultWidth,  // Field Width (Default = 6)
		height = Constants.Field.DefaultHeight, // Field Height (Default = 12)
		loadedFromURLQuery = false, // Chain was loaded from URL query
		publicVars = { // Public Variables
			map: [],          // Map that contains the puyo
			mapEditor: [],    // The map used during the "editing" portion of the simulator
			mapSimulation: [] // The map used during the simulation
		};

	function Map(w, h, m) { // Creates a puyo map, either a new one or from an existing one
		var map = [];

		if (m !== undefined) {
			for (var x = 0; x < w; x++) {
				map[x] = [];
				for (var y = 0; y < h + 1; y++) {
					map[x][y] = new Puyo(m.puyo(x, y), m.get(x, y).getDOM());
				}
			}
		} else {
			for (var x = 0; x < w; x++) {
				map[x] = [];
				for (var y = 0; y < h + 1; y++) {
					map[x][y] = new Puyo(Constants.Puyo.None);
				}
			}
		}
		
		function puyo(x, y) { // Returns puyo at position (x,y)
			return map[x][y].getPuyo();
		}
		
		function get(x, y) { // Returns the puyo object at position (x,y)
			return map[x][y];
		}
		
		function set(x, y, p) { // Sets the puyo at position (x,y)
			map[x][y].setPuyo(p);
			
			if (!PuyoDisplay.getRenderer()) {
				return;
			}

			PuyoDisplay.getRenderer().drawPuyo(x, y, map[x][y]);
			
			if (!PuyoDisplay.animation.isRunning()) { // Redraw all puyo around us
				if (y > 0) { PuyoDisplay.getRenderer().drawPuyo(x, y - 1, map[x][y - 1]); }
				if (x > 0) { PuyoDisplay.getRenderer().drawPuyo(x - 1, y, map[x - 1][y]); }
				if (y < height) {    PuyoDisplay.getRenderer().drawPuyo(x, y + 1, map[x][y + 1]); }
				if (x < width - 1) { PuyoDisplay.getRenderer().drawPuyo(x + 1, y, map[x + 1][y]); }
			}
		}
		
		return {
			puyo: puyo,
			get:  get,
			set:  set
		};
	}
	
	function init() { // Initalize
		if (location.search) { // Load from the URL Query
			loadFromURLQuery();
		}
	}
	
	function setChain(chain, w, h) { // Sets the chain with the specified width and height
		var pos;
		w = w || Constants.Field.DefaultWidth;
		h = h || Constants.Field.DefaultHeight;
		
		if (Simulation.isRunning()) { // Stop the simulation
			Simulation.back();
		}

		if (w !== width || h !== height) {
			width = w;
			height = h;

			publicVars.mapEditor = new Map(width, height);
			publicVars.map = publicVars.mapEditor;

			if (PuyoDisplay.getRenderer()) { // If we have a render, draw up the new field
				PuyoDisplay.getRenderer().uninit();
				$("#field").css({ width: Field.getWidth() * PuyoDisplay.puyoSize + "px", height: (Field.getHeight() + 1) * PuyoDisplay.puyoSize + "px" });
				PuyoDisplay.getRenderer().init();
			}
		}

		pos = chain.length - 1;
		for (var y = h; y >= 0; y--) {
			for (var x = w - 1; x >= 0; x--) {
				if (pos < 0) {
					publicVars.map.set(x, y, Constants.Puyo.None);
				} else {
					publicVars.map.get(x, y).setFromURL(chain.charAt(pos));
					pos--;
					
					if (!PuyoDisplay.getRenderer()) {
						continue;
					}
					
					PuyoDisplay.getRenderer().drawPuyo(x, y, publicVars.map.get(x, y));
					if (!PuyoDisplay.animation.isRunning()) { // Redraw all puyo around us
						if (y > 0) { PuyoDisplay.getRenderer().drawPuyo(x, y - 1, publicVars.map.get(x, y - 1)); }
						if (x > 0) { PuyoDisplay.getRenderer().drawPuyo(x - 1, y, publicVars.map.get(x - 1, y)); }
						if (y < h) {    PuyoDisplay.getRenderer().drawPuyo(x, y + 1, publicVars.map.get(x, y + 1)); }
						if (x < w - 1) { PuyoDisplay.getRenderer().drawPuyo(x + 1, y, publicVars.map.get(x + 1, y)); }
					}
				}
			}
		}
	}

	function loadFromURLQuery() { // Loads a chain from the URL query (location.search)
		if (!location.search) return;
		if (Simulation.isRunning()) Simulation.back(); // Stop the simulator if it is running

		var chainQuery = unescape(location.search);
		if (location.search.length > 2 && chainQuery.charAt(1) === "?") // Old Style Chain Query (v1 & v2)
		{
			var query = chainQuery.substring(2);

			var sizeExp = /\(\d+,\d+\)/;
			if (query.search(sizeExp) === 0) // String contains chain width & height
			{
				var match = query.match(sizeExp)[0];
				var size = match.substring(1, match.length - 1).split(",");

				setChain(query.substring(match.length), parseInt(size[0], 10) || Constants.Field.DefaultWidth, parseInt(size[1], 10) || Constants.Field.DefaultHeight);
			}
			else // String just contains a chain (as far as we know)
				setChain(query, Constants.Field.DefaultWidth, Constants.Field.DefaultHeight);
			
			loadedFromURLQuery = true;
		}
		else // New Style Chain Query (v3)
		{
			var query = (function() { // Create the query string
				var query = {};
				var parameters = chainQuery.substring(1).split("&");
				for (var i = 0; i < parameters.length; i++)
				{
					var parameter = parameters[i].split("=");
					query[parameter[0]] = parameter[1];
				}
				
				return query;
			}());

			if (query.chain) { // If a chain exists in the query, use it
				loadedFromURLQuery = true;
				setChain(query.chain, parseInt(query.w, 10) || Constants.Field.DefaultWidth, parseInt(query.h, 10) || Constants.Field.DefaultHeight);
			}
		}
	}
	
	function mapToString() { // Converts mapEditor to a string that can be shared
		var
			addZeros = false, // Add zeros to the front
			chainString = ""; // The chain string
		for (var y = 0; y < height + 1; y++) {
			for (var x = 0; x < width; x++) {
				if (publicVars.mapEditor.puyo(x, y) === Constants.Puyo.None && !addZeros) {
					continue; // Don't need to add zeros to the front of the string
				}
				
				addZeros = true;
				chainString += publicVars.mapEditor.get(x, y).getURL();
			}
		}
		
		return chainString;
	}
	
	function getWidth() {
		return width;
	}
	
	function getHeight() {
		return height;
	}
	
	function isLoadedFromURLQuery() {
		return loadedFromURLQuery;
	}

	publicVars.mapEditor = new Map(width, height);
	publicVars.map = publicVars.mapEditor;
	
	return { // Public API
		Map:      Map,
		init:     init,
		setChain: setChain,
		loadFromURLQuery: loadFromURLQuery,
		mapToString: mapToString,
		getWidth:  getWidth,
		getHeight: getHeight,
		isLoadedFromURLQuery: isLoadedFromURLQuery,
		publicVars: publicVars
	};
}());

/*
 * Simulation
 *
 * The *heart* of the simulator. Controls the simulation aspect of it (aka it runs it)
 */

var Simulation = (function() {
	var
		running = false,  // Simulator is running
		paused  = false,  // Simulator is paused
		stepMode = false, // Simulator is in step mode
		skipMode = false, // Simulator is in skip mode (skips right to the end of the chain)
		leftoverNuisance = 0, // Leftover nuisance puyo
		action = -1, // Current action
		timer, // The simulation timer
		
		score    = 0, // Score
		chains   = 0, // Chains
		nuisance = 0, // Nuisance

		prevChainPower = 0, // Previous chain power
		colorBonus = [[0, 3, 6, 12, 24], [0, 2, 4, 8, 16]], // Color bonuses (Classic, Fever)
		groupBonus = [[0, 2, 3, 4, 5, 6, 7, 10], [0, 1, 2, 3, 4, 5, 6, 8]], // Group bonuses (Classic, Fever)
		positions = [{x: 0, y: -1}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}], // Positions around us
		publicVars = { // Public Variables
			chainPowers: [   0,   8,  16,  32,  64,  96, 128, 160, 192, 224, 256, 288, // Default chain power
			   320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672],
			chainPowerInc:  0, // Chain power increment
			puyoToClear:    Constants.Simulation.DefaultPuyoToClear,    // Puyo To Clear (Default = 4)
			pointPuyoBonus: Constants.Simulation.DefaultPointPuyoBonus, // Point Puyo Bonus (Default = 50)
			targetPoints:   Constants.Simulation.DefaultTargetPoints,   // Target Points (Default = 70)
			speed: Constants.Simulation.DefaultSpeed, // Speed that the simulator runs at (lower = faster; Default = 500)
			scoreMode: 0 // Score Mode (0 = Classic, 1 = Fever)
		};
	
	function back() { // Stops the chain
		// Reset all variables
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}

		running  = false;
		paused   = false;
		stepMode = false;
		skipMode = false;
		action = -1;
		
		chains = 0;
		score = 0;
		nuisance = 0;
		leftoverNuisance = 0;
		prevChainPower = 0;
		
		$("#field-chains").text(chains);
		$("#field-score").text(score);
		$("#field-nuisance").text(nuisance);
		
		PuyoDisplay.setNuisanceTrayImages(nuisance);
		
		// Display the "editor" chain on the puyo display and set the simulation buttons
		ControlsDisplay.controlButtons(false, true, false, true, true);
		$("#tab-simulator input, #tab-simulator select").prop("disabled", false); // Disable simulator options
		
		Field.publicVars.map = Field.publicVars.mapEditor;
		for (var y = 0; y < Field.getHeight() + 1; y++) {
			for (var x = 0; x < Field.getWidth(); x++) {
				PuyoDisplay.getRenderer().drawPuyo(x, y, Field.publicVars.map.get(x, y));
			}
		}
	}
	
	function start() { // Starts the chain
		if (!running) {
			ControlsDisplay.controlButtons(true, false, true, false, false); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select").prop("disabled", true); // Disable simulator options

			// Set all variables
			running = true;
			Field.publicVars.mapSimulation = new Field.Map(Field.getWidth(), Field.getHeight(), Field.publicVars.mapEditor);
			Field.publicVars.map = Field.publicVars.mapSimulation;
			
			// Check to see if the puyo can fall and go from there
			action = 0;
			if (!dropPuyo()) { // No puyo dropped, start chaining
				chain();
			} else { // Puyo dropped, delay chaining
				timer = setTimeout(function() { chain(); }, publicVars.speed);
			}
		} else if (running && (paused || stepMode)) {
			ControlsDisplay.controlButtons(true, false, true, false, false); // Toggle simulation buttons

			paused = false;
			stepMode = false;
			
			chain();
		}
	}
	
	function pause() { // Pauses the chain
		if (running && !paused && !stepMode && !skipMode) {
			if (timer !== undefined) {
				clearTimeout(timer);
				timer = undefined;
			}
		
			paused = true;
			
			ControlsDisplay.controlButtons(true, true, false, true, true); // Toggle simulation buttons
		}
	}
	
	function step() { // Advances a step in the chain
		if (!running) {
			ControlsDisplay.controlButtons(true, true, false, true, true); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select").prop("disabled", true); // Disable simulator options

			// Set all variables
			running = true;
			stepMode = true;
			Field.publicVars.mapSimulation = new Field.Map(Field.getWidth(), Field.getHeight(), Field.publicVars.mapEditor);
			Field.publicVars.map = Field.publicVars.mapSimulation;
			
			// Check to see if the puyo can fall and go from there
			action = 0;
			if (!dropPuyo()) { // No puyo dropped, start chaining
				chain();
			}
		} else if (running && !skipMode && action != -1) {
			ControlsDisplay.controlButtons(true, true, false, true, true); // Toggle simulation buttons

			paused = false;
			stepMode = true;
			
			chain();
		}
	}
	
	function skip() { // Skips right to the end of the chain
		if (!running) {
			ControlsDisplay.controlButtons(true, false, false, false, false); // Toggle simulation buttons
			$("#tab-simulator input, #tab-simulator select").prop("disabled", true); // Disable simulator options

			// Set all variables
			running = true;
			skipMode = true;
			Field.publicVars.mapSimulation = new Field.Map(Field.getWidth(), Field.getHeight(), Field.publicVars.mapEditor);
			Field.publicVars.map = Field.publicVars.mapSimulation;
			
			// Drop the puyo and start chaining
			action = 0;
			dropPuyo();
			chain();
		} else if (running && !skipMode && action != -1) {
			ControlsDisplay.controlButtons(true, false, false, false, false); // Toggle simulation buttons

			paused = false;
			stepMode = false;
			skipMode = true;
			
			chain();
		}
	}
	
	function chain() { // This preforms the chain
		if (action === 0) { // Preform the chain
			var // Create some variables
				check = [], // "Check" array (will be filled in right after this)
				chainMade = false, // Indiciates if a chain has been made
				puyoCleared      = 0, // Number of puyo that were cleared in the chain
				pointPuyoCleared = 0, // Number of point puyo cleared
				groups = [ [], [], [], [], [] ]; // Groups to sort the colors

			// Create the "check" array
			for (var x = 0; x < Field.getWidth(); x++) {
				check[x] = [];
				for (var y = 0; y < Field.getHeight() + 1; y++) {
					check[x][y] = false;
				}
			}
			
			// Check to see which puyo have been cleared
			for (var y = 1; y < Field.getHeight() + 1; y++) { // Don't check the hidden row
				for (var x = 0; x < Field.getWidth(); x++) {
					if (!check[x][y] && Field.publicVars.map.get(x, y).isColored()) { // Is a colored puyo
						var cleared   = 1; // Amount of puyo cleared
						var checked   = 1; // Amount of puyo checked
						var puyo      = Field.publicVars.map.puyo(x, y); // Puyo currently being checked
						var list      = [{x: x, y: y}]; // List of puyo to clear
						check[x][y]   = true;

						while (checked <= cleared) {
							var pos = list[checked - 1];
							// Check the puyo to see if we can make a chain
							for (var i = 0; i < 4; i++) {
								// Check for out of bounds
								if (positions[i].y == -1 && pos.y <= 1) continue;
								if (positions[i].x == -1 && pos.x <= 0) continue;
								if (positions[i].y == 1 && pos.y >= Field.getHeight())    continue;
								if (positions[i].x == 1 && pos.x >= Field.getWidth() - 1) continue;
								
								// Check to see if the puyo match
								var checkX = pos.x + positions[i].x, checkY = pos.y + positions[i].y; // Shortcuts
								if (!check[checkX][checkY] && Field.publicVars.map.puyo(checkX, checkY) === puyo) {
									cleared++;
									check[checkX][checkY] = true;
									list.push({x: checkX, y: checkY});
								}
							}

							checked++;
						}

						if (cleared >= publicVars.puyoToClear) { // A chain was made
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

							for (var i = 0; i < cleared; i++) { // Set the cleared sprite for the cleared puyo
								var pos = list[i];
								switch (Field.publicVars.map.puyo(pos.x, pos.y)) {
									case Constants.Puyo.Red:    Field.publicVars.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Red);    break;
									case Constants.Puyo.Green:  Field.publicVars.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Green);  break;
									case Constants.Puyo.Blue:   Field.publicVars.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Blue);   break;
									case Constants.Puyo.Yellow: Field.publicVars.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Yellow); break;
									case Constants.Puyo.Purple: Field.publicVars.map.set(pos.x, pos.y, Constants.Puyo.Cleared.Purple); break;
								}
								
								// Check the nuisance/point/hard puyo around the current puyo
								for (var j = 0; j < 4; j++) {
									// Check for out of bounds
									if (positions[j].y == -1 && pos.y <= 1) continue;
									if (positions[j].x == -1 && pos.x <= 0) continue;
									if (positions[j].y == 1 && pos.y >= Field.getHeight())    continue;
									if (positions[j].x == 1 && pos.x >= Field.getWidth() - 1) continue;
									
									// Check to see if the puyo match
									var checkX = pos.x + positions[j].x, checkY = pos.y + positions[j].y; // Shortcuts
									if (Field.publicVars.map.puyo(checkX, checkY) === Constants.Puyo.Nuisance) { // Nuisance Puyo
										Field.publicVars.map.set(checkX, checkY, Constants.Puyo.Cleared.Nuisance);
									} else if (Field.publicVars.map.puyo(checkX, checkY) === Constants.Puyo.Point) { // Point Puyo
										Field.publicVars.map.set(checkX, checkY, Constants.Puyo.Cleared.Point);
										pointPuyoCleared++;
									} else if (Field.publicVars.map.puyo(checkX, checkY) === Constants.Puyo.Hard) { // Hard Puyo
										Field.publicVars.map.set(checkX, checkY, Constants.Puyo.Nuisance);
									}
								}
							}
						}
					}
				}
			}

			if (chainMade) { // Has a chain been made?
				// Calculate the clear bonus (whhich requires it's own function)
				var clearBonus = (function(groups) {
					var clearBonus = 0; // Clear Bonus
					var colors     = 0; // Colors erased
					var total      = 0; // Amount of groups erased

					for (var color = 0; color < groups.length; color++) { // Loop through all the colors.
						if (groups[color].length > 0) colors++;
						for (var i = 0; i < groups[color].length; i++) { // Loop through all the groups
							total++;

							if (publicVars.puyoToClear < 4) { // Puyo to Clear < 4 uses slightly different scoring
								if (groups[color][i] > 6 + publicVars.puyoToClear) {
									clearBonus += groupBonus[publicVars.scoreMode][7];
								} else {
									clearBonus += groupBonus[publicVars.scoreMode][groups[color][i] - publicVars.puyoToClear];
								}
							} else { // Puyo to Clear >= 4 scoring
								if (groups[color][i] > 10) {
									clearBonus += groupBonus[publicVars.scoreMode][7];
								} else {
									clearBonus += groupBonus[publicVars.scoreMode][groups[color][i] - 4];
								}
							}
						}
					}
					
					clearBonus += colorBonus[publicVars.scoreMode][colors - 1]; // Add the color bonus

					// Add the chain power now
					var power = 0;
					if (chains >= publicVars.chainPowers.length) { 
						power = prevChainPower + publicVars.chainPowerInc;
					} else {
						power = publicVars.chainPowers[chains];
					}
					
					prevChainPower = power;
					clearBonus += power;

					clearBonus = Math.min(Math.max(clearBonus, 1), 999); // Limit the clear bonus to between 1 to 999.

					return clearBonus;
				})(groups);
				
				// Calculate the scoring
				var bonus = ((puyoCleared * 10) * clearBonus);
				bonus += (pointPuyoCleared * publicVars.pointPuyoBonus);

				chains++;
				score += bonus;
				
				var nuisanceCalculated = (bonus / publicVars.targetPoints) + leftoverNuisance; // Calculate nuisance
				nuisance += Math.floor(nuisanceCalculated); // Round down and add to nuisance
				leftoverNuisance = nuisanceCalculated % 1; // Save leftover nuisance for the next chain
				
				// Now that we did that, move onto the next action
				action = 1;
				
				if (skipMode) { // If we are in skip mode, move directly onto the next step of the chain
					chain();
				} else {
					$("#field-chains").text(chains);
					$("#field-score").text(((puyoCleared * 10) + (pointPuyoCleared * publicVars.pointPuyoBonus)) + " x " + clearBonus);
					$("#field-nuisance").text(nuisance);
					
					PuyoDisplay.setNuisanceTrayImages(nuisance);
					
					if (!stepMode) { // Set the timer if we aren't in step mode
						timer = setTimeout(function() { chain(); }, publicVars.speed);
					}
				}
			} else { // No chain was made, stop the chain.
				action = -1;

				if (skipMode) { // If we are in skip mode, stop
					for (var y = 0; y < Field.getHeight() + 1; y++) {
						for (var x = 0; x < Field.getWidth(); x++) {
							PuyoDisplay.getRenderer().drawPuyo(x, y, Field.publicVars.map.get(x, y));
						}
					}
					
					$("#field-chains").text(chains);
					$("#field-score").text(score);
					$("#field-nuisance").text(nuisance);
					
					PuyoDisplay.setNuisanceTrayImages(nuisance);
				} else { // Just toggle the buttons
					ControlsDisplay.controlButtons(true, false, false, false, false);
				}
			}

		} else if (action === 1) { // Erase & drop puyo
			$("#field-score").text(score); // Set the score to it's real value now
			
			// Remove any cleared puyo
			for (var y = 1; y < Field.getHeight() + 1; y++) { // Can start at 1 since you can't clear puyo in the hidden row
				for (var x = 0; x < Field.getWidth(); x++) {
					if (Field.publicVars.map.get(x, y).isCleared()) {
						Field.publicVars.map.set(x, y, Constants.Puyo.None);
					}
				}
			}
			
			// Drop the puyo and see if we can continue the chain
			if (dropPuyo()) { // Puyo dropped, continue with the chain
				action = 0;

				if (skipMode) { // If we are in skip mode, move directly onto the next step of the chain
					chain();
				} else if (!stepMode) { // Set the timer if we aren't in step mode
					timer = setTimeout(function() { chain(); }, publicVars.speed);
				}
			} else { // No puyo dropped, stop the chain
				action = -1;

				if (skipMode) { // If we are in skip mode, stop
					for (var y = 0; y < Field.getHeight() + 1; y++) {
						for (var x = 0; x < Field.getWidth(); x++) {
							PuyoDisplay.getRenderer().drawPuyo(x, y, Field.publicVars.map.get(x, y));
						}
					}
					
					$("#field-chains").text(chains);
					$("#field-score").text(score);
					$("#field-nuisance").text(nuisance);
					
					PuyoDisplay.setNuisanceTrayImages(nuisance);
				} else { // Just toggle the buttons
					ControlsDisplay.controlButtons(true, false, false, false, false);
				}
			}
		}
	}
	
	function dropPuyo() { // Makes the puyo fall in place and returns if any puyo changed position
		var dropped = false;

		for (var x = 0; x < Field.getWidth(); x++) {
			for (var y = Field.getHeight() - 1; y >= 0; y--) { // No need to check the bottom row
				if (Field.publicVars.map.puyo(x, y) !== Constants.Puyo.None && Field.publicVars.map.puyo(x, y) !== Constants.Puyo.Wall &&
				    Field.publicVars.map.puyo(x, y + 1) === Constants.Puyo.None) { // There's an empty space below this puyo!
					dropped = true;
					
					var y2 = y;
					while (y2 < Field.getHeight() && Field.publicVars.map.puyo(x, y2 + 1) === Constants.Puyo.None) {
						y2++;
					}
					
					Field.publicVars.map.set(x, y2, Field.publicVars.map.puyo(x, y));
					Field.publicVars.map.set(x, y, Constants.Puyo.None);
				}
			}
		}

		return dropped;
	}
	
	function isRunning() { // Returns if the simulation is running
		return running;
	}
	
	return { // Public API
		publicVars:  publicVars,
		back:  back,
		start: start,
		pause: pause,
		step:  step,
		skip:  skip,
		isRunning: isRunning
	};
}());

/*
 * Simulator Display
 *
 * The main display class, controls showing the field, puyo, and content displays.
 */

var SimulatorDisplay = (function() {
	var loaded = { field: false, content: false }; // Load status
	
	function init() { // Display loading animation while content loads
		$("<div>").attr("id", "loading").appendTo("body");
	}

	function isContentLoaded() { // Returns if the field display, field css, and the content display has been loaded.
		return (loaded.field && loaded.content);
	}
	
	function setLoaded(name) { // Set that name has been loaded
		loaded[name] = true;
		
		if (isContentLoaded()) { // Is everything loaded?
			display();
		}
	}
	
	function display() { // Displays the content (Field & Content Displays)
		$("#loading").fadeOut(500, function() { // Fade out the loading animation, then display content
			$("#loading").remove();

			$("#simulator").html( // Set content of simulator element
				"<div id=\"simulator-field\"><\/div>" +
				"<div id=\"simulator-controls\"><\/div>" +
				"<div id=\"simulator-options\"><\/div>");

			$("#style-select").html( // Set content for the style selector
				"Field Style: " +
				"<select>" +
					"<option value=\"basic\">Basic<\/option>" +
					"<option value=\"standard\" selected=\"selected\">Standard<\/option>" +
					"<option value=\"eyecandy\">Eye Candy<\/option>" +
				"<\/select>");
			$("#style-select > select").change(function() {
				$(this).prop("disabled", true);
				FieldDisplay.load($(this).val());
				Storage.set("fieldstyle", $(this).val());
			}).val(Storage.get("fieldstyle") || "standard");

			$("#simulator, #style-select").hide().fadeIn(500);

			FieldDisplay.display();
			PuyoDisplay.display();
			ContentDisplay.display();
		});
	}
	
	return { // Public API
		init:            init,
		isContentLoaded: isContentLoaded,
		setLoaded:       setLoaded
	};
}());

/*
 * Field Display
 *
 * Controls the display and the style of the field.
 */

var FieldDisplay = (function() {
	var
		styleElement,  // DOM element associated with the field style.
		xml,           // XML object for the style opened.
		publicVars = { // Public Variables
			selectedPuyo: Constants.Puyo.None, // Current puyo selected
			puyoInsertion: false               // Indiciates if we are going to insert puyo to place them.
		};
		
	function init() { // Initalize
		PuyoDisplay.init();
		load(Storage.get("fieldstyle") || "standard");
	}
	
	function load(style) { // Loads the display and the style (need to do this after DOM ready)
		// Load the style
		var styleURL = (function(style) {
			switch (style) {
				case "basic":    return "field-basic.xml";
				case "standard": return "field-standard.xml";
				case "eyecandy": return "field-eyecandy.xml";
				default:         return "field-basic.xml";
			}
		})(style);
		
		$.ajax("xml/" + styleURL, { context: this, dataType: "xml", cache: false })
			.success(function(data) { // AJAX was successful
				// Now we need to load the stylesheet from the xml file
				$.ajax("css/" + $(data).find("css").attr("href"), { context: this, dataType: "text", cache: false } )
					.success(function(cssData) { // AJAX was successful
						// Set content of style
						if (!SimulatorDisplay.isContentLoaded()) { // Just being loaded for the first time
							// In this case, we"ll need to use DOM elements rather than the jQuery way.
							if (!styleElement) { // Create style element if it does not exist
								styleElement = document.createElement("style");
								styleElement.setAttribute("type", "text/css");
								document.getElementsByTagName("head")[0].appendChild(styleElement);
							}

							if (styleElement.styleSheet && styleElement.styleSheet.cssText !== undefined) { // IE way
								styleElement.styleSheet.cssText = cssData;
							} else { // The way every other browser does it
								styleElement.textContent = cssData; // OK to use textContent here.
								// IE < 9 doesn"t support textContent, but IE sets the style using a different method anyway.
							}
							
							xml = data;
							SimulatorDisplay.setLoaded("field"); // Everything for this is loaded.
						}
						else { // We are just changing the style
							$("#simulator-field, #nuisance-tray").fadeOut(500, function() { // Fade out the simulator and display the new one
								if (styleElement.styleSheet && styleElement.styleSheet.cssText !== undefined) { // IE way
									styleElement.styleSheet.cssText = cssData;
								} else { // The way every other browser does it
									styleElement.textContent = cssData; // OK to use textContent here.
									// IE < 9 doesn"t support textContent, but IE sets the style using a different method anyway.
								}

								xml = data;

								$("#simulator-field, #nuisance-tray").fadeIn(500);
								$("#style-select > select").prop("disabled", false);
								
								PuyoDisplay.getRenderer().uninit();
								display();
								PuyoDisplay.getRenderer().init();
							});
						}
					})
					.error(function(data) { // AJAX was not successful
						if (SimulatorDisplay.isContentLoaded() && $("#style-select > select").prop("disabled")) {
							$("#style-select > select").prop("disabled", false);
						}
						
						throw "Error loading CSS for Field Display.";
					});
			})
			.error(function() { // AJAX was not sucessful
				if (SimulatorDisplay.isContentLoaded() && $("#style-select > select").prop("disabled")) {
					$("#style-select > select").prop("disabled", false);
				}
				
				throw "Error loading XML for Field Display.";
			});
	}
	
	function display() { // Displays the field
		var scripts = $(xml).find("scripts").text(); // Scripts that may be in the XML

		$("#simulator-field").html($(xml).find("field").text());
		if (scripts !== "") { // Execute any scripts that may be present
			(new Function(scripts))();
		}
		
		$("#field").css({ width: Field.getWidth() * PuyoDisplay.puyoSize + "px", height: (Field.getHeight() + 1) * PuyoDisplay.puyoSize + "px" });

		// Add field borders for browsers which don"t support border-image
		// I"m looking at you IE
		if (document.body.style.borderImage === undefined &&
			document.body.style.MozBorderImage === undefined &&
			document.body.style.webkitBorderImage === undefined)
		{
			$("#simulator-field").addClass("alternate-border");
			$.each(["top-left", "top", "top-right", "bottom-left", "bottom", "bottom-right", "left", "right"], function() {
				$("<span>").addClass("border-" + this).appendTo("#simulator-field");
			});
		}
		
		// Set up the field cursor
		(function() { // Wrap in a function call
			var
				mouseDown      = false, // A mouse button is pressed
				leftMouseDown  = false, // Left mouse button is pressed
				rightMouseDown = false, // Right mouse button is pressed
				offsetX, // X offset in the DOM
				offsetY, // Y offset in the DOM
				fieldX,  // X position in the field
				fieldY;  // Y position in the field

			$("#field").mouseenter(function(e) {
				if (Simulation.isRunning()) { // Don't allow placing puyo when the simulator is running
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
				if (Simulation.isRunning()) { // Don't allow placing puyo when the simulator is running
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

				if (Simulation.isRunning()) { // Don't allow placing puyo when the simulator is running
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
					if (publicVars.selectedPuyo === Constants.Puyo.Delete) { // Delete this puyo and shift the ones on top down one row
						for (var y = fieldY; y > 0; y--) {
							Field.publicVars.map.set(fieldX, y, Field.publicVars.map.puyo(fieldX, y - 1));
						}
						Field.publicVars.map.set(fieldX, 0, Constants.Puyo.None);
					} else {
						if (publicVars.puyoInsertion) { // Insert puyo
							for (var y = 0; y < fieldY; y++) {
								Field.publicVars.map.set(fieldX, y, Field.publicVars.map.puyo(fieldX, y + 1));
							}
						}

						Field.publicVars.map.set(fieldX, fieldY, publicVars.selectedPuyo);
					}
				} else if (rightMouseDown) { // Right click, delete puyo
					Field.publicVars.map.set(fieldX, fieldY, Constants.Puyo.None);
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
			}).bind("contextmenu", function() {
				return false;
			});
		}());
	}

	return { // Public API
		init:       init,
		load:       load,
		display:    display,
		publicVars: publicVars
	};
}());

/*
 * Puyo Display
 *
 * Controls the style of the puyo and displays it on the field (using either HTML5 Canvas or DOM).
 */

var PuyoDisplay = (function() {

	var
		renderer,  // Renderer function to use (DOMRenderer or CanvasRenderer)
		puyoSkin,  // Current puyo skin
		puyoSize = 32, // Puyo Size (always 32)
		puyoSkins,     // Puyo Skins
		puyoSkinsPath = "images/puyo/32x32", // Puyo Skins Path
		timerNI, // Nuisance Tray Animation timer
		publicVars = { // Public Variables
			animateNuisanceTray: true // Aniamte nuisance tray
		};
	
	function init() { // Initalize the puyo display
		setRenderer((document.createElement("canvas").getContext ? Storage.get("puyo_renderer") || "CanvasRenderer" : "DOMRenderer")); // Set up render
		setPuyoSkin(Storage.get("puyoskin") || "classic");
		
		publicVars.animateNuisanceTray = ((Storage.get("animate_nuisance_tray") || "yes") === "yes");
	}

	function DOMRenderer() { // Using DOM to display the puyo
		function init() { // Initalize the DOM Renderer
			if ((Field.getWidth() !== Constants.Field.DefaultWidth || Field.getHeight() !== Constants.Field.DefaultHeight) && !$("#field-content").hasClass("alternate")) {
				$("#field-content").addClass("alternate");
			} else if (Field.getWidth() === Constants.Field.DefaultWidth && Field.getHeight() === Constants.Field.DefaultHeight && $("#field-content").hasClass("alternate")) {
				$("#field-content").removeClass("alternate");
			}

			$("<div>").attr({ id: "field-DOM", width: Field.getWidth() * puyoSize, height: (Field.getHeight() + 1) * puyoSize }).appendTo("#field");
			
			// Now create all the DOM elements
			for (var y = 0; y < Field.getHeight() + 1; y++) {
				for (var x = 0; x < Field.getWidth(); x++) {
					Field.publicVars.map.get(x, y).setDOM($("<span>").addClass("puyo")
						.css({ top: y * puyoSize, left: x * puyoSize })
						.appendTo("#field-DOM"));
					
					if (Simulation.isRunning()) {
						Field.publicVars.mapEditor.get(x, y).setDOM(Field.publicVars.map.get(x, y).getDOM());
					}
					
					if (y === 0) { // Set opacity for top row
						Field.publicVars.map.get(x, y).getDOM().css("opacity", 0.5);
					}
					
					drawPuyo(x, y, Field.publicVars.map.get(x, y));
				}
			}
		}

		function uninit() { // Uninitalize the DOM Renderer
			$("#field-DOM").remove();
		}

		function drawPuyo(x, y, p) { // Draws the puyo at x, y
			var pos;
			
			if (!p.getDOM()) { // If there isn't a DOM attached to the puyo, don't do anything
				return;
			}

			if (p.getPuyo() === Constants.Puyo.None && p.getDOM().css("background-image") !== "none") { // Remove image if puyo is blank
				p.getDOM().css("background-image", "none");
			} else if (p.getPuyo() !== Constants.Puyo.None) {
				if (p.getDOM().css("background-image") === "none") { // Set background image
					p.getDOM().css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
				}
				
				pos = getImagePosition(x, y, p.getPuyo());
				p.getDOM().css("background-position", "-" + (pos.x * puyoSize) + "px -" + (pos.y * puyoSize) + "px");
			}
		}
		
		function setPuyoSkin() { // Sets the puyo skin
			var newPuyoImage = new Image();
			newPuyoImage.src = puyoSkinsPath + "/" + puyoSkin.image;
			newPuyoImage.onload = function() { // Do it like this so the puyo don't dissapear while the image is loading
				if (animation.isRunning()) { // Stop the animation if it is running
					animation.stop();
				}
				if (puyoSkin.frames !== undefined && puyoSkin.frames > 0) { // Is this puyo skin animated?
					animation.start(puyoSkin.frames);
				}

				puyoImage = newPuyoImage;

				if ($("#field-DOM").length > 0) { // Can we draw the puyo?
					for (var y = 0; y < Field.getHeight() + 1; y++) {
						for (var x = 0; x < Field.getWidth(); x++) {
							var p = Field.publicVars.map.get(x, y);

							if  (p.getDOM().css("background-image") !== "none") { // Set the puyo to the new skin
								p.getDOM().css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')")
							}
						}
					}
				}

				$("#puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)").css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
				
				var nuisanceTrayImages = $("#nuisance-tray span");
				for (var i = 0; i < 6; i++) { // Update the images of the nuisance tray images
					if (nuisanceTrayImages.eq(i).css("background-image") !== "none") {
						nuisanceTrayImages.eq(i).css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
					}
				}
			};
		}

		function getName() { // Returns the name of this renderer
			return "DOMRenderer";
		}

		return { // Public API
			init:        init,
			uninit:      uninit,
			drawPuyo:    drawPuyo,
			setPuyoSkin: setPuyoSkin,
			getName:     getName
		};
	}
	
	function CanvasRenderer() { // Using HTML5 Canvas to display the puyo
		var
			ctx,       // Canvas context
			puyoImage; // Puyo Image sheet

		function init() { // Initalize the Canvas Renderer
			if ((Field.getWidth() !== Constants.Field.DefaultWidth || Field.getHeight() !== Constants.Field.DefaultHeight) && !$("#field-content").hasClass("alternate")) {
				$("#field-content").addClass("alternate");
			} else if (Field.getWidth() === Constants.Field.DefaultWidth && Field.getHeight() === Constants.Field.DefaultHeight && $("#field-content").hasClass("alternate")) {
				$("#field-content").removeClass("alternate");
			}

			$("<canvas>").attr({ id: "field-canvas", width: Field.getWidth() * puyoSize, height: (Field.getHeight() + 1) * puyoSize }).appendTo("#field");
			ctx = document.getElementById("field-canvas").getContext("2d");
			
			// Now draw everything
			for (var y = 0; y < Field.getHeight() + 1; y++) {
				for (var x = 0; x < Field.getWidth(); x++) {
					drawPuyo(x, y, Field.publicVars.map.get(x, y));
				}
			}
		}

		function uninit() { // Uninitalize the Canvas Renderer
			$("#field-canvas").remove();
		}

		function drawPuyo(x, y, p) { // Draws the puyo at x, y
			var pos;
			if (ctx === undefined) return;

			ctx.clearRect(x * puyoSize, y * puyoSize, puyoSize, puyoSize);

			if (p.getPuyo() !== Constants.Puyo.None && puyoImage !== undefined) {
				pos = getImagePosition(x, y, p.getPuyo());
				if (y === 0) { // Puyo in hidden row are partially transparent
					ctx.globalAlpha = 0.5;
					ctx.drawImage(puyoImage, pos.x * puyoSize, pos.y * puyoSize, puyoSize, puyoSize, x * puyoSize, y * puyoSize, puyoSize, puyoSize);
					ctx.globalAlpha = 1;
				} else {
					ctx.drawImage(puyoImage, pos.x * puyoSize, pos.y * puyoSize, puyoSize, puyoSize, x * puyoSize, y * puyoSize, puyoSize, puyoSize);
				}
			}
		}

		function setPuyoSkin() { // Sets the puyo skin
			var newPuyoImage = new Image();
			newPuyoImage.src = puyoSkinsPath + "/" + puyoSkin.image;
			newPuyoImage.onload = function() {
				if (animation.isRunning()) { // Stop the animation if it is running
					animation.stop();
				}

				puyoImage = newPuyoImage;
				
				if (puyoSkin.frames !== undefined && puyoSkin.frames > 0) { // Is this puyo skin animated?
					animation.start(puyoSkin.frames);
				}
				
				if ($("#field-canvas").length > 0) { // Can we draw the puyo?
					for (var y = 0; y < Field.getHeight() + 1; y++) {
						for (var x = 0; x < Field.getWidth(); x++) {
							drawPuyo(x, y, Field.publicVars.map.get(x, y));
						}
					}
				}

				$("#puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)").css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
				
				var nuisanceTrayImages = $("#nuisance-tray span");
				for (var i = 0; i < 6; i++) { // Update the images of the nuisance tray images
					if (nuisanceTrayImages.eq(i).css("background-image") !== "none") {
						nuisanceTrayImages.eq(i).css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
					}
				}
			};
		}
		
		function getName() { // Returns the name of this renderer
			return "CanvasRenderer";
		}
		
		return { // Public API
			init:        init,
			uninit:      uninit,
			drawPuyo:    drawPuyo,
			setPuyoSkin: setPuyoSkin,
			getName:     getName
		};
	}
	
	var animation = (function() { // Animation for the puyo
		var
			frame = 0,       // Current frame the animation is on
			totalFrames,     // Total number of frames in the animation
			timer,           // Timer for setInterval
			running = false; // If the animation is running
		
		function animate() { // Animates the puyo
			frame++;
			if (frame >= totalFrames) {
				frame = 0;
			}

			for (var y = 0; y < Field.getHeight() + 1; y++) {
				for (var x = 0; x < Field.getWidth(); x++) {
					renderer.drawPuyo(x, y, Field.publicVars.map.get(x, y));
				}
			}
			
			$("#puyo-selection .puyo.puyo-red").css("background-position", "-" + (frame * puyoSize) + "px 0px");
			$("#puyo-selection .puyo.puyo-green").css("background-position", "-" + (frame * puyoSize) + "px -" + (1 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-blue").css("background-position", "-" + (frame * puyoSize) + "px -" + (2 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-yellow").css("background-position", "-" + (frame * puyoSize) + "px -" + (3 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-purple").css("background-position", "-" + (frame * puyoSize) + "px -" + (4 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-nuisance").css("background-position", "-" + (frame * puyoSize) + "px -" + (5 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-point").css("background-position", "-" + (frame * puyoSize) + "px -" + (6 * puyoSize) + "px");

			timer = setTimeout(function() { animate(); }, 200);
		}
		
		function start(n) { // Starts the animation (n = total number of frames
			running = true;

			frame = 0;
			totalFrames = n;
			
			timer = setTimeout(function() { animate(); }, 200);

		}

		function stop() { // Stops the animation
			running = false;
			clearTimeout(timer);

			$("#puyo-selection .puyo.puyo-red").css("background-position", "0px 0px");
			$("#puyo-selection .puyo.puyo-green").css("background-position", "0px -" + (1 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-blue").css("background-position", "0px -" + (2 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-yellow").css("background-position", "0px -" + (3 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-purple").css("background-position", "0px -" + (4 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-nuisance").css("background-position", "0px -" + (5 * puyoSize) + "px");
			$("#puyo-selection .puyo.puyo-point").css("background-position", "0px -" + (6 * puyoSize) + "px");
		}
		
		function isRunning() { // Returns if the animation is running
			return running;
		}
		
		function getFrame() { // Returns the current frame of the animation
			return frame;
		}
		
		return { // Public API
			start:     start,
			stop:      stop,
			isRunning: isRunning,
			getFrame:  getFrame
		};
	}());
	
	function getImagePosition(x, y, p) { // Returns the position of the image for background-image (p = puyo object)
		var posX, posY;

		function getXPosition(x, y, p) { // Returns the X position of the puyo
			if (animation.isRunning()) return animation.getFrame(); // Animated
			if (y < 1) return 0;
			if (p === Constants.Puyo.Nuisance || p === Constants.Puyo.Point) return 0;

			function U() { return (y > 1 && Field.publicVars.map.puyo(x, y - 1) === p); }
			function L() { return (x > 0 && Field.publicVars.map.puyo(x - 1, y) === p); }
			function D() { return (y < Field.getHeight()    && Field.publicVars.map.puyo(x, y + 1) === p); }
			function R() { return (x < Field.getWidth() - 1 && Field.publicVars.map.puyo(x + 1, y) === p); }
			
			if (!U() && !L() && !D() && !R()) return 0;
			if (!U() && !L() &&  D() && !R()) return 1;
			if ( U() && !L() && !D() && !R()) return 2;
			if ( U() && !L() &&  D() && !R()) return 3;
			if (!U() && !L() && !D() &&  R()) return 4;
			if (!U() && !L() &&  D() &&  R()) return 5;
			if ( U() && !L() && !D() &&  R()) return 6;
			if ( U() && !L() &&  D() &&  R()) return 7;
			if (!U() &&  L() && !D() && !R()) return 8;
			if (!U() &&  L() &&  D() && !R()) return 9;
			if ( U() &&  L() && !D() && !R()) return 10;
			if ( U() &&  L() &&  D() && !R()) return 11;
			if (!U() &&  L() && !D() &&  R()) return 12;
			if (!U() &&  L() &&  D() &&  R()) return 13;
			if ( U() &&  L() && !D() &&  R()) return 14;
			if ( U() &&  L() &&  D() &&  R()) return 15;
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
			case Constants.Puyo.Hard:     posX = 0; posY = 7; break;
			case Constants.Puyo.Iron:     posX = 1; posY = 7; break;
			case Constants.Puyo.Wall:     posX = 2; posY = 7; break;

			case Constants.Puyo.Cleared.Red:    posX = 3; posY = 7; break;
			case Constants.Puyo.Cleared.Green:  posX = 4; posY = 7; break;
			case Constants.Puyo.Cleared.Blue:   posX = 5; posY = 7; break;
			case Constants.Puyo.Cleared.Yellow: posX = 6; posY = 7; break;
			case Constants.Puyo.Cleared.Purple: posX = 7; posY = 7; break;

			case Constants.Puyo.Cleared.Nuisance: posX = 8; posY = 7; break;
			case Constants.Puyo.Cleared.Point:    posX = 9; posY = 7; break;
		}

		return {x: posX, y: posY};
	}

	function setRenderer(r) { // Sets the render to use
		if (r === "DOMRenderer") { // Set to DOMRenderer
			renderer = DOMRenderer();
		} else if (r === "CanvasRenderer") { // Set to CanvasRenderer
			renderer = CanvasRenderer();
		} else {
			renderer = DOMRenderer(); // Just use DOMRenderer
			throw "Unknown Puyo Renderer selected. Defaulted to DOM Renderer.";
		}
	}
	
	function getRenderer() { // Returns the renderer
		return renderer;
	}
	
	function display() { // Display (in other words, initalize the renderer)
		renderer.init();
	}
	
	function setPuyoSkin(skin) { // Sets the puyo skin
		var index = (function() {
			for (var i = 0; i < puyoSkins.length; i++) {
				if (puyoSkins[i].id === skin) {
					return i;
				}
			}
			
			return -1;
		}());
		
		if (index !== -1) {
			puyoSkin = puyoSkins[index];
			renderer.setPuyoSkin();
		} else {
			puyoSkin = puyoSkins[0];
			renderer.setPuyoSkin();
			//throw "Unknown Puyo Skin Selected. Defaulting to " + puyoSkins[0].id + ".";
		}
	}
	
	function displayPuyoSelection() {
		$("#puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)").css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
	}
	
	function getPuyoSkin() { // Returns the id of the current puyo skin
		return puyoSkin.id;
	}
	
	function getPuyoSkins() { // Returns the puyo skins (used for skin selection)
		return puyoSkins;
	}
	
	function setNuisanceTrayImages(n) { // Sets the nuisance tray images
		var
			amounts = [1, 6, 30, 180, 360, 720, 1440],
			images = $("#nuisance-tray span"),
			nuisance = n;

		for (var i = 5; i >= 0; i--) {
			if (nuisance <= 0) { // No nuisance = no image
				images.eq(i).css("background-image", "none");
			} else {
				for (var am = amounts.length - 1; am >= 0; am--) {
					if (nuisance >= amounts[am]) {
						nuisance -= amounts[am];
						if (images.eq(i).css("background-image") === "none")
							images.eq(i).css("background-image", "url('" + puyoSkinsPath + "/" + puyoSkin.image + "')");
							
						images.eq(i).css("background-position", "-" + (am * 64) + "px -256px");
						break;
					}
				}
			}
		}
		
		if (n !== 0 && publicVars.animateNuisanceTray) { // Make it nice and animate it
			animateNuisanceTrayImages();
		}
	}
	
	function animateNuisanceTrayImages(step) { // Animate the nuisance tray icons (i = steps left), initial is 16 steps
		var images = $("#nuisance-tray span");
		if (step === undefined) { // Step not initalized, so we are just starting the animation
			if (timerNI !== undefined) { // Stop the timer if it is running
				clearTimeout(timerNI);
			}

			step = 16;
			images.css({ left: "80px", opacity: "0.0" });
		} else if (step <= 0) { // Stop animating
			timerNI = undefined;
			images.css("opacity", "1.0");
			return;
		}

		// Animate the icons
		step--;
		images.eq(5).css("left", Math.floor((80 * step / 16)) + "px").css("opacity", "+=0.0625");
		images.eq(4).css("left", Math.floor(32 + (48 * step / 16)) + "px").css("opacity", "+=0.0625");
		images.eq(3).css("left", Math.floor(64 + (16 * step / 16)) + "px").css("opacity", "+=0.0625");
		images.eq(2).css("left", Math.floor(96 - (16 * step / 16)) + "px").css("opacity", "+=0.0625");
		images.eq(1).css("left", Math.floor(128 - (48 * step / 16)) + "px").css("opacity", "+=0.0625");
		images.eq(0).css("left", Math.floor(160 - (80 * step / 16)) + "px").css("opacity", "+=0.0625");
		
		timerNI = setTimeout(function() { animateNuisanceTrayImages(step); }, 16); // 60 FPS
	}
	
	puyoSkins = [ // Set up the puyo skins
		{ id : "classic",   image : "classic.png"   },
		{ id : "puyo4",     image : "puyo4.png"     },
		{ id : "fever",     image : "fever.png"     },
		{ id : "fever_alt", image : "fever_alt.png" },
		{ id : "real",      image : "real.png"      },
		{ id : "moji",      image : "moji.png"      },
		{ id : "beta",      image : "beta.png"      },
		{ id : "cube",      image : "cube.png"      },
		{ id : "clear",     image : "clear.png"     },
		{ id : "chalk",     image : "chalk.png", frames : 4 },
		{ id : "aqua",      image : "aqua.png"      },
		{ id : "degi",      image : "degi.png"      },
		{ id : "shiki",     image : "shiki.png"     }
	];
	
	return { // Public API
		init:         init,
		setRenderer:  setRenderer,
		getRenderer:  getRenderer,
		display:      display,
		animation:    animation,
		setPuyoSkin:  setPuyoSkin,
		displayPuyoSelection: displayPuyoSelection,
		getPuyoSkin:  getPuyoSkin,
		getPuyoSkins: getPuyoSkins,
		setNuisanceTrayImages: setNuisanceTrayImages,
		puyoSize:     puyoSize,
		publicVars:   publicVars
	};
}());

/*
 * Controls Display
 *
 * Displays the controls (note that loading them is Content Display's job).
 */

var ControlsDisplay = (function() {

	function display() { // Displays the controls
		// Note: Content Display sets the HTML of #simulator-controls
		$("#puyo-insertion").change(function() {
			FieldDisplay.publicVars.puyoInsertion = $(this).prop("checked");
		});
		
		$("#field-erase-all").click(function() {
			Field.setChain("", Field.getWidth(), Field.getHeight());
		});
		
		if (!Field.isLoadedFromURLQuery()) { // Hide "Set from URL" if we didn't load anything from the URL query
			$("#field-set-from-url").hide();
		}
		$("#field-set-from-url").click(function() {
			Field.loadFromURLQuery();
		});

		PuyoDisplay.displayPuyoSelection();
		$("#puyo-selection .puyo.puyo-none").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.None; });
		$("#puyo-selection .puyo.puyo-delete").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Delete; });
		$("#puyo-selection .puyo.puyo-red").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Red; });
		$("#puyo-selection .puyo.puyo-green").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Green; });
		$("#puyo-selection .puyo.puyo-blue").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Blue; });
		$("#puyo-selection .puyo.puyo-yellow").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Yellow; });
		$("#puyo-selection .puyo.puyo-purple").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Purple; });
		$("#puyo-selection .puyo.puyo-nuisance").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Nuisance; });
		$("#puyo-selection .puyo.puyo-point").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Point; });
		$("#puyo-selection .puyo.puyo-hard").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Hard; });
		$("#puyo-selection .puyo.puyo-iron").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Iron; });
		$("#puyo-selection .puyo.puyo-wall").click(function() { FieldDisplay.publicVars.selectedPuyo = Constants.Puyo.Wall; });
		$("#puyo-selection .puyo").click(function() {
			$("#puyo-selection .selected").removeClass("selected");
			$(this).parent().addClass("selected");
		});
		$("#puyo-selection .puyo.puyo-none").parent().addClass("selected");
		
		$("#simulation-back").click(Simulation.back);
		$("#simulation-start").click(Simulation.start);
		$("#simulation-pause").click(Simulation.pause);
		$("#simulation-step").click(Simulation.step);
		$("#simulation-skip").click(Simulation.skip);

		$.each(["1 (Slowest)", "2", "3", "4", "5 (Normal)", "6", "7", "8", "9 (Fastest)"], function(index, value) {
			$("#simulation-speed").append("<option value=\"" + ((9 - index) * 100) + "\">" + value + "<\/option>");
		});
		$("#simulation-speed").change(function() {
			Simulation.publicVars.speed = parseInt($(this).val(), 10);
		}).val(Constants.Simulation.DefaultSpeed);
		
		controlButtons(false, true, false, true, true);

		$("#field-score").text("0");
		$("#field-chains").text("0");
		$("#field-nuisance").text("0");
		
		// Set up the nuisance tray images
		// Start from the right and work our way to the left to get the order correct
		for (var i = 5; i >= 0; i--) {
			$("<span>").css("left", (i * 32) + "px").appendTo("#nuisance-tray");
		}
	}
	
	function controlButtons(back, start, pause, step, skip) { // Controls the display of the simulator control buttons
		$("#simulation-back").prop("disabled", !back);
		$("#simulation-start").prop("disabled", !start);
		$("#simulation-pause").prop("disabled", !pause);
		$("#simulation-step").prop("disabled", !step);
		$("#simulation-skip").prop("disabled", !skip);
	}

	return { // Public API
		display:        display,
		controlButtons: controlButtons
	};
}());

/*
 * Content Display
 *
 * Controls the displays of the simulator controls and the options.
 */

var ContentDisplay = (function() {

	var
		onloader, // Content Onloader
		xml;      // XML object for the content loaded.

	function init() { // Load the content (need to do this after DOM ready)
		onloader = new ContentOnloader(); // Set up our content onloader

		$.ajax("xml/content.xml", { context: this, dataType: "xml", cache: false })
			.success(function(data) { // AJAX was successful
				xml = data;
				SimulatorDisplay.setLoaded("content"); // Everything for this is loaded.
			})
			.error(function() {
				throw "Error loading XML for Content Display.";
			});
		
		SavedChains.init();  // Initalize Saved Chains (doing it here as it depends on this content onloader)
		PresetChains.init(); // Initalize Preset Chains (doing it here as it depends on this content onloader)
		ChainPowers.init();  // Initalize Chain Powers (doing it here as it depends on this content onloader)
	}
	
	function display() { // Displays the content display
		$("#simulator-controls").html($(xml).find("simulator-controls").text());
		$("#simulator-options").html($(xml).find("options").text());
		ControlsDisplay.display();

		// Set up the tabs for the options
		$("#options-tab-wrapper ul.tabs > li a").click(function() {
			$("#options-tab-wrapper ul.tabs > li.tab-active").removeClass("tab-active");
			$("#options-panel-content .content-active").removeClass("content-active");
			
			$(this).parent().addClass("tab-active");
			$(this.rel).addClass("content-active");
		});
		$("#options-tab-wrapper ul.tabs > li:first-child a").click();
		
		// "Saved Chains" tab
		$("#save-chain-save").click(function() {
			if ($("#save-chain-name").val() !== "") {
				SavedChains.save($("#save-chain-name").val());
				$("#save-chain-name").val("");
			}
		});
		
		// "Chains" tab
		$("<div>").attr("id", "preset-chains-loading").appendTo("#preset-chains");
		
		// "Simulator" tab
		$("input:radio[name='score-mode']").change(function() { // Score Mode
			switch ($(this).filter(":checked").val()) {
				case "classic": Simulation.publicVars.scoreMode = 0; break;
				case "fever":   Simulation.publicVars.scoreMode = 1; break;
			}
		}).filter("[value='classic']").prop("checked", true);
		
		(function() { // Wrap in a function because we have some functions for a few of these selects
			function range(min, max, inc) { // Sets the range of the select items
				var html = "";
				inc = inc || 1;
				for (var i = min; i <= max; i += inc) {
					html += "<option value=\"" + i + "\">" + i + "<\/option>";
				}
			
				return html;
			}
			function addArray(text, values) { // Adds items from an array
				var html = "";
				for (var i = 0; i < text.length; i++) {
					html += "<option value=\"" + values[i] + "\">" + text[i] + "<\/option>";
				}
			
				return html;
			}

			$("#puyo-to-clear").change(function() {
				Simulation.publicVars.puyoToClear = parseInt($(this).val(), 10);
			}).html(range(2, 6)).val(Constants.Simulation.DefaultPuyoToClear);
			$("#target-points").change(function() {
				Simulation.publicVars.targetPoints = parseInt($(this).val(), 10);
			}).html(range(10, 990, 10)).val(Constants.Simulation.DefaultTargetPoints);
			$("#point-puyo-bonus").change(function() {
				Simulation.publicVars.pointPuyoBonus = parseInt($(this).val(), 10);
			}).html(addArray(
				["50", "100", "300", "500", "1K", "10K", "100K", "500K", "1M"],
				[50, 100, 300, 500, 1000, 10000, 100000, 500000, 1000000]
			)).val(Constants.Simulation.DefaultPointPuyoBonus);

			$("#chain-powers").hide();
			$("<div>").attr("id", "chain-powers-loading").insertAfter("#chain-powers");

			$("#field-size-width").html(range(3, 16)).val(Constants.Field.DefaultWidth);
			$("#field-size-height").html(range(6, 26)).val(Constants.Field.DefaultHeight);
			$("#set-field-size").click(function() {
				var
					w = parseInt($("#field-size-width").val(), 10),
					h = parseInt($("#field-size-height").val(), 10);

				if (w !== Field.getWidth() || h !== Field.getHeight()) {
					Field.setChain("", w, h);
				}
			});
		}());

		// "Links" tab
		(function() {
			function shortenURL(url) { // Shorten URL using bit.ly
				var api = { // API Settings
					longUrl : encodeURIComponent(url), // URL to encode
					login   : "puyonexus", // API Login
					key     : "R_78a3314f3397ad3074f0283611a5bbe9" // API Key
				};
				
				$.getJSON("http://api.bit.ly/v3/shorten?login=" + api.login + "&apiKey=" + api.key + "&longUrl=" + api.longUrl + "&format=json", function(json) {
					if (json.status_code === 200 && json.status_txt === "OK") { // Seems like we have the shortened URL now.
						$("#link-url").text(json.data.url);
					}
				});
			}

			$("#get-links").click(function() {
				var
					chain = Field.mapToString(),
					w = Field.getWidth(),
					h = Field.getHeight(),
					url = "http://www.puyonexus.net/chainsim";
					
				if (w !== Constants.Field.DefaultWidth || h !== Constants.Field.DefaultHeight) { // Include w & h in the url
					if ($("#shorten-link-url").prop("checked")) { // Shorten URL
						shortenURL(url + "/?w=" + w + "&h=" + h + "&chain=" + chain);
					} else {
						$('#link-url').text(url + "/?w=" + w + "&h=" + h + "&chain=" + chain);
					}

					$('#link-image').text(url + "/chainimage.php?w=" + w + "&h=" + h + "&chain=" + chain);
					$('#link-chainID').text('(' + w + ',' + h + ')' + chain);
				} else { // Don't include w & h in the url
					if ($("#shorten-link-url").prop("checked")) { // Shorten URL
						shortenURL(url + "/?chain=" + chain);
					} else {
						$('#link-url').text(url + "/?chain=" + chain);
					}
					
					$('#link-image').text(url + "/chainimage.php?chain=" + chain);
					$('#link-chainID').text(chain);
				} 
			});
		}());

		// "Puyo Skin" tab
		$.each(PuyoDisplay.getPuyoSkins(), function(index, value) {
			$('<li>')
				.append("<input type=\"radio\" name=\"puyo-skin-selection\" id=\"puyo-skin-" + value.id + "\" value=\"" + value.id + "\" \/>")
				.append($("<label>")
					.attr("for", "puyo-skin-" + value.id)
					.addClass("puyo-skin")
					.css("background-position", "0px -" + (index * PuyoDisplay.puyoSize) + "px")
				).appendTo('#puyo-skin-selection');
		});
		$("input[name='puyo-skin-selection']").change(function() {
			PuyoDisplay.setPuyoSkin($(this).filter(":checked").val());
			Storage.set("puyoskin", $(this).filter(":checked").val());
		});
		$("input[name='puyo-skin-selection'][value='" + PuyoDisplay.getPuyoSkin() + "']").prop("checked", true);
		
		// "Settings" tab
		if (!document.createElement("canvas").getContext) { // No canvas support? Disable the option to select Canvas
			$("#puyo-renderer-canvas").prop("disabled", true);
		}
		$("input:radio[name='puyo-renderer']").change(function() { // Score Mode
			switch ($(this).filter(":checked").val()) {
				case "CanvasRenderer":
					if (PuyoDisplay.getRenderer().getName() !== "CanvasRenderer") {
						PuyoDisplay.getRenderer().uninit();
						PuyoDisplay.setRenderer("CanvasRenderer");
						PuyoDisplay.getRenderer().init();
						PuyoDisplay.getRenderer().setPuyoSkin();
						Storage.set("puyo_renderer", "CanvasRenderer");
					}
					break;
				case "DOMRenderer":
					if (PuyoDisplay.getRenderer().getName() !== "DOMRenderer") {
						PuyoDisplay.getRenderer().uninit();
						PuyoDisplay.setRenderer("DOMRenderer");
						PuyoDisplay.getRenderer().init();
						PuyoDisplay.getRenderer().setPuyoSkin();
						Storage.set("puyo_renderer", "DOMRenderer");
					}
					break;
			}
		}).filter("[value='" + PuyoDisplay.getRenderer().getName() + "']").prop("checked", true);
		
		$("input:radio[name='animate-nuisance-tray']").change(function() { // Score Mode
			switch ($(this).filter(":checked").val()) {
				case "yes":
					PuyoDisplay.publicVars.animateNuisanceTray = true;
					Storage.set("animate_nuisance_tray", "yes");
					break;
				case "no":
					PuyoDisplay.publicVars.animateNuisanceTray = false;
					Storage.set("animate_nuisance_tray", "no");
					break;
			}
		}).filter("[value='" + (PuyoDisplay.publicVars.animateNuisanceTray ? "yes" : "no") + "']").prop("checked", true);

		onloader.execute(); // Execute everything in the onloader.
	}
	
	function addToOnloader(f) { // Adds a function to the content display onloader
		onloader.add(f);
	}
	
	return { // Public API
		init:          init,
		display:       display,
		addToOnloader: addToOnloader
	};
}());

/*
 * Saved Chains
 *
 * Loads and displays the saved chains
 */

var SavedChains = (function() {
	var chains = []; // Saved chains array
	
	function init() {
		var
			dataString, // String of the data
			dataArray,  // Array of the data
			data,       // Actual data for a saved chain
			dataObject, // Object of the data
			parameter;  // Used to split the parameter up
			
		dataString = Storage.get("saved_chains") || ""; // Saved chains
		
		// Only support new style chains, so this is ok.
		dataArray = dataString.split(";");

		for (i = 0; i < dataArray.length; i++) {
			if (dataArray[i] === "") { // Make sure it isn't empty
				continue;
			}

			data = dataArray[i].split(",");
			dataObject = {};
			
			for (j = 0; j < data.length; j++) {
				parameter = data[j].split("=");
				dataObject[parameter[0]] = parameter[1];
			}

			chains.push({
				name:   decodeURIComponent(dataObject.name),
				width:  (parseInt(dataObject.w, 10) || Field.DefaultWidth),
				height: (parseInt(dataObject.h, 10) || Field.DefaultHeight),
				chain:  dataObject.chain
			});
		}
		
		ContentDisplay.addToOnloader(function() {
			SavedChains.display();
		});
	}
	
	function load(index) { // Load a chain
		Field.setChain(
			chains[index].chain,
			chains[index].width  || Constants.Field.DefaultWidth,
			chains[index].height || Constants.Field.DefaultHeight
		);
	}
	
	function save(name) { // Save a chain
		if (name === "") { // No name was set
			return;
		}
		
		chains.push({
			name:   name,
			width:  Field.getWidth(),
			height: Field.getHeight(),
			chain:  Field.mapToString()
		});
		
		saveChains();
		display();
	}
	
	function del(index) { // Deletes the chain at index
		chains.splice(index, 1);
		
		saveChains();
		display();
	}
	
	function saveChains() { // Saves the chains
		var
			dataString,
			dataArray = [],
			i;
		
		for (var i = 0; i < chains.length; i++) {
			dataArray.push("name=" + encodeURIComponent(chains[i].name) + ",w=" + chains[i].width + ",h=" + chains[i].height + ",chain=" + chains[i].chain);
		}
		
		dataString = dataArray.join(';');
		Storage.set("saved_chains", dataString);
	}

	function display() { // Display the chains that are saved
		var i; // Loop index

		$("#saved-chains-list").empty(); // Delete any entries that might be displayed
		
		if (chains.length === 0) { // No saved chains
			$("#saved-chains-list").append("<li class=\"center\">There are no saved chains.<\/li>");
		} else {
			for (var i = 0; i < chains.length; i++) {
				$("<li>").html(
					"<dl id=\"saved-chain-" + i + "\">" +
						"<dd><a class=\"chain-name\">" + chains[i].name + "<\/dd>" +
						"<dt>" +
							"<a class=\"icon-delete\" title=\"Delete Chain\"><\/a>" +
						"<\/dt>" +
					"<\/dl>")
					.appendTo("#saved-chains-list");
				
				$("#saved-chain-" + i + " .chain-name").bind("click", { index: i }, function(event) {
					load(event.data.index);
				});
				$("#saved-chain-" + i + " .icon-delete").bind("click", { index: i }, function(event) {
					del(event.data.index);
				});
			}
		}
	}
	
	return { // Public API
		init:    init,
		save:    save,
		display: display
	};
}());

/*
 * Preset Chains
 *
 * Loads and displays the chain presets available. Since we use JSON rather than XML now,
 * this will be easier & much simpler.
 */

var PresetChains = (function() {

	var
		chains,   // Chains
		map = []; // Map for the groups
	
	function init() { // Load the preset chains
		$.getJSON("js/presetchains.js")
			.success(function(data) {
				chains = data;
				ContentDisplay.addToOnloader(function() {
					PresetChains.display();
				});
			})
			.error(function() {
				throw "Unable to load the preset chains.";
			});
	}
	
	function setChain(index, set, color, amount) { // Sets the chain to the preset chain with the specified arguments.
		Field.setChain(map[index].sets[set].colors[color].chains[amount].chain, map[index].fieldWidth, map[index].fieldHeight);
		Simulation.publicVars.puyoToClear = map[index].puyoToClear;
		$("#puyo-to-clear").val(map[index].puyoToClear);
	}
	
	function display() {
		var optgroup, index = 0;
		
		$("#preset-chains-loading").remove();

		$("#tab-preset-chains").html(
		"<select id=\"preset-chains-group-select\"><\/select>" +
		"<hr \/>" +
		"<ul id=\"preset-chains-list\"><\/ul>");

		for (var series = 0; series < chains.length; series++) {
			optgroup = $("<optgroup>").attr("label", chains[series].name);

			for (var group = 0; group < chains[series].groups.length; group++) {
				map[index] = chains[series].groups[group];
				
				$("<option>").attr("value", index).text(chains[series].groups[group].name).appendTo(optgroup);
				index++;
			}
			
			$("#preset-chains-group-select").append(optgroup);
		}
		
		$("#preset-chains-group-select").change(function() {
			displayGroup($(this).val());
		}).val(1).change();
	}
	
	function displayGroup(index) {
		var li, dl, dt;
		$("#preset-chains-list").empty(); // Empty the list so we can put new stuff in it
		
		for (var set = 0; set < map[index].sets.length; set++) {
			li = $("<li>");
			dl = $("<dl>");
			dt = $("<dt>");
			
			$("<dd>").text(map[index].sets[set].name).appendTo(dl);
			$(dt).appendTo(dl);
			
			for (var color = 0; color < map[index].sets[set].colors.length; color++) {
				var select = $("<select>").bind("change", {
					set: set,
					color: color
				}, function(event) {
					if ($(this).prop("selectedIndex") === 0) {
						return;
					}
					
					setChain(index, event.data.set, event.data.color, parseInt($(this).val(), 10));

					$(this).prop("selectedIndex", 0);
				});
				$(dt).append(select);
				
				// Add color amount as first index
				$("<option>").text(map[index].sets[set].colors[color].amount + " Col").appendTo(select);
				
				// Add the chains now
				for (var chain = 0; chain < map[index].sets[set].colors[color].chains.length; chain++) {
					$("<option>").attr("value", chain).text(map[index].sets[set].colors[color].chains[chain].amount).appendTo(select);
				}
			}
			
			$(li).append(dl);
			$("#preset-chains-list").append(li);
		}
	}
	
	return { // Public API
		init:         init,
		setChain:     setChain,
		display:      display,
		displayGroup: displayGroup
	};
}());

/*
 * Chain Powers
 *
 * Loads the chain powers from each game and character.
 */

var ChainPowers = (function() {

	var
		powers,   // Chain Powers
		map = []; // Single-dimensional array used for the chain powers
	
	function init() { // Load the chain powers
		$.getJSON("js/chainpowers.js")
			.success(function(data) {
				powers = data;
				ContentDisplay.addToOnloader(function() {
					ChainPowers.display();
				});
			})
			.error(function() {
				throw "Unable to load the chain powers.";
			});
	}
	
	function display() { // Displays the chain powers (and also sets up the map)
		var group, index = 0;

		$("#chain-powers-loading").remove();
		$("#chain-powers").show();
		
		for (var i = 0; i < powers.length; i++) {
			group = $("<optgroup>").attr("label", powers[i].set);

			for (var j = 0; j < powers[i].powers.length; j++) {
				map[index] = {
					values:        powers[i].powers[j].values,
					chainPowerInc: powers[i].powers[j].chainPowerInc || 0,
					scoreMode:     powers[i].scoreMode || "classic",
					targetPoints:  powers[i].targetPoints || 70
				};
				$("<option>").attr("value", index).text(powers[i].powers[j].name).appendTo(group);
				index++;
			}
			
			$("#chain-powers").append(group);
		}
		
		$("#chain-powers").change(function() {
			var power = map[parseInt($(this).val(), 10)];
			Simulation.publicVars.chainPowers = power.values;
			Simulation.publicVars.chainPowerInc = power.chainPowerInc;

			$("input[name='score-mode'][value='" + power.scoreMode + "']").prop("checked", true).change();
			$("#target-points").val(power.targetPoints).change();
		}).val(1); // Set to Puyo Puyo 2
	}
	
	return { // Public API
		init:    init,
		display: display
	};
}());

/*
 * Content Onloader
 *
 * Acts like onload, except for anything.
 */

var ContentOnloader = function() {

	var
		loaded = false, // Indicates if content has been loaded.
		fList  = [];    // Function list
	
	function add(f) { // Adds a function to the list (or executes it if loaded = true)
		if (loaded) {
			f.apply(window);
		}
		else {
			fList.push(f);
		}
	}
	
	function execute() { // Execute all functions and set loaded to true
		var f;

		loaded = true;
		while (fList.length !== 0) {
			f = fList.shift();
			f.apply(window);
		}
	}
	
	function reset() { // Sets loaded to false
		loaded = false;
	}
	
	return { // Public API
		add:     add,
		execute: execute,
		reset:   reset
	};
};

/*
 * Storage
 *
 * Stores the saved settings. Either uses DOM Storage or cookies,
 * sepending on which the browser supports.
 */

var Storage = (function() {

	var handler; // Indicates which storage handler we should use (DOMStorage or Cookies)
		
	var DOMStorage = {
		get: function(key) {
			return localStorage.getItem("chainsim_" + key);
		},
		
		set: function(key, value) {
			localStorage.setItem("chainsim_" + key, value);
		}
	};
	
	var Cookies = {
		get: function(key) {
			var results = document.cookie.match('(^|;) ?chainsim_' + key + '=([^;]*)(;|$)');
			return (results !== null ? decodeURIComponent(results[2]) : null);
		},
		
		set: function(key, value) {
			var date = new Date();
			date.setTime(date.getDate() + 10 * (60 * 60 * 24 * 365)); // Set expiration date (10 years from now)
			
			document.cookie = 
				"chainsim_" + key + '=' + encodeURIComponent(value) +
				'; max-age=' + (10 * (60 * 60 * 24 * 365)) +
				'; expires=' + date.toUTCString() +
				'; path=/';
		}
	};
	
	function get(key) { // Returns the value of key (or null if key does not exist)
		return handler.get(key);
	}
	
	function set(key, value) { // Sets the key with the specified value
		handler.set(key, value);
	}
	
	// Set the handler
	if ("localStorage" in window && window.localStorage !== null) { // Use DOMStorage
		handler = DOMStorage;
	} else { // Use cookies
		handler = Cookies;
	}
	
	return { // Public API
		get: get,
		set: set
	};
}());

/*
 * Initalize
 *
 * Initalizes the simulator.
 */

function init() {
	Field.init();            // Initalize the Field
	SimulatorDisplay.init(); // Initalize the Simulator Display
	FieldDisplay.init();     // Initalize the Field Display
	ContentDisplay.init();   // Initalize the Content Display
	
	(function() { // Easter eggs :D
		function easteregg(keys, surprise) { // Set up the main easter egg function
			var key = 0;
			
			$(document).keydown(function(e) {
				if (e.which === keys[key]) {
					key++;
					if (key == keys.length) {
						surprise.call();
						key = 0;
					}
				} else {
					key = 0;
				}
			});
		}
		easteregg([38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13], function() { // Konami Code
			Field.setChain(
				'674747776576475547454744667667744745654475574457467675' +
				'676576475564766565774566777654565744564447467547655745' +
				'567665647574756475476656475747564754556475747564754764' +
				'647574756475474756475647564766756475647564755647564756' +
				'475647544756475647564746656475647564756466564756475647' +
				'567564756475647564456475647564756474564756475647567456' +
				'475647564756456475647564754674564756475647547564756475' +
				'647564475647564756475647564756475647564756475647564756',
				16, 26 // Set to the 108 chain from Puyo~n
			);
			Simulation.publicVars.puyoToClear = 4;
			$("#puyo-to-clear").val(Simulation.publicVars.puyoToClear);
		});
	}());
}
$(document).ready(init);

}());