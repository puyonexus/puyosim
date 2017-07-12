/* These are all of the functions used in the Chain Simulator */

/*****************************************
** Cookie Functions
*****************************************/
/* Create a Cookie */
function createCookie(name, value, days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = '; expires=' + date.toGMTString();
	}
	else
		var expires = '';

	document.cookie = name + '=' + value + expires + '; path=/' + (URL.cookie == '' ? '' : '; domain=' + URL.cookie);
}

/* Read a Cookie */
function readCookie(name)
{
	var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return (results !== null ? results[2] : null);
}

/* Delete a Cookie */
function eraseCookie(name)
{
	createCookie(name, '', -1);
}


/*****************************************
** Return & Modify Values
*****************************************/
/* Shortcut for getElementById */
function getObject(obj)
{
	return document.getElementById(obj);
}

/* Return the value of a radio form */
function getRadioValue(element)
{
	for (var i = 0; i < element.length; i++)
	{
		if (element[i].checked)
			return element[i].value;
	}
	return false;
}

/* See if the value is in the array */
function in_array(needle, haystack)
{
	for (key in haystack)
	{
		if (haystack[key] == needle)
			return true;
	}
	return false;
}

/* Selects text of a input box */
function selectText(element)
{
	getObject(element).focus();
	getObject(element).select();
}

/* Conforms a string (used for chains) */
function conformString(str, len)
{
	/* Is the string undefined? */
	if (typeof str == 'undefined')
		str = '';

	if (str.length < len)
	{
		while (str.length < len)
			str = '0' + str;
	}
	else if (str.length > len)
		str = str.substring(str.length - len, str.length);

	return str;
}

/* Remove substring */
function removeSubstring(str, subStr)
{
	/* Make sure the sub string exists */
	if (str.indexOf(subStr) < 0)
		return str;
	else
		return str.replace(subStr, '');
}

/* Returns if the object already has that class name defined */
function hasClassName(object, className)
{
	return object.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)')) !== null;
}

/* Add class name */
function addClassName(object, className)
{
	if (!hasClassName(object, className))
		return (object.className == '' ? '' : object.className + ' ') + className;

	return object.className;
}

/* Remove class name */
function removeClassName(object, className)
{
	if (hasClassName(object, className))
		return (object.className == className ? '' : object.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' '));
	
	return object.className;
}

/*****************************************
** Arrays & Objects
*****************************************/
/* Create a multi-dimensional array */
ArrayMulti = function()
{
	// Create
	function create(dimensions)
	{
		// Set up our array
		var array    = [];
		array.length = ((dimensions.length > 0) ? dimensions[0] : 0);
		dimensions.shift();
		
		if (dimensions.length > 0)
		{
			for (var i = 0; i < array.length; i++)
				array[i] = create(dimensions.concat([]));
		}
		
		return array;
	}

	//Set up our dimensions
	var dimensions = [];
	for (var i = 0; i < arguments.length; i++)
		dimensions[i] = arguments[i];

	//Create the mult-dimensional array
	return create(dimensions);
}

/* Copy object or multi-dimensional array */
function cloneObject(obj)
{
	var newObj = (obj instanceof Array) ? [] : {};
	
	for (i in obj)
	{
		if (obj[i] && typeof obj[i] == 'object')
			newObj[i] = cloneObject(obj[i]);
		else
			newObj[i] = obj[i];
	}

	return newObj;
}

/* Compare 2 object to see if their values are the same */
function compareObject(obj1, obj2)
{
	/* Are they both objects */
	if (typeof obj1 == 'object' && typeof obj2 == 'object')
	{
		for (var i in obj1)
		{
			if (!compareObject(obj1[i], obj2[i]))
				return false;
		}
		
		for (var i in obj2)
		{
			if (!compareObject(obj2[i], obj1[i]))
				return false;
		}
		
		return true;
	}

	return obj1 === obj2;
}


/*****************************************
** Layouts & Styles
*****************************************/
/* Initalize the Chain Simulator */
function init()
{
	// Set up all of the classes
	chainsWidget = new ChainsWidget();

	// Do stuff for chain url's because the board size may not be 6x12
	if (typeof URL.chain != 'undefined')
	{
		// Do we have a different board size, and it's in the correct position?
		var fieldSizeBrackets = URL.chain.match(/\(\d+,\d+\)/);
		if (fieldSizeBrackets !== null && URL.chain.indexOf(fieldSizeBrackets[0]) == 0)
		{
			fieldSizeBrackets = fieldSizeBrackets[0];
			var fieldSizes = fieldSizeBrackets.match(/\d+/g);
			
			// Set field width & height
			setFieldSize(fieldSizes[0], fieldSizes[1], false);
			
			map = stringToMap(URL.chain.substring(fieldSizeBrackets.length));
		}
		else
			map = stringToMap(URL.chain);
	}
	else
		map = stringToMap('');
	
	/* Load the current style */
	style = readCookie('chainsim_style');
	if (style != STYLE_STANDARD && style != STYLE_EYE_CANDY)
		style = STYLE_STANDARD;
	
	/* Load the current puyo skins */
	puyoSkin_small = readCookie('chainsim_puyo_skin_small');
	if (!in_array(puyoSkin_small, puyoSkins_small))
		puyoSkin_small = puyoSkins_small[0]; // Set it to the PP1/PP2 puyo.
	
	puyoSkin_large = readCookie('chainsim_puyo_skin_large');
	if (!in_array(puyoSkin_large, puyoSkins_large))
		puyoSkin_large = puyoSkins_large[1]; // Set it to the PPF puyo.
	
	/* Set the current board style */
	setPuyoStyle();
}

