/* These writes the content for the Puyo Puyo Chain Simulator */

/* Get Cookie Info */
//if (cur_skin == null)
//{
//	cur_skin = Math.floor(readCookie('puyochain_skin'));
//	if (cur_skin == undefined || cur_skin < 1 || cur_skin > SKINS) cur_skin = 1;
//	selectPuyoSize();
//}

/* Main Initial Content */
function init()
{
	
	/* Set up left puyo table */
	content =
		'<div id="field_' + puyo_size + '">' +
			'<div id="top_row_' + puyo_size + '"><img src="' + pname[PUYO_NONE] + '" class="puyo_' + puyo_size + '" alt="" />';
			
			for (x = 1; x < 7; x++)
			{
				content +=
					'<a href="javascript: putpuyo(' + x + ');" onmouseover="putpuyo1(' + x + ');" onmouseout="putpuyo2(' + x + ');">' +
					'<img src="' + filename(x, 0) + '" id="puyo_' + x + '" class="puyo_' + puyo_size + '" alt="" /></a>';
			}
			
			content += '<img src="' + pname[PUYO_NONE] + '" class="puyo_' + puyo_size + '" alt="" /></div>';
			
			for (y = 1; y < 13; y++)
			{
				content += '<img src="' + wall_img + '" class="puyo_' + puyo_size + '" alt="" />';
				for (x = 1; x < 7; x++)
				{
					cf = x + (y * 8);
					content +=
						'<a href="javascript: putpuyo(' + cf + ');" onmouseover="putpuyo1(' + cf + ');" onmouseout="putpuyo2(' + cf + ');">' +
						'<img src="' + filename(x, y) + '" id="puyo_' + cf + '" class="puyo_' + puyo_size + '" alt="" /></a>';
				}
				content += '<img src="' + wall_img + '" class="puyo_' + puyo_size + '" alt="" />';
			}
			
			for (x = 0; x < 8; x++)
			{
				content += '<img src="' + wall_img + '" class="puyo_' + puyo_size + '" alt="" />';
			}
			
			content += '</div>';

	getObject('field').innerHTML = content;
	
	/* Now we set up the right table */
	content = '<img src="' + pname[PUYO_NONE] + '" id="side_fieldimg" alt="" /><br />';

	if (mode == 'eye_candy')
	{
		content += '<div id="garbage_bar">';
		
		for (i = 1; i < 7; i++)
		{
			content += '<img src="' + pname[PUYO_NONE] + '" id="garbage' + i + '" class="garbage" alt="" />';
		}
		
		content += '</div><br />';
	}

	content += '<div class="b">&nbsp;&nbsp;Currently Selected Puyo:</div><div id="puyo_' + puyo_size + '_selected"><img src="images/p.gif" class="puyo_' + puyo_size + '" alt="" id="puyo_selected_img" /></div><input type="checkbox" id="cb_insertpuyo" class="checkbox"><label for="cb_insertpuyo" class="checkbox"> Insert puyo instead of replacing puyo</label><br />';

	content += '<table id="puyo_select"><tr>' +
			'<td><a href="javascript: changecolor(' + PUYO_NONE + ');"><img src="' + pname[PUYO_NONE] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_DELETE + ');"><img src="' + pname[PUYO_DELETE] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_GARBAGE + ');"><img src="' + pname[PUYO_GARBAGE] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_WALL + ');"><img src="' + pname[PUYO_WALL] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_IRON + ');"><img src="' + pname[PUYO_IRON] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_HARD + ');"><img src="' + pname[PUYO_HARD] + '" class="puyo_' + puyo_size + '" alt="" /></a></td></tr>' +
			'<tr><td><a href="javascript: changecolor(' + PUYO_RED + ');"><img src="' + pname[PUYO_RED] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_GREEN + ');"><img src="' + pname[PUYO_GREEN] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_BLUE + ');"><img src="' + pname[PUYO_BLUE] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_YELLOW + ');"><img src="' + pname[PUYO_YELLOW] + '" class="puyo_' + puyo_size + '" alt="" /></a></td>' +
			'<td><a href="javascript: changecolor(' + PUYO_PURPLE + ');"><img src="' + pname[PUYO_PURPLE] + '" class="puyo_' + puyo_size + '" alt="" /></a></td></tr></table>';

	content += '<div class="b" id="chain_score"><span id="chains">0</span> Chain!<br />\n'
		+ 'Score: <span id="score">0</span><br />\n'
		+ 'Garbage: <span id="garbage">0</span></div>\n'
		+ '<div class="center">\n'
		+ '<input type="button" class="button majorb" onclick="remap();" name="return_to_chain" value="&nbsp;&nbsp;Edit Mode&nbsp;&nbsp;" />'
		+ '<input type="button" class="button majorb" onclick="rensa(0);" name="advance_one_step" value="Advance a Step" /><br />'
		+ '<input type="button" class="button majorb" onclick="auto();" name="start_simulation" value="Start/Stop Simulation" /><br /><br />'
		+ '<span class="b"><a href="javascript: makemap(0);">Clear Field</a>&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '<a href="javascript: makemap(1);">Make Field from URL</a></span></div>';
	
	getObject('side_field').innerHTML = content;
	content = '';

	//Switch modes
	content += '<a href="javascript: switch_mode();" style="color: #FFF;">Switch to ' + (mode == 'eye_candy' ? 'Standard Mode' : 'Eye Candy Mode') + '</a>';
	getObject('switch_mode').innerHTML = content;
	
	content = '';
	//readmap();
}


