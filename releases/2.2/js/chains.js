/*
Here is an example of how the pre-made chains array is set up:

	chains[0].game = 'Puyo Puyo Fever';
	chains[0].groups[0].name = 'Standard';
	chains[0].groups[0].field.width = 6;
	chains[0].groups[0].field.height = 12;
	chains[0].groups[0].sets[0].name = 'Stairs';
	chains[0].groups[0].sets[0].chains[3][15] = '0000'; // Chain Data
*/

// Chains Widget Class
function ChainsWidget()
{
	var chains      = [];
	var mapping     = [];
	var colors      = 4;
	var selectedTab = null;
	var currentId   = 0;

	// Initalize
	function initalize()
	{
		var nodes  = { // Set all to null
			game:  null,
			group: null,
			set:   null,
			color: null,
			chain: null
		};
		
		// Load the XML
		var ajax = new Ajax();
		ajax.loadSync(URL.XML.chains);
		var xml = ajax.getResponseXML();
		
		nodes.game = xml.getElementsByTagName('game'); // Games
		for (var i = 0; i < nodes.game.length; i++)
		{
			chains[i] = { // Set up the game
				game:   nodes.game[i].getAttribute('name'),
				groups: []
			};
			
			nodes.group = nodes.game[i].getElementsByTagName('group'); // Groups
			for (var j = 0; j < nodes.group.length; j++)
			{
				// Get attributes, since they are not required
				var width; // Field Width
				if (nodes.group[j].getAttribute('fieldwidth') === null)
					width = 6;
				else
					width = parseInt(nodes.group[j].getAttribute('fieldwidth'));
				
				var height; // Field Height
				if (nodes.group[j].getAttribute('fieldheight') === null)
					height = 12;
				else
					height = parseInt(nodes.group[j].getAttribute('fieldheight'));
				
				var puyoNeededToChain; // Puyo needed to make a chain
				if (nodes.group[j].getAttribute('puyotochain') === null)
					puyoNeededToChain = 4;
				else
					puyoNeededToChain = parseInt(nodes.group[j].getAttribute('puyotochain'));

				mapping.push([i, j]); // Add to the mapping
				chains[i].groups[j] = { // Set up the group
					name: nodes.group[j].getAttribute('name'),
					field: {
						width:       width,
						height:      height,
						puyotochain: puyoNeededToChain
					},
					sets: []
				};
				
				nodes.set = nodes.group[j].getElementsByTagName('set'); // Sets
				for (var k = 0; k < nodes.set.length; k++)
				{
					chains[i].groups[j].sets[k] = { // Set up the sets
						name:   nodes.set[k].getAttribute('name'),
						chains: []
					};
					
					nodes.color = nodes.set[k].getElementsByTagName('color'); // Colors
					for (var m = 0; m < nodes.color.length; m++)
					{
						var colorAmount = parseInt(nodes.color[m].getAttribute('amount'));
						chains[i].groups[j].sets[k].chains[colorAmount] = []; // Set up for the chains
						
						nodes.chain = nodes.color[m].getElementsByTagName('chain'); // Chains
						for (var n = 0; n < nodes.chain.length; n++)
						{
							var chainAmount = parseInt(nodes.chain[n].getAttribute('amount'));
							if (nodes.chain[n].childNodes.length > 0)
								chains[i].groups[j].sets[k].chains[colorAmount][chainAmount] = nodes.chain[n].childNodes[0].nodeValue;
							else
								chains[i].groups[j].sets[k].chains[colorAmount][chainAmount] = null;
						}
					}
				}
			}
		}
	}
	
	// Get the chains
	this.getChains = function()
	{
		return chains;
	}
	
	// Get a chain
	this.getChain = function(game, group, set, color, chain)
	{
		return chains[game].groups[group].sets[set].chains[color][chain];
	}
	// Get the field size for the current group
	this.getFieldSize = function(game, group)
	{
		return chains[game].groups[group].field;
	}
	
	// Display the group selection box
	this.displayGroupSelectionBox = function(selected)
	{
		var mapId = 0;
		var elements = {
			parent:   getObject('widget-chains-group-select'),
			select:   null,
			optgroup: null,
			option:   null
		};
		
		elements.select = document.createElement('select');
		elements.select.setAttribute('onchange', 'chainsWidget.displayGroupSelection(this.value, chainsWidget.getColors());');
		
		for (var i = 0; i < chains.length; i++)
		{
			// Create the optgroup selection
			elements.optgroup = document.createElement('optgroup');
			elements.optgroup.setAttribute('label', chains[i].game);
			
			for (var j = 0; j < chains[i].groups.length; j++)
			{
				// Create the option selection
				elements.option = document.createElement('option');
				elements.option.setAttribute('value', mapId);
				elements.option.appendChild(document.createTextNode(chains[i].groups[j].name));
				elements.optgroup.appendChild(elements.option);
				
				mapId++;
			}
			
			elements.select.appendChild(elements.optgroup);
		}
		
		elements.select.selectedIndex = selected;
		elements.parent.appendChild(elements.select);
	}
	
	// Display the selection for the widget
	this.displayGroupSelection = function(id, colors)
	{
		currentId = id;

		var group    = chains[mapping[id][0]].groups[mapping[id][1]]; // Shortcut
		var elements = { // Set all to null
			parent:   getObject('widget-chains-chain-select'), // Except this one
			fieldset: null,
			legend:   null,
			ul:       null,
			li:       null,
			a:        null
		};
		
		// Clear out the current display
		while (elements.parent.hasChildNodes())
			elements.parent.removeChild(elements.parent.lastChild);

		for (var i = 0; i < group.sets.length; i++)
		{
			if (typeof group.sets[i].chains[colors] == 'undefined')
				continue; // Don't bother with this set if there aren't chains for the color

			elements.fieldset = document.createElement('fieldset');
			elements.legend   = document.createElement('legend');
			elements.legend.appendChild(document.createTextNode(group.sets[i].name));
			elements.fieldset.appendChild(elements.legend);
			elements.ul = document.createElement('ul');

			for (var j = 0; j < group.sets[i].chains[colors].length; j++)
			{
				if (typeof group.sets[i].chains[colors][j] != 'undefined' && group.sets[i].chains[colors][j] !== null)
				{
					elements.li = document.createElement('li');
					elements.a  = document.createElement('a');
					elements.a.setAttribute('href', '#');
					elements.a.setAttribute('onclick', 'chainsWidget.displayChain(' + mapping[id][0] + ', ' + mapping[id][1] + ', ' + i + ', ' + colors + ', ' + j + '); return false;');
					elements.a.appendChild(document.createTextNode(j));
					elements.li.appendChild(elements.a);
					elements.ul.appendChild(elements.li);
				}
			}
			
			elements.fieldset.appendChild(elements.ul);
			elements.parent.appendChild(elements.fieldset);
		}
	}
	
	// Display the chain on the field
	this.displayChain = function(game, group, set, color, chain)
	{
		var chain = chains[game].groups[group].sets[set].chains[color][chain]; // Shortcut
		if (!editMode)
			editChain();
		
		// Set the appropiate field size
		if (chains[game].groups[group].field.width != fieldWidth || chains[game].groups[group].field.height != fieldHeight - 1)
		{
			fieldWidth  = chains[game].groups[group].field.width;
			fieldHeight = chains[game].groups[group].field.height + 1;

			map = stringToMap('');
			displayPuyoField();
		}
		
		// Set the puyo needed to make a chain
		if (puyoToChain != chains[game].groups[group].field.puyotochain)
			setPuyoToChain(chains[game].groups[group].field.puyotochain);
		
		map = stringToMap(chain);
		updateMap();
	}
	
	// Colors
	this.getColors = function() { return colors; }
	this.setColors = function(n, tab)
	{
		// Update the tab
		if (typeof selectedTab != 'undefined' && selectedTab !== null)
			selectedTab.className = removeClassName(selectedTab, 'selected');
	
		tab.className = addClassName(tab, 'selected');
		colors = n;
		selectedTab = tab;
		
		// Update the selection
		this.displayGroupSelection(currentId, colors);
	}
	
	initalize();
}