/* Toggle Widget */
function toggleWidget(widget)
{
	/*if (hasClassName(getObject(widget + '_content'), 'hidden'))
		getObject(widget + '_content').className = removeClassName(getObject(widget + '_content'), 'hidden');
	else
		getObject(widget + '_content').className = addClassName(getObject(widget + '_content'), 'hidden');*/
	
	if (hasClassName(getObject(widget), 'hidden'))
		getObject(widget).className = removeClassName(getObject(widget), 'hidden');
	else
		getObject(widget).className = addClassName(getObject(widget), 'hidden');
}

/* Set an active stylesheet */
function setActiveStyleSheet(title)
{
	var i, a, main;

	for (i = 0; (a = document.getElementsByTagName('link')[i]); i++)
	{
		if (a.getAttribute('rel').indexOf('style') != -1 && a.getAttribute('title'))
		{
			a.disabled = true;
			if (a.getAttribute('title') == title)
				a.disabled = false;
		}
	}
}


/*****************************************
** Conversions
*****************************************/
/* This converts from a string to map data */
function stringToMap(str)
{
	/* Set up the temporary array */
	var mapTemp = new ArrayMulti(fieldWidth, fieldHeight);

	/* Pad or trim the string (from the right) if neccessary */
	str = conformString(str, fieldWidth * fieldHeight);

	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
			mapTemp[x][y] = convertURLtoInternal(str.charAt((y * fieldWidth) + x));
	}
	
	return mapTemp;
}

/* This converts from a map to string data */
function mapToString(addZero)
{
	/* Set up the temporary string */
	addZero = (typeof addZero != 'undefined');
	var strTemp = '';
	var str;

	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			str = convertInternaltoURL((mapCopy === null ? map[x][y] : mapCopy[x][y]));
			
			/* Can we add it? */
			if (str != PUYO.URL.NONE || strTemp != '' || addZero)
				strTemp += str;
		}
	}

	return strTemp;
}

/* This converts a URL character to internal number. */
function convertURLtoInternal(p)
{
	switch (p)
	{
		case PUYO.URL.RED:      return PUYO.RED;
		case PUYO.URL.GREEN:    return PUYO.GREEN;
		case PUYO.URL.BLUE:     return PUYO.BLUE;
		case PUYO.URL.YELLOW:   return PUYO.YELLOW;
		case PUYO.URL.PURPLE:   return PUYO.PURPLE;
		case PUYO.URL.NUISANCE: return PUYO.NUISANCE;
		case PUYO.URL.HARD:     return PUYO.HARD;
		case PUYO.URL.IRON:     return PUYO.IRON;
		case PUYO.URL.POINT:    return PUYO.POINT;
		case PUYO.URL.WALL:     return PUYO.WALL;
		default:                return PUYO.NONE;
	}
}

/* This converts an internal number to URL character. */
function convertInternaltoURL(p)
{
	switch (p)
	{
		case PUYO.RED:      return PUYO.URL.RED;
		case PUYO.GREEN:    return PUYO.URL.GREEN;
		case PUYO.BLUE:     return PUYO.URL.BLUE;
		case PUYO.YELLOW:   return PUYO.URL.YELLOW;
		case PUYO.PURPLE:   return PUYO.URL.PURPLE;
		case PUYO.NUISANCE: return PUYO.URL.NUISANCE;
		case PUYO.HARD:     return PUYO.URL.HARD;
		case PUYO.IRON:     return PUYO.URL.IRON;
		case PUYO.POINT:    return PUYO.URL.POINT;
		case PUYO.WALL:     return PUYO.URL.WALL;
		default:            return PUYO.URL.NONE;
	}
}


/*****************************************
** Board Layouts & Styles
*****************************************/
/* This sets the correct puyo style settings */
function setPuyoStyle()
{
	if (style == STYLE_EYE_CANDY)
	{
		/* These are the settings for eye candy mode */
		puyoSize    = PUYO.SIZE.LARGE;
		puyoDir     = puyoSkin_large;
		
		/* Let's load the background images */
		boardBG = DIRECTORY.IMAGES + '/boardBG.png';
		
		/* Loads the images for the nuisance puyo. */
		puyoNuisanceIndicator = 
			DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/nuisance_indicator.png';
		
		/* Load images for X Display */
		puyoXDisplay = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/x_display.png';
	}
	else
	{
		/* These are the settings for standard mode */
		puyoSize    = PUYO.SIZE.SMALL;
		puyoDir     = puyoSkin_small;
	}
	
	/* Now we can load the puyo. */
	/* Load the normal puyo. */
	puyo[PUYO.NONE]     = '';
	puyo[PUYO.DELETE]   = DIRECTORY.IMAGES + '/' + (puyoSize == PUYO.SIZE.SMALL ? 'delete_small.png' : 'delete.png');
	puyo[PUYO.RED]      = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_R.png';
	puyo[PUYO.GREEN]    = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_G.png';
	puyo[PUYO.BLUE]     = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_B.png';
	puyo[PUYO.YELLOW]   = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_Y.png';
	puyo[PUYO.PURPLE]   = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_P.png';
	puyo[PUYO.NUISANCE] = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_N.png';
	puyo[PUYO.POINT]    = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_T.png';
	puyo[PUYO.HARD]     = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_H.png';
	puyo[PUYO.IRON]     = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_I.png';
	puyo[PUYO.WALL]     = DIRECTORY.IMAGES + '/puyo/' + puyoDir + '/puyo_W.png';
	
	/* Now we load the popping sprites. */
	puyo[PUYO.POP_RED]      = puyo[PUYO.RED];
	puyo[PUYO.POP_GREEN]    = puyo[PUYO.GREEN];
	puyo[PUYO.POP_BLUE]     = puyo[PUYO.BLUE];
	puyo[PUYO.POP_YELLOW]   = puyo[PUYO.YELLOW];
	puyo[PUYO.POP_PURPLE]   = puyo[PUYO.PURPLE];
	puyo[PUYO.POP_NUISANCE] = puyo[PUYO.NUISANCE];
	
	/* Set the appropiate stylesheet */
	setActiveStyleSheet(style == STYLE_EYE_CANDY ? STYLE_SHEET_LARGE : STYLE_SHEET_SMALL);
}

