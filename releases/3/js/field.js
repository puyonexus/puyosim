/*
 * Puyo Field
 */

var Field = Class.extend({
	width  : 0,
	weight : 0,  // Excludes the hidden row on top of the field
	
	map       : null, // Puyo Map
	mapBuffer : null, // Puyo Map Buffer (just contains puyo)
	
	cursor: {x : 0, y : 0, puyo : undefined}, // Cursor
	selectedPuyo: undefined, // Currently selected puyo
	
	insertionMode : false, // Indicates if we overwrite or insert puyo
	mouseDown     : false, // Indiciates if the mouse is pressed (for dragging)
	mouseButton   : 0,     // Indiciates mouse button pressed (for dragging)
	
	init: function() {
		this.width  = Field.DefaultWidth;
		this.height = Field.DefaultHeight;
		this.selectedPuyo = Puyo.None;

		this.createMap();
		
		// Set chain from URL
		if (location.search)
			this.parseChainQuery();
		
		// Display the chain once the display is ready
		var self = this;
		simulator.display.onload(function() {
			self.display();
		});
	},
	
	setChain: function(width, height, chain) { // Set the chain used for the current field
		if (simulator.simulation.isRunning()) simulator.simulation.stop(); // Stop the simulator if it is running

		width  = clamp(width, Field.MinWidth, Field.MaxWidth);
		height = clamp(height, Field.MinHeight, Field.MaxHeight);

		// Set the correct length for the chain
		var size = width * (height + 1);
		if (chain.length > size)
			chain = chain.substring(0, size);
		else if (chain.length < size)
			chain = chain.padLeft(size, Puyo.URL.None);
		
		// Set the map
		if (this.width != width || this.height != height) // Only make a new map if it's not the same size
		{
			this.width  = width;
			this.height = height;
			this.createMap();
			
			if (simulator.display.isLoaded()) this.display();
			if (simulator.optionsPanel.isLoaded())
			{
				$('#field-size-width').val(width);
				$('#field-size-height').val(height);
			}
		}

		if (simulator.display.isLoaded())
		{
			for (var y = 0; y < this.height + 1; y++)
			{
				for (var x = 0; x < this.width; x++)
				{
					this.map[x][y].setFromUrlId(chain.charAt((y * this.width) + x));
					this.mapBuffer[x][y] = this.map[x][y].puyo;
					simulator.display.setPuyoImage(this.map[x][y], x, y);
				}
			}
		}
		else
		{
			for (var y = 0; y < this.height + 1; y++)
			{
				for (var x = 0; x < this.width; x++)
				{
					this.map[x][y].setFromUrlId(chain.charAt((y * this.width) + x));
					this.mapBuffer[x][y] = this.map[x][y].puyo;
				}
			}
		}
	},
	
	parseChainQuery: function() { // Parses the chain query string (location.search)
		if (!location.search) return;
		if (simulator.simulation.isRunning()) simulator.simulation.stop(); // Stop the simulator if it is running
		
		if (location.search.length > 2 && location.search.charAt(1) == '?') // Old Style Chain Query (v1 & v2)
		{
			var query = location.search.substring(2);

			var sizeExp = /\(\d+,\d+\)/;
			if (query.search(sizeExp) == 0) // String contains chain width & height
			{
				var match = query.match(sizeExp)[0];
				var size = match.substring(1, match.length - 1).split(',');

				this.setChain(size[0], size[1], query.substring(match.length));
			}
			else // String just contains a chain (as far as we know)
				this.setChain(Field.DefaultWidth, Field.DefaultHeight, query);
		}
		else // New Style Chain Query (v3)
		{
			var query = (function() { // Create the query string
				var query = {};
				var parameters = location.search.substring(1).split('&');
				for (var i = 0; i < parameters.length; i++)
				{
					var parameter = parameters[i].split('=');
					query[parameter[0]] = parameter[1];
				}
				
				return query;
			})();
			
			if (query.chain) // If a chain exists in the query, use it
				this.setChain(query.w || Field.DefaultWidth, query.h || Field.DefaultHeight, query.chain);
		}
	},
	
	createMap: function() { // Creates a blank puyo map with the dimensions set for this field
		this.map        = [];
		this.map.length = this.width;
		
		this.mapBuffer = [];
		this.mapBuffer.length = this.width;
		
		for (var x = 0; x < this.width; x++)
		{
			this.map[x] = [];
			this.map[x].length = this.height + 1;
			
			this.mapBuffer[x] = [];
			this.mapBuffer[x].length = this.height + 1;

			for (var y = 0; y < this.height + 1; y++)
			{
				this.map[x][y] = new Puyo(Puyo.None);
				this.mapBuffer[x][y] = Puyo.None;
			}
		}
	},
	
	erase: function() { // Clears the field
		if (simulator.simulation.isRunning())
			simulator.simulation.stop();
		
		for (var y = 0; y < this.height + 1; y++)
		{
			for (var x = 0; x < this.width; x++)
			{
				this.setPuyo(Puyo.None, x, y);
			}
		}
	},
	
	setPuyo: function(puyo, x, y) { // Sets the puyo at the current position
		if (simulator.simulation.isRunning()) return;
		if (!simulator.display) // Throw an exception if the display does not exist
			throw "The display class (simulator.display) does not exist or is not initalized.";

		if (puyo == Puyo.Delete) // Deletes the puyo at the current position, and moves all the puyo above it down
		{
			for (var y2 = y; y2 > 0; y2--)
			{
				this.map[x][y2].puyo  = this.map[x][y2 - 1].puyo;
				this.mapBuffer[x][y2] = this.map[x][y2 - 1].puyo;
				simulator.display.setPuyoImage(this.map[x][y2], x, y2);
			}

			this.map[x][0].puyo   = Puyo.None;
			this.mapBuffer[x][y2] = Puyo.None;
			simulator.display.setPuyoImage(this.map[x][0], x, 0);
		}
		else
		{
			if (this.insertionMode && puyo != Puyo.None) // Shift up the puyo one, and insert puyo at current position
			{
				for (var y2 = 0; y2 < y; y2++)
				{
					this.map[x][y2].puyo  = this.map[x][y2 + 1].puyo;
					this.mapBuffer[x][y2] = this.map[x][y2 + 1].puyo;
					simulator.display.setPuyoImage(this.map[x][y2], x, y2);
				}
			}

			this.map[x][y].puyo  = puyo;
			this.mapBuffer[x][y] = puyo;
			simulator.display.setPuyoImage(this.map[x][y], x, y);
		}
	},
	
	convertMapToString: function() { // Converts the map to a string that can be used in the URL
		var str = '';
		var zero = false; // Indicates if we need to add a 0 (we don't need them in front of the chain)
		if (simulator.simulation.isRunning()) // Use mapBuffer
		{
			for (var y = 0; y < this.height + 1; y++)
			{
				for (var x = 0; x < this.width; x++)
				{
					var puyo = (new Puyo(this.mapBuffer[x][y])).getUrlId();

					if (!zero && puyo === Puyo.URL.None) continue;
					zero = true;
					str += puyo;
				}
			}
		}
		else // Use map
		{
			for (var y = 0; y < this.height + 1; y++)
			{
				for (var x = 0; x < this.width; x++)
				{
					var puyo = this.map[x][y].getUrlId();

					if (!zero && puyo === Puyo.URL.None) continue;
					zero = true;
					str += puyo;
				}
			}
		}
		
		return str;
	},
	
	display: function() { // Displays the game field
		var self = this;

		$('#field').empty();
		$('#field').css({
			'width':  (this.width * simulator.display.puyo.size) + 'px',
			'height': ((this.height + 1) * simulator.display.puyo.size) + 'px'
		});
		if (this.width == Field.DefaultWidth &&
		    this.height == Field.DefaultHeight &&
			$('#field-content').hasClass('alternate'))
		{
			$('#field-content').removeClass('alternate');
		}
		else if ((this.width != Field.DefaultWidth ||
		          this.height != Field.DefaultHeight) &&
				 !$('#field-content').hasClass('alternate'))
		{
			$('#field-content').addClass('alternate');
		}

		for (var y = 0; y < this.height + 1; y++)
		{
			var row = document.createElement('span');
			$(row).attr('class', 'row');
			$('#field').append(row);

			for (var x = 0; x < this.width; x++)
			{
				this.map[x][y].DOM = $('<span>');
				
				// Set up the mouse events for each puyo
				$(this.map[x][y].DOM)
					.attr('class', 'puyo')
					.bind('placepuyo', function() {
						if (self.mouseButton == 1) // Left click
							self.setPuyo(self.selectedPuyo, self.cursor.x, self.cursor.y);
						else if (self.mouseButton == 3) // Right click
							self.setPuyo(Puyo.None, self.cursor.x, self.cursor.y);
					})
					.bind('mouseenter', {x : x, y : y}, function(event) {
						self.cursor = {
							puyo : this,
							x    : event.data.x,
							y    : event.data.y
						};
						$('#field-cursor').css({
							'visibility': (!simulator.simulation.isRunning() ? 'visible' : 'hidden'),
							'top': $(this).position().top,
							'left': $(this).position().left
						});
						
						if (self.mouseDown) $(this).trigger('placepuyo');
					})
					.appendTo(row);

				simulator.display.setPuyoImage(self.map[x][y], x, y);
			}
		}
		
		// Create the cursor
		$('<div>')
			.attr('id', 'field-cursor')
			.appendTo('#field');
		
		// Set up the mouse events on the field
		$('#field')
			.mousedown(function(event) {
				if (!simulator.simulation.isRunning())
				{
					self.mouseDown   = true;
					self.mouseButton = event.which || 0;
					$('#field-cursor').css('visibility', 'visible');
				
					event.preventDefault();
					$(self.cursor.puyo).trigger('placepuyo');
				}
			})
			.mouseup(function() {
				self.mouseDown   = false;
				self.mouseButton = 0;
			})
			.mouseleave(function() {
				self.mouseDown   = false;
				self.mouseButton = 0;
				$('#field-cursor').css('visibility', 'hidden');
			})
			.bind('contextmenu', function() {
				return false;
			});
	}
});

/*
 * Field Constants
 */

Field.DefaultWidth  = 6;
Field.DefaultHeight = 12; // Excludes the hidden row on top of the field
Field.MinWidth  = 3;
Field.MaxWidth  = 16;
Field.MinHeight = 6;
Field.MaxHeight = 26;