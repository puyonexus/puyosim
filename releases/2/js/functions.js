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

	document.cookie = name + '=' + value + expires + '; path=/' + (cookieURL == '' ? '' : '; domain=' + cookieURL);
}

/* Read a Cookie */
function readCookie(name)
{
	/*var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;*/
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
	//for (i in element)
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

	var str_array = str.split(subStr);

	str =
		(typeof str_array[0] == 'undefined' ? '' : str_array[0]) +
		(typeof str_array[1] == 'undefined' ? '' : str_array[1]);

	return str;
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
	/* Set up our dimensions */
	var dimensions = [];
	for (var i = 0; i < arguments.length; i++)
		dimensions[i] = arguments[i];

	/*Create the mult-dimensional array */
	return createArrayMulti(dimensions);
}

/* Create a multi-dimensional array - Internal Function */
function createArrayMulti(dimensions)
{
	/*Set up our array */
	var array      = [];
	array.length   = ((dimensions.length > 0) ? dimensions[0] : 0);
	dimensions.shift();

	if (dimensions.length > 0)
	{
		for (var i = 0; i < array.length; i++)
			array[i] = createArrayMulti(dimensions.concat([]));
	}

	return array;
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
	/* Load the current chain in the URL */
	map = stringToMap(typeof chainURL == 'undefined' ? '' : chainURL);
	
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
	if (hasClassName(getObject(widget + '_content'), 'hidden'))
		getObject(widget + '_content').className = removeClassName(getObject(widget + '_content'), 'hidden');
	else
		getObject(widget + '_content').className = addClassName(getObject(widget + '_content'), 'hidden');
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
	var mapTemp = new ArrayMulti(6, 13);

	/* Pad or trim the string (from the right) if neccessary */
	str = conformString(str, 78);

	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
			mapTemp[x][y] = convertURLtoInternal(str.charAt((y * 6) + x));
	}
	
	return mapTemp;
}

/* This converts from a map to string data */
function mapToString(addZero)
{
	/* Set up the temporary string */
	addZero = (typeof addZero != 'undefined')
	var strTemp = '';
	var str;

	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
		{
			str = convertInternaltoURL((mapCopy === null ? map[x][y] : mapCopy[x][y]));
			
			/* Can we add it? */
			if (str != PUYO_URL_NONE || strTemp != '' || addZero)
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
		case PUYO_URL_RED:      return PUYO_RED;
		case PUYO_URL_GREEN:    return PUYO_GREEN;
		case PUYO_URL_BLUE:     return PUYO_BLUE;
		case PUYO_URL_YELLOW:   return PUYO_YELLOW;
		case PUYO_URL_PURPLE:   return PUYO_PURPLE;
		case PUYO_URL_NUISANCE: return PUYO_NUISANCE;
		case PUYO_URL_HARD:     return PUYO_HARD;
		case PUYO_URL_IRON:     return PUYO_IRON;
		case PUYO_URL_POINT:    return PUYO_POINT;
		case PUYO_URL_WALL:     return PUYO_WALL;
		default:                return PUYO_NONE;
	}
}