/* Update Large Puyo Skin */
function setLargePuyoSkin()
{
	/* Set the puyo skin */
	puyoSkin_large = getRadioValue(document['form_puyo_selection_large'].elements['input_puyoSkinLarge']);
	createCookie('chainsim_puyo_skin_large', puyoSkin_large, 365); // Create cookie to last for 365 days (over 9000 minutes!).
	
	if (style != STYLE_EYE_CANDY)
		return;
	
	/* Update the puyo style */
	setPuyoStyle();
	
	/* Update the board, to change to the new style */
	displayPuyoField();
	displayPuyoSelection();
	
	/* Update the nuisance indicator backgrounds */
	for (var i = 0; i < 6; i++)
		setBackgroundImage('nuisanceIndicator_' + i, puyoNuisanceIndicator);
	
	/* Stop puyo animations */
	if (puyoAnimation_timer !== null)
		stop_puyoAnimations();
	
	/* Start puyo animations if we need too */
	init_puyoAnimations();

	/* Pop puyo if necessary */
	for (y = 0; y < fieldHeight; y++)
	{
		for (x = 0; x < fieldWidth; x++)
		{
			if (map[x][y] >= PUYO.POP.RED && map[x][y] <= PUYO.POP.POINT)
				popPuyo(map[x][y], x, y);
		}
	}
}

/* Update Small Puyo Skin */
function setSmallPuyoSkin()
{
	/* Set the puyo skin */
	puyoSkin_small = getRadioValue(document['form_puyo_selection_small'].elements['input_puyoSkinSmall']);
	createCookie('chainsim_puyo_skin_small', puyoSkin_small, 365); // Create cookie to last for 365 days (over 9000 minutes!).
	
	if (style != STYLE_STANDARD)
		return;
	
	/* Update the puyo style */
	setPuyoStyle();
	
	/* Update the board, to change to the new style */
	displayPuyoField();
	displayPuyoSelection();

	/* Pop puyo if necessary */
	for (y = 0; y < fieldHeight; y++)
	{
		for (x = 0; x < fieldWidth; x++)
		{
			if (map[x][y] >= PUYO.POP.RED && map[x][y] <= PUYO.POP.POINT)
				popPuyo(map[x][y], x, y);
		}
	}
}

/* Switch Skins */
function switchStyle()
{
	/* Set the appropiate skin mode */
	if (style == STYLE_STANDARD)
	{
		style = STYLE_EYE_CANDY;
		getObject('switch_style_text').innerHTML = STYLE_SWITCH_STANDARD;
	}
	else
	{
		style = STYLE_STANDARD;
		getObject('switch_style_text').innerHTML = STYLE_SWITCH_EYE_CANDY;
	}
	
	setPuyoStyle();
	displayPuyoField();
	displayPuyoSelection();
	createCookie('chainsim_style', style, 365);
	
	init_puyoAnimations();  // Start puyo animations
	init_puyoAnimation_X(); // Start the X animation
}

/* Gets the background image to use */
function formatBackgroundImage(background)
{
	if (background == '')
		return 'none';
	
	return 'url(' + background + ')';
}

/* Sets the background image */
function setBackgroundImage(object, background)
{
	getObject(object).style.backgroundImage = formatBackgroundImage(background);
}

// Set the field size
function setFieldSize(width, height)
{
	// Don't bother if the field is the same size
	if (width == fieldWidth && height == fieldHeight - 1)
		return;
		
	// Make sure the width and height are valid
	if (isNaN(width) || width < 3 || width > 16 || isNaN(height) || height < 6 || height > 26)
		return;

	if (!editMode)
		editChain();
	
	fieldWidth  = parseInt(width);
	fieldHeight = parseInt(height) + 1;

	map = stringToMap('');
	puyoMouseOver = new ArrayMulti(fieldWidth, fieldHeight);
	
	// Because we could be doing this in the initalization, don't update if the object doesn't exist
	if (getObject('puyo_field') !== null)
		displayPuyoField();
}

/*****************************************
** Update Visuals
*****************************************/
/* Update the board background */
function updateBoardBG()
{
	curBoardBG++;
	if (curBoardBG > 4) // After purple
		curBoardBG = 0;
	
	getObject('puyo_field_background').style.backgroundPosition = '-' + (curBoardBG * 192) + 'px';
}

