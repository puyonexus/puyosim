/*
Here is an example of how the fever chains array is set up:

	FeverChains[0].game = 'Puyo Puyo Fever';
	FeverChains[0].field.width = 6;
	FeverChains[0].field.height = 12;
	FeverChains[0].sets[0].name = 'Stairs';
	FeverChains[0].sets[0].chains[3][15] = '15 chain - 3 colors data';
*/

// Initalize the fever chains
function initalizeFeverChains()
{
	// Set the variables
	FeverChains = [];
	var nodes = {game: null, set: null, color: null, chain: null};
	
	// Load the xml
	var data = loadXML(URL.XML.feverChains);
	
	// Start initalization process
	initalizeGames();

	// Initalize the games
	function initalizeGames()
	{
		nodes.game = data.getElementsByTagName('game');
		for (var i = 0; i < nodes.game.length; i++)
		{
			// Set up the game
			FeverChains[i] = {
			game: nodes.game[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
			field: {
				width:  parseInt(nodes.game[i].getElementsByTagName('field')[0].getAttribute('width')),
				height: parseInt(nodes.game[i].getElementsByTagName('field')[0].getAttribute('height'))},
			sets: []
			};
			
			// Set up the sets
			initalizeSets(i);
		}
	}
	
	// Initalize the sets
	function initalizeSets(game)
	{
		nodes.set = nodes.game[game].getElementsByTagName('set');
		for (var i = 0; i < nodes.set.length; i++)
		{
			// Set up the sets
			FeverChains[game].sets[i] = {
				name: nodes.set[i].getElementsByTagName('type')[0].childNodes[0].nodeValue,
				chains: []
			};
			
			// Set up the colors
			initalizeColors(game, i);
		}
	}
	
	// Initalize the colors
	function initalizeColors(game, set)
	{
		nodes.color = nodes.set[set].getElementsByTagName('colors');
		for (var i = 0; i < nodes.color.length; i++)
		{
			FeverChains[game].sets[set].chains[parseInt(nodes.color[i].getAttribute('value'))] = [];
			
			// Set up the chains
			initalizeChains(game, set, i, parseInt(nodes.color[i].getAttribute('value')));
		}
	}
	
	// Finally, initalize the chains
	function initalizeChains(game, set, color, color_value)
	{
		nodes.chain = nodes.color[color].getElementsByTagName('chain');
		for (var i = 0; i < nodes.chain.length; i++)
		{
			FeverChains[game].sets[set].chains[color_value][parseInt(nodes.chain[i].getAttribute('value'))] = nodes.chain[i].childNodes[0].nodeValue;
		}
	}
}