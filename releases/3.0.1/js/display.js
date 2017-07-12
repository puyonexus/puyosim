/*
 * Chain Simulator Display
 */

var Display = Class.extend({
	
	cssTag      : undefined, // CSS tag used for the stylesheet
	onloadReady : false,     // If the display has been loaded
	onloadList  : [],        // Onload functions
	
	puyo : { // Styling that has to deal with the puyo
		skin   : 0,  // Skin ID to use (0 = classic = default)
		size   : 32, // Size of puyo (in pixels)
		url    : function() { // Gets the url for the puyo
			return 'images/puyo/' + this.size + 'x' + this.size + '/' + Puyo.Skin[this.skin].image;
		},
		
		animation : {
			animated : false, // If the puyo is animated
			frames   : 0,     // Number of frames in the animation
			frame    : 0,     // Current frame of the animation
			timer    : null   // Timer used for the animation
		}
	},
	
	init: function() {

		$('#style-select select').change(function() { // Set up the style changer
			simulator.display.change($(this).val());
		}).val(localStorage.getItem('chainsim-style') || 'standard');
		
		// Set up the content in #simulator
		$('#simulator').empty();
		$('<div>').attr('id', 'simulator-field').appendTo('#simulator');
		$('<div>').attr('id', 'simulator-controls').appendTo('#simulator');
		$('<div>').attr('id', 'simulator-options-panel').appendTo('#simulator');

		this.load(localStorage.getItem('chainsim-style') || 'standard'); // Load simulator style
		this.setPuyoSkin(localStorage.getItem('chainsim-puyo-skin') || 'classic'); // Load puyo skin
	},
	
	load: function(style) { // Loads the display for the field
		var self = this;
		var url  = (function(style) { // Get the url for the style to load
			switch (style) {
				case 'basic':     return 'basic.xml';
				case 'standard':  return 'standard.xml';
				case 'eye-candy': return 'eye-candy.xml';
				default:          return 'standard.xml';
			}
		})(style);
		
		$.ajax({
			url      : 'xml/' + url,
			type     : 'GET',
			dataType : 'xml',
			success  : function(xml) {

				// Set the content of the field and controls
				$('#simulator-field').html($(xml).find('field').text());
				$('#simulator-controls').html($(xml).find('controls').text());
				
				// Set up the stylesheet
				if (document.createStyleSheet) // IE needs it to be done in a different way
				{
					if (!self.cssTag)
						self.cssTag = document.createStyleSheet('css/' + $(xml).find('css').attr('href'));
					else
						self.cssTag.href = 'css/' + $(xml).find('css').attr('href');
				}
				else // The way every other browser does it
				{
					if (self.cssTag)
						$(self.cssTag).remove();
					
					self.cssTag = $('<link>')
						.attr({
							'rel'   : 'stylesheet',
							'type'  : 'text/css',
							'href'  : 'css/' + $(xml).find('css').attr('href'),
							'media' : 'screen'
						});
					$(self.cssTag).appendTo('head');
				}
				
				// Add field borders for browsers which don't support border-image
				// I'm looking at you IE
				if (typeof document.body.style.borderImage == 'undefined' &&
				    typeof document.body.style.MozBorderImage == 'undefined' &&
					typeof document.body.style.webkitBorderImage == 'undefined')
				{
					$('#simulator-field').addClass('alternate-border');
					var borderClasses = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right', 'left', 'right'];
					$.each(borderClasses, function() {
						$('<span>').addClass('border-' + this).appendTo('#simulator-field');
					});
				}
				
				// Insertion mode checkbox
				$('#insertion-mode').click(function() { simulator.field.insertionMode = $(this).attr('checked'); });
				
				// Set up the puyo display in the puyo selection
				$('#controls-puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)').css('background-image', 'url("' + self.puyo.url() + '")');
				
				$('#puyo-selection .puyo').click(function() {
					$('#puyo-selection .selected').removeClass('selected');
					$(this).parent().addClass('selected');
				});
				$('#controls-puyo-selection .puyo.puyo-none').parent().addClass('selected');
				
				$('#controls-puyo-selection .puyo-none').click(  function() { simulator.field.selectedPuyo = Puyo.None;   });
				$('#controls-puyo-selection .puyo-red').click(   function() { simulator.field.selectedPuyo = Puyo.Red;    });
				$('#controls-puyo-selection .puyo-green').click( function() { simulator.field.selectedPuyo = Puyo.Green;  });
				$('#controls-puyo-selection .puyo-blue').click(  function() { simulator.field.selectedPuyo = Puyo.Blue;   });
				$('#controls-puyo-selection .puyo-yellow').click(function() { simulator.field.selectedPuyo = Puyo.Yellow; });
				$('#controls-puyo-selection .puyo-purple').click(function() { simulator.field.selectedPuyo = Puyo.Purple; });
				
				$('#controls-puyo-selection .puyo-delete').click(  function() { simulator.field.selectedPuyo = Puyo.Delete;   });
				$('#controls-puyo-selection .puyo-nuisance').click(function() { simulator.field.selectedPuyo = Puyo.Nuisance; });
				$('#controls-puyo-selection .puyo-point').click(   function() { simulator.field.selectedPuyo = Puyo.Point;    });
				$('#controls-puyo-selection .puyo-hard').click(    function() { simulator.field.selectedPuyo = Puyo.Hard;     });
				$('#controls-puyo-selection .puyo-iron').click(    function() { simulator.field.selectedPuyo = Puyo.Iron;     });
				$('#controls-puyo-selection .puyo-wall').click(    function() { simulator.field.selectedPuyo = Puyo.Wall;     });
				
				// Set up the Erase All & Set from URL buttons
				$('#field-erase-all').click(function() { simulator.field.erase(); });

				if (location.search)
					$('#field-set-from-url').click(function() { simulator.field.parseChainQuery(); });
				else
					$('#field-set-from-url').remove();
				
				// Set up the simulator control buttons
				$('#simulation-back').click(function()  { simulator.simulation.stop();  });
				$('#simulation-start').click(function() { simulator.simulation.start(); });
				$('#simulation-pause').click(function() { simulator.simulation.pause(); });
				$('#simulation-step').click(function()  { simulator.simulation.step();  });
				$('#simulation-skip').click(function()  { simulator.simulation.skip();  });
				self.toggleSimButtons(false, true, false, true, true);
				
				// Set up the speed control
				$('#simulation-speed').change(function() {
					simulator.simulation.speed = $(this).val() || Simulation.DefaultSpeed;
				});
				var simulationSpeed = ['1 (Fast)', '2', '3', '4', '5 (Medium)', '6', '7', '8', '9 (Slow)'];
				for (var i = 0; i < 9; i++)
				{
					$('<option>')
						.attr('value', ((i + 1) * 100))
						.text(simulationSpeed[i])
						.appendTo('#simulation-speed');
				}
				$('#simulation-speed').val(simulator.simulation.speed);
				
				// Set up the score display
				$('#field-score').text(simulator.simulation.score.toString());
				$('#field-chains').text(simulator.simulation.chains.toString());
				$('#field-nuisance').text(simulator.simulation.nuisance.toString());
				
				// Add the elements for the nuisance indicator
				for (var i = 0; i < 6; i++)
					$('<span>').appendTo('#nuisance-indicator');
					
				// If the simulator is still running, let's apply the right simulation buttons and score and stuff
				if (simulator.simulation.isRunning())
				{
					self.toggleSimButtons(
						simulator.simulation.running,
						(!simulator.simulation.running ||  simulator.simulation.paused ||  simulator.simulation.stepMode) && simulator.simulation.action != -1,
						  simulator.simulation.running && !simulator.simulation.paused && !simulator.simulation.stepMode && simulator.simulation.action != -1,
						(!simulator.simulation.running ||  simulator.simulation.paused ||  simulator.simulation.stepMode) && simulator.simulation.action != -1,
						(!simulator.simulation.running ||  simulator.simulation.paused ||  simulator.simulation.stepMode) && simulator.simulation.action != -1
					);

					self.displayNuisanceIcons(simulator.simulation.nuisance);
				}

				// Execute the scripts
				var script = $(xml).find('scripts').text();
				if (script) (new Function(script))();
				
				// Display onload is now ready. Execute onload scripts
				// Don't delete the scripts as they get called every time a style is loaded.
				self.onloadReady = true;
				$.each(self.onloadList, function() { this.apply(window); });
			},

			error    : function() {
				$('#simulator-field').html('Field content could not be loaded.');
				$('#simulator-controls').html('Field controls could not be loaded.');
			}
		});
	},
	
	change: function(style) { // Change the display style
		localStorage.setItem('chainsim-style', style);
		this.load(style);
	},
	
	setPuyoSkin: function(skin) { // Sets the puyo skin
		var self = this;
		$.each(Puyo.Skin, function(index, value) {
			if (skin !== value.id) return true; // Goto the next statement

			self.puyo.skin = index;
			
			// Set animation information
			if (value.animated)
			{
				self.puyo.animation.animated = true;
				self.puyo.animation.frame    = 0;
				self.puyo.animation.frames   = value.frames;

				if (self.puyo.animation.timer !== null) clearTimeout(self.puyo.animation.timer);
				self.puyo.animation.timer = setTimeout(function() { self.animatePuyo(); }, 200);

				// Update the field animation to display the correct frame
				if (self.onloadReady)
				{
					for (var y = 0; y < simulator.field.height + 1; y++)
					{
						for (x = 0; x < simulator.field.width; x++)
						{
							var puyo = simulator.field.map[x][y];
							if (puyo.isColoredPuyo() || puyo.puyo == Puyo.Nuisance || puyo.puyo == Puyo.Point)
							{
								$(puyo.DOM).css('background-position', '-' + (self.puyo.animation.frame * self.puyo.size) + 'px -' + (self.getPuyoPosition(puyo.puyo).y * self.puyo.size) + 'px');
							}
						}
					}
				}
			}
			else if (self.puyo.animation.animated)
			{
				self.puyo.animation.animated = false;
				self.puyo.animation.frame    = 0;
				self.puyo.animation.frames   = 0;

				if (self.puyo.animation.timer !== null) clearTimeout(self.puyo.animation.timer);
				self.puyo.animation.timer = null;

				// Reset the puyo images
				if (self.onloadReady)
				{
					for (var y = 0; y < simulator.field.height + 1; y++)
					{
						for (x = 0; x < simulator.field.width; x++)
						{
							self.reconnectPuyo(simulator.field.map[x][y], x, y);
						}
					}
			
					// Reset the background-position
					// Apparantly setting background-position to nothing removes it, so we'll do it that way.
					if (typeof document.body.style.backgroundPositionX != 'undefined') // Hackish way to fix an IE bug
						$('#controls-puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)').css('background-position-x', '');
					else
						$('#controls-puyo-selection .puyo:not(.puyo-none):not(.puyo-delete)').css('background-position', '');
				}
			}
			
			// Update all the puyo
			$('#field .puyo, #controls-puyo-selection .puyo:not(.puyo-none):not(.puyo-delete), #nuisance-indicator span').each(function() {
				if ($(this).css('background-image') != 'none')
					$(this).css('background-image', 'url("' + self.puyo.url() + '")');
			});
			
			return false;
		});
	},
	
	setPuyoImage: function(puyo, x, y) { // Sets the appropiate puyo image
		if (puyo.puyo == Puyo.None) // Special case for no puyo
		{
			$(puyo.DOM).css({
				'background-position': '0px 0px',
				'background-image': 'none'
			});
		}
		else
		{
			if ($(puyo.DOM).css('background-image') == 'none')
				$(puyo.DOM).css('background-image', 'url("' + this.puyo.url() + '")');

			var pos = {x: 0, y: 0};
			
			// If it is a colored puyo, set the correct image and connect them correctly
			if (y > 0 && puyo.isColoredPuyo())
			{
				pos = {
					x: this.getConnectPuyoImage(puyo, x, y),
					y: this.getPuyoPosition(puyo.puyo).y
				};
			}
			else
				pos = this.getPuyoPosition(puyo.puyo);

			if (this.puyo.animation.animated && puyo.isColoredPuyo())
				$(puyo.DOM).css('background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (pos.y * this.puyo.size) + 'px');
			else
				$(puyo.DOM).css('background-position', '-' + (pos.x * this.puyo.size) + 'px -' + (pos.y * this.puyo.size) + 'px');
		}
		
		// Reconnect the puyo around us
		if (y > 0)
		{
			if (y > 1) this.reconnectPuyo(simulator.field.map[x][y - 1], x, y - 1);
			if (x > 0) this.reconnectPuyo(simulator.field.map[x - 1][y], x - 1, y);
			if (y < simulator.field.height)    this.reconnectPuyo(simulator.field.map[x][y + 1], x, y + 1);
			if (x < simulator.field.width - 1) this.reconnectPuyo(simulator.field.map[x + 1][y], x + 1, y);
		}
	},
	
	getConnectPuyoImage: function(puyo, x, y) { // Returns the position of the puyo to display it connecting properly
		if (!puyo.isColoredPuyo() || this.puyo.animation.animated) return 0;

		var connectedU = function() { return (y > 1 && simulator.field.map[x][y - 1].puyo == puyo.puyo); };
		var connectedL = function() { return (x > 0 && simulator.field.map[x - 1][y].puyo == puyo.puyo); };
		var connectedD = function() { return (y < simulator.field.height    && simulator.field.map[x][y + 1].puyo == puyo.puyo); };
		var connectedR = function() { return (x < simulator.field.width - 1 && simulator.field.map[x + 1][y].puyo == puyo.puyo); };
		
		if (!connectedU() && !connectedL() && !connectedD() && !connectedR()) return 0;
		if (!connectedU() && !connectedL() &&  connectedD() && !connectedR()) return 1;
		if ( connectedU() && !connectedL() && !connectedD() && !connectedR()) return 2;
		if ( connectedU() && !connectedL() &&  connectedD() && !connectedR()) return 3;
		if (!connectedU() && !connectedL() && !connectedD() &&  connectedR()) return 4;
		if (!connectedU() && !connectedL() &&  connectedD() &&  connectedR()) return 5;
		if ( connectedU() && !connectedL() && !connectedD() &&  connectedR()) return 6;
		if ( connectedU() && !connectedL() &&  connectedD() &&  connectedR()) return 7;
		if (!connectedU() &&  connectedL() && !connectedD() && !connectedR()) return 8;
		if (!connectedU() &&  connectedL() &&  connectedD() && !connectedR()) return 9;
		if ( connectedU() &&  connectedL() && !connectedD() && !connectedR()) return 10;
		if ( connectedU() &&  connectedL() &&  connectedD() && !connectedR()) return 11;
		if (!connectedU() &&  connectedL() && !connectedD() &&  connectedR()) return 12;
		if (!connectedU() &&  connectedL() &&  connectedD() &&  connectedR()) return 13;
		if ( connectedU() &&  connectedL() && !connectedD() &&  connectedR()) return 14;
		if ( connectedU() &&  connectedL() &&  connectedD() &&  connectedR()) return 15;
		
		return 0; // Should never reach here
	},
	
	reconnectPuyo: function(puyo, x, y) { // Reconnects the puyo at this space
		if (!puyo.isColoredPuyo() || this.puyo.animation.animated) return;

		var pos = {
			x: this.getConnectPuyoImage(puyo, x, y),
			y: this.getPuyoPosition(puyo.puyo).y
		};
		
		$(puyo.DOM).css('background-position', '-' + (pos.x * this.puyo.size) + 'px -' + (pos.y * this.puyo.size) + 'px');
	},
	
	getPuyoPosition: function(puyo) { // Returns the puyo position on the texture sheet
		switch (puyo)
		{
			case Puyo.Red:    return {x: 0, y: 0};
			case Puyo.Green:  return {x: 0, y: 1};
			case Puyo.Blue:   return {x: 0, y: 2};
			case Puyo.Yellow: return {x: 0, y: 3};
			case Puyo.Purple: return {x: 0, y: 4};
			
			case Puyo.Nuisance: return {x: 0, y: 5};
			case Puyo.Point:    return {x: 0, y: 6};
			case Puyo.Hard:     return {x: 0, y: 7};
			case Puyo.Iron:     return {x: 1, y: 7};
			case Puyo.Wall:     return {x: 2, y: 7};
			
			case Puyo.Popped.Red:    return {x: 3, y: 7};
			case Puyo.Popped.Green:  return {x: 4, y: 7};
			case Puyo.Popped.Blue:   return {x: 5, y: 7};
			case Puyo.Popped.Yellow: return {x: 6, y: 7};
			case Puyo.Popped.Purple: return {x: 7, y: 7};
			
			case Puyo.Popped.Nuisance: return {x: 8, y: 7};
			case Puyo.Popped.Point:    return {x: 9, y: 7};
		}
		
		return {x: 0, y: 0};
	},
	
	displayNuisanceIcons: function(nuisance) { // Displays the nuisance icons in the indicator
		var amounts = [
			1,   // Small
			6,   // Medium
			30,  // Rock
			180, // Star
			360, // Moon
			720, // Crown
			1440 // Comet
		];
		
		var icons = $('#nuisance-indicator > span');
		for (var i = 5; i >= 0; i--)
		{
			if (nuisance <= 0)
				icons.eq(i).css('background-image', 'none');
			else
			{
				for (var am = amounts.length - 1; am >= 0; am--)
				{
					if (nuisance >= amounts[am])
					{
						nuisance -= amounts[am];
						if (icons.eq(i).css('background-image') == 'none')
							icons.eq(i).css('background-image', 'url("' + this.puyo.url() + '")');
							
						icons.eq(i).css('background-position', '-' + (am * 64) + 'px -256px');
						break;
					}
				}
			}
		}
	},
	
	toggleSimButtons: function(back, start, pause, step, skip) { // Toggles the simulation buttons (true = enabled)
		$('#simulation-back').attr('disabled', !back);
		$('#simulation-start').attr('disabled', !start);
		$('#simulation-pause').attr('disabled', !pause);
		$('#simulation-step').attr('disabled', !step);
		$('#simulation-skip').attr('disabled', !skip);
		
		// Disable settings stuff while running
		// Hackish way, but back = true means not running
		$('#tab-settings input, #tab-settings select').attr('disabled', back);
	},
	
	animatePuyo: function() { // Animates the puyo
		if (!this.puyo.animation.animated)
		{
			this.puyo.animation.timer = null;
			return;
		}
		
		this.puyo.animation.frame++;
		if (this.puyo.animation.frame >= this.puyo.animation.frames)
			this.puyo.animation.frame = 0;
		
		// Update the field animation
		for (var y = 0; y < simulator.field.height + 1; y++)
		{
			for (x = 0; x < simulator.field.width; x++)
			{
				var puyo = simulator.field.map[x][y];
				if (puyo.isColoredPuyo() || puyo.puyo == Puyo.Nuisance || puyo.puyo == Puyo.Point)
				{
					$(puyo.DOM).css('background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(puyo.puyo).y * this.puyo.size) + 'px');
				}
			}
		}
		
		// Update the controls animation
		$('#controls-puyo-selection .puyo-red').css(     'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Red).y      * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-green').css(   'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Green).y    * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-blue').css(    'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Blue).y     * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-yellow').css(  'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Yellow).y   * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-purple').css(  'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Purple).y   * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-nuisance').css('background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Nuisance).y * this.puyo.size) + 'px');
		$('#controls-puyo-selection .puyo-point').css(   'background-position', '-' + (this.puyo.animation.frame * this.puyo.size) + 'px -' + (this.getPuyoPosition(Puyo.Point).y    * this.puyo.size) + 'px');
		
		var self = this;
		this.puyo.animation.timer = setTimeout(function() { self.animatePuyo(); }, 200);
	},
	
	onload: function(func) { // Adds a function to the onload call.
		this.onloadList.push(func);
		if (this.onloadReady)
			func.apply(window);
	},
	
	isLoaded: function() { return this.onloadReady; }
});