/* Update nuisance indicator */
function updateNuisanceIndicator()
{
	/* Are we not in Eye Candy Mode? */
	if (style != STYLE_EYE_CANDY)
		return;

	/* Our nuisance */
	var nuisanceCopy = nuisance;
	var curIndicator = 0;
	
	/* Reset nuisance indicator */
	for (var i = 0; i < 6; i++)
		getObject('nuisanceIndicator_' + i).style.backgroundPosition = '0px';
	
	for (var i = nuisance_amounts.length - 1; i >= 0; i--)
	{
		if (nuisanceCopy <= 0 || curIndicator > 5)
			return;

		if (nuisanceCopy >= nuisance_amounts[i])
		{
			getObject('nuisanceIndicator_' + curIndicator).style.backgroundPosition = '-' + (64 * i) + 'px';

			curIndicator++;
			nuisanceCopy -= nuisance_amounts[i];
			i++;
		}
	}
}


/*****************************************
** Puyo Animations
*****************************************/
/* Init puyo animations */
function init_puyoAnimations()
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style != STYLE_EYE_CANDY)
		return;
		
	/* Enable animations? */
	enable_animations = false;
	
	for (var i = PUYO.NONE; i <= PUYO.WALL; i++)
	{
		/* Get the number of frames and set the current frame. */
		puyoAnimation_frames[i]   = puyoSkins_large_frames[puyoSkin_large][i];
		puyoAnimation_curFrame[i] = 0;
		
		if (puyoAnimation_frames[i] > 1)
			enable_animations = true;
	}

	/* Now enable animations, if we have more than one frame for any */
	if (enable_animations)
		puyoAnimation_timer = setInterval('animatePuyo()', 200);
}

/* Animate Puyo */
function animatePuyo()
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style != STYLE_EYE_CANDY)
		return;
		
	/* Update the frames for each image. */
	for (var i = PUYO.RED; i <= PUYO.WALL; i++)
	{
		puyoAnimation_curFrame[i]++;

		if (puyoAnimation_curFrame[i] >= puyoAnimation_frames[i])
			puyoAnimation_curFrame[i] = 0;
	}
	
	/* Update board images */
	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			if (map[x][y] < PUYO.POP.RED)
				getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_curFrame[(puyoMouseOver[x][y] ? curPuyo : map[x][y])]) + 'px';
			}
	}
	
	/* Update puyo selection images */
	for (var i = PUYO.RED; i <= PUYO.WALL; i++)
		getObject('puyoSelect_' + i + '_image').style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_curFrame[i]) + 'px';
}

/* Stop animation of puyo and reset their images. */
function stop_puyoAnimations()
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style != STYLE_EYE_CANDY)
		return;
	
	/* Clear the timeout */
	clearInterval(puyoAnimation_timer);
	puyoAnimation_timer = null;

	/* Reset the frames for each image. */
	for (var i = PUYO.RED; i <= PUYO.WALL; i++)
		puyoAnimation_curFrame[i] = 0;
	
	/* Update board images */
	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			if (map[x][y] < PUYO.POP.RED)
				getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_curFrame[(puyoMouseOver[x][y] ? curPuyo : map[x][y])]) + 'px';
		}
	}
	
	/* Update puyo selection images */
	for (var i = PUYO.RED; i <= PUYO.WALL; i++)
		getObject('puyoSelect_' + i).style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_curFrame[i]) + 'px';
}

/* Init X Animation */
function init_puyoAnimation_X()
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style == STYLE_EYE_CANDY)
		puyoAnimation_X_timer = setTimeout('animatePuyo_X(0)', 100);
}

/* X Animation */
function animatePuyo_X(twist)
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style != STYLE_EYE_CANDY)
		return;

	/* Which twist are we? */
	if (twist == 0)
	{
		/* X is starting to turn. */
		if (puyoAnimation_X_curFrame == 0)
			puyoAnimation_X_curFrame = 8;
		else
			puyoAnimation_X_curFrame--;

		if (puyoAnimation_X_curFrame == 7)
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(1)', 120);
		else
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(0)', 40);
	}
	
	/* Turning Back */
	else if (twist == 1)
	{
		if (puyoAnimation_X_curFrame == 8)
			puyoAnimation_X_curFrame = 0;
		else
			puyoAnimation_X_curFrame++;

		if (puyoAnimation_X_curFrame == 0)
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(2)', 40);
		else
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(1)', 40);
	}
	
	/* Doing the full twist */
	else if (twist == 2)
	{
		if (puyoAnimation_X_curFrame == 8)
			puyoAnimation_X_curFrame = 0;
		else
			puyoAnimation_X_curFrame++;

		if (puyoAnimation_X_curFrame == 0)
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(0)', 1000);
		else
			puyoAnimation_X_timer = setTimeout('animatePuyo_X(2)', 40);
	}
	
	/* Now set the correct images */
	getObject('displayX_L').style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_X_curFrame) + 'px';
	if (fieldWidth % 2 == 0)
		getObject('displayX_R').style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_X_curFrame) + 'px';
}

/* Stop X Animation */
function stop_puyoAnimation_X()
{
	/* Puyo animations are only for Eye Candy Mode */
	if (style != STYLE_EYE_CANDY)
		return;

	puyoAnimation_X_curFrame = 0;
	
	/* Clear the timeout */
	clearTimeout(puyoAnimation_X_timer);

	/* Now set the correct images */
	getObject('displayX_L').style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_X_curFrame) + 'px';
	getObject('displayX_R').style.backgroundPosition = '-' + (PUYO.SIZE.PIXELS.LARGE * puyoAnimation_X_curFrame) + 'px';
}

/*****************************************
** Chaining
*****************************************/
/* This changes the current puyo type */
function changeCurPuyo(p)
{
	getObject('puyoSelect_' + curPuyo).className = removeClassName(getObject('puyoSelect_' + curPuyo), 'selected');
	curPuyo = p;
	getObject('puyoSelect_' + curPuyo).className = addClassName(getObject('puyoSelect_' + curPuyo), 'selected');
}

