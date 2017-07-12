/* These control the variables for the Puyo Puyo Chain Simulator */


/* Define our constants */
var PUYO_RED     = 13;
var PUYO_GREEN   = 16;
var PUYO_BLUE    = 14;
var PUYO_YELLOW  = 15;
var PUYO_PURPLE  = 17;
var PUYO_GARBAGE = 2;
var PUYO_WALL    = 12;
var PUYO_IRON    = 11;
var PUYO_NONE    = 0;
var PUYO_DELETE  = 18;
var IS_A_PUYO    = 13;
var POP_PUYO     = 20;
var PUYO_HARD    = 3;

var PUYO_URL_RED     = '4';
var PUYO_URL_GREEN   = '7';
var PUYO_URL_BLUE    = '5';
var PUYO_URL_YELLOW  = '6';
var PUYO_URL_PURPLE  = '8';
var PUYO_URL_GARBAGE = '1';
var PUYO_URL_WALL    = '2';
var PUYO_URL_IRON    = '3';
var PUYO_URL_NONE    = '0';
var PUYO_URL_HARD    = 'A';

var PUYO_POP_RED     = 20;
var PUYO_POP_GREEN   = 21;
var PUYO_POP_BLUE    = 22;
var PUYO_POP_YELLOW  = 23;
var PUYO_POP_PURPLE  = 24;
var PUYO_POP_GARBAGE = 25;


/* Score, Garbage, Chains */
var score   = 0;
var chain   = 0;
var garbage = 0;


/* Game Related */
var colors        = 4;
var target_points = 120;
var puyo_to_clear = 4;


/* URL */
var nurl     = document.URL.split('??'); // Splits URL
var URL      = 'http://www.puyonexus.net/chainsim/';
var URL_puyo = (nurl[1] == undefined ? '' : padString(nurl[1], 78)); // Number Part
var puzzle = URL_puyo;

/* If our URL does not have www, add it so cookies work */
//if (nurl[0].substring(0, 20) == 'http://puyonexus.net')
//	window.location = URL;

/* Linking Codes */
var lurl = new Array();
	lurl[0] = URL + '??'; // URL to chain
	lurl[1] = URL + 'chainimage.php/'; // URL to image
	lurl[2] = '[puyochain]'; // BBcode
	lurl[3] = '<puyochain>'; // Wiki code

	lurl[11] = '.png'; // END URL to image
	lurl[12] = '[/puyochain]'; // END BBcode
	lurl[13] = '</puyochain>'; // END Wiki code

var inosendo_warning = '<div style="color: #FF0000;">NOTE:</div>' +
	'This chain data will not be compatable with Inosendo\'s chain simulator.<br />'+
	'If you wish to make it compatable with Inosendo\'s chain simulator, you should eliminate the hard puyo.';

/* Let's check which mode to load */
var mode = (readCookie('chainsim_mode') == '1' ? 'eye_candy' : '');

/* Images */
/* Let's load our puyo sets */
//puyo_sm = readCookie('chainsim_puyo_sm');
//puyo_lg = readCookie('chainsim_puyo_lg');
var pdname = 'images/'; // Directory of images
var pname = new Array();
	pname[PUYO_NONE]  = pdname + 'p.gif';
	pname[PUYO_IRON]   = pdname + 'puyo_I_sm.gif';
	pname[PUYO_DELETE] = pdname + 'del.gif';

/* Puyo Sprites */
var connect_puyo = (readCookie('chainsim_puyo_connect') == 1);
var puyo_skin_sm = readCookie('chainsim_puyo_skin_sm');
var puyo_skin_lg = readCookie('chainsim_puyo_skin_lg');

/* Set up the puo skin array */
var puyo_skin_sm_spr = new Array();
puyo_skin_sm_spr[0] = 'pp1';
puyo_skin_sm_spr[1] = 'pp3';
puyo_skin_sm_spr[2] = 'pp4_cibi';