/* More tab stuf */
/* Subtab Menu */
tabSub_menu =
	//'<div class="left">' + 
	'<div class="navbutton">' +
		'<ul>' +
			'<li><a href="javascript: change_colors(3);" id="3col">3 Colors</a></li>' +
			'<li><a href="javascript: change_colors(4);" id="4col" class="current">4 Colors</a></li>' +
			'<li><a href="javascript: change_colors(5);" id="5col">5 Colors</a></li>' +
		'</ul>' +
	'</div><br />' +
	
	'<div class="navbutton">' +
		'<ul>' +
			'<li><a href="javascript: change_fever(\'ppf_easy\');" id="FEVER_ppf_easy">Fever 1 &amp; 2 (Easy)</a></li>' +
			'<li><a href="javascript: change_fever(\'ppf\');" id="FEVER_ppf" class="current">Fever 1 &amp; 2 (Normal)</a></li>' +
			'<li><a href="javascript: change_fever(\'ppf_endless\');" id="FEVER_ppf_endless">Fever 1 &amp; 2 (Endless)</a></li>' +
			//'<li><a href="javascript: change_fever(\'p15_easy\');" id="FEVER_p15_easy">15th Anniversary (Unused Easy)</a></li>' +
			'<li><a href="javascript: change_fever(\'p15\');" id="FEVER_p15">15th Anniversary (Normal)</a></li>' +
			'<li><a href="javascript: change_fever(\'p15_endless\');" id="FEVER_p15_endless">15th Anniversary (Endless)</a></li>' +
			'<li><a href="javascript: change_fever(\'p15_wii\');" id="FEVER_p15_wii">15th Anniversary Wii (Normal)</a></li>' +
			'<li><a href="javascript: change_fever(\'p15_wii_endless\');" id="FEVER_p15_wii_endless">15th Anniversary Wii (Endless)</a></li>' +
			'<li><a href="javascript: change_fever(\'yoshi\');" id="FEVER_yoshi">(Custom) Nick\'s Fever (Normal)</a></li>' +
			'<li><a href="javascript: change_fever(\'yoshi_endless\');" id="FEVER_yoshi_endless">(Custom) Nick\'s Fever (Endless)</a></li>' +
		'</ul>' +
	'</div>';

