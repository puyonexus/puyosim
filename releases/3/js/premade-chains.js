/*
 * Premade Chains
 */

var PremadeChains = Class.extend({
	chains: undefined, // Premade Chains
	
	init: function() { // Initalizes the premade chains
		var self = this;

		$.ajax({
		url      : 'xml/premade-chains.xml',
		type     : 'GET',
		dataType : 'xml',
		success  : function(xml) {
		
				var games = $(xml).find('game');
				self.chains = [];
				self.chains.length = games.length;
				
				for (var game = 0; game < games.length; game++)
				{
					var groups = $(games[game]).find('group');
					self.chains[game] = [];
					self.chains[game].length = groups.length;
					self.chains[game].name = $(games[game]).attr('name');
					
					for (var group = 0; group < groups.length; group++)
					{
						var sets = $(groups[group]).find('set');
						self.chains[game][group] = [];
						self.chains[game][group].length = sets.length;
						self.chains[game][group].name = $(groups[group]).attr('name');
						self.chains[game][group].size = {
							width:  parseInt($(groups[group]).attr('fieldwidth'))  || Field.DefaultWidth,
							height: parseInt($(groups[group]).attr('fieldheight')) || Field.DefaultHeight
						};
						self.chains[game][group].erase = parseInt($(groups[group]).attr('puyotochain')) || Simulation.DefaultEraseAmount;
						
						for (var set = 0; set < sets.length; set++)
						{
							var colors = $(sets[set]).find('color');
							self.chains[game][group][set] = [];
							self.chains[game][group][set].length = colors.length;
							self.chains[game][group][set].name   = $(sets[set]).attr('name');
							self.chains[game][group][set].colors = [];
							
							for (var color = 0; color < colors.length; color++)
							{
								var chains = $(colors[color]).find('chain');
								self.chains[game][group][set].colors.push($(colors[color]).attr('amount'));
								self.chains[game][group][set][color] = [];
								self.chains[game][group][set][color].length = chains.length;
								self.chains[game][group][set][color].start = parseInt($(chains[0]).attr('amount')) || 0;
								self.chains[game][group][set][color].end   = parseInt($(chains[chains.length - 1]).attr('amount')) || 0;
								
								for (var chain = 0; chain < chains.length; chain++)
								{
									self.chains[game][group][set][color][chain] = $(chains[chain]).text();
								}
							}
						}
					}
				}
				
				simulator.optionsPanel.onload(function() {
					self.display();
				});
			}
		});
	},
	
	get: function(game, group, set, color, chain) { // Returns the chain and the dimensions of the field
		return {
			chain:  this.chains[game][group][set][color][chain],
			width:  this.chains[game][group].size.width,
			height: this.chains[game][group].size.height,
			erase:  this.chains[game][group].erase
		};
	},
	
	display: function() { // Display the premade chains
		$('#tab-premade-chains').html(
			'<select id="premade-chains-group-select"><\/select>' +
			'<hr \/>' +
			'<ul id="premade-chains-list"><\/ul>');
		
		var self = this;
		$('#premade-chains-group-select').change(function() {
			self.displayChainSelection($(this).val().split(','));
		});
		
		for (var game = 0; game < this.chains.length; game++)
		{
			var optgroup = $('<optgroup>')
				.attr('label', this.chains[game].name);
			
			for (var group = 0; group < this.chains[game].length; group++)
			{
				$('<option>')
					.attr('value', game.toString() + ',' + group.toString())
					.text(this.chains[game][group].name)
					.appendTo(optgroup);
			}
			
			$(optgroup).appendTo('#premade-chains-group-select');
		}
		
		$('#premade-chains-group-select').val('0,1');
		this.displayChainSelection([0, 1]);
	},
	
	displayChainSelection: function(index) { // Displays chain selection for selected game/set
		var self  = this;
		var game  = index[0] || 0;
		var group = index[1] || 0;
		
		$('#premade-chains-list').empty();
		
		for (var set = 0; set < this.chains[game][group].length; set++)
		{
			var li = $('<li>');
			var dl = $('<dl>');
			var dt = $('<dt>');
			
			$('<dd>')
				.text(this.chains[game][group][set].name)
				.appendTo(dl);
			$(dt).appendTo(dl);

			for (var color = 0; color < this.chains[game][group][set].colors.length; color++)
			{
				var select = $('<select>')
					.bind('change', {
						game  : game,
						group : group,
						set   : set,
						color : color
					}, function(event) {
						if ($(this).attr('selectedIndex') == 0) return;

						var chain = self.get(
							event.data.game,
							event.data.group,
							event.data.set,
							event.data.color,
							(parseInt($(this).val()) || 0)
						);
						simulator.field.setChain(chain.width, chain.height, chain.chain);
						simulator.simulation.eraseAmount = chain.erase;
						$('#puyo-to-clear').val(chain.erase);
					
						$(this).attr('selectedIndex', 0);
					});
				$(select).appendTo(dt);
				
				// Append a -- to the top of the select
				$('<option>')
					.text((this.chains[game][group][set].colors[color]).toString() + ' Col')
					.appendTo(select);
				
				var chainSet = this.chains[game][group][set][color];
				for (var chain = 0; chain < chainSet.length; chain++)
				{
					$('<option>')
						.attr('value', chain)
						.text((chainSet.start + chain).toString())
						.appendTo(select);
				}
			}
			
			$(dl).appendTo(li);
			$(li).appendTo('#premade-chains-list');
		}
	}
});