var puyo_skin_lg_spr = new Array();
puyo_skin_lg_spr[0] = 'ppf';
//puyo_skin_lg_spr[1] = 'pp4';
puyo_skin_lg_spr[2] = 'pp15_real';
puyo_skin_lg_spr[3] = 'pp15_classic';
//puyo_skin_lg_spr[4] = 'pp15_moji';
//puyo_skin_lg_spr[5] = 'pp15_beta';
//puyo_skin_lg_spr[6] = 'pp15_cube';
//puyo_skin_lg_spr[7] = 'pp15_clear';

if (!in_array(puyo_skin_sm, puyo_skin_sm_spr)) puyo_skin_sm = puyo_skin_sm_spr[0];
if (!in_array(puyo_skin_lg, puyo_skin_lg_spr)) puyo_skin_lg = puyo_skin_lg_spr[0];

/* Set the correct puyo sizes now */
selectPuyoSize();

/* Garbage sprites */

//ext = (puyo_skin_lg == 'ppf' ? 'gif' : 'png');
//var puyo_garbage = new Array();
	/*puyo_garbage[0] = pname[PUYO_NONE];
	puyo_garbage[1] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_sm.' + ext;
	puyo_garbage[2] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_med.' + ext;
	puyo_garbage[3] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_rock.' + ext;
	puyo_garbage[4] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_star.' + ext;
	puyo_garbage[5] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_moon.' + ext;
	puyo_garbage[6] = pdname + 'puyo/' + puyo_skin_lg + '/garbage_crown.' + ext;
	puyo_garbage[7] = pdname + 'garbage_comet.gif';
	*/


/* Garbage amounts */
var garbage_amount = new Array(0, 1, 6, 30, 180, 360, 720/*, 1440*/);


/* Skins, for the skin menu */
/*var cur_skin = null;
var SKINS    = 22;

var sel_skins = new Array();
	sel_skins[1]  = 'Wood Blocks';
	sel_skins[2]  = 'Jungle Wood';
	sel_skins[3]  = 'Underground Rocks';
	sel_skins[4]  = 'Stone Pillar Field';
	sel_skins[5]  = 'Arle\'s Sun Prairie';
	sel_skins[6]  = 'Draco\'s Sun Forest';
	sel_skins[7]  = 'Schezo\'s Sun Rock';
	sel_skins[8]  = 'Colorful Blocks';
	sel_skins[9]  = 'Red Metal';
	sel_skins[10] = 'Sand Rocks';
	sel_skins[11] = 'The Green Machine';
	sel_skins[12] = 'The Gray Hand';
	sel_skins[13] = 'Pipe Dream';
	sel_skins[14] = 'Schezo\'s Jungle';
	sel_skins[15] = 'Rulue\'s Rich Gold';
	sel_skins[16] = 'Satan\'s Masked Dream',
	sel_skins[17] = 'Puyo School',
	sel_skins[18] = 'Red Fever',
	sel_skins[19] = 'Green Fever',
	sel_skins[20] = 'Blue Fever',
	sel_skins[21] = 'Yellow Fever',
	sel_skins[22] = 'Purple Fever';*/

/* Set up the skins */
var skinID = Array2D(8, 10);

skinID[0][0] = 'Chain Simulator';
skinID[0][1] = 'Random Skin';

skinID[1][0] = skinID[0][0];
skinID[1][1] = 'Wood Blocks';

skinID[2][0] = 'Nazo Puyo';
skinID[2][1] = 'Wood Jungle';

skinID[3][0] = 'Puyo Puyo';
skinID[3][1] = 'Colorful Blocks';
skinID[3][2] = 'Underground Rocks';
skinID[3][3] = 'Stone Field';