/* Linkinc Codes Tab */
tabDesc['link_codes'] = 'Linking Codes';
tabSub['link_codes'] = false;

tabContent['link_codes'] =
	'<div align="center">' +
		'<input type="button" class="button" onclick="writeurl();" name="get_linking_codes" value="Generate Linking Codes" />' +
	'</div>' +
	'<fieldset>' +
		'<legend>Link back to the chain</legend>' +
		'<input name="url_of_chain" id="url_of_chain" type="text" class="url text" value="" style="width: 100%;" />' +
	'</fieldset>' +
	'<fieldset>' +
		'<legend>Image of the chain</legend>' +
		'<input name="url_of_image" id="url_of_image" type="text" class="url text" value="" style="width: 100%;" />' +
	'</fieldset>' +
	'<fieldset>' +
		'<legend>BBCode to post a chain image on the forum</legend>' +
		'<input name="ppm_bbcode" id="pn_bbcode" type="text" class="url text" value="" style="width: 100%;" />' +
	'</fieldset>' +
	'<fieldset>' +
		'<legend>Code to use in the PPF Fever Editor</legend>' +
		'<input name="ppm_bbcode" id="ppf_fe" type="text" class="url text" value="" style="width: 100%;" />' +
	'</fieldset><br />' +
	'<div id="inosendo_warning" class="b" style="margin: 0px 8px;"></div>';

/* Settings Tab */
tabDesc['settings'] = 'Change Settings &amp; Values';
tabSub['settings'] = false;

//function set_first_content()
//{
	tabContent['settings'] =
		'<fieldset>' +
			'<legend>Target Points</legend>' +
			'<div class="b">Target Points: <span id="tpoints">' + target_points + '</span></div>' +
			'Set target points (from 0.01 to 9999, default: 120):' +
			'&nbsp;&nbsp;<input type="text" name="box_settpoints" id="box_settpoints" class="text" maxlength="4" size="2" />' +
			'&nbsp;&nbsp;<input type="button" name="but_settpoints" class="button" onclick="setTargetPoints();" value="Set" />' +
		'</fieldset>' +
		'<fieldset>' +
			'<legend>Character Power</legend>' +
			'<div id="cpower" class="b">Current Character Power: ' + char_power_char + ' - ' + char_power_game + '</div>' +
			'<table id="char_power">' +
				'<tr>' +
					'<td>' +
						'<fieldset>' +
							'<legend>Puyo Puyo Fever</legend>' +
							'<select name="selectPowers_PPF">' +
								'<optgroup label="Regular Power" />';
								for (i = 0; i < 16; i++)
								{
									tabContent['settings'] += '<option>' + pwr_chara[1][i] + '</option>';
								}
								tabContent['settings'] += '<optgroup label="Fever Power" />';
								for (i = 0; i < 16; i++)
								{
									tabContent['settings'] += '<option>' + pwr_chara[1][i] + '</option>';
								}
							tabContent['settings'] += '</select>' +
						'</fieldset>' +
					'</td>' +
					'<td>' +
						'<fieldset>' +
							'<legend>Puyo Puyo Fever 2</legend>' +
							'<select name="selectPowers_PPF2">' +
								'<option>Lemres</option>' +
							'</select>' +
						'</fieldset>' +
					'</td>' +
				'</tr>' +
				'<tr>' +
					'<td>' +
						'<fieldset>' +
							'<legend>Puyo Puyo! 15th Anniversary</legend>' +
							'<select name="selectPowers_PP15">' +
								'<option>Ursa Major</option>' +
							'</select>' +
						'</fieldset>' +
					'</td>' +
					'<td>' +
						'<fieldset>' +
							'<legend>Classic</legend>' +
							'<select name="selectPowers_PP">';
								for (i = 0; i < 2; i++)
								{
									tabContent['settings'] += '<option>' + pwr_chara[0][i] + '</option>';
								}
							tabContent['settings'] += '</select>' +
						'</fieldset>' +
					'</td>' +
				'</tr>' +
			'</table>' +
		'</fieldset>' +
		'<fieldset>' +
			'<legend>Puyo Needed to make a Chain</legend>' +
			'<div class="b">Puyo Needed to make a Chain: <span id="ID_puyo_to_clear">' + puyo_to_clear + '</span></div>' +
			'Set the amount of puyo you need to make a chain (from 2 to 72, default: 4):' +
			'&nbsp;&nbsp;<input type="text" name="box_puyotoclear" id="box_puyotoclear" class="text" maxlength="2" size="2" />' +
			'&nbsp;&nbsp;<input type="button" name="but_puyotoclear" class="button" onclick="setPuyoToChain();" value="Set" />' +
		'</fieldset>';
		
	//getObject('subTab_content').innerHTML = tabContent['settings'];
