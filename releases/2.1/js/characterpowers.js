/*
Here is an example of how the character power array is set up:

	CharacterPowers[0].game = 'Puyo Puyo Fever';
	CharacterPowers[0].mode = 0; // 0 for Classic, 1 for Fever. Used for scoring.
	CharacterPowers[0].characters[0].name = 'Amitie';
	CharacterPowers[0].characters[0].powers[0] = '1st chain power';
*/

// Initalize the character powers
function initalizeCharacterPowers()
{
	// Set the variables
	CharacterPowers = [];
	var nodes = {game: null, power: null};

	// Load the xml
	data = loadXML(URL.XML.characterPowers);
	
	// Initalize the games now
	initalizeGames();
	
	function initalizeGames()
	{
		nodes.game = data.getElementsByTagName('game');
		for (var i = 0; i < nodes.game.length; i++)
		{
			// Set up the game
			CharacterPowers[i] = {
				game: nodes.game[i].getAttribute('name'),
				mode: nodes.game[i].getAttribute('mode'),
				characters: []
			};
			
			initalizePowers(i);
		}
	}
	
	function initalizePowers(game)
	{
		nodes.power = nodes.game[game].getElementsByTagName('power');
		for (var i = 0; i < nodes.power.length; i++)
		{
			// Set up the powers
			CharacterPowers[game].characters[i] = {
				name:   nodes.power[i].getAttribute('character'),
				powers: nodes.power[i].childNodes[0].nodeValue.split(',')
			};
			
			// Now run parseInt on those powers to make sure they actually are integers
			// Wish there was a function to do this automatically that worked for all browsers
			for (var j = 0; j < CharacterPowers[game].characters[i].powers.length; j++)
				CharacterPowers[game].characters[i].powers[j] = parseInt(CharacterPowers[game].characters[i].powers[j]);
		}
	}
}