skinID[4][0] = 'Puyo Puyo 2: Tsuu';
skinID[4][1] = 'Red Metal';
skinID[4][2] = 'Golden Rocks';
skinID[4][3] = 'Green Machine';
skinID[4][4] = 'Gray Hand';
skinID[4][5] = 'Pipe Dream';
skinID[4][6] = 'Shezo\'s Jungle';
skinID[4][7] = 'Rulue\'s Gold';
skinID[4][8] = 'Satan\'s Tower';
skinID[4][9] = 'Wood Field';
skinID[4][10]= 'Midnight Statues';
skinID[4][11]= 'Colorful Shapes';

skinID[5][0] = 'Puyo Puyo Sun';
skinID[5][1] = 'Arle\'s Prarie';
skinID[5][2] = 'Draco\'s Forest';
skinID[5][3] = 'Shezo\'s Rock';

skinID[6][0] = 'Puyo Puyo~n';
skinID[6][1] = 'The Circus';

skinID[7][0] = 'Puyo Puyo Fever';
skinID[7][1] = 'Red Fever';
skinID[7][2] = 'Green Fever';
skinID[7][3] = 'Blue Fever';
skinID[7][4] = 'Yellow Fever';
skinID[7][5] = 'Purple Fever';

/* Let's load the skin variables */
var skin_game = readCookie('chainsim_skin_game');
var skin_value = readCookie('chainsim_skin_value');
if (skin_game == undefined || skin_value == undefined ||
    skinID[skin_game][skin_value] == undefined || skin_value < 1)
{
	skin_game = 1;
	skin_value = 1;
}
	
/* These deal with the map things */
var map     = new Array();
var map1    = new Array();
var ck      = new Array();
var cp      = new Array();
var timerID = '';
var timerOn = false;
var r       = new Array();
	r[0] = 8;
	r[1] = 1;
	r[2] = -8;
	r[3] = -1;


/* Set up all of the stuff for the tabs and stuff */
var cur_tab     = 'settings';
var tabContent  = new Array();
var tabSub_menu = new Array();
var tabSub      = new Array();
var tabDesc     = new Array();

var fever_style = 'ppf';


/* This is just, stuff */
var pclr = 0;
var re = 1;
var s3_type = 0;		/* Ϣ���ܡ��ʥ��Υ����� */
var tsu_or_fever = 0;	/* ��(0)���ե����С�(1)�� */
s3_type = 1;
tsu_or_fever = 1;

/* Something */
var s1_bonus = new Array();
s1_bonus[0] = new Array(0, 0, 0, 0, 2, 3, 4, 5, 6, 7, 10);
s1_bonus[1] = new Array(0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 8);

/* Something */
var s2_bonus = new Array();
s2_bonus[0] = new Array(0, 3, 6, 12, 24);
s2_bonus[1] = new Array(0, 2, 4, 8, 16);

