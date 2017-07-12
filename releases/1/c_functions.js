/* These are the functions for the Puyo Puyo Chain Simulator */


/* Cookie Related */
function createCookie(name, value, days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = '; expires=' + date.toGMTString();
	}
	else var expires = '';
	document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name)
{
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for(i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ')  c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name)
{
	createCookie(name, '', -1);
}


/* Get the ID of an object with less coding */
function getObject(object)
{
	return document.getElementById(object);
}


/* Get checked element value */
function getRadioValue(element)
{
	for (i in element)
	{
		if (element[i].checked)
		{
			return element[i].value;
		}
	}
	return false;
}


/* Check for a value in an array */
function in_array(needle, haystack)
{
	for (key in haystack)
	{
		if (haystack[key] == needle) return true;
	}
	return false;
}


/* Create a 2D array*/
function Array2D(v1, v2)
{
	array = new Array(v1);
	for (i = 0; i < v1; i++)
	{
		array[i] = new Array(v2);
	}
	
	return array;
}


/* Pads a string */
function padString(str, len)
{
	while (str.length < len) str = '0' + str;
	return str;
}


/* Reset chain, score, and garbage */
function resetScore()
{
	score   = 0;
	chain   = 0;
	garbage = 0;
	
	getObject('score').innerHTML   = score;
	getObject('chains').innerHTML   = chain;
	getObject('garbage').innerHTML = garbage;

	setGarbage();
}


/* Set the garbage amount */
function setGarbage()
{
	if (mode != 'eye_candy')
	{
		return false;
	}

	k = garbage;
	for (i = 1; i < 7; i++)
	{
		for (j = 7; j > 0; j--)
		{
			if (k >= garbage_amount[j])
			{
				getObject('garbage' + i).src = puyo_garbage[j];
				k -= garbage_amount[j];
				j = 0;
			}
			else if (j == 1)
			{
				getObject('garbage' + i).src = puyo_garbage[0];
			}
		}
	}
}


/* Change the nice colored fever background */
function change_bg()
{
	if (mode != 'eye_candy')
	{
		return false;
	}

	// Changes background
	bg_index[0]++;
	if (bg_index[0] >= 6)
	{
		bg_index[0] = 1;
	}
	getObject('field_lg').style.backgroundImage = 'url("' + bg_index[bg_index[0]] + '")';
}


/* Function for correctly setting the target points */
function setTargetPoints()
{
	// Set target points
	i = getObject('box_settpoints').value;
	if (!isNaN(i) && i != '')
	{
		if (i < 0.01)
		{
			i = 0.01;
		}
		if (i > 9999)
		{
			i = 9999;
		}
		
		target_points = i;
		getObject('tpoints').innerHTML = target_points;
		set_first_content();
	}
}


/* Function for correctly settings the amount of puyo you need to make a chain */
function setPuyoToChain()
{
	// Set puyo needed to make a chain
	i = getObject('box_puyotoclear').value;
	if (!isNaN(i) && i != '')
	{
		i = Math.floor(i);
		if (i < 2)
		{
			i = 2;
		}
		if (i > 72)
		{
			i = 72;
		}
		
		puyo_to_clear = i;
		getObject('ID_puyo_to_clear').innerHTML = puyo_to_clear;
		set_first_content();
	}
}


/* Skin Preview */
function change_skin(skin_id)
{
	// Changes the skin preview image
	getObject('img_skin').src = 'images/skin_' + skin_id.split(',')[0] + '_' + skin_id.split(',')[1] + '.png';
}


/* Makes the selected skin the default skin */
function change_my_skin()
{
	// Makes the skin the default skin
	cur_skin = getRadioValue(document.skin_change.skin).split(',');
	createCookie('chainsim_skin_game', cur_skin[0], 365);
	createCookie('chainsim_skin_value', cur_skin[1], 365);

	getObject('skin_game').innerHTML = skinID[cur_skin[0]][0];
	getObject('skin_value').innerHTML = skinID[cur_skin[0]][cur_skin[1]];
}

/* Small puyo skins */
function change_puyo_skin_sm()
{
	puyo_skin_sm_tmp = getRadioValue(document.change_puyo_sm.puyo_sm);
	if (puyo_skin_sm_tmp != puyo_skin_sm)
	{
		puyo_skin_sm = puyo_skin_sm_tmp;
		reloadBoardData();
	}
	else puyo_skin_sm = puyo_skin_sm_tmp;
	createCookie('chainsim_puyo_skin_sm', puyo_skin_sm, 365);
}

/* Eye Candy puyo skins */
function change_puyo_skin_lg()
{
	puyo_skin_lg_tmp = getRadioValue(document.change_puyo_lg.puyo_lg);
	if (puyo_skin_lg_tmp != puyo_skin_lg)
	{
		puyo_skin_lg = puyo_skin_lg_tmp;
		reloadBoardData();
	}
	else puyo_skin_lg = puyo_skin_lg_tmp;
	createCookie('chainsim_puyo_skin_lg', puyo_skin_lg, 365);
}


/* Switch between modes. This time we will do it without refreshing the page */
function switch_mode()
{
	// Switches between Lite and Eye Candy Mode
	if (mode == 'eye_candy')
	{
		eraseCookie('chainsim_mode');
		mode = '';
	}
	else
	{
		createCookie('chainsim_mode', '1', 365);
		mode = 'eye_candy';
	}

	reloadBoardData();
}

/* Reload the data */
function reloadBoardData()
{
	stopauto();
	recordMap();
	selectPuyoSize();
	init();
	preload_images();
}


/* Gets the right puyo from the filename */
function filename(x, y)
{
	pID = puzzle.charAt(x + (y * 6) - 1);

	     if (pID == PUYO_URL_RED)     puyo = PUYO_RED;
	else if (pID == PUYO_URL_GREEN)   puyo = PUYO_GREEN;
	else if (pID == PUYO_URL_BLUE)    puyo = PUYO_BLUE;
	else if (pID == PUYO_URL_YELLOW)  puyo = PUYO_YELLOW;
	else if (pID == PUYO_URL_PURPLE)  puyo = PUYO_PURPLE;
	else if (pID == PUYO_URL_GARBAGE) puyo = PUYO_GARBAGE;
	else if (pID == PUYO_URL_WALL)    puyo = PUYO_WALL;
	else if (pID == PUYO_URL_IRON)    puyo = PUYO_IRON;
	else if (pID == PUYO_URL_HARD)    puyo = PUYO_HARD;
	else                              puyo = PUYO_NONE;

	map[x + (y * 8)] = puyo;
	//map1[x + (y * 8)] = puyo;
	return pname[puyo];
}


/* Records the chain to switch modes */
function recordMap()
{
	puzzle = '';
	for (y = 0; y < 13; y++)
	{
		for (x = 1; x < 7; x++)
		{
			puyo = map[x + (y * 8)];

			     if (puyo == PUYO_RED)     puzzle += PUYO_URL_RED;
			else if (puyo == PUYO_GREEN)   puzzle += PUYO_URL_GREEN;
			else if (puyo == PUYO_BLUE)    puzzle += PUYO_URL_BLUE;
			else if (puyo == PUYO_YELLOW)  puzzle += PUYO_URL_YELLOW;
			else if (puyo == PUYO_PURPLE)  puzzle += PUYO_URL_PURPLE;
			else if (puyo == PUYO_GARBAGE) puzzle += PUYO_URL_GARBAGE;
			else if (puyo == PUYO_WALL)    puzzle += PUYO_URL_WALL;
			else if (puyo == PUYO_IRON)    puzzle += PUYO_URL_IRON;
			else if (puyo == PUYO_HARD)    puzzle += PUYO_URL_HARD;
			else                           puzzle += PUYO_URL_NONE;
		}
	}
}


/* Writes the URL */
function writeurl()
{
	// Write out the various URL's
	stopauto();
	pID  = '';
	getObject('inosendo_warning').innerHTML = '';
	
	for (y = 0; y < 13; y++)
	{
		for (x = 1; x < 7; x++)
		{
			puyo = map[x + (y * 8)];

			     if (puyo == PUYO_RED)     pID += PUYO_URL_RED;
			else if (puyo == PUYO_GREEN)   pID += PUYO_URL_GREEN;
			else if (puyo == PUYO_BLUE)    pID += PUYO_URL_BLUE;
			else if (puyo == PUYO_YELLOW)  pID += PUYO_URL_YELLOW;
			else if (puyo == PUYO_PURPLE)  pID += PUYO_URL_PURPLE;
			else if (puyo == PUYO_GARBAGE) pID += PUYO_URL_GARBAGE;
			else if (puyo == PUYO_WALL)    pID += PUYO_URL_WALL;
			else if (puyo == PUYO_IRON)    pID += PUYO_URL_IRON;
			else if (puyo == PUYO_HARD)
			{
				pID += PUYO_URL_HARD;
				getObject('inosendo_warning').innerHTML = inosendo_warning;
			}
			else if (pID != '')            pID += PUYO_URL_NONE;
		}
	}
	
	getObject('url_of_chain').value = lurl[0] + pID;
	getObject('url_of_image').value = lurl[1] + pID + lurl[11];
	getObject('pn_bbcode').value    = lurl[2] + pID + lurl[12];
	getObject('ppf_fe').value       = pID;
	//getObject('ppm_html').value     = lurl[3] + pID + lurl[13];
}


/* Create an array of a set length */
function arrnum(n)
{
	for (i = 0; i < n; i++)
	{
     		this[i] = 0;
	}
}


/* Change color of selected puyo */
function changecolor(c)
{
	pclr = c;
	getObject('puyo_selected_img').src = pname[pclr];
}


/* Start chaining! */
function rensa(s)
{
	stopauto();
	if (re == 1)         pictmap();
	if (soatmap(s) == 0) erasemap(s);

}


/* Place the puyo */
function putpuyo(n)
{
	if (pclr == PUYO_DELETE)
	{
		for (i = n; i > 7; i -= 8) map[i] = map[i - 8];
		map[n % 8] = 0;
	}
	else
	{
		if (getObject('cb_insertpuyo').checked)
		{
			for (i = (n % 8); i < n; i = i + 8) map[i] = map[i + 8];
		}
		map[n] = pclr;
	}
	putpuyo2(n);
	re = 1;
}


/* Museover puyo */
function putpuyo1(n)
{
	if (pclr == PUYO_DELETE)
	{
		for (i = n; i > 7; i -= 8) getObject('puyo_' + i).src = pname[map[i - 8]];
		getObject('puyo_' + (n % 8)).src = pname[PUYO_NONE];
	}
	else
	{
		if (getObject('cb_insertpuyo').checked)
		{
			for (i = (n % 8); i < n; i += 8) getObject('puyo_' + i).src = pname[map[i + 8]];
		}
		getObject('puyo_' + n).src = pname[pclr];
	}
}


/* Mouseout puyo */
function putpuyo2(n)
{
	for (i = (n % 8); i <= n; i += 8) getObject('puyo_' + i).src = pname[map[i]];
}


/* I guess this has to do with map erasing */
function erasemap(s)
{
	ck = new arrnum(112);	// Create a new array field for puyo
	sa = new arrnum(5);	//Probably for bonuses
	s1 = 0;			// Something
	s2 = 0;			// Something
	s3 = 0;			// Something
	s4 = 0;			// Something

	for (x = 1; x < 7; x++)
	{
		for (y = 1; y < 13; y++)
		{
			cf = x + (y * 8);
			if (map[cf] >= IS_A_PUYO && map[cf] < POP_PUYO && ck[cf] == 0)
			{
				cl = 0;
				ch = 0;
				cc = map[cf];
				cp[0]  = cf;
				ck[cf] = 1;
				while (cl <= ch)
				{
					for (z = 0; z < 4; z++)
					{
						cf = cp[cl] + r[z];
						if (cf > 8 && map[cf] == cc && ck[cf] == 0)
						{
							ch++;
							cp[ch] = cf;
							ck[cf] = 2;
						}
					}
					cl++;
				}
				if (ch >= puyo_to_clear - 1)
				{
					// If there are enough puyo, erase them!
					for (i = 0; i <= ch; i++)
					{
						switch (map[cp[i]])
						{
							case PUYO_RED:    getObject('puyo_' + cp[i]).src = pname[PUYO_POP_RED];    map[cp[i]] = PUYO_POP_RED; break;
							case PUYO_GREEN:  getObject('puyo_' + cp[i]).src = pname[PUYO_POP_GREEN];  map[cp[i]] = PUYO_POP_GREEN; break;
							case PUYO_BLUE:   getObject('puyo_' + cp[i]).src = pname[PUYO_POP_BLUE];   map[cp[i]] = PUYO_POP_BLUE; break;
							case PUYO_YELLOW: getObject('puyo_' + cp[i]).src = pname[PUYO_POP_YELLOW]; map[cp[i]] = PUYO_POP_YELLOW; break;
							case PUYO_PURPLE: getObject('puyo_' + cp[i]).src = pname[PUYO_POP_PURPLE]; map[cp[i]] = PUYO_POP_PURPLE; break;
						}
						// Now we check for garbage puyo
						for (z = 0; z < 4; z++)
						{
							cf = cp[i] + r[z];
							
							// Let's check for the normal garbage
							if (cf > 8)
							{
								// Let's check for hard puyo, and then turn them into normal garbage puyo.
								if (map[cf] == PUYO_HARD)
								{
									map[cf] --;
									
									getObject('puyo_' + cf).src = pname[PUYO_GARBAGE];
									map[cf] = PUYO_GARBAGE;
								}
								
								// Normal garbage now
								else if (map[cf] == PUYO_GARBAGE)
								{
									map[cf]--;

									getObject('puyo_' + cf).src = pname[PUYO_POP_GARBAGE];
									map[cf] = PUYO_POP_GARBAGE;
								}
							}
						}
					}
					// Something
					s4 = s4 + ch + 1;
					// Something
					s1 += s1_bonus[tsu_or_fever][(ch > 10 ? ch : 10)];
					// Something
					sa[cc - 13] = 1;
				}
			}
		}
	}
	// Add up a bonus
	s2 = sa[0] + sa[1] + sa[2] + sa[3] + sa[4] - 1;
	if (s2 >= 0)
	{
		s2 = s2_bonus[tsu_or_fever][(s2 > 4 ? 4 : s2)];
	}
	else
	{
		s2 = -1;
	}

	// Check if we have made a chain or not
	if (s2 >= 0)
	{
		chain += 1;
	}
	else
	{
		chain = 0;
		score = 0;
		garbage = 0;
	}

	// If we made more than a 19 chain somehow, limit to 19 to prevent errors
	if (chain > 0)
	{
		s3 = s3_bonus[s3_type][(chain > 19 ? 18 : chain - 1)];
	}
	else
	{
		s3 = 0;
	}
	// Tally up the score bonus
	sb = (s1 + s2 + s3) * s4 * 10;
	if (sb == 0) sb = s4 * 10;
	score += sb;
	
	getObject('chains').innerHTML = chain;
	
	if (s2 >= 0)
	{
		getObject('score').innerHTML = score;
	}

	if (s == 1 && chain > 0)
	{
		timerID = setTimeout('rensa(1);', 500);
		timerOn = true;
		
		k = Math.floor(score / target_points);
		// Add the garbage
		garbage += k;
		getObject('garbage').innerHTML = garbage;
			
		// Change background if we should
		change_bg();

		// Calculate garbage
		setGarbage();
	}
}


/* Change power (NOT VALID) */
function changetype(tp){
	s3_type = tp.options[tp.selectedIndex].value;
	if(s3_type == 0){
		tsu_or_fever = 0;
	} else {
		tsu_or_fever = 1;
	}
}


/* Make the field, either clear it or get it from the URL */
function makemap(type)
{
	make_field((type == 1 ? URL_puyo : ''));
}


/* Set up a field! */
function make_field(setup)
{
	// Creates the field
	stopauto();
	resetScore();
	pos = setup.length - 1;
	for (y = 12; y >= 0; y--)
	{
		for (x = 6; x > 0; x--)
		{
			pd = setup.charAt(pos);
			if (pd < 0)
			{
				puyo = PUYO_NONE;
			}
			else
			{
				     if (pd == PUYO_URL_RED)     puyo = PUYO_RED;
				else if (pd == PUYO_URL_GREEN)   puyo = PUYO_GREEN;
				else if (pd == PUYO_URL_BLUE)    puyo = PUYO_BLUE;
				else if (pd == PUYO_URL_YELLOW)  puyo = PUYO_YELLOW;
				else if (pd == PUYO_URL_PURPLE)  puyo = PUYO_PURPLE;
				else if (pd == PUYO_URL_GARBAGE) puyo = PUYO_GARBAGE;
				else if (pd == PUYO_URL_WALL)    puyo = PUYO_WALL;
				else if (pd == PUYO_URL_IRON)    puyo = PUYO_IRON;
				else                             puyo = PUYO_NONE;
				pos--;
			}
			map[x + (y * 8)] = puyo;
			getObject('puyo_' + (x + (y * 8))).src = pname[puyo];
		}
	}
	re = 1;
}

/* Read the map */
function readmap()
{
	for (y = 0; y < 104; y += 8)
	{
		map[y] = PUYO_WALL;
		map[y + 7] = PUYO_WALL;
		for (x = 1; x < 7; x++)
		{
			cf = x + y;
			pd  = getObject('puyo_' + cf).src;
			pda = pd.split("/");
			pd  = pda[pda.length - 2] + '/' + pda[pda.length - 1];
			puyo = 0;
			while (pd != pname[puyo] && puyo <= 25)
				puyo++;
			//map[cf] = PUYO_NONE;
			//for (puyo in pname)
			//{
				//puyo++;
				//if (pd == pname[puyo])
				//{
					//map[cf] = puyo;
					//break;
				//}
			//}
			map[cf] = puyo;
		}
	}
	for (y = 104; y < 112; y++) map[y] = PUYO_WALL;
	re = 1;
}


/* Remap the puyo */
function remap()
{
	stopauto();
	for (y = 0; y < 104; y += 8)
	{
		for (x = 1; x < 7; x++)
		{
			cf = x + y;
			map[cf] = map1[cf];
			getObject('puyo_' + cf).src = pname[map[cf]];

		}
	}
	resetScore();
	re = 0;
}


/* Picture Map */
function pictmap()
{
	for (y = 0; y < 104; y += 8)
	{
		for (x = 1; x < 7; x++)
		{
			cf = x + y;
			map1[cf] = map[cf];
		}
	}
	re = 0;
}


/* Droping the puyo */
function soatmap(s)
{
	f = 0;
	for (x = 1; x < 7; x++)
	{
		dy = 0;
		for (y = 12; y >= 0; y--)
		{
			cf = x + y * 8;
			if (map[cf] == PUYO_NONE || map[cf] >= POP_PUYO)
			{
				map[cf] = PUYO_NONE;
				getObject('puyo_' + cf).src = pname[PUYO_NONE];
				dy++;
			}
			else if (map[cf] == PUYO_WALL)
			{
				dy = 0;
			}
			else if (dy > 0)
			{
				puyo = map[cf];
				map[cf + dy * 8] = puyo;
				map[cf] = PUYO_NONE;
				getObject('puyo_' + (cf + dy * 8)).src = pname[puyo];
				getObject('puyo_' + cf).src = pname[PUYO_NONE];
				f = 1;
			}
		}
	}
	if (s == 1 && f == 1)
	{
		timerID = setTimeout('rensa(1);', 500);
		timerOn = true;
	}
	return f;
}


/* Start/Stop our simulation */
function auto()
{
	if (timerOn == true) stopauto();
	else rensa(1);
}


/* Stop our simulation if we need to */
function stopauto()
{
	clearTimeout(timerID);
	timerOn = false;
}


/* Preload our images */
function preload_images()
{
	// Preloads images
	content = '';
	if (mode == 'eye_candy')
	{
		// Fever BG's
		for (i = 1; i < 6; i++)
		{
			content += '<img src="' + bg_index[i] + '" class="bg_hide" alt="" />';
		}
		
		// Garbage Puyo
		for (i = 1; i < 8; i++)
		{
			content += '<img src="' + puyo_garbage[i] + '" class="puyo_hide" alt="" />';
		}
	}

	// Poping Sprites
	for (i = PUYO_POP_RED; i <= PUYO_POP_GARBAGE; i++)
	{
		content += '<img src="' + pname[i] + '" class="puyo_hide" alt="" />';
	}
	getObject('load_data').innerHTML = content;
	content = '';
}


/* Change the amount of colors, for picking fever chains */
function change_colors(col)
{
	// Change the colors for fever chains
	getObject(colors + 'col').className = '';
	colors = col;
	getObject(colors + 'col').className = 'current';

	change_fever(fever_style);
}


/* Switch between tabs */
function switch_tab(id_of_tab)
{
	// Change tab styles
	getObject('tab_' + cur_tab).className = '';
	getObject('tab_' + cur_tab + '_content').style.display = 'none';
	cur_tab = id_of_tab;
	getObject('tab_' + cur_tab).className = 'current';
	getObject('tab_' + cur_tab + '_content').style.display = '';

	getObject('tab_cont_top').innerHTML = tabDesc[id_of_tab];
}


/* Write out the fever URL's for the tabs */
function write_fever_urls(tab, style)
{
	str = '';
	// Writes the fever URL's.
	for (i = 3; i < 16; i++)
	{
		str += '<a href="javascript: feverChain(\'' + tab + '\', ' + style + ', ' + i + ');">' + i + '</a>';
		
		if (i < 15)
		{
			str += '&nbsp;&nbsp;';
		}
	}
	
	return str;
}

/* Write out the fever URL's for the tabs */
function create_fever_url(array)
{
	str = '';
	for (i = 0; i < array.length; i++)
	{
		str +=
		'<fieldset>' +
			'<legend>' + array[i] + '</legend>';
			
		for (j = 3; j < 16; j++)
		{
			str += '<a href="javascript: feverChain(\'' + fever_style + '\', ' + i + ', ' + j + ');">' + j + '</a>';
			
			if (j < 15)
			{
				str += '&nbsp;&nbsp;';
			}
		}
		
		str +=
		'</fieldset>';
	}
	return str;
}

/* Set the connect puyo status */
function set_connect_puyo(option)
{
	if (option) createCookie('chainsim_puyo_connect', 1, 365);
	else eraseCookie('chainsim_puyo_connect');
}

/* Get current fever styles */
function change_fever(style)
{

	getObject('FEVER_' + fever_style).className = '';
	fever_style = style;
	getObject('FEVER_' + style).className = 'current';
	
	/* Get the right ones */
	switch (style)
	{
		case 'ppf': case 'ppf_easy': case 'ppf_endless': case 'p15_easy':
			str = create_fever_url(new Array(
				'Stairs',
				'Sandwich',
				'Stairwich',
				'Turukame'
			));
			break;

		case 'p15': case 'p15_wii': case 'p15_endless': case 'p15_wii_endless':
			str = create_fever_url(new Array(
				'Stairs',
				'Sandwich',
				'Stairwich',
				'Stairs #2',
				'Sandwich #2',
				'Folding',
				'Avalanche',
				'Avalanche #2'
			));
			break;

		case 'yoshi': case 'yoshi_endless':
			str = create_fever_url(new Array(
				'Stairs',
				'Reverse Stairs',
				'Sandwich',
				'Reverse Sandwich',
				'Stairwich',
				'Reverse Stairwich',
				'Beetle',
				'Reverse Beetle',
				'Turukame',
				'Reverse Turukame',
				'Random',
				'Reverse Random'
			));
			break;
	}

	getObject('fever_data').innerHTML = str;
}

function selectPuyoSize()
{
	if (mode == 'eye_candy')
	{
		puyo_size = 'lg';
		
		//ext = (puyo_skin_lg == 'ppf' ? 'gif' : 'png');
		ext = 'png';

		pname[PUYO_RED]     = pdname + 'puyo/' + puyo_skin_lg + '/puyo_R.' + ext;
		pname[PUYO_GREEN]   = pdname + 'puyo/' + puyo_skin_lg + '/puyo_G.' + ext;
		pname[PUYO_BLUE]    = pdname + 'puyo/' + puyo_skin_lg + '/puyo_B.' + ext;
		pname[PUYO_YELLOW]  = pdname + 'puyo/' + puyo_skin_lg + '/puyo_Y.' + ext;
		pname[PUYO_PURPLE]  = pdname + 'puyo/' + puyo_skin_lg + '/puyo_P.' + ext;
		pname[PUYO_GARBAGE] = pdname + 'puyo/' + puyo_skin_lg + '/puyo_O.' + ext;
		pname[PUYO_WALL]    = pdname + 'puyo_W.gif';
		pname[PUYO_HARD]    = pdname + 'puyo/' + puyo_skin_lg + '/puyo_H.' + ext;

		pname[PUYO_POP_RED]     = pdname + 'pop_R.gif';
		pname[PUYO_POP_GREEN]   = pdname + 'pop_G.gif';
		pname[PUYO_POP_BLUE]    = pdname + 'pop_B.gif';
		pname[PUYO_POP_YELLOW]  = pdname + 'pop_Y.gif';
		pname[PUYO_POP_PURPLE]  = pdname + 'pop_P.gif';
		pname[PUYO_POP_GARBAGE] = pdname + 'pop_O.gif';
	
		wall_img = pdname + 'wall_lg.gif';

		/* Colorful backgrounds */
		bg_index = new Array();
			bg_index[0] = 1;
			bg_index[1] = pdname + 'fieldbg_R.png';
			bg_index[2] = pdname + 'fieldbg_G.png';
			bg_index[3] = pdname + 'fieldbg_B.png';
			bg_index[4] = pdname + 'fieldbg_Y.png';
			bg_index[5] = pdname + 'fieldbg_P.png';
		
		/* Garbage Sprites */
		puyo_garbage = new Array();
			puyo_garbage[0] = pname[PUYO_NONE];
			puyo_garbage[1] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_sm.' + ext;
			puyo_garbage[2] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_med.' + ext;
			puyo_garbage[3] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_rock.' + ext;
			puyo_garbage[4] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_star.' + ext;
			puyo_garbage[5] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_moon.' + ext;
			puyo_garbage[6] = pdname + 'puyo/' + puyo_skin_lg + '/nuisance_crown.' + ext;
			//puyo_garbage[7] = pdname + 'nuisance_comet.gif';
	}
	else
	{
		puyo_size = 'sm';

		pname[PUYO_RED]     = pdname + 'puyo/' + puyo_skin_sm + '/puyo_R.gif';
		pname[PUYO_GREEN]   = pdname + 'puyo/' + puyo_skin_sm + '/puyo_G.gif';
		pname[PUYO_BLUE]    = pdname + 'puyo/' + puyo_skin_sm + '/puyo_B.gif';
		pname[PUYO_YELLOW]  = pdname + 'puyo/' + puyo_skin_sm + '/puyo_Y.gif';
		pname[PUYO_PURPLE]  = pdname + 'puyo/' + puyo_skin_sm + '/puyo_P.gif';
		pname[PUYO_GARBAGE] = pdname + 'puyo/' + puyo_skin_sm + '/puyo_O.gif';
		pname[PUYO_WALL]    = pdname + 'puyo/' + puyo_skin_sm + '/puyo_W.gif';
		pname[PUYO_HARD]    = pdname + 'puyo/' + puyo_skin_sm + '/puyo_H.gif';

		pname[PUYO_POP_RED]     = pdname + 'pop_R_sm.gif';
		pname[PUYO_POP_GREEN]   = pdname + 'pop_G_sm.gif';
		pname[PUYO_POP_BLUE]    = pdname + 'pop_B_sm.gif';
		pname[PUYO_POP_YELLOW]  = pdname + 'pop_Y_sm.gif';
		pname[PUYO_POP_PURPLE]  = pdname + 'pop_P_sm.gif';
		pname[PUYO_POP_GARBAGE] = pdname + 'pop_O_sm.gif';

		wall_img = pdname + 'wall.gif';
	}
}