/* Mouseover Puyo */
function puyoMouseover(curX, curY)
{
	/* Don't mouseover puyo if we are not in edit mode. */
	if (!editMode)
		return;

	/* Is the current puyo the delete puyo? */
	if (curPuyo == PUYO.DELETE)
	{
		for (var y = 0; y <= curY; y++)
			setBackgroundImage('puyo_' + curX + '_' + y, (y < 1 ? puyo[PUYO.NONE] : puyo[map[curX][y - 1]]));
	}
	
	/* Are we going to insert puyo? */
	else if (getObject('insertPuyo').checked)
	{
		for (var y = 0; y <= curY; y++)
			setBackgroundImage('puyo_' + curX + '_' + y, (y == curY ? puyo[curPuyo] : puyo[map[curX][y + 1]]));
	}
	
	/* Ok, just replace the puyo */
	else
		setBackgroundImage('puyo_' + curX + '_' + curY, puyo[curPuyo]);
	
	puyoMouseOver[curX][curY] = true;
}

/* Mouseout puyo. Return them to their original puyo */
function puyoMouseout(x, curY)
{
	/* Don't mouseout puyo if we are not in edit mode. */
	if (!editMode)
		return;

	for (var y = 0; y <= curY; y++)
		setBackgroundImage('puyo_' + x + '_' + y, puyo[map[x][y]]);

	puyoMouseOver[x][curY] = false;
}

/* Set the puyo to it's pop sprite */
function popPuyo(p, x, y)
{
	var puyoImg = (map[x][y] >= PUYO.POP.RED ? map[x][y] - PUYO.POP.RED + PUYO.RED : map[x][y]);

	map[x][y] = p;
	getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (style == STYLE_EYE_CANDY ? (puyoAnimation_timer === null ? PUYO.SIZE.PIXELS.LARGE : PUYO.SIZE.PIXELS.LARGE * (puyoAnimation_frames[puyoImg])) : PUYO.SIZE.PIXELS.SMALL) + 'px';
}

/* Now let's unset the pop sprite */
function unpopPuyo(p, x, y)
{
	getObject('puyo_' + x + '_' + y).style.backgroundPosition = '0px';
	updatePuyo(p, x, y);
}

/* Update puyo */
function updatePuyo(p, x, y)
{
	/* Don't place puyo if we are not in edit mode */
	if (!editMode && p === null)
		return;

	/* Delete puyo */
	if (p === null && curPuyo == PUYO.DELETE)
	{
		curY = y;
		for (var y = curY; y >= 0; y--)
		{
			map[x][y] = (y < 1 ? PUYO.NONE : map[x][y - 1]);
			getObject('puyo_' + x + '_' + y).style.backgroundImage = 'url("' + puyo[map[x][y]] + '")';
		}
	}

	/* Insert puyo */
	else if (p === null && getObject('insertPuyo').checked)
	{
		curY = y;
		for (var y = 0; y <= curY; y++)
		{
			map[x][y] = (y == curY ? curPuyo : map[x][y + 1]);
			setBackgroundImage('puyo_' + x + '_' + y, puyo[map[x][y]]);
		}
	}

	/* If we are not deleting or inserting puyo */
	else
	{
		map[x][y] = (p === null ? curPuyo : p);
		setBackgroundImage('puyo_' + x + '_' + y, puyo[map[x][y]]);
	}
}

/* Update our map */
function updateMap()
{
	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
			updatePuyo(map[x][y], x, y);
	}
}

/* Reset puyo state */
function resetPuyoState()
{
	for (var y = 0; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			/* Reset only if the puyo is currently popped */
			if (map[x][y] >= PUYO.POP.RED && map[x][y] <= PUYO.POP.POINT)
				getObject('puyo_' + x + '_' + y).style.backgroundPosition = '0px';
		}
	}
}

/* Go back to edit mode */
function editChain()
{
	stopChain();
	editMode = true;

	if (mapCopy !== null)
	{
		resetPuyoState();
		map     = cloneObject(mapCopy);
		mapCopy = null;
		updateMap();
	}
	
	/* Reset everything */
	chains   = 0;
	score    = 0;
	nuisance = 0;
	
	updateChainLabels(chains, score, nuisance, 0, 0);
	updateNuisanceIndicator();
}

/* Start our chain */
function startChain()
{
	/* Stop our Chain */
	if (playMode)
		stopChain();
	
	/* Play our chain */
	else
	{
		editMode = false;
		playMode = true;

		/* Check current step of the chain */
		if (chainStep == 0)
			doChain();
		else
			puyoFall();
	}
}

/* Advance one step in the chain. */
function advanceChain()
{
	/* Stop our Chain */
	if (playMode)
		stopChain();

	editMode = false;
	playMode = false;
		
	/* Check current step of the chain */
	if (chainStep == 0)
		doChain();
	else
		puyoFall();
}

/* Stop our Chain */
function stopChain()
{
	playMode  = false;
	chainStep = 0;
	
	clearTimeout(timerChain);
	clearTimeout(timerFall);
}

/* Clear the board */
function clearBoard()
{
	/* Stop the chain */
	mapCopy = stringToMap('');

	editChain();
}

// Set the popping speed
function setPopSpeed(speed)
{
	if (!editMode)
		return;
	
	curPopSpeed = popSpeeds[speed];
}