/* Things */
var char_power_char = 'Amitie';
var char_power_game = 'Puyo Puyo Fever';
var type = new Array();
var s3_bonus = new Array();
type[0] = 'Classic';
s3_bonus[0] = new Array(0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512);
type[1] = 'Amitie';
s3_bonus[1] = new Array(0, 8, 16, 22, 33, 67, 111, 167, 223, 279, 349, 419, 489, 559, 629, 699, 699, 699, 699);
type[2] = 'Amitie in Fever';
s3_bonus[2] = new Array(0, 6, 12, 15, 20, 33, 55, 83, 111, 167, 195, 201, 239, 279, 307, 307, 307, 307, 307);
type[3] = 'Oshare';
s3_bonus[3] = new Array(0, 7, 16, 23, 35, 74, 125, 191, 259, 330, 419, 512, 617, 699, 699, 699, 699, 699, 699);
type[4] = 'Oshare in Fever';
s3_bonus[4] = new Array(0, 6, 11, 13, 19, 32, 53, 80, 107, 163, 191, 197, 235, 277, 306, 306, 306, 306, 306);
type[5] = 'Klug';
s3_bonus[5] = new Array(0, 7, 16, 23, 35, 74, 125, 191, 259, 330, 419, 512, 617, 699, 699, 699, 699, 699, 699);
type[6] = 'Klug in Fever';
s3_bonus[6] = new Array(0, 6, 12, 14, 20, 32, 53, 79, 104, 156, 181, 186, 219, 254, 278, 278, 278, 278, 278);
type[7] = "���롼�����̾��";
s3_bonus[7] = new Array(0, 7, 16, 23, 37, 76, 131, 201, 274, 349, 446, 545, 661, 699, 699, 699, 699, 699, 699);
type[8] = "���롼�����ե����С���";
s3_bonus[8] = new Array(0, 6, 11, 13, 18, 30, 50, 75, 100, 151, 176, 181, 210, 251, 277, 277, 277, 277, 277);
type[9] = "��ǥ롦�̾��";
s3_bonus[9] = new Array(0, 9, 18, 24, 37, 74, 123, 184, 246, 307, 384, 461, 538, 615, 692, 699, 699, 699, 699);
type[10] = "��ǥ롦�ե����С���";
s3_bonus[10] = new Array(0, 5, 9, 12, 16, 26, 44, 67, 89, 134, 156, 160, 191, 223, 246, 246, 246, 246, 246);
type[11] = "���륿�롦�̾��";
s3_bonus[11] = new Array(0, 9, 17, 23, 34, 67, 110, 164, 216, 268, 332, 394, 450, 509, 566, 622, 699, 699, 699);
type[12] = "���륿�롦�ե����С���";
s3_bonus[12] = new Array(0, 6, 12, 14, 20, 32, 53, 79, 104, 156, 181, 186, 219, 254, 278, 278, 278, 278, 278);
type[13] = "������쥳���١��̾��";
s3_bonus[13] = new Array(0, 7, 15, 20, 31, 63, 107, 160, 216, 271, 341, 411, 485, 557, 629, 699, 699, 699, 699);
type[14] = "������쥳���١��ե����С���";
s3_bonus[14] = new Array(0, 7, 13, 17, 23, 38, 64, 97, 130, 197, 230, 237, 283, 333, 368, 368, 368, 368, 368);
type[15] = "�ɤ󤰤ꥬ���롦�̾��";
s3_bonus[15] = new Array(0, 9, 17, 23, 34, 67, 110, 164, 216, 268, 332, 394, 450, 509, 566, 622, 699, 699, 699);
type[16] = "�ɤ󤰤ꥬ���롦�ե����С���";
s3_bonus[16] = new Array(0, 6, 12, 14, 20, 32, 53, 79, 104, 156, 181, 186, 219, 254, 278, 278, 278, 278, 278);
type[17] = "���Ť�ե�󥱥��̾��";
s3_bonus[17] = new Array(0, 9, 17, 22, 32, 63, 104, 154, 202, 249, 306, 361, 406, 456, 503, 549, 699, 699, 699);
type[18] = "���Ť�ե�󥱥󡦥ե����С���";
s3_bonus[18] = new Array(0, 7, 13, 15, 20, 32, 52, 76, 101, 149, 171, 174, 202, 232, 251, 251, 251, 251, 251);
type[19] = "���ˤ����̾��";
s3_bonus[19] = new Array(0, 7, 15, 20, 31, 63, 107, 160, 216, 271, 341, 411, 485, 557, 629, 699, 699, 699, 699);
type[20] = "���ˤ��󡦥ե����С���";
s3_bonus[20] = new Array(0, 8, 14, 17, 23, 37, 60, 90, 119, 177, 205, 210, 247, 285, 310, 310, 310, 310, 310);
type[21] = "�����ʲ��ҡ��̾��";
s3_bonus[21] = new Array(0, 7, 15, 20, 31, 63, 107, 160, 216, 271, 341, 411, 485, 557, 629, 699, 699, 699, 699);
type[22] = "�����ʲ��ҡ��ե����С���";
s3_bonus[22] = new Array(0, 6, 13, 16, 23, 38, 65, 99, 133, 202, 240, 243, 299, 355, 395, 395, 395, 395, 395);
type[23] = "�楦������̾��";
s3_bonus[23] = new Array(0, 7, 16, 21, 32, 67, 113, 171, 231, 291, 367, 445, 529, 610, 692, 699, 699, 699, 699);
type[24] = "�楦����󡦥ե����С���";
s3_bonus[24] = new Array(0, 6, 13, 16, 22, 37, 62, 93, 126, 191, 225, 233, 279, 330, 366, 366, 366, 366, 366);
type[25] = "�ۤۤ��ɤꡦ�̾��";
s3_bonus[25] = new Array(0, 7, 15, 20, 30, 60, 100, 151, 201, 251, 314, 377, 440, 503, 566, 629, 699, 699, 699);
type[26] = "�ۤۤ��ɤꡦ�ե����С���";
s3_bonus[26] = new Array(0, 8, 15, 18, 25, 40, 67, 100, 134, 201, 237, 242, 286, 335, 370, 370, 370, 370, 370);
type[27] = "����롦�̾��";
s3_bonus[27] = new Array(0, 8, 16, 23, 34, 70, 118, 177, 238, 299, 376, 453, 534, 613, 692, 699, 699, 699, 699);
type[28] = "����롦�ե����С���";
s3_bonus[28] = new Array(0, 6, 12, 14, 20, 32, 53, 79, 104, 156, 181, 186, 219, 254, 278, 278, 278, 278, 278);
type[29] = "�ݥݥ����̾��";
s3_bonus[29] = new Array(0, 7, 15, 20, 30, 60, 100, 151, 201, 251, 314, 377, 440, 503, 566, 629, 699, 699, 699);
type[30] = "�ݥݥ����ե����С���";
s3_bonus[30] = new Array(0, 8, 15, 18, 25, 40, 67, 100, 134, 201, 237, 242, 286, 335, 370, 370, 370, 370, 370);
type[31] = "�����Х󥯥롦�̾��";
s3_bonus[31] = new Array(0, 8, 16, 23, 34, 70, 118, 177, 238, 299, 376, 453, 534, 613, 692, 699, 699, 699, 699);
type[32] = "�����Х󥯥롦�ե����С���";
s3_bonus[32] = new Array(0, 6, 11, 13, 19, 32, 53, 80, 107, 163, 191, 197, 235, 277, 306, 306, 306, 306, 306);


