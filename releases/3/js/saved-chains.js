/*
 * Saved Chains
 */

var SavedChains = Class.extend({

	savedChains : [],
	
	init: function() {
		// Load the chains
		var savedChains = localStorage.getItem('chainsim-saved-chains');
		if (savedChains !== null)
			this.savedChains = JSON.parse(savedChains);
		
		var self = this;
		simulator.optionsPanel.onload(function() {
			self.display();
		});
	},
	
	load: function(value) { // Loads a chain
		simulator.field.setChain(
			this.savedChains[value].width  || Field.DefaultWidth,
			this.savedChains[value].height || Field.DefaultHeight,
			this.savedChains[value].chain
		);
	},
	
	save: function(name) { // Saves a chain
		if (!name) return; // Don't save if no name was inserted

		if (simulator.field.width == Field.DefaultWidth && simulator.field.height == Field.DefaultHeight)
		{
			this.savedChains.push({
				name  : name,
				chain : simulator.field.convertMapToString()
			});
		}
		else
		{
			this.savedChains.push({
				name   : name,
				width  : simulator.field.width,
				height : simulator.field.height,
				chain  : simulator.field.convertMapToString()
			});
		}
		
		localStorage.setItem('chainsim-saved-chains', JSON.stringify(this.savedChains));
		
		this.display(); // Reload chains
	},
	
	del: function(index) { // Deletes a chain
		this.savedChains.splice(index, 1);
		
		localStorage.setItem('chainsim-saved-chains', JSON.stringify(this.savedChains));
		
		this.display(); // Reload chains
	},
	
	display: function() { // Displays all the memory that is saved
		$('#saved-chains-list').empty(); // Erase all the chains currently listed

		for (var i = 0; i < this.savedChains.length; i++)
		{
			$('<li>').html(
				'<dl>' +
					'<dd>' + this.savedChains[i].name + '<\/dd>' +
					'<dt>' +
						'<input type="button" onclick="simulator.savedChains.load(' + i + ');" value="Load" \/>' +
						'<input type="button" onclick="simulator.savedChains.del(' + i + ');" value="Delete" \/>' +
					'<\/dt>' +
				'<\/dl>')
				.appendTo('#saved-chains-list');
		}
	}
});