/* Use Chain in URL */
function useChainInURL()
{
	// Do stuff for chain url's because the board size may not be 6x12
	if (typeof URL.chain != 'undefined')
	{
		// Do we have a different board size, and it's in the correct position?
		var fieldSizeBrackets = URL.chain.match(/\(\d+,\d+\)/);
		if (fieldSizeBrackets !== null && URL.chain.indexOf(fieldSizeBrackets[0]) == 0)
		{
			fieldSizeBrackets = fieldSizeBrackets[0];
			var fieldSizes = fieldSizeBrackets.match(/\d+/g);
			
			// Set field width & height
			setFieldSize(fieldSizes[0], fieldSizes[1]);
			
			mapCopy = stringToMap(URL.chain.substring(fieldSizeBrackets.length));
		}
		else
			mapCopy = stringToMap(URL.chain);
	}
	else
		mapCopy = stringToMap('');
	
	editChain();
	displayPuyoField();
}

/* Let's make our chain now. */
function doChain()
{
	// If the chain is just starting (mapCopy is null), set and reset some variables
	if (mapCopy === null)
	{
		mapCopy = cloneObject(map); // Copy the map
		lastCharacterPower = 0;     // Reset the last character power
		
		// See if the puyo need to fall first
		if (canPuyoFall(map)) // Yes they do
		{
			chainStep = 1;
			puyoFall();
			return; // So we don't do chaining
		}
		else
			chainStep = 0;
	}

	var check        = new ArrayMulti(fieldWidth, fieldHeight); // Check if puyo can be popped.
	var popPuyoX     = []; // Array of puyo that can be popped (X).
	var popPuyoY     = []; // Array of puyo that can be popped (Y).
	var chainMade    = false; // Has a chain been made?
	var bonus        = 0; // The score.
	var totalCleared = 0; // Total Puyo Cleared.
	var colorCleared = []; // Color has been erased.
	
	for (var y = 1; y < fieldHeight; y++)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			if (map[x][y] >= PUYO.RED && map[x][y] <= PUYO.PURPLE && !check[x][y])
			{
				var cleared   = 1; // Amount of puyo that can be cleared.
				var checked   = 1; // Amount of puyo checked.
				var checkX    = x; // Check X.
				var checkY    = y; // Check Y.
				var checkPuyo = map[x][y]; // Current puyo being checked.

				check[x][y] = true;
				popPuyoX[0] = x;
				popPuyoY[0] = y;
				

				while (checked <= cleared)
				{
					for (var z = 0; z < 4; z++)
					{
						/* Reset Variables */
						checkX = popPuyoX[checked - 1];
						checkY = popPuyoY[checked - 1];

						if (z < 2)
							checkX = (z == 0 ? checkX - 1 : checkX + 1);
						else
							checkY = (z == 2 ? checkY - 1 : checkY + 1);
						
						/* Check for out of bounds */
						if (checkX < 0 || checkX >= fieldWidth || checkY < 1 || checkY >= fieldHeight)
							continue;
						
						if (map[checkX][checkY] == checkPuyo && !check[checkX][checkY])
						{
							cleared++;
							check[checkX][checkY] = true;
							
							popPuyoX[cleared - 1] = checkX;
							popPuyoY[cleared - 1] = checkY;
						}
					}
					checked++;
				}

				/* Are there enough puyo for them to be popped? */
				if (cleared >= puyoToChain)
				{
					/* YES! */
					chainMade = true;
					totalCleared += cleared;

					for (i = 0; i < cleared; i++)
					{
						/* Ok, let's change the checked puyo into pop sprites */
						switch (map[popPuyoX[i]][popPuyoY[i]])
						{
							case PUYO.RED:    popPuyo(PUYO.POP.RED,    popPuyoX[i], popPuyoY[i]); break;
							case PUYO.GREEN:  popPuyo(PUYO.POP.GREEN,  popPuyoX[i], popPuyoY[i]); break;
							case PUYO.BLUE:   popPuyo(PUYO.POP.BLUE,   popPuyoX[i], popPuyoY[i]); break;
							case PUYO.YELLOW: popPuyo(PUYO.POP.YELLOW, popPuyoX[i], popPuyoY[i]); break;
							case PUYO.PURPLE: popPuyo(PUYO.POP.PURPLE, popPuyoX[i], popPuyoY[i]); break;
						}
						
						/* Check for nuisance puyo presence */
						for (z = 0; z < 4; z++)
						{
							/* Reset Variables */
							checkX = popPuyoX[i];
							checkY = popPuyoY[i];

							if (z < 2)
								checkX = (z == 0 ? checkX - 1 : checkX + 1);
							else
								checkY = (z == 2 ? checkY - 1 : checkY + 1);
							
							if (checkX >= 0 && checkX < fieldWidth && checkY > 0 && checkY < fieldHeight)
							{
								if (map[checkX][checkY] == PUYO.HARD) // Hard Puyo
									updatePuyo(PUYO.NUISANCE, checkX, checkY);
								else if (map[checkX][checkY] == PUYO.NUISANCE) // Nuisance Puyo
									popPuyo(PUYO.POP.NUISANCE, checkX, checkY);
								else if (map[checkX][checkY] == PUYO.POINT) // Point Puyo
									popPuyo(PUYO.POP.POINT, checkX, checkY);
							}
						}
					}
	
					/* Now let's do our bonuses */
					if (colorCleared[checkPuyo] > 0)
						colorCleared[checkPuyo] += (cleared - 4 < 0 ? 0 : cleared - 4);
					else
						colorCleared[checkPuyo] = cleared;
				}
			}
		}
	}

	/* Ok, now we can make the puyo fal into the correct place. */
	if (chainMade)
	{
		updateBoardBG();
		
		// Calculate the score
		// I know it's not completely perfect but I do not know how to calculate as different groups.
		var colorsCleared = 0;
		var puyoClearedBonus = 0;
		for (i in colorCleared) // Get the amount of colors that were cleared
		{
			if (colorCleared[i] > 0)
			{
				colorsCleared++;
				puyoClearedBonus += (colorCleared[i] > 10 ? 6 + Math.floor(puyoToChain / 2) : colorCleared[i] - 4);
			}
		}
		puyoClearedBonus += (colorsCleared - 1) * 2;
		
		var currentChainValue = chainValue[(chains >= chainValue.length ? chainValue.length - 1 : chains)];
		if (currentChainValue < 0) // For PP7 transformation mode character power
			currentChainValue = lastCharacterPower + -currentChainValue;
		
		puyoClearedBonus += currentChainValue;
		
		// Limit the values
		if (puyoClearedBonus < 1)        puyoClearedBonus = 1;
		else if (puyoClearedBonus > 999) puyoClearedBonus = 999;
		
		bonus = (totalCleared * 10) * puyoClearedBonus;
		
		// Update the stats
		chains++;
		score    += bonus;
		nuisance += Math.round(bonus / targetPoints);
		
		// Update the labels
		updateChainLabels(chains, score, nuisance, (totalCleared * 10), puyoClearedBonus);
		
		// Update the nuisance indicator (Only in Eye Candy Mode)
		updateNuisanceIndicator();
		
		// Update the current step
		chainStep = 1;

		if (playMode)
			timerFall = setTimeout(function() { puyoFall(); }, curPopSpeed);
	}
	
	// No chain made. We are finished.
	else
		stopChain();
}