/* Character Power */
var pwr_chara = new Array();
var pwr_bonus = new Array();

/* Classic */
pwr_chara[0] = new Array();
pwr_bonus[0] = new Array();

pwr_chara[0][0] = 'Puyo Puyo';
pwr_bonus[0][0] = new Array(0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512);

pwr_chara[0][1] = 'Puyo Puyo Tsu';
pwr_bonus[0][1] = new Array(0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512);

/* Puyo Puyo Fever */
pwr_chara[1] = new Array();
pwr_bonus[1] = new Array();

pwr_chara[1][0]  = 'Amitie';
pwr_bonus[1][1]  = new Array(0, 8, 16, 22, 33, 67, 111, 167, 223, 279, 349, 419, 489, 559, 629, 699, 699, 699, 699);

pwr_chara[1][1]  = 'Oshare Bones';

pwr_chara[1][2]  = 'Klug';

pwr_chara[1][3]  = 'Dongurigaeru';

pwr_chara[1][4]  = 'Rider';

pwr_chara[1][5]  = 'Onion Pixy';

pwr_chara[1][6]  = 'Ocean Prince';

pwr_chara[1][7]  = 'Raffine';

pwr_chara[1][8]  = 'Yu';

pwr_chara[1][9]  = 'Tarutaru';

pwr_chara[1][10] = 'Hohow Bird';

pwr_chara[1][11] = 'Ms. Accord';

pwr_chara[1][12] = 'Frankensteins';

pwr_chara[1][13] = 'Arle';

pwr_chara[1][14] = 'Popoi';

pwr_chara[1][15] = 'Carbuncle';