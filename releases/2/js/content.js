/* This is all of the content used in the chain simulator */
//map = stringToMap(typeof chainURL == 'undefined' ? '606454707745557664657645475765775664457744475767466647547547764754764754764757' : chainURL);

/*****************************************
** Puyo Field Section
*****************************************/
/* Display the puyo field */
function displayPuyoField()
{
	/* Create content variable */
	var content = '';
	
	/* Go through each of the rows */
	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
			content += '<a href="javascript: void(0);" onclick="updatePuyo(null, ' + x + ', ' + y + ');" onmouseover="puyoMouseover(' + x + ', ' + y + ')" onmouseout="puyoMouseout(' + x + ', ' + y + ')" id="puyo_' + x + '_' + y + '" class="puyo" style="background-image: ' + formatBackgroundImage(puyo[map[x][y]]) + ';"></a>';
		
		/* Go to the next row if we are at the end */
		content += '<div class="clear"></div>';
		
		/* Set up the background if we are at the end of the first row */
		if (y == 0)
			content += '<div id="puyo_field_background" class="main_field">';
	}

	/* Finish the puyo stuff */
	content += '</div>';
	
	/* Display the X's */
	content += '<div class="classX">';
	content += '	<span id="displayX_L" style="background-image: url(\'' + puyoXDisplay + '\');"></span>';
	content += '	<span id="displayX_R" style="background-image: url(\'' + puyoXDisplay + '\');"></span>';
	content += '</div>';

	/* Display the content */
	getObject('puyo_field').innerHTML = content;
}

/* Display the nuisance indicator */
function displayNuisanceIndicator()
{
	/* Create content variable */
	var content = '';
	
	/* Go through each of the sprites */
	for (i = 5; i >= 0; i--)
		content += '<span id="nuisanceIndicator_' + i + '"' + (i == 5 ? ' class="first"' : '') + ' style="background-image: url(' + puyoNuisanceIndicator + ');"></span>';
	
	/* Display the content */
	getObject('nuisance_indicator').innerHTML = content;
}

/* Display the puyo selection */
function displayPuyoSelection()
{
	/* Create content variable */
	var content = '';
	
	/* Loop through all of the puyo */
	for (var i = PUYO_NONE; i <= PUYO_WALL; i++)
	{
		/* Display the "Insert Mode" checkbox if we are at the end of the first row */
		if (i == PUYO_RED)
			content += '<span class="insert"><input type="checkbox" id="insertPuyo" /><label for="insertPuyo"> Insert Mode</label></span>';
		
		/* Goto the next line at the end of each row */
		if (i == PUYO_RED || i == PUYO_NUISANCE)
			content += '<div class="clear"></div>';
		
		/* Display the puyo sprite */
		content += '<span id="puyoSelect_' + i + '" class="puyo' + (curPuyo == i ? ' selected' : '') + '"><a href="javascript: void(0);" onclick="changeCurPuyo(' + i + ');" id="puyoSelect_' + i + '_image" style="background-image: ' + formatBackgroundImage(puyo[i]) + ';" class="puyo"></a></span>';
	}
	
	/* Display the content */
	getObject('puyo_selection').innerHTML = content;
}

/* Display fever chains. */
function displayFeverChains()
{
	/* Load the fever chains */
	loadFeverChains();

	/* Display game selection. */
	var content =
		'	<select id="feverChain_widget_gameSelect_box" onchange="displayFeverSelection(this.value);" class="small">';

	for (var i = 0; i < feverChainData_game.length; i++)
		content += '<option value="' + i + '"' + (i == 1 ? ' selected="selected"' : '') + '>' + feverChainData_game[i] + '</option>';
	
	content +=
		'	</select>';
	
	getObject('feverWidget_gameSelect').innerHTML = content;
}

/* Display fever chain selection */
function displayFeverSelection(game)
{
	var content = '';
	
	for (var i = 0; i < feverChainData_type[game].length; i++)
	{
		content +=
			'<fieldset>' +
			'	<legend>' + feverChainData_type[game][i] + '</legend>';
		
		for (var j = 3; j <= 15; j++)
			content += '<a href="javascript: void(0);" onclick="displayFeverChain(' + game + ', ' + i + ', ' + (j - 3) + ');">' + j + '</a>';
			

		content += '</fieldset>';
	}
	
	getObject('widget_fever_chainSelect').innerHTML = content;
}

/* Display small puyo skins */
function displayPuyoSkins_small()
{
	/* Set up the puyo colors */
	var puyo_colors = ['R', 'G', 'B', 'Y', 'P', 'N'];

	/* Set up initlal content */
	var content = '<form name="form_puyo_selection_small">';

	/* Display content for each puyo */
	for (i in puyoSkins_small)
	{
		content += '<div class="puyo_display">';
		content += '	<span><input type="radio" name="input_puyoSkinSmall" value="' + puyoSkins_small[i] + '"' + (puyoSkin_small == puyoSkins_small[i] ? ' checked="checked"' : '') + ' /></span>';
		
		/* Display each puyo the fun way ;) */
		for (j = 0; j < puyo_colors.length; j++)
			content += '<span class="puyo_small" style="margin-left: 4px; background-image: url(\'' + imgDir + '/puyo/' + puyoSkins_small[i] + '/puyo_' + puyo_colors[j] + '.' + PUYO_EXT_SMALL + '\');"></span>';
		
		content += '</div>';
		content += '<div class="clear"></div>';
	}

	content += '<p></p>';

	content += '<div class="center">';
	content += '	<input type="button" onclick="setSmallPuyoSkin();" value="Set My Small Puyo Skin" />';
	content += '</div>';
	
	getObject('puyo_skin_selection_smallPuyo').innerHTML = content;
}

/* Display large puyo skins */
function displayPuyoSkins_large()
{
	/* Set up the puyo colors */
	var puyo_colors = ['R', 'G', 'B', 'Y', 'P', 'N'];

	/* Set up initlal content */
	var content = '<form name="form_puyo_selection_large">';

	/* Display content for each puyo */
	for (i in puyoSkins_large)
	{
		content += '<div class="puyo_display">';
		content += '	<span style="margin-top: 8px;"><input type="radio" name="input_puyoSkinLarge" value="' + puyoSkins_large[i] + '"' + (puyoSkin_large == puyoSkins_large[i] ? ' checked="checked"' : '') + ' /></span>';
		
		/* Display each puyo the fun way ;) */
		for (j = 0; j < puyo_colors.length; j++)
			content += '<span class="puyo_large" style="margin-left: 4px;  background-image: url(\'' + imgDir + '/puyo/' + puyoSkins_large[i] + '/puyo_' + puyo_colors[j] + '.' + PUYO_EXT_LARGE + '\');"></span>';
			
		content += '</div>';
		content += '<div class="clear"></div>';
	}
	
	

	content += '<p></p>';

	content += '<div class="center">';
	content += '	<input type="button" onclick="setLargePuyoSkin();" value="Set My Large Puyo Skin" />';
	content += '</div>';
	
	getObject('puyo_skin_selection_largePuyo').innerHTML = content;
}