/* Make puyo fall into place */
function puyoFall()
{
	/* Update the bonus label */
	updateChainLabels(chains, score, nuisance, 0, 0);

	for (var y = fieldHeight - 1; y >= 0; y--)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			/* Can the puyo fall down? */
			if (map[x][y] == PUYO.WALL)
				continue;

			/* Has the puyo been popped now? */
			else if (map[x][y] >= PUYO.POP.RED && map[x][y] <= PUYO.POP.POINT)
				unpopPuyo(PUYO.NONE, x, y);

			else if (map[x][y + 1] == PUYO.NONE)
			{
				var curY = y; // Current Y.

				while (map[x][curY + 1] == PUYO.NONE && curY < fieldHeight - 1)
				{
					updatePuyo(map[x][curY], x, curY + 1);
					updatePuyo(PUYO.NONE,    x, curY);
					curY++;
				}
			}
		}
	}

	/* Update the current step */
	chainStep = 0;

	if (playMode)
		timerChain = setTimeout(function() { doChain(); }, curPopSpeed);
}

// See if the puyo can fall
function canPuyoFall(map)
{
	for (var y = fieldHeight - 1; y > 0; y--)
	{
		for (var x = 0; x < fieldWidth; x++)
		{
			if (y > 0 && map[x][y] == PUYO.NONE && map[x][y - 1] != PUYO.NONE && map[x][y - 1] != PUYO.WALL)
				return true;
		}
	}
	return false;
}

/* Display Options */
function updateChainLabels(chains, score, nuisance, bonusL, bonusR)
{
	getObject('label_chains').innerHTML   = chains;
	getObject('label_score').innerHTML    = score;
	getObject('label_nuisance').innerHTML = nuisance;
	getObject('label_bonus').innerHTML    = (bonusR == 0 ? '' : bonusL + ' x ' + bonusR);
}

/*****************************************
** Skins
*****************************************/
// Set the skin preview image
function setChainImageSkinPreview(skin)
{
	skin = skin.split(',');

	getObject('chain_image_skins_preview').src = DIRECTORY.IMAGES + '/' + DIRECTORY.CHAIN_IMAGE_SKINS + '/' + ChainImageSkins[parseInt(skin[0])].id + '/' + ChainImageSkins[parseInt(skin[0])].skins[parseInt(skin[1])].image;
}

// Get skin number from skin id
function getSkinNumberFromSkinId(set, skin)
{
	// Make sure they are not undefined or null
	if (typeof set == 'undefined' || typeof skin == 'undefined' ||
		set === null || skin === null)
		return '0,0';

	// Do the skins exist? If they don't we will set them to the default Wood Blocks
	var skinSetNumber = getChainImageSkinSet(set);
	var skinNumber    = getChainImageSkin(skinSetNumber, skin);
	if (skinNumber == -1) // -1 means does not exist
		return '0,0'; // Return the default Wood Blocks

	return skinSetNumber.toString() + ',' + skinNumber.toString();
}

// Set chain image skin
function setChainImageSkin(skin)
{
	skin = skin.split(',');
	
	createCookie('chainsim_chain_image_set',  ChainImageSkins[parseInt(skin[0])].id, 365 * 10); // Set for 10 years
	createCookie('chainsim_chain_image_skin', ChainImageSkins[parseInt(skin[0])].skins[parseInt(skin[1])].id, 365 * 10); // Set for 10 years
}

/*****************************************
** Options
*****************************************/
/* Load all of the options for the widget. */
function loadOptions()
{
	// Load the options file
	var ajax = new Ajax();
	ajax.loadSync(URL.XML.options);
	getObject('widget_options_main_content').innerHTML = '<div>' + ajax.getResponseText() + '</div>';
	
	// Now execute the scripts in the options file
	var scripts = getObject('widget_options_main_content').getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++)
		eval(scripts[i].innerHTML);
}

