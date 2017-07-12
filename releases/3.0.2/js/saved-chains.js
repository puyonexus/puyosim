/*
 * Saved Chains
 */

var SavedChains = Class.extend({

	// v3.0.0 and v3.0.1 used a json object to represent the saved chains
	// This version uses a different, simplier method
	// and eliminates the need for json
	// New Format: name=,w=,h=,chain= (seperated by ;)

	// Note that the syntax is slightly different than the other files.
	// This is to make it more compatable with JSLint (like it is right now, lol)
	// and is similar to the style I will be using in a rewrite.
	
	chains : [], // Saved chains array
	
	init: function() {
		var
			dataString, // String of the data
			dataArray,  // Array of the data
			data,       // Actual data for a saved chain
			dataObject, // Object of the data
			parameter,  // Used to split the parameter up
			e,          // Exception
			i,          // Loop Indices
			j;          // Loop Indices
			
		dataString = localStorage.getItem("chainsim-saved-chains"); // Saved chains
			
		// Now we will test to see if it is in the old format
		// Or the new format. If it's the old format, load it
		// and save it as the new format
		if (dataString !== null && dataString !== "") {
			if (dataString.charAt(0) === '[' && dataString.charAt(dataString.length - 1) === ']') { // Old style
				try {
					dataArray = $.parseJSON(dataString);
				} catch (e) {
					dataArray = [];
				}
				
				for (i = 0; i < dataArray.length; i++) { // Load the chains
					this.chains.push({
						name   : dataArray[i].name,
						width  : (parseInt(dataArray[i].width, 10)  || Field.DefaultWidth),
						height : (parseInt(dataArray[i].height, 10) || Field.DefaultHeight),
						chain  : dataArray[i].chain
					});
				}
				
				// Now save the chains so they get stored in the new format
				this.saveChains();
			} else { // New style
				dataArray = dataString.split(';');

				for (i = 0; i < dataArray.length; i++) {
					if (dataArray[i] === "") { // Make sure it isn't empty
						continue;
					}

					data = dataArray[i].split(',');
					dataObject = {};
					
					for (j = 0; j < data.length; j++) {
						parameter = data[j].split('=');
						dataObject[parameter[0]] = parameter[1];
					}

					this.chains.push({
						name   : decodeURIComponent(dataObject.name),
						width  : (parseInt(dataObject.w, 10) || Field.DefaultWidth),
						height : (parseInt(dataObject.h, 10) || Field.DefaultHeight),
						chain  : dataObject.chain
					});
				}
			}
		}
		
		var self = this;
		simulator.optionsPanel.onload(function() {
			self.display();
		});
	},
	
	load: function(index) { // Load a chain
		simulator.field.setChain(
			this.chains[index].width  || Field.DefaultWidth,
			this.chains[index].height || Field.DefaultHeight,
			this.chains[index].chain
		);
	},
	
	save: function(name) { // Save a chain
		if (name === "") { // No name was set
			return;
		}
		
		this.chains.push({
			name :  name,
			width : simulator.field.width,
			height: simulator.field.height,
			chain : simulator.field.convertMapToString()
		});
		
		this.saveChains();
		this.display();
	},
	
	del: function(index) { // Deletes the chain at index
		this.chains.splice(index, 1);
		
		this.saveChains();
		this.display();
	},
	
	saveChains: function() { // Saves the chains
		var
			dataString,
			dataArray = [],
			i;
		
		for (i = 0; i < this.chains.length; i++) {
			dataArray.push("name=" + encodeURIComponent(this.chains[i].name) + ",w=" + this.chains[i].width + ",h=" + this.chains[i].height + ",chain=" + this.chains[i].chain);
		}
		
		dataString = dataArray.join(';');
		localStorage.setItem("chainsim-saved-chains", dataString);
	},

	display: function() { // Display the chains that are saved
		var i; // Loop index

		$("#saved-chains-list").empty(); // Delete any entries that might be displayed
		
		if (this.chains.length === 0) { // No saved chains
			$("#saved-chains-list").append("<div class=\"center\">There are no saved chains.<\/div>");
		} else {
			for (i = 0; i < this.chains.length; i++) {
				$("<li>").html(
					"<dl>" +
						"<dd><a onclick=\"simulator.savedChains.load(" + i + ");\" class=\"chain-name\">" + this.chains[i].name + "<\/dd>" +
						"<dt>" +
							"<a onclick=\"simulator.savedChains.del(" + i + ");\" class=\"icon-delete\" title=\"Delete Chain\"><\/a>" +
						"<\/dt>" +
					"<\/dl>")
					.appendTo("#saved-chains-list");
			}
		}
	}
});