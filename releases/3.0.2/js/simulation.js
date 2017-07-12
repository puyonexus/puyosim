/*
 * Simulation
 */
var Simulation = Class.extend({

	running : false, // If the simulation is running
	paused  : false, // If the simulation is paused
	action  : -1,    // Current action (-1 = no action)
	
	stepMode : false, // Indiciates if we are in step mode
	skipMode : false, // Indiciates if we are in skip mode
	
	speed : 500, // Speed of simulation

	eraseAmount  : 4,  // Erase amount
	targetPoints : 70, // Target Points
	
	pointPuyoBonus : 50, // The bonus point puyo provide
	
	timer : null, // Timer
	
	score    : 0, // Score
	chains   : 0, // Chains
	nuisance : 0, // Nuisance
	
	chainPower : [   0,   8,  16,  32,  64,  96, 128, 160, 192, 224, 256, 288, // Default chain power
				   320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672],
	colorBonus : [[0, 3, 6, 12, 24], [0, 2, 4, 8, 16]], // Color bonuses (Classic, Fever)
	groupBonus : [[0, 2, 3, 4, 5, 6, 7, 10], [0, 1, 2, 3, 4, 5, 6, 8]], // Group bonuses (Classic, Fever)
	lastChainPower : 0, // Last chain power
	chainPowerAdd  : 0, // Amount to add to chain power after it reaches the limit
	scoreMode      : 0, // Score mode (0 = Classic, 1 = Fever)
	
	map : null, // Map
	
	init: function() { // Initalization
	},
	
	start: function() { // Starts the simulation
		if (!this.running)
		{
			this.running = true;
			this.paused  = false;
			
			this.stepMode = false;
			this.skipMode = false;
			simulator.display.toggleSimButtons(true, false, true, false, false);
			
			this.map = simulator.field.map;
			this.action = (this.canDropPuyo() ? 2 : 1);
			this.simulation();
		}
		else if (this.running && (this.paused || this.stepMode))
		{
			this.paused   = false;
			this.stepMode = false;
			simulator.display.toggleSimButtons(true, false, true, false, false);

			this.simulation();
		}
	},
	
	stop: function() { // Stops the simulation
		if (this.running)
		{
			this.running = false;
			this.paused  = false;
			this.action  = -1;
			
			this.stepMode = false;
			this.skipMode = false;
			
			if (this.timer) clearTimeout(this.timer);
			this.timer = null;
			
			this.score    = 0;
			this.chains   = 0;
			this.nuisance = 0;
			
			this.lastChainPower = 0;

			$('#field-score').text(this.score.toString());
			$('#field-chains').text(this.chains.toString());
			$('#field-nuisance').text(this.nuisance.toString());
			simulator.display.displayNuisanceIcons(this.nuisance);
			
			this.setMapFromBuffer(simulator.field.mapBuffer);
			this.map = null;
			
			simulator.display.toggleSimButtons(false, true, false, true, true);
		}
	},
	
	pause: function() { // Pauses the simulation
		if (this.running && !this.paused && !this.stepMode && !this.skipMode)
		{
			this.paused = true;

			if (this.timer) clearTimeout(this.timer);
			this.timer = null;
			
			simulator.display.toggleSimButtons(true, true, false, true, true);
		}
	},	
	
	step: function() { // Preforms one step in the simulation
		if (!this.running)
		{
			this.running = true;
			this.paused  = false;
			
			this.stepMode = true;
			this.skipMode = false;
			simulator.display.toggleSimButtons(true, true, false, true, true);
			
			this.map = simulator.field.map;
			this.action = (this.canDropPuyo() ? 2 : 1);
			this.simulation();
		}
		else if (this.running && !this.skipMode && this.action != -1)
		{
			this.paused   = false;
			this.stepMode = true;
			simulator.display.toggleSimButtons(true, true, false, true, true);

			this.simulation();
		}
	},
	
	skip: function() { // Skip to the end of the simulation
		if (!this.running)
		{
			this.running = true;
			this.paused  = false;
			
			this.stepMode = false;
			this.skipMode = true;
			simulator.display.toggleSimButtons(true, false, false, false, false);
			
			this.map = simulator.field.map;
			this.action = (this.canDropPuyo() ? 2 : 1);
			
			this.simulation();
		}
		if (this.running && (this.paused || this.stepMode))
		{
			this.paused   = false;
			this.stepMode = false;
			this.skipMode = true;
			simulator.display.toggleSimButtons(true, false, false, false, false);

			this.simulation();
		}
	},
	
	simulation: function() { // Preforms the simulation
		if (this.action == 1) // Chaining
		{
			// Create the variables for chaining
			var check      = this.createEmptyMap(false, simulator.field.width, simulator.field.height + 1);
			var chainMade  = false; // Indicates if a chain has been made
			var clearTotal = 0;     // Total amount of puyo that have been cleared
			var pointPuyo  = 0;     // Number of point puyo erased
			
			var groups = [ [], [], [], [], [] ]; // Groups
			
			// Check which puyos to erase
			for (var y = 1; y < simulator.field.height + 1; y++)
			{
				for (var x = 0; x < simulator.field.width; x++)
				{
					if (!check[x][y] && this.map[x][y].isColoredPuyo())
					{
						var cleared   = 1; // Amount of puyo cleared
						var checked   = 1; // Amount of puyo checked
						var puyo      = this.map[x][y].puyo; // Puyo currently being checked
						var list      = [{x: x, y: y}]; // List of puyo to clear
						check[x][y]   = true;
						
						while (checked <= cleared)
						{
							var pos = list[checked - 1];
							// Check the puyo to see if we can make a chain
							if (pos.y > 1 && !check[pos.x][pos.y - 1] && this.map[pos.x][pos.y - 1].puyo == puyo) // Up
							{
								cleared++;
								check[pos.x][pos.y - 1] = true;
								list.push({x: pos.x, y: pos.y - 1});
							}
							if (pos.x > 0 && !check[pos.x - 1][pos.y] && this.map[pos.x - 1][pos.y].puyo == puyo) // Left
							{
								cleared++;
								check[pos.x - 1][pos.y] = true;
								list.push({x: pos.x - 1, y: pos.y});
							}
							if (pos.y < simulator.field.height && !check[pos.x][pos.y + 1] && this.map[pos.x][pos.y + 1].puyo == puyo) // Down
							{
								cleared++;
								check[pos.x][pos.y + 1] = true;
								list.push({x: pos.x, y: pos.y + 1});
							}
							if (pos.x < simulator.field.width - 1 && !check[pos.x + 1][pos.y] && this.map[pos.x + 1][pos.y].puyo == puyo) // Right
							{
								cleared++;
								check[pos.x + 1][pos.y] = true;
								list.push({x: pos.x + 1, y: pos.y});
							}
							
							checked++;
						}

						if (cleared >= this.eraseAmount) // A chain was made
						{
							chainMade   = true;
							clearTotal += cleared;
							
							// Add the erased puyo to the group list
							switch (puyo)
							{
								case Puyo.Red:    groups[0].push(cleared); break;
								case Puyo.Green:  groups[1].push(cleared); break;
								case Puyo.Blue:   groups[2].push(cleared); break;
								case Puyo.Yellow: groups[3].push(cleared); break;
								case Puyo.Purple: groups[4].push(cleared); break;
							}
							
							// Set & Display the popped sprite
							for (var i = 0; i < cleared; i++)
							{
								var pos = list[i];

								switch (this.map[pos.x][pos.y].puyo)
								{
									case Puyo.Red:    this.setPuyo(Puyo.Popped.Red,    pos.x, pos.y); break;
									case Puyo.Green:  this.setPuyo(Puyo.Popped.Green,  pos.x, pos.y); break;
									case Puyo.Blue:   this.setPuyo(Puyo.Popped.Blue,   pos.x, pos.y); break;
									case Puyo.Yellow: this.setPuyo(Puyo.Popped.Yellow, pos.x, pos.y); break;
									case Puyo.Purple: this.setPuyo(Puyo.Popped.Purple, pos.x, pos.y); break;
								}
							
								// Check the nuisance/point/hard puyo around the puyo
								if (pos.y > 1) // Up
								{
									     if (this.map[pos.x][pos.y - 1].puyo == Puyo.Nuisance) this.setPuyo(Puyo.Popped.Nuisance, pos.x, pos.y - 1);
									else if (this.map[pos.x][pos.y - 1].puyo == Puyo.Point)  { this.setPuyo(Puyo.Popped.Point,    pos.x, pos.y - 1); pointPuyo++; }
									else if (this.map[pos.x][pos.y - 1].puyo == Puyo.Hard)     this.setPuyo(Puyo.Nuisance,        pos.x, pos.y - 1);
								}
								if (pos.x > 0) // Left
								{
									     if (this.map[pos.x - 1][pos.y].puyo == Puyo.Nuisance) this.setPuyo(Puyo.Popped.Nuisance, pos.x - 1, pos.y);
									else if (this.map[pos.x - 1][pos.y].puyo == Puyo.Point)  { this.setPuyo(Puyo.Popped.Point,    pos.x - 1, pos.y); pointPuyo++; }
									else if (this.map[pos.x - 1][pos.y].puyo == Puyo.Hard)     this.setPuyo(Puyo.Nuisance,        pos.x - 1, pos.y);
								}
								if (pos.y < simulator.field.height) // Down
								{
									     if (this.map[pos.x][pos.y + 1].puyo == Puyo.Nuisance) this.setPuyo(Puyo.Popped.Nuisance, pos.x, pos.y + 1);
									else if (this.map[pos.x][pos.y + 1].puyo == Puyo.Point)  { this.setPuyo(Puyo.Popped.Point,    pos.x, pos.y + 1); pointPuyo++; }
									else if (this.map[pos.x][pos.y + 1].puyo == Puyo.Hard)     this.setPuyo(Puyo.Nuisance,        pos.x, pos.y + 1);
								}
								if (pos.x < simulator.field.width - 1) // Right
								{
									     if (this.map[pos.x + 1][pos.y].puyo == Puyo.Nuisance) this.setPuyo(Puyo.Popped.Nuisance, pos.x + 1, pos.y);
									else if (this.map[pos.x + 1][pos.y].puyo == Puyo.Point)  { this.setPuyo(Puyo.Popped.Point,    pos.x + 1, pos.y); pointPuyo++; }
									else if (this.map[pos.x + 1][pos.y].puyo == Puyo.Hard)     this.setPuyo(Puyo.Nuisance,        pos.x + 1, pos.y);
								}
							}
						}
					}
				}
			}
			
			if (chainMade)
			{
				// Calculate the clear bonus (whhich requires it's own function)
				var clearBonus = (function(self, groups) {
					var clearBonus = 0; // Clear Bonus
					var colors     = 0; // Colors erased
					var total      = 0; // Amount of groups erased

					for (var color = 0; color < groups.length; color++) // Loop through all the colors.
					{
						if (groups[color].length > 0) colors++;
						for (var i = 0; i < groups[color].length; i++) // Loop through all the groups
						{
							total++;
							
							if (self.eraseAmount < 4) // Erase Amount < 4 uses slightly different scoring
							{
								if (groups[color][i] > 6 + self.eraseAmount)
									clearBonus += self.groupBonus[self.scoreMode][7];
								else
									clearBonus += self.groupBonus[self.scoreMode][groups[color][i] - self.eraseAmount];
							}
							else // Erase Amount >= 4 scoring
							{
								if (groups[color][i] > 10)
									clearBonus += self.groupBonus[self.scoreMode][7];
								else
									clearBonus += self.groupBonus[self.scoreMode][groups[color][i] - 4];
							}
						}
					}
					
					clearBonus += self.colorBonus[self.scoreMode][colors - 1]; // Add the color bonus

					// Add the chain power now
					var strength = 0;
					if (self.chains >= self.chainPower.length)
						strength = self.lastChainPower + self.chainPowerAdd;
					else
						strength = self.chainPower[self.chains];
					
					self.lastChainPower = strength;
					clearBonus += strength;

					clearBonus = Math.min(Math.max(clearBonus, 1), 999);

					return clearBonus;
				})(this, groups);
				
				// Calculate the scoring
				var bonus = ((clearTotal * 10) * clearBonus);
				bonus += (pointPuyo * this.pointPuyoBonus);

				this.chains++;
				this.score += bonus;
				this.nuisance += Math.round(bonus / this.targetPoints); // Target Points = 70 for now. Temporary.
				
				// Drop the puyo now
				this.action = 2;
				if (this.skipMode)
					this.simulation();
				else
				{
					if (!this.stepMode)
					{
						var self = this;
						this.timer = setTimeout(function() { self.simulation(); }, this.speed);
					}
					
					$('#field-chains').text(this.chains.toString());
					$('#field-score').text((clearTotal * 10) + ' x ' + clearBonus + (pointPuyo > 0 ? ' + ' + (pointPuyo * this.pointPuyoBonus) : ''));
					$('#field-nuisance').text(this.nuisance.toString());
					simulator.display.displayNuisanceIcons(this.nuisance);
				}
			}
			else
			{
				this.action = -1;
				
				if (this.skipMode)
				{
					this.setAllPuyoImages();

					$('#field-chains').text(this.chains.toString());
					$('#field-score').text(this.score.toString());
					$('#field-nuisance').text(this.nuisance.toString());
					simulator.display.displayNuisanceIcons(this.nuisance);
				}
				else
					simulator.display.toggleSimButtons(true, false, false, false, false);
			}
		}
		else if (this.action == 2) // Erase & Drop Puyo
		{
			// Erase all the popped puyos
			$('#field-score').text(this.score.toString());
			for (var y = 1; y < simulator.field.height + 1; y++)
			{
				for (var x = 0; x < simulator.field.width; x++)
				{
					if (this.map[x][y].isPopped()) this.setPuyo(Puyo.None, x, y);
				}
			}

			var dropped = this.dropPuyo();
			if (dropped)
			{
				this.action = 1;
				if (this.skipMode)
					this.simulation();
				else
				{
					if (!this.stepMode)
					{
						var self = this;
						this.timer = setTimeout(function() { self.simulation(); }, this.speed);
					}
				}
			}
			else
			{
				this.action = -1;
				
				if (this.skipMode)
				{
					this.setAllPuyoImages();

					$('#field-chains').text(this.chains.toString());
					$('#field-score').text(this.score.toString());
					$('#field-nuisance').text(this.nuisance.toString());
					simulator.display.displayNuisanceIcons(this.nuisance);
				}
				else
					simulator.display.toggleSimButtons(true, false, false, false, false);
			}
		}
	},

	dropPuyo: function() { // Makes the puyo fall. Returns if any puyo actually fell
		var dropped = false;
		
		for (var x = 0; x < simulator.field.width; x++)
		{
			for (var y = simulator.field.height - 1; y >= 0; y--) // Start from the second to last row
			{
				if (this.map[x][y].puyo != Puyo.None && this.map[x][y].puyo != Puyo.Wall && this.map[x][y + 1].puyo == Puyo.None) // Empty space, we can drop
				{
					dropped = true;

					var y2 = y;
					while (y2 < simulator.field.height && this.map[x][y2 + 1].puyo == Puyo.None)
					{
						this.setPuyo(this.map[x][y2].puyo, x, y2 + 1);
						this.setPuyo(Puyo.None, x, y2);
						y2++;
					}
				}
			}
		}
		
		return dropped;
	},
	
	canDropPuyo: function() { // Indiciates if any puyo can be dropped
		for (var x = 0; x < simulator.field.width; x++)
		{
			for (var y = simulator.field.height - 1; y >= 0; y--) // Start from the second to last row
			{
				if (this.map[x][y].puyo != Puyo.None && this.map[x][y].puyo != Puyo.Wall && this.map[x][y + 1].puyo == Puyo.None) // Empty space, we can drop
					return true;
			}
		}
		
		return false;
	},
	
	setPuyo: function(puyo, x, y) { // Sets the puyo at the current position
		this.map[x][y].puyo = puyo;
		if (!this.skipMode)
			simulator.display.setPuyoImage(this.map[x][y], x, y);
	},
	
	setAllPuyoImages: function() { // Updates the puyo images for all puyo
		for (var x = 0; x < simulator.field.width; x++)
		{
			for (var y = 0; y < simulator.field.height + 1; y++)
				simulator.display.setPuyoImage(this.map[x][y], x, y);
		}
	},
	
	setMapFromBuffer: function() { // Sets the map from the buffer (doesn't return anything)
		for (var x = 0; x < simulator.field.width; x++)
		{
			for (var y = 0; y < simulator.field.height + 1; y++)
			{
				this.map[x][y].puyo = simulator.field.mapBuffer[x][y];
				simulator.display.setPuyoImage(this.map[x][y], x, y);
			}
		}
	},
	
	createEmptyMap: function(value, w, h) { // Creates an empty map
		var map = [];
		map.length = w;
		
		for (var x = 0; x < w; x++)
		{
			map[x] = [];
			map[x].length = h;
			
			for (var y = 0; y < h; y++)
			{
				map[x][y] = value;
			}
		}
		
		return map;
	},
	
	isRunning: function() { // Returns if the simulation is running
		return this.running;
	}
});

Simulation.DefaultEraseAmount    = 4;
Simulation.DefaultTargetPoints   = 70;
Simulation.DefaultPointPuyoBonus = 50;
Simulation.DefaultSpeed          = 500;