/* Change navigation tab */
function widget_options_change_tab(tab)
{
	getObject(widget_options_tab).className = removeClassName(getObject(widget_options_tab), 'selected');
	getObject(widget_options_tab + '_content').className = addClassName(getObject(widget_options_tab + '_content'), 'hidden');
	widget_options_tab = tab;
	getObject(widget_options_tab).className = addClassName(getObject(widget_options_tab), 'selected');
	getObject(widget_options_tab + '_content').className = removeClassName(getObject(widget_options_tab + '_content'), 'hidden');
}

/* Generate Linking Codes */
function generateLinkingCodes()
{
	// Get the Chain ID
	var chainID = mapToString();

	// Get the code to use
	var code = '';
	if (chainID == '')
		code = '';
	else if (fieldWidth == 6 && fieldHeight == 13)
		code = chainID;
	else
		code = '(' + fieldWidth + ',' + (fieldHeight - 1) + ')' + chainID;
	
	for (var i = 0; i < linkingCodes.length; i++)
	{
		// The linking code type can only support 6x12 field sizes.
		if (linkingCodes[i].standardOnly && (fieldWidth != 6 || fieldHeight != 13))
			getObject(linkingCodes[i].id).value = '';
		else if (code != '') // This linking code type can support different field sizes
		{
			if (linkingCodes[i].shortenUrl && getObject('linkingcode-shortenurl') !== null && getObject('linkingcode-shortenurl').checked)
				getObject(linkingCodes[i].id).value = shortenChainUrl(code);
			else
				getObject(linkingCodes[i].id).value = linkingCodes[i].start + code + linkingCodes[i].end;
		}
	}
}

// Shorten the chain URL
function shortenChainUrl(chainId)
{
	// Note: this requires shortenurl.php to work!
	var ajax = new Ajax();
	ajax.loadSync('shortenurl.php?chain_id=' + chainId);
	if (ajax.getResponseStatus() != 200)
		return ''; // Return a blank string

	var request = ajax.getResponseXML();
	return request.getElementsByTagName('results')[0].getElementsByTagName('shortUrl')[0].childNodes[0].nodeValue;
}

/* Set Target Points */
function setTargetPoints(value)
{
	/* Don't do this stuff we are not in edit mode */
	if (!editMode)
		return;

	/* Make sure the target points is between 0.01 and 9999 */
	if (!isNaN(value) && value >= 0.01 && value <= 9999)
	{
		targetPoints = value;
		getObject('label_targetPoints').innerHTML = targetPoints;
	}
}

/* Set Puyo Needed to Make a Chain */
function setPuyoToChain(value)
{
	/* Don't do this stuff we are not in edit mode */
	if (!editMode)
		return;

	/* Make sure the puyo needed to make a chain is between 2 and 72 */
	if (!isNaN(value) && value >= 2 && value <= 72)
	{
		puyoToChain = value;
		getObject('label_puyoToChain').innerHTML = puyoToChain;
	}
}

/* Add Character Powers */
function addCharacterPowers()
{
	// Determine start values
	var cp_start = [];
	cp_start.push(0);
	for (var i = 0; i < CharacterPowers.length; i++)
		cp_start.push(cp_start[i] + CharacterPowers[i].characters.length);
		
	// Ok, write out the groups now
	for (var i = 0; i < CharacterPowers.length; i++)
	{
		var optgroup   = document.createElement('optgroup');
		optgroup.label = CharacterPowers[i].game;
		
		// Write out the characters
		for (var j = 0; j < CharacterPowers[i].characters.length; j++)
		{
			var option   = document.createElement('option');
			option.value = cp_start[i] + j;
			
			option.appendChild(document.createTextNode(CharacterPowers[i].characters[j].name));
			optgroup.appendChild(option);
		}
		
		// Add the group
		getObject('input_characterPower').appendChild(optgroup);
	}
}

// Add field sizes
function addFieldSizes()
{
	for (var i = 0; i < fieldSizes.length; i++)
	{
		// Add the field size
		var option;
		
		option = document.createElement('option');
		option.value = i;
		
		option.appendChild(document.createTextNode(fieldSizes[i].name));
		getObject('input_fieldSizes_defaults').appendChild(option);
	}
}

/* Set Character Power */
function setCharacterPower(value)
{
	/* Don't do this stuff we are not in edit mode */
	if (!editMode)
		return;
		
	// Determine start values
	var cp_start = [];
	cp_start.push(0);
	for (var i = 0; i < CharacterPowers.length; i++)
		cp_start.push(cp_start[i] + CharacterPowers[i].characters.length);
	
	// Determine the value that we chose
	if (value < cp_start[0] || value >= cp_start[cp_start.length - 1])
		return;
	for (var i = 0; i < cp_start.length - 1; i++)
	{
		if (value >= cp_start[i] && value < cp_start[i + 1])
		{
			// This is the value, set the current character power, and update the label
			chainValue = CharacterPowers[i].characters[value - cp_start[i]].powers;
			getObject('label_characterPower').innerHTML = CharacterPowers[i].characters[value - cp_start[i]].name + ' (' + CharacterPowers[i].game + ')';
			
			// Update the selected index.
			if (value != getObject('input_characterPower').selectedIndex)
				getObject('input_characterPower').selectedIndex = value;

			return;
		}
	}
}