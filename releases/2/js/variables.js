/* These are all of the variables used in the Chain Simulator */

/* Puyo Constants */
/* Internal Puyo Constants */
var PUYO_NONE     = 0;
var PUYO_DELETE   = 1;
var PUYO_RED      = 2;
var PUYO_GREEN    = 3;
var PUYO_BLUE     = 4;
var PUYO_YELLOW   = 5;
var PUYO_PURPLE   = 6;
var PUYO_NUISANCE = 7;
var PUYO_POINT    = 8;
var PUYO_HARD     = 9;
var PUYO_IRON     = 10;
var PUYO_WALL     = 11;

/* Pop Constants */
var PUYO_POP_RED      = 12;
var PUYO_POP_GREEN    = 13;
var PUYO_POP_BLUE     = 14;
var PUYO_POP_YELLOW   = 15;
var PUYO_POP_PURPLE   = 16;
var PUYO_POP_NUISANCE = 17;
var PUYO_POP_POINT    = 18;

/* URL Constants */
var PUYO_URL_NONE     = '0';
var PUYO_URL_RED      = '4';
var PUYO_URL_GREEN    = '7';
var PUYO_URL_BLUE     = '5';
var PUYO_URL_YELLOW   = '6';
var PUYO_URL_PURPLE   = '8';
var PUYO_URL_NUISANCE = '1';
var PUYO_URL_POINT    = 'B';
var PUYO_URL_HARD     = 'A';
var PUYO_URL_IRON     = '3';
var PUYO_URL_WALL     = '2';

/* Styles */
var STYLE_STANDARD  = 0;
var STYLE_EYE_CANDY = 1;

var STYLE_SHEET_SMALL = 'Small Puyo Skin';
var STYLE_SHEET_LARGE = 'Large Puyo Skin';

var STYLE_SWITCH_STANDARD  = 'Switch to the Standard Skin';
var STYLE_SWITCH_EYE_CANDY = 'Switch to the Eye Candy Skin';

/* Tabs */
var TAB_LINKING_CODES = 'options_widget_linking_codes';
var TAB_SETTINGS      = 'options_widget_settings';
var TAB_MY_PROFILE    = 'options_widget_my_profile';
var TAB_DOWNLOAD      = 'options_widget_download';

/* Game Modes */
var MODE_CLASSIC = 0;
var MODE_FEVER   = 1;

/* Other constants */
var PUYO_SMALL = 0;
var PUYO_LARGE = 1;

var PUYO_EXT_SMALL = 'png';
var PUYO_EXT_LARGE = 'png';

var PUYO_SIZE_SMALL = 16;
var PUYO_SIZE_LARGE = 32;


/* Image Settings */
/* Folders */
var DIRECTORY_IMAGES = 'images';
var imgDir         = 'images';
var puyoSkin_small = '';
var puyoSkin_large = '';

/* Board BG's (Only in Eye Candy Mode) */
var curBoardBG = 0;
var boardBG;

/* The X's (Only in Eye Candy Mode) */
var displayX_current = 0;
var displayX_twist   = 0;

/* Sepcial Chalk Puyo Varibles */
var chalkPuyoInt = 0;

/* Puyo Animations */
var puyoAnimation_timer    = null;
var puyoAnimation_frames   = [];
var puyoAnimation_curFrame = [];

var puyoAnimation_X_timer    = null;
var puyoAnimation_X_curFrame = 0;


/* Undefined variables */
var puyoSize;
var puyoDir;
var puyoFileExt;
var puyoNuisanceIndicator;
var puyoXDisplay;

/* Style */
var style = STYLE_STANDARD;


/* Puyo Arrays, and other puyo related things */
/* Init the puyo maps and arrays */
var puyo    = [];
var map     = new ArrayMulti(6, 13);
var mapCopy = null;

/* Move hovering */
var puyoMouseOver = new ArrayMulti(6, 13);

/* Fever Chain Data */
var feverChainData_game   = [];
//var feverChainData_type   = new Array2D(0, 0);
//var feverChainData_chain  = new Array4D(0, 0, 0, 0);
var feverChainData_type   = new ArrayMulti(0, 0);
var feverChainData_chain  = new ArrayMulti(0, 0, 0, 0);

/* Skin Data */
var skins_data = {};
var skinData_name;  // Skin Name
var skinData_image; // Skin Image

/* Settings for puyo chaining */
var targetPoints = 120;
var puyoToChain  = 4;