//}

/* My Profile Tab*/
tabDesc['my_profile'] = 'Modify My Chain Simulator Profile';
tabSub['my_profile'] = false;

tabContent['my_profile'] =
	'<fieldset>'+
		'<legend>My Skin</legend>' +
		'<div class="center">You can specify a background you want to see on a geneated image created by this chain simulator.</div>' +
		'<div class="center">Your current skin: <span class="b" id="skin_value">' + skinID[skin_game][skin_value] + '</span> from <span class="b" id="skin_game">' + skinID[skin_game][0] + '</span>.</div>' +
		'<form name="skin_change">' +
			'<table id="skin_sel" cellspacing="16"><tr>' +
				'<td valign="top" colspan="2">' +
					'<div class="center b">' + skinID[0][0] + '</div>' +
					'<input type="radio" name="skin" value="1,1" id="s1,1" onclick="change_skin(this.value);" ' + (skin_game == 1 && skin_value == 1 ? 'checked="checked" ' : '') + '/><label for="s1,1">&nbsp;' + skinID[1][1] + '</label><br />' +
					'<input type="radio" name="skin" value="0,1" id="s0,1" onclick="change_skin(this.value);" ' + (skin_game == 0 && skin_value == 1 ? 'checked="checked" ' : '') + '/><label for="s0,1">&nbsp;' + skinID[0][1] + '</label>' +
				'</td>' +
				'<td valign="top" rowspan="2" class="center">' +
					'<img src="images/skin_' + skin_game + '_' + skin_value + '.png" id="img_skin" alt="" /><br />' +
					'<input type="button" name="make_default_skin" onclick="change_my_skin();" class="button" value="Make this my skin" />' +
				'</td></tr>' +
				'<tr><td valign="top">';
					for (i = 2; i < Math.ceil((skinID.length + 2) / 2); i++)
					{
						tabContent['my_profile'] += '<div class="center b">' + skinID[i][0] + '</div>';
						for (j = 1; j < skinID[i].length; j++)
						{
							if (skinID[i][j] == undefined)
							{
								tabContent['my_profile'] += '<br />';
								break;
							}
							tabContent['my_profile'] += '<input type="radio" name="skin" value="' + i + ',' + j + '" id="s' + i + ',' + j + '" onclick="change_skin(this.value);" ' + (skin_game == i && skin_value == j ? 'checked="checked" ' : '') + '/><label for="s' + i + ',' + j + '">&nbsp;' + skinID[i][j] + '</label><br />';
						}
					}
					/*'<div class="center b">Nazo Puyo</div>' +
					'<input type="radio" name="skin" value="3" id="s3" onclick="change_skin(this.value);" /><label for="s3">&nbsp;Jungle</label><br /><br />' +
					'<div class="center b">Puyo Puyo</div>' +
					'<input type="radio" name="skin" value="4" id="s4" onclick="change_skin(this.value);" /><label for="s4">&nbsp;Rock Theme</label><br />' +
					*/
				tabContent['my_profile'] += '</td>' +
				'<td valign="top">';
					for (i = Math.ceil((skinID.length + 2) / 2); i < skinID.length; i++)
					{
						tabContent['my_profile'] += '<div class="center b">' + skinID[i][0] + '</div>';
						for (j = 1; j < skinID[i].length; j++)
						{
							if (skinID[i][j] == undefined)
							{
								tabContent['my_profile'] += '<br />';
								break;
							}
							tabContent['my_profile'] += '<input type="radio" name="skin" value="' + i + ',' + j + '" id="s' + i + ',' + j + '" onclick="change_skin(this.value);" ' + (skin_game == i && skin_value == j ? 'checked="checked" ' : '') + '/><label for="s' + i + ',' + j + '">&nbsp;' + skinID[i][j] + '</label><br />';
						}
					}
					/*'<div class="center b">Puyo Puyo Fever</div>' +
					'<input type="radio" name="skin" value="18" id="s18" onclick="change_skin(this.value);" /><label for="s18">&nbsp;Red Fever</label><br />' +
					'<input type="radio" name="skin" value="19" id="s19" onclick="change_skin(this.value);" /><label for="s19">&nbsp;Green Fever</label><br />' +
					'<input type="radio" name="skin" value="20" id="s20" onclick="change_skin(this.value);" /><label for="s20">&nbsp;Blue Fever</label><br />' +
					'<input type="radio" name="skin" value="21" id="s21" onclick="change_skin(this.value);" /><label for="s21">&nbsp;Yellow Fever</label><br />' +
					'<input type="radio" name="skin" value="22" id="s22" onclick="change_skin(this.value);" /><label for="s22">&nbsp;Purple Fever</label><br />' +*/
				tabContent['my_profile'] += '</td>' +
					//'<select size="12" name="skin_select" id="skin_select" onchange="change_skin(this.value);">';

					/*for (i = 1; i <= SKINS; i += 1)
					{
						if (cur_skin == i)
						{
							tabContent['my_profile'] += '<option value="' + i + '" selected="selected" style="font-style: italic;">' + sel_skins[i] + '</option>';
						}
						else
						{
							tabContent['my_profile'] += '<option value="' + i + '" style="font-weight: normal;">' + sel_skins[i] + '</option>';
						}
					}

					tabContent['my_profile'] += '</select><br />' +*/
					//tabContent['my_profile'] +=
					//'<input type="button" name="make_default_skin" onclick="make_default_skin();" class="button" value="Make this the default skin" />' +
				//'</div>' +
			//'</td>' +
			//'<td valign="top">' +
				
			//'</td>' +
		'</tr></table></form>' +
	'</fieldset>' +
	'<table>' +
		'<tr>' +
			'<td style="width: 50%;" valign="top">' +
				'<fieldset>' +
					'<legend>Standard Mode Puyo &amp; Chain Images</legend>' +
					'<input type="checkbox" id="cb_connect_puyo" onclick="set_connect_puyo(this.checked);" ' + (connect_puyo ? ' checked="checked" ' : '') + '"/><label for="cb_connect_puyo">&nbsp;Connect Puyo in Chain Images</label><br /><br />' +
					'<form name="change_puyo_sm">';
					
					for (i in puyo_skin_sm_spr)
					{
						tabContent['my_profile'] +=
							'<input type="radio" name="puyo_sm" id="id_' + puyo_skin_sm_spr[i] + '" value="' + puyo_skin_sm_spr[i] + '" ' + (puyo_skin_sm == puyo_skin_sm_spr[i] ? 'checked="checked" ' : '') + '/><label for="id_' + puyo_skin_sm_spr[i] + '">' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_R.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_G.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_B.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_Y.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_P.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_O.gif" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_sm_spr[i] + '/puyo_H.gif" alt="" />' +
							'</label><br />';
					}
					/*'<input type="radio" id="id_pp1" name="puyo_sm" value="pp1" ' + (puyo_skin_sm == 'pp1' ? ' checked="checked"' : '') + '"/><label for="id_pp1">' +
						'&nbsp;<img src="images/puyo/pp1/puyo_R.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_G.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_B.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_Y.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_P.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_O.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp1/puyo_H.gif" alt="" />' +
					'</label><br />' +
					'<input type="radio" id="id_pp3" name="puyo_sm" value="pp3" ' + (puyo_skin_sm == 'pp3' ? ' checked="checked"' : '') + '"/><label for="id_pp3">' +
						'&nbsp;<img src="images/puyo/pp3/puyo_R.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_G.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_B.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_Y.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_P.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_O.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp3/puyo_H.gif" alt="" />' +
					'</label><br />' +
					'<input type="radio" id="id_pp4_cibi" name="puyo_sm" value="pp4_cibi" ' + (puyo_skin_sm == 'pp4_cibi' ? ' checked="checked"' : '') + '"/><label for="id_pp4_cibi">' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_R.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_G.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_B.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_Y.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_P.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_O.gif" alt="" />' +
						'&nbsp;<img src="images/puyo/pp4_cibi/puyo_H.gif" alt="" />' +
					'</label><br />'  +*/
					tabContent['my_profile'] += '</label><br />' +
					'<div class="center"><input type="button" class="button" onclick="change_puyo_skin_sm();" value="Make this my small puyo skin" /></div>' +
				'</form></fieldset>' +
			'</td>' +
			'<td style="width: 50%;" valign="top">' +
				'<fieldset>' +
					'<legend>Eye Candy Mode Puyo</legend>' +
					'<form name="change_puyo_lg">';
					for (i in puyo_skin_lg_spr)
					{
						tabContent['my_profile'] +=
							'<input type="radio" name="puyo_lg" id="id_' + puyo_skin_lg_spr[i] + '" value="' + puyo_skin_lg_spr[i] + '" ' + (puyo_skin_lg == puyo_skin_lg_spr[i] ? 'checked="checked" ' : '') + '/><label for="id_' + puyo_skin_lg_spr[i] + '">' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_R.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_G.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_B.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_Y.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_P.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_O.png" alt="" />' +
								'&nbsp;<img src="images/puyo/' + puyo_skin_lg_spr[i] + '/puyo_H.png" alt="" />' +
							'</label><br />';
					}
					tabContent['my_profile'] += '</label><br />' +
					'<div class="center"><input type="button" class="button" onclick="change_puyo_skin_lg();" value="Make this my eye candy puyo skin" /></div>' +
				'</form></fieldset>' +
			'</td>' +
		'</tr>' +
	'</table>';

