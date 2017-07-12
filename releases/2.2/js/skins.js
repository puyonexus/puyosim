/*
Here is an example of how the skins array is set up:

	ChainImageSkins[0].name = 'Chain Simulator';
	ChainImageSkins[0].id = 'chain_simulator';
	ChainImageSkins[0].skins[0].name  = 'Wood Blocks';
	ChainImageSkins[0].skins[0].image = 'woodblocks.png';
	ChainImageSkins[0].skins[0].id = 'wood_blocks';
*/

function initalizeChainImageSkins()
{
	// Set the variables
	ChainImageSkins = [];
	var nodes = {set: null, skin: null};

	// Load the XML
	var ajax = new Ajax();
	ajax.loadSync(URL.XML.chainImageSkins);
	var data = ajax.getResponseXML();
	
	// Start initalization process
	initalizeSets();
	
	function initalizeSets()
	{
		nodes.set = data.getElementsByTagName('chainimage')[0].getElementsByTagName('set');
		for (var i = 0; i < nodes.set.length; i++)
		{
			ChainImageSkins[i] = {
				name:  nodes.set[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
				id:    nodes.set[i].getAttribute('id'),
				skins: []
			};
			
			initalizeSkins(i);
		}
	}
	
	function initalizeSkins(set)
	{
		nodes.skin = nodes.set[set].getElementsByTagName('skin');
		for (var i = 0; i < nodes.skin.length; i++)
		{
			ChainImageSkins[set].skins[i] = {
				name:  nodes.skin[i].childNodes[0].nodeValue,
				image: nodes.skin[i].getAttribute('image'),
				id:    nodes.skin[i].getAttribute('id')
			};
		}
	}
}

// Returns the id of the current skin set, or -1 if it does not exist
function getChainImageSkinSet(set)
{
	for (var i = 0; i < ChainImageSkins.length; i++)
	{
		if (ChainImageSkins[i].id == set)
			return i;
	}
	
	return -1;
}

// Returns the id of the current skin in the set, or -1 if it does not exist
function getChainImageSkin(set, skin)
{
	// Make sure the set is not -1
	if (set == -1)
		return -1;

	for (var i = 0; i < ChainImageSkins[set].skins.length; i++)
	{
		if (ChainImageSkins[set].skins[i].id == skin)
			return i;
	}
	
	return -1;
}