/* Play Mode and Edit Mode. The chain is playing */
var editMode = true;
var playMode = false;

/* Current amount of colors, for fever chains */
var curColors = 1; // 4 Colors

/* Current Puyo Selected */
var curPuyo = PUYO_NONE;

/* Current widget tab */
var widget_options_tab = TAB_LINKING_CODES;

/* Timers */
var timerChain = null;
var timerFall;

/* Current step of the chain */
var chainStep = 0;

/* Skins */
var puyoSkins_small = [
	'pp1',
	'pp3',
	'pp4_cibi'
];

var puyoSkins_large = [
	'pp4',
	'ppf',
	'pp15_real',
	'pp15_classic',
	'pp15_moji',
	'pp15_beta',
	'pp15_cube',
	'pp15_clear',
	'pp15_chalk'
];

var puyoSkins_large_frames = {
	'pp4':          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'ppf':          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_real':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_classic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_moji':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_beta':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_cube':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_clear':   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_chalk':   [1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1]
};


/* Display */
var chains   = 0;
var score    = 0;
var nuisance = 0;

/* Nuisance Amounts */
var nuisance_amounts = [
	0,   // None
	1,   // Small
	6,   // Medium
	30,  // Rock
	180, // Star
	360, // Moon
	720, // Crown
	1440 // Comet
];