/* Download Tab */
tabDesc['download'] = 'Download the Chain Simulator';
tabSub['download'] = false;

tabContent['download'] =
	'You want to use the Chain Simulator, but going somewhere without internet access. Or you just don\'t feel like going online. No worries, you can always download the Chain Simulator.<br /><br />' +
	'<div class="center"><s>Download the Chain Simulator</s><br />Not avaliable yet.</div>';

/* Fever Chains Tab */
tabDesc['fever_chains'] = 'Select a fever chain to use.';
tabSub['fever_chains'] = true;

tabContent['fever_chains'] = '';
	
//write_skin();
// Let's write out the DIV's for the content (All except the div for the fever chains)
function set_first_content()
{
	content = '';
	for (i in tabContent)
	{
		content = '';
		content += '<div id="tab_' + i + '_content">';
	
		if (tabSub[i] == true)
		{
			content += '<table style="width: 100%; border: 0px;"><tr><td id="tab_sub" valign="top" style="width: 100px;">' + tabSub_menu + '</td><td><div style="height: 300px; overflow: auto;" id="fever_data">' + tabContent[i] + '</div></td></tr></table></div>';
		}
		else
		{
			content += tabContent[i] + '</div>';
		}
		getObject('subTab_content').innerHTML += content;
		getObject('tab_' + i + '_content').style.display = 'none';
	}

	getObject('tab_settings_content').style.display = '';
	content = '';
	change_fever('ppf');
}