/* This converts an internal number to URL character. */
function convertInternaltoURL(p)
{
	switch (p)
	{
		case PUYO_RED:      return PUYO_URL_RED;
		case PUYO_GREEN:    return PUYO_URL_GREEN;
		case PUYO_BLUE:     return PUYO_URL_BLUE;
		case PUYO_YELLOW:   return PUYO_URL_YELLOW;
		case PUYO_PURPLE:   return PUYO_URL_PURPLE;
		case PUYO_NUISANCE: return PUYO_URL_NUISANCE;
		case PUYO_HARD:     return PUYO_URL_HARD;
		case PUYO_IRON:     return PUYO_URL_IRON;
		case PUYO_POINT:    return PUYO_URL_POINT;
		case PUYO_WALL:     return PUYO_URL_WALL;
		default:            return PUYO_URL_NONE;
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
		puyoSize    = PUYO_LARGE;
		puyoDir     = puyoSkin_large;
		puyoFileExt = PUYO_EXT_LARGE;
		
		/* Let's load the background images */
		boardBG = DIRECTORY_IMAGES + '/boardBG.png';
		
		/* Loads the images for the nuisance puyo. */
		puyoNuisanceIndicator = 
			DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/nuisance_indicator.' + puyoFileExt;
		
		/* Load images for X Display */
		puyoXDisplay = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/x_display.' + puyoFileExt;
	}
	else
	{
		/* These are the settings for standard mode */
		puyoSize    = PUYO_SMALL;
		puyoDir     = puyoSkin_small;
		puyoFileExt = PUYO_EXT_SMALL;
	}
	
	/* Now we can load the puyo. */
	/* Load the normal puyo. */
	//puyo[PUYO_NONE]     = imgDir + '/blank.gif';
	//puyo[PUYO_DELETE]   = imgDir + '/delete.png';
	puyo[PUYO_NONE]     = '';
	puyo[PUYO_DELETE]   = DIRECTORY_IMAGES + '/' + (puyoSize == PUYO_SMALL ? 'delete_small.png' : 'delete.png');
	puyo[PUYO_RED]      = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_R.' + puyoFileExt;
	puyo[PUYO_GREEN]    = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_G.' + puyoFileExt;
	puyo[PUYO_BLUE]     = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_B.' + puyoFileExt;
	puyo[PUYO_YELLOW]   = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_Y.' + puyoFileExt;
	puyo[PUYO_PURPLE]   = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_P.' + puyoFileExt;
	puyo[PUYO_NUISANCE] = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_N.' + puyoFileExt;
	puyo[PUYO_POINT]    = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_T.' + puyoFileExt;
	puyo[PUYO_HARD]     = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_H.' + puyoFileExt;
	puyo[PUYO_IRON]     = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_I.' + puyoFileExt;
	puyo[PUYO_WALL]     = DIRECTORY_IMAGES + '/puyo/' + puyoDir + '/puyo_W.' + puyoFileExt;
	
	/* Now we load the popping sprites. */
	puyo[PUYO_POP_RED]      = puyo[PUYO_RED];
	puyo[PUYO_POP_GREEN]    = puyo[PUYO_GREEN];
	puyo[PUYO_POP_BLUE]     = puyo[PUYO_BLUE];
	puyo[PUYO_POP_YELLOW]   = puyo[PUYO_YELLOW];
	puyo[PUYO_POP_PURPLE]   = puyo[PUYO_PURPLE];
	puyo[PUYO_POP_NUISANCE] = puyo[PUYO_NUISANCE];

	/* Now let's load the outside wall */
	//outsideWall = imgDir + '/wall_' + puyoSize + '.' + puyoFileExt;
	
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
	for (y = 0; y < 13; y++)
	{
		for (x = 0; x < 6; x++)
		{
			if (map[x][y] >= PUYO_POP_RED && map[x][y] <= PUYO_POP_POINT)
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
	for (y = 0; y < 13; y++)
	{
		for (x = 0; x < 6; x++)
		{
			if (map[x][y] >= PUYO_POP_RED && map[x][y] <= PUYO_POP_POINT)
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
	
	for (var i = PUYO_NONE; i <= PUYO_WALL; i++)
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
	for (var i = PUYO_RED; i <= PUYO_WALL; i++)
	{
		puyoAnimation_curFrame[i]++;

		if (puyoAnimation_curFrame[i] >= puyoAnimation_frames[i])
			puyoAnimation_curFrame[i] = 0;
	}
	
	/* Update board images */
	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
		{
			if (map[x][y] < PUYO_POP_RED)
				getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_curFrame[(puyoMouseOver[x][y] ? curPuyo : map[x][y])]) + 'px';
			}
	}
	
	/* Update puyo selection images */
	for (var i = PUYO_RED; i <= PUYO_WALL; i++)
		getObject('puyoSelect_' + i + '_image').style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_curFrame[i]) + 'px';
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
	for (var i = PUYO_RED; i <= PUYO_WALL; i++)
		puyoAnimation_curFrame[i] = 0;
	
	/* Update board images */
	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
		{
			if (map[x][y] < PUYO_POP_RED)
				getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_curFrame[(puyoMouseOver[x][y] ? curPuyo : map[x][y])]) + 'px';
		}
	}
	
	/* Update puyo selection images */
	for (var i = PUYO_RED; i <= PUYO_WALL; i++)
		getObject('puyoSelect_' + i).style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_curFrame[i]) + 'px';
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
	getObject('displayX_L').style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_X_curFrame) + 'px';
	getObject('displayX_R').style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_X_curFrame) + 'px';
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
	getObject('displayX_L').style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_X_curFrame) + 'px';
	getObject('displayX_R').style.backgroundPosition = '-' + (PUYO_SIZE_LARGE * puyoAnimation_X_curFrame) + 'px';
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
	if (curPuyo == PUYO_DELETE)
	{
		for (var y = 0; y <= curY; y++)
			setBackgroundImage('puyo_' + curX + '_' + y, (y < 1 ? puyo[PUYO_NONE] : puyo[map[curX][y - 1]]));
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
	var puyoImg = (map[x][y] >= PUYO_POP_RED ? map[x][y] - PUYO_POP_RED + PUYO_RED : map[x][y]);

	map[x][y] = p;
	getObject('puyo_' + x + '_' + y).style.backgroundPosition = '-' + (style == STYLE_EYE_CANDY ? (puyoAnimation_timer === null ? PUYO_SIZE_LARGE : PUYO_SIZE_LARGE * (puyoAnimation_frames[puyoImg])) : PUYO_SIZE_SMALL) + 'px';
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
	if (p === null && curPuyo == PUYO_DELETE)
	{
		curY = y;
		for (var y = curY; y >= 0; y--)
		{
			map[x][y] = (y < 1 ? PUYO_NONE : map[x][y - 1]);
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
	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
			updatePuyo(map[x][y], x, y);
	}
}

/* Reset puyo state */
function resetPuyoState()
{
	for (var y = 0; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
		{
			/* Reset only if the puyo is currently popped */
			if (map[x][y] >= PUYO_POP_RED && map[x][y] <= PUYO_POP_POINT)
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
	playMode = false;
	
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

/* Use Chain in URL */
function useChainInURL()
{
	/* Check to see if ChainURL has a chain */
	mapCopy = stringToMap((typeof chainURL == 'undefined' ? '' : chainURL));
	
	editChain();
}

/* Let's make our chain now. */
function doChain()
{
	/* Create some temporary variables */
	if (mapCopy === null)
	{
		mapCopy = cloneObject(map); // A copy of the map.
		
		/* Update the current step */
		chainStep = 1;
		
		/* Make the puyo fall just to be sure */
		puyoFall();

		/* If the puyo are in the same position then just continue to chain. */
		if (!compareObject(map, mapCopy))
			return;

		/* Reset the chain step */
		chainStep = 0;

		/* Clear the timeout since we are chaining */
		clearTimeout(timerChain);
	}

	var check        = new ArrayMulti(6, 13); // Check if puyo can be popped.
	var popPuyoX     = []; // Array of puyo that can be popped (X).
	var popPuyoY     = []; // Array of puyo that can be popped (Y).
	var chainMade    = false; // Has a chain been made?
	var bonus        = 0; // The score.
	var totalCleared = 0; // Total Puyo Cleared.
	var colorCleared = []; // Color has been erased.
	
	for (var y = 1; y < 13; y++)
	{
		for (var x = 0; x < 6; x++)
		{
			if (map[x][y] >= PUYO_RED && map[x][y] <= PUYO_PURPLE && !check[x][y])
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
						if (checkX < 0 || checkX > 5 || checkY < 1 || checkY > 12)
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
							case PUYO_RED:    popPuyo(PUYO_POP_RED,    popPuyoX[i], popPuyoY[i]); break;
							case PUYO_GREEN:  popPuyo(PUYO_POP_GREEN,  popPuyoX[i], popPuyoY[i]); break;
							case PUYO_BLUE:   popPuyo(PUYO_POP_BLUE,   popPuyoX[i], popPuyoY[i]); break;
							case PUYO_YELLOW: popPuyo(PUYO_POP_YELLOW, popPuyoX[i], popPuyoY[i]); break;
							case PUYO_PURPLE: popPuyo(PUYO_POP_PURPLE, popPuyoX[i], popPuyoY[i]); break;
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
							
							if (checkX >= 0 && checkX < 6 && checkY > 0 && checkY < 13)
							{
								if (map[checkX][checkY] == PUYO_HARD) // Hard Puyo
									updatePuyo(PUYO_NUISANCE, checkX, checkY);
								else if (map[checkX][checkY] == PUYO_NUISANCE) // Nuisance Puyo
									popPuyo(PUYO_POP_NUISANCE, checkX, checkY);
								else if (map[checkX][checkY] == PUYO_POINT) // Point Puyo
									popPuyo(PUYO_POP_POINT, checkX, checkY);
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

		/* Let's add up our bonuses now. */
		bonusRight = 0;

		if (gameMode == MODE_CLASSIC)
		{
			for (i in colorCleared)
			{
				if (colorCleared[i] > 4)
					bonusRight += (1 + (colorCleared[i] - 4) + (bonusRight > 0 ? 3 : 0));
				else
					bonusRight += (bonusRight > 0 ? 3 : 0);
			}
		}
		else if (gameMode == MODE_FEVER)
		{
			for (i in colorCleared)
				bonusRight += ((colorCleared[i] - 4 > 0 ? colorCleared[i] - 4 : 0) + (bonusRight > 0 ? 2 : 0));
		}

		bonusRight = chainValue[(chains > chainValue.Length ? chainValue.Length - 1 : chains)] + bonusRight;

		/* Let's limit the values for fever chains */
		     if (bonusRight < 1)
			bonusRight = 1;
		else if (bonusRight > 999)
			bonusRight = 999;

		bonus = (totalCleared * 10) * bonusRight;
		
		/* Ok, let's update our stats */
		chains++;
		score    += bonus;
		nuisance += Math.round(bonus / targetPoints);
		
		/* Update Labels */
		updateChainLabels(chains, score, nuisance, (totalCleared * 10), bonusRight);
		
		/* Update the nuisance indicator (Only in Eye Candy Mode) */
		updateNuisanceIndicator();
		
		/* Update the current step */
		chainStep = 1;

		if (playMode)
			timerFall = setTimeout('puyoFall()', 500);
	}
	
	/* No chain made. We are finished. */
	else
		stopChain();
}

/* Make puyo fall into place */
function puyoFall()
{
	/* Update the bonus label */
	updateChainLabels(chains, score, nuisance, 0, 0);

	for (var y = 12; y >= 0; y--)
	{
		for (var x = 0; x < 6; x++)
		{
			/* Can the puyo fall down? */
			if (map[x][y] == PUYO_WALL)
				continue;

			/* Has the puyo been popped now? */
			else if (map[x][y] >= PUYO_POP_RED && map[x][y] <= PUYO_POP_POINT)
				unpopPuyo(PUYO_NONE, x, y);

			else if (map[x][y + 1] == PUYO_NONE)
			{
				var curY = y; // Current Y.

				while (map[x][curY + 1] == PUYO_NONE && curY < 12)
				{
					updatePuyo(map[x][curY], x, curY + 1);
					updatePuyo(PUYO_NONE,    x, curY);
					curY++;
				}
			}
		}
	}

	/* Update the current step */
	chainStep = 0;

	if (playMode)
		timerChain = setTimeout('doChain()', 500);
}


/*****************************************
** Fever Chains
*****************************************/
/* Load up the fever chains file */
function loadFeverChains()
{
	/* Load the XML file. */
	var navMain = loadXML(URL_feverChains);
	
	/* Set up arrays */
	feverChainData_game   = []; // Games
	feverChainData_type   = []; // Types
	feverChainData_chain  = []; // Chains
	
	/* Ok, let's set up the array for the fever chains */
	for (var game = 0; game < navMain.getElementsByTagName('game').length; game++)
	{
		/* Game Tags */
		var navGame = navMain.getElementsByTagName('game')[game];
		
		/* Update the amount of fever chains */
		feverChainData_type[game]  = [];
		feverChainData_chain[game] = new ArrayMulti(navGame.getElementsByTagName('set').length, 3, 12, 0);
		
		/* Get the game name, but make sure the tag exists. */
		feverChainData_game[game] = 
			(navGame.childNodes[1].childNodes[0].nodeValue === null ?
				(typeof navGame.childNodes[0].childNodes[0].nodeValue != 'undefined' ?
					navGame.childNodes[0].childNodes[0].nodeValue : 'Undefined Name') :
				(typeof navGame.childNodes[1].childNodes[0].nodeValue != 'undefined' ?	
					navGame.childNodes[1].childNodes[0].nodeValue : 'Undefined Name')
			);
		
		for (var set = 0; set < navGame.getElementsByTagName('set').length; set++)
		{
			/* Ok, now the set */
			var navSet = navGame.getElementsByTagName('set')[set];
			
			/* Get the type name, but make sure the tag exists. */
			feverChainData_type[game][set] =
				(typeof navSet.getElementsByTagName('type')[0].childNodes[0].nodeValue != 'undefined' ? 
					navSet.getElementsByTagName('type')[0].childNodes[0].nodeValue : 'Undefined Type');
			
			for (var colors = 0; colors < 3; colors++)
			{
				/* Are there the right amount of colors? */
				if (typeof navSet.getElementsByTagName('colors')[colors] == 'undefined')
					break;

				/* There are, now we do the color tag */
				var navColors = navSet.getElementsByTagName('colors')[colors];

				for (var chain = 0; chain < 13; chain++)
				{
					/* Are there the right amount of chains? */
					if (typeof navColors.getElementsByTagName('chain')[chain] == 'undefined')
						break;

					/* Set up the chain tag */
					var navChains = navColors.getElementsByTagName('chain')[chain];
					
					/* Get the chain, but make sure the tag exists */
					feverChainData_chain[game][set][colors][chain] =
						(typeof navChains.childNodes[0].nodeValue != 'undefined' ?
							navChains.childNodes[0].nodeValue : '');
				}
			}
		}
	}
}

/* Display the fever chain */
function displayFeverChain(game, set, chain)
{
	var feverChain = feverChainData_chain[game][set][curColors][chain];

	if (!editMode)
		editChain();
	
	/* Make sure the fever chain isn't undefied */
	if (typeof feverChain == 'undefined')
		feverChain = '';

	map = stringToMap(feverChain);
	updateMap();
}

/* Change the color amount for fever chains. */
function changeCurColor(colors)
{
	getObject('widget_fever_tab_' + curColors).className = removeClassName(getObject('widget_fever_tab_' + curColors), 'selected');
	curColors = colors;
	getObject('widget_fever_tab_' + curColors).className = addClassName(getObject('widget_fever_tab_' + curColors), 'selected');

	/* Now set the appropiate class */
	//for (var i = 0; i < 3; i++)
	//{
		//var objectClass = getObject('widget_fever_tab_' + i).className;
		//getObject('widget_fever_tab_' + i).className = (i == colors ? 'selected' : '');
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
/* Load the skins */
function loadSkinData()
{
	/* Load the XML file. */
	var skinData = loadXML(URL_skinData);
	
	/* Set up the skin sets. */
	for (var set = 0; set < skinData.getElementsByTagName('set').length; set++)
	{
		/* Set the new navigation */
		var nav_set = skinData.getElementsByTagName('set')[set];
		
		/* Get the name of the set. */
		//skinData_set[set] = nav_set.getElementsByTagName('name');
	}
}

/*****************************************
** Options
*****************************************/
/* Load all of the options for the widget. */
function loadOptions()
{
	/* Load the Options File */
	getObject('widget_options_main_content').innerHTML = loadXML(URL_options);
	
	/* Look for scripts and execute their Javascript */
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
	/* Get the Chain ID, from either mapCopy or map */
	var chainID = mapToString();
	
	/* Now write them to the text fields. */
	for (var i = 0; i < linkingCodes_field.length; i++)
		getObject(linkingCodes_field[i]).value = linkingCodes_begin[i] + chainID + linkingCodes_end[i];
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
	/* Set start values for each group */
	var cp_start = [];
	
	cp_start[0] = 0; // Classic
	cp_start[1] = cp_start[0] + chainValues_classic.length; // Fever 1
	cp_start[2] = cp_start[1] + chainValues_fever1.length; // Fever 2
	cp_start[3] = cp_start[2] + chainValues_fever2.length; // 15th Anniversary

	/* Create the optgroups. */
	var cp_group = [
		document.createElement('optgroup'), // Classic
		document.createElement('optgroup'), // Fever 1
		document.createElement('optgroup'), // Fever 2
		document.createElement('optgroup') // 15th Anniversary
	];
	
	/* Group Names */
	var cp_groupNames = [
		'Classic', // Classic
		'Fever 1', // Fever 1
		'Fever 2', // Fever 2
		'15th Anniversary' // 15th Anniversary
	];
	
	/* Character Names */
	var cp_charNames = [
		chainValueNames_classic, // Classic
		chainValueNames_fever1, // Fever 1
		chainValueNames_fever2, // Fever 2
		chainValueNames_puyo15 // 15th Anniversary
	];
	
	/* Now write out each field */
	for (var i = 0; i < cp_group.length; i++)
	{
		/* Add the labels */
		cp_group[i].label = cp_groupNames[i];
		
		for (var j = 0; j < cp_charNames[i].length; j++)
		{
			/* Write out the character names */
			var option;

			option       = document.createElement('option');
			option.value = cp_start[i] + j;
			
			option.appendChild(document.createTextNode(cp_charNames[i][j]));
			cp_group[i].appendChild(option);
		}
		
		/* Now add the group */
		getObject('input_characterPower').appendChild(cp_group[i]);
	}
}

/* Set Character Power */
function setCharacterPower(value)
{
	/* Don't do this stuff we are not in edit mode */
	if (!editMode)
		return;
		
	/* Set start values for each group */
	var cp_start = [];

	cp_start[0] = 0; // Classic
	cp_start[1] = cp_start[0] + chainValues_classic.length; // Fever 1
	cp_start[2] = cp_start[1] + chainValues_fever1.length; // Fever 2
	cp_start[3] = cp_start[2] + chainValues_fever2.length; // 15th Anniversary
	cp_start[4] = cp_start[3] + chainValues_puyo15.length; // Upper Limit

	/* Group Names */
	var cp_groupNames = [
		'Classic', // Classic
		'Fever 1', // Fever 1
		'Fever 2', // Fever 2
		'15th Anniversary' // 15th Anniversary
	];

	/* Character Names */
	var cp_chainValues = [
		chainValues_classic, // Classic
		chainValues_fever1, // Fever 1
		chainValues_fever2, // Fever 2
		chainValues_puyo15 // 15th Anniversary
	];

	/* Character Names */
	var cp_charNames = [
		chainValueNames_classic, // Classic
		chainValueNames_fever1, // Fever 1
		chainValueNames_fever2, // Fever 2
		chainValueNames_puyo15 // 15th Anniversary
	];
	
	/* If the value is out of range don't bother. */
	if (value < cp_start[0] || value >= cp_start[cp_start.length - 1])
		return;
	
	/* Determine the value */
	for (var i = 0; i < cp_groupNames.length; i++)
	{
		/* Determine if it is in the valid range if values */
		if (value >= cp_start[i] && value <= cp_start[i + 1])
		{
			/* Determine the game mode */
			gameMode = (value >= cp_start[0] && value < cp_start[1] ? MODE_CLASSIC : MODE_FEVER);
			
			/*Set the chain value now */
			chainValue = cp_chainValues[i][value - cp_start[i]];
			
			/* Set the label */
			getObject('label_characterPower').innerHTML = cp_charNames[i][value - cp_start[i]] + ' (' + cp_groupNames[i] + ')';
		}
	}

	/* See if the selected index is correct. */
	if (value != getObject('input_characterPower').selectedIndex)
		getObject('input_characterPower').selectedIndex = value;
}

/*****************************************
** XML Functions
*****************************************/
/* Load an XML file */
function loadXML(filename)
{
	/* Do we have support for XMLHttpRequest? */
	if (typeof XMLHttpRequest == 'undefined')
	{
		XMLHttpRequest = function()
		{
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {};
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {};
			try { return new ActiveXObject("Msxml2.XMLHTTP"); }     catch(e) {};
			try { return new ActiveXObject("Microsoft.XMLHTTP"); }  catch(e) {return null;};
		}
	}
	
	/* Set up an instance of XMLHttpRequest */
	var request = new XMLHttpRequest();

	/* Load the file */
	request.open('GET', filename, false);
	request.send(null);
	
	/* Return the XML (or HTML), based on file extension. */
	if (filename.substring(filename.length - 5, filename.length) == ".html")
		return request.responseText;

	return request.responseXML;
}