/* Chain Values */
/* Chain Values for Classic Modes */
var chainValueNames_classic = [
	"Puyo Puyo",
	"Puyo Puyo 2"
];
var chainValues_classic = [
	[   0,   8,  16,  32,  64, 128, 256, 512, 999, 999, 999, 999,
	  999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Puyo Puyo
	[   0,   8,  16,  32,  64,  96, 128, 160, 192, 224, 256, 288,
	  320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672]  // Puyo Puyo 2
];

/* Chain Values for Puyo Puyo Fever */
var chainValueNames_fever1 = [
	"Amitie",
	"Amitie (Fever)",
	"Oshare Bones",
	"Oshare Bones (Fever)",
	"Klug",
	"Klug (Fever)",
	"Dongurigaeru",
	"Dongurigaeru (Fever)",
	"Rider",
	"Rider (Fever)",
	"Onion Pixy",
	"Onion Pixy (Fever)",
	"Ocean Prince",
	"Ocean Prince (Fever)",
	"Raffine",
	"Raffine (Fever)",
	"Yu",
	"Yu (Fever)",
	"Tarutaru",
	"Tarutaru (Fever)",
	"Hohow Bird",
	"Hohow Bird (Fever)",
	"Ms. Accord",
	"Ms. Accord (Fever)",
	"Frankensteins",
	"Frankensteins (Fever)",
	"Arle",
	"Arle (Fever)",
	"Popoi",
	"Popoi (Fever)",
	"Carbuncle",
	"Carbuncle (Fever)"
];
var chainValues_fever1 = [
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Amitie
	[   4,  10,  18,  22,  30,  48,  80, 120, 160, 240, 280, 288,
	  342, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Amitie (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Oshare Bones
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Oshare Bones (Fever)
	[   4,  11,  24,  34,  53, 110, 188, 288, 392, 500, 638, 780,
	  945, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Klug
	[   4,   9,  16,  20,  27,  43,  72, 108, 144, 216, 252, 259,
	  308, 360, 396, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Klug (Fever)
	[   4,  13,  25,  33,  49,  96, 158, 235, 310, 384, 475, 564,
	  644, 728, 810, 890, 968, 999, 999, 999, 999, 999, 999, 999], // Dongurigaeru
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Dongurigaeru (Fever)
	[   4,  13,  26,  35,  53, 106, 176, 264, 352, 440, 550, 660,
	  770, 880, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Rider
	[   3,   8,  14,  18,  24,  38,  64,  96, 128, 192, 224, 230,
	  274, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Rider (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Onion Pixy
	[   5,  12,  21,  25,  34,  53,  87, 130, 171, 254, 294, 301,
	  353, 408, 444, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Onion Pixy (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Ocean Prince
	[   4,  10,  19,  24,  34,  55,  93, 142, 191, 290, 343, 355,
	  428, 508, 565, 624, 676, 728, 780, 832, 884, 936, 988, 999], // Ocean Prince (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Raffine
	[   4,   9,  17,  20,  28,  46,  76, 115, 154, 233, 273, 282,
	  337, 396, 438, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Raffine (Fever)
	[   4,  11,  23,  31,  47,  96, 162, 245, 330, 416, 525, 636,
	  756, 872, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Yu & Rei
	[   4,  10,  19,  23,  32,  53,  89, 134, 181, 274, 322, 333,
	  400, 472, 524, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Yu & Rei (Fever)
	[   4,  13,  25,  33,  49,  96, 158, 235, 310, 384, 475, 564,
	  644, 728, 810, 890, 968, 999, 999, 999, 999, 999, 999, 999], // Tarutaru
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Tarutaru (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Hohow Bird
	[   5,  12,  22,  26,  36,  58,  96, 144, 192, 288, 336, 346,
	  410, 480, 528, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Hohow Bird (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Ms. Accord
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Ms. Accord (Fever)
	[   4,  13,  25,  32,  47,  91, 150, 221, 290, 356, 438, 516,
	  581, 652, 720, 785, 847, 888, 999, 999, 999, 999, 999, 999], // Frankensteins
	[   4,  11,  19,  22,  29,  46,  75, 110, 145, 214, 245, 250,
	  290, 332, 359, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Frankensteins (Fever)
	[   4,  12,  24,  33,  50, 101, 169, 254, 341, 428, 538, 648,
	  763, 876, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Arle
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Arle (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Popoi
	[   5,  12,  22,  26,  36,  58,  96, 144, 192, 288, 336, 346,
	  410, 480, 528, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Popoi (Fever)
	[   4,  12,  24,  33,  50, 101, 169, 254, 341, 428, 538, 648,
	  763, 876, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Carbuncle
	[   4,   9,  17,  20,  28,  46,  76, 115, 154, 233, 273, 282,
	  337, 396, 438, 480, 520, 560, 600, 640, 680, 720, 760, 800]  // Carbuncle (Fever)
];

/* Chain Values for Puyo Puyo Fever 2 */
var chainValueNames_fever2 = [
	"Amitie",
	"Amitie (Fever)",
	"Oshare Bones",
	"Oshare Bones (Fever)",
	"Klug",
	"Klug (Fever)",
	"Dongurigaeru",
	"Dongurigaeru (Fever)",
	"Rider",
	"Rider (Fever)",
	"Onion Pixy",
	"Onion Pixy (Fever)",
	"Ocean Prince",
	"Ocean Prince (Fever)",
	"Raffine",
	"Raffine (Fever)",
	"Yu & Rei",
	"Yu & Rei (Fever)",
	"Tarutaru",
	"Tarutaru (Fever)",
	"Hohow Bird",
	"Hohow Bird (Fever)",
	"Ms. Accord",
	"Ms. Accord (Fever)",
	"Frankensteins",
	"Frankensteins (Fever)",
	"Arle",
	"Arle (Fever)",
	"Sig",
	"Sig (Fever)",
	"Lemres",
	"Lemres (Fever)",
	"Feli",
	"Feli (Fever)",
	"Baldanders",
	"Baldanders (Fever)",
	"Gogotte",
	"Gogotte (Fever)",
	"Akuma",
	"Akuma (Fever)",
	"Strange Klug",
	"Strange Klug (Fever)",
];
var chainValues_fever2 = [
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Amitie
	[   4,  10,  18,  22,  30,  48,  80, 120, 160, 240, 280, 288,
	  342, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Amitie (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Oshare Bones
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Oshare Bones (Fever)
	[   4,  11,  24,  34,  53, 110, 188, 288, 392, 500, 638, 780,
	  945, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Klug
	[   3,   8,  15,  18,  25,  41,  68, 103, 138, 209, 245, 253,
	  302, 356, 394, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Klug (Fever)
	[   4,  13,  25,  33,  49,  96, 158, 235, 310, 384, 475, 564,
	  644, 728, 810, 890, 968, 999, 999, 999, 999, 999, 999, 999], // Dongurigaeru
	[   4,  11,  19,  23,  31,  48,  79, 118, 155, 230, 266, 272,
	  319, 368, 400, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Dongurigaeru (Fever)
	[   4,  13,  27,  36,  55, 110, 185, 278, 373, 468, 588, 708,
	  833, 956, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Rider
	[   4,   9,  16,  19,  26,  41,  68, 101, 134, 199, 231, 237,
	  279, 324, 354, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Rider (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Onion Pixy
	[   5,  12,  21,  25,  34,  53,  87, 130, 171, 254, 294, 301,
	  353, 408, 444, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Onion Pixy (Fever)
	[   4,  11,  21,  28,  41,  82, 135, 202, 267, 332, 413, 492,
	  567, 644, 720, 795, 869, 936, 999, 999, 999, 999, 999, 999], // Ocean Prince
	[   4,  10,  19,  23,  32,  53,  89, 134, 181, 274, 322, 333,
	  400, 472, 524, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Ocean Prince (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Raffine
	[   3,   8,  15,  20,  28,  46,  77, 118, 159, 242, 287, 298,
	  360, 428, 477, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Raffine (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Yu & Rei
	[   4,  10,  18,  23,  31,  50,  84, 127, 170, 257, 301, 310,
	  371, 436, 482, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Yu & Rei (Fever)
	[   4,  13,  25,  33,  49,  96, 158, 235, 310, 384, 475, 564,
	  644, 728, 810, 890, 968, 999, 999, 999, 999, 999, 999, 999], // Tarutaru
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Tarutaru (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Hohow Bird
	[   5,  12,  21,  26,  35,  55,  92, 137, 182, 271, 315, 323,
	  382, 444, 486, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Hohow Bird (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Ms. Accord
	[   4,   9,  16,  20,  27,  43,  72, 108, 144, 216, 252, 259,
	  308, 360, 396, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Ms. Accord (Fever)
	[   4,  13,  25,  32,  47,  91, 150, 221, 290, 356, 438, 516,
	  581, 652, 720, 785, 847, 888, 999, 999, 999, 999, 999, 999], // Frankensteins
	[   4,  11,  19,  22,  29,  46,  75, 110, 145, 214, 245, 250,
	  290, 332, 359, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Frankensteins (Fever)
	[   4,  13,  27,  36,  55, 110, 185, 278, 373, 468, 588, 708,
	  833, 956, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Arle
	[   4,  10,  18,  22,  30,  48,  80, 120, 160, 240, 280, 288,
	  342, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Arle (Fever)
	[   3,  10,  20,  27,  40,  82, 137, 206, 277, 348, 438, 528,
	  623, 716, 810, 905, 999, 999, 999, 999, 999, 999, 999, 999], // Sig
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Sig (Fever)
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Lemres
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Lemres (Fever)
	[   4,  11,  21,  28,  41,  82, 135, 202, 267, 332, 413, 492,
	  567, 644, 720, 795, 869, 936, 999, 999, 999, 999, 999, 999], // Feli
	[   4,  11,  19,  24,  32,  50,  84, 125, 166, 247, 287, 294,
	  347, 404, 442, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Feli (Fever)
	[   4,  13,  24,  31,  45,  86, 141, 206, 269, 328, 400, 468,
	  518, 576, 630, 680, 726, 744, 910, 980, 999, 999, 999, 999], // Baldanders
	[   4,  11,  18,  22,  28,  43,  70, 103, 134, 197, 224, 227,
	  261, 296, 317, 336, 364, 392, 420, 448, 476, 504, 532, 560], // Baldanders (Fever)
	[   4,  11,  21,  28,  41,  82, 135, 202, 267, 332, 413, 492,
	  567, 644, 720, 795, 869, 936, 999, 999, 999, 999, 999, 999], // Gogotte
	[   4,  10,  18,  23,  31,  50,  84, 127, 170, 257, 301, 310,
	  371, 436, 482, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Gogotte (Fever)
	[   3,  10,  21,  29,  46,  96, 163, 250, 339, 432, 550, 672,
	  812, 944, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Akuma
	[   3,   8,  15,  20,  28,  46,  77, 118, 159, 242, 287, 298,
	  360, 428, 477, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Akuma (Fever)
	[   4,  11,  23,  31,  47,  96, 162, 245, 330, 416, 525, 636,
	  756, 872, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Strange Klug
	[   4,   9,  17,  20,  28,  46,  76, 115, 154, 233, 273, 282,
	  337, 396, 438, 480, 520, 560, 600, 640, 680, 720, 760, 800]  // Strange Klug (Fever)
];

/* Chain Values for Puyo Puyo! 15th Anniversary */
var chainValueNames_puyo15 = [
	"Amitie",
	"Amitie (Fever)",
	"Raffine",
	"Raffine (Fever)",
	"Sig",
	"Sig (Fever)",
	"Rider",
	"Rider (Fever)",
	"Klug",
	"Klug (Fever)",
	"Ms. Accord",
	"Ms. Accord (Fever)",
	"Oshare Bones",
	"Oshare Bones (Fever)",
	"Yu & Rei",
	"Yu & Rei (Fever)",
	"Ocean Prince",
	"Ocean Prince (Fever)",
	"Onion Pixy",
	"Onion Pixy (Fever)",
	"Dongurigaeru",
	"Dongurigaeru (Fever)",
	"Lemres",
	"Lemres (Fever)",
	"Feli",
	"Feli (Fever)",
	"Baldanders",
	"Baldanders (Fever)",
	"Akuma",
	"Akuma (Fever)",
	"Arle",
	"Arle (Fever)",
	"Nasu Grave",
	"Nasu Grave (Fever)",
	"Suketoudara",
	"Suketoudara (Fever)",
	"Zoh Daimaoh",
	"Zoh Daimaoh (Fever)",
	"Schezo",
	"Schezo (Fever)",
	"Rulue",
	"Rulue (Fever)",
	"Satan",
	"Satan (Fever)",
	"Non-Stop Fever",
	"Non Classic/Fever Modes"
];
var chainValues_puyo15 = [
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Amitie
	[   4,  10,  18,  22,  30,  48,  80, 120, 160, 240, 280, 288,
	  342, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Amitie (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Raffine
	[   3,   8,  15,  20,  28,  46,  77, 118, 159, 242, 287, 298,
	  360, 428, 477, 528, 572, 616, 660, 704, 748, 792, 836, 880], // Raffine (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Sig
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Sig (Fever)
	[   4,  12,  25,  34,  52, 106, 178, 269, 362, 456, 575, 696,
	  826, 952, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Rider
	[   3,   8,  14,  18,  24,  38,  64,  96, 128, 192, 224, 230,
	  274, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Rider (Fever)
	[   4,  11,  23,  33,  51, 110, 188, 288, 392, 500, 638, 780,
	  945, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Klug
	[   4,   9,  16,  20,  27,  43,  72, 108, 144, 216, 252, 259,
	  308, 360, 396, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Klug (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Ms. Accord
	[   4,   9,  16,  20,  27,  43,  72, 108, 144, 216, 252, 259,
	  308, 360, 396, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Ms. Accord (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Oshare Bones
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Oshare Bones (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Yu & Rei
	[   4,   9,  17,  22,  31,  50,  85, 130, 175, 266, 315, 326,
	  394, 468, 521, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Yu & Rei (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Ocean Prince
	[   4,  10,  19,  24,  34,  55,  93, 142, 191, 290, 343, 355,
	  428, 508, 565, 624, 676, 728, 780, 832, 884, 936, 988, 999], // Ocean Prince (Fever)
	[   4,  11,  22,  30,  45,  91, 153, 230, 309, 388, 488, 588,
	  693, 796, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Onion Pixy
	[   5,  12,  21,  25,  34,  53,  87, 130, 171, 254, 294, 301,
	  353, 408, 444, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Onion Pixy (Fever)
	[   4,  13,  25,  33,  48,  96, 158, 235, 310, 384, 475, 564,
	  644, 728, 810, 890, 968, 999, 999, 999, 999, 999, 999, 999], // Dongurigaeru
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Dongurigaeru (Fever)
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Lemres
	[   4,  10,  18,  21,  29,  46,  76, 113, 150, 223, 259, 266,
	  313, 364, 398, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Lemres (Fever)
	[   4,  11,  21,  28,  41,  82, 135, 202, 267, 332, 413, 492,
	  567, 644, 720, 795, 869, 936, 999, 999, 999, 999, 999, 999], // Feli
	[   4,  11,  19,  24,  32,  50,  84, 125, 166, 247, 287, 294,
	  347, 404, 442, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Feli (Fever)
	[   4,  13,  25,  32,  47,  91, 150, 221, 290, 356, 438, 516,
	  581, 652, 720, 785, 847, 888, 999, 999, 999, 999, 999, 999], // Baldanders
	[   4,  10,  17,  21,  28,  43,  71, 106, 139, 206, 238, 243,
	  284, 328, 356, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Baldanders (Fever)
	[   4,  11,  23,  32,  49, 101, 170, 259, 350, 444, 563, 684,
	  819, 948, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Akuma
	[   4,   9,  17,  20,  28,  46,  76, 115, 154, 233, 273, 282,
	  337, 396, 438, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Akuma (Fever)
	[   4,  12,  24,  33,  50, 101, 169, 254, 341, 428, 538, 648,
	  763, 876, 990, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Arle
	[   4,   9,  16,  20,  27,  43,  72, 108, 144, 216, 252, 259,
	  308, 360, 396, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Arle (Fever)
	[   4,  13,  25,  32,  47,  91, 150, 221, 290, 356, 438, 516,
	  581, 652, 720, 785, 847, 888, 999, 999, 999, 999, 999, 999], // Nasu Grave
	[   4,  10,  17,  21,  28,  43,  71, 106, 139, 206, 238, 243,
	  284, 328, 356, 384, 416, 448, 480, 512, 544, 576, 608, 640], // Nasu Grave (Fever)
	[   4,  11,  21,  28,  41,  82, 135, 202, 267, 332, 413, 492,
	  567, 644, 720, 795, 869, 936, 999, 999, 999, 999, 999, 999], // Suketoudara
	[   4,  11,  20,  25,  34,  55,  92, 139, 186, 281, 329, 339,
	  405, 476, 526, 576, 624, 672, 720, 768, 816, 864, 912, 960], // Suketoudara (Fever)
	[   4,  11,  22,  29,  43,  86, 144, 216, 288, 360, 450, 540,
	  630, 720, 810, 900, 990, 999, 999, 999, 999, 999, 999, 999], // Zoh Daimaoh
	[   4,  11,  19,  24,  32,  50,  84, 125, 166, 247, 287, 294,
	  347, 404, 442, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Zoh Daimaoh (Fever)
	[   4,  11,  23,  33,  51, 110, 188, 288, 392, 500, 638, 780,
	  945, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Schezo
	[   3,   8,  15,  18,  25,  41,  68, 103, 138, 209, 245, 253,
	  302, 356, 394, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Schezo (Fever)
	[   4,  11,  24,  33,  51, 106, 179, 274, 371, 472, 600, 732,
	  882, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Rulue
	[   3,   8,  15,  20,  28,  46,  77, 112, 151, 229, 272, 283,
	  342, 406, 453, 501, 543, 585, 627, 668, 710, 752, 794, 836], // Rulue (Fever)
	[   4,  11,  23,  33,  51, 101, 167, 250, 331, 412, 513, 612,
	  766, 966, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], // Satan
	[   3,   8,  15,  18,  25,  41,  68, 103, 138, 209, 245, 253,
	  302, 356, 394, 432, 468, 504, 540, 576, 612, 648, 684, 720], // Satan (Fever)
	[   4,  10,  18,  22,  30,  48,  80, 120, 160, 240, 280, 288,
	  342, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800], // Non-Stop Fever
	[   4,  12,  24,  32,  48,  96, 160, 240, 320, 400, 500, 600,
	  700, 800, 900, 999, 999, 999, 999, 999, 999, 999, 999, 999]  // Non Classic/Fever Modes
];

/* Set the default chain Value & Game Mode */
var gameMode   = MODE_CLASSIC;
var chainValue = chainValues_classic[1]; // Set the default chain value to Puyo Puyo 2.


/* URL's */
/* Get the URL */
var domainURL  = 'http://www.puyonexus.net/chainsim/';
var websiteURL = document.URL;
var chainURL   = websiteURL.split('??')[1];

/* Set the cookie path */
var cookieURL  = (websiteURL.indexOf('http') == 0 ? '.puyonexus.net' : '');

/* Check the URL */
//checkWebsiteURL(websiteURL);

/* XML URL's */
var URL_feverChains = 'xml/feverChains.xml';
var URL_skinData    = 'xml/skins.xml';
var URL_options     = 'xml/options.html';


/* Linking codes */
/* Begin Of Linking Codes */
var linkingCodes_begin = [
	domainURL + '??', // Link
	domainURL + 'chainimage.php/', // Image
	'[puyochain]', // BBcode
	'' // Chain ID
];

/* End of Linking Codes */
var linkingCodes_end = [
	'', // Link
	'.png', // Image
	'[/puyochain]', // BBCode
	'' // Chain ID
];

/* Description */
var linkingCodes_description = [
	'Link to this chain', // Link
	'Image of this chain', // Image
	'BBCode for the Puyo Nexus Forum', // BBCode
	'Code for the PPF Fever Editor' // Fever Editor
];

/* Field Names */
var linkingCodes_field = [
	'linkingCodes_link', // Link
	'linkingCodes_image', // Image
	'linkingCodes_bbcode', // BBCode
	'linkingCodes_chainID' // Chain ID
];