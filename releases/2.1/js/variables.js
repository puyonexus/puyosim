/* These are all of the variables used in the Chain Simulator */

// Puyo Constants
var PUYO = {
	NONE:     0,
	DELETE:   1,
	RED:      2,
	GREEN:    3,
	BLUE:     4,
	YELLOW:   5,
	PURPLE:   6,
	NUISANCE: 7,
	POINT:    8,
	HARD:     9,
	IRON:     10,
	WALL:     11,
	POP: {
		RED:      12,
		GREEN:    13,
		BLUE:     14,
		YELLOW:   15,
		PURPLE:   16,
		NUISANCE: 17,
		POINT:    18
	},
	URL: {
		NONE:     '0',
		RED:      '4',
		GREEN:    '7',
		BLUE:     '5',
		YELLOW:   '6',
		PURPLE:   '8',
		NUISANCE: '1',
		POINT:    'B',
		HARD:     'A',
		IRON:     '3',
		WALL:     '2'
	},
	SIZE: {
		SMALL: 0,
		LARGE: 1,
		PIXELS: {
			SMALL: 16,
			LARGE: 32
		}
	}
};

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

// Game Modes
var MODE = {CLASSIC: 0, FEVER: 1};

/* Image Settings */
/* Folders */
var DIRECTORY_IMAGES = 'images';
var puyoSkin_small = '';
var puyoSkin_large = '';

/* Board BG's (Only in Eye Candy Mode) */
var curBoardBG = 0;
var boardBG;

/* Puyo Animations */
var puyoAnimation_timer    = null;
var puyoAnimation_frames   = [];
var puyoAnimation_curFrame = [];

var puyoAnimation_X_timer    = null;
var puyoAnimation_X_curFrame = 0;


/* Undefined variables */
var puyoDir;
var puyoXDisplay;
var puyoSize;
var puyoNuisanceIndicator;

/* Style */
var style = STYLE_STANDARD;


/* Puyo Arrays, and other puyo related things */
/* Init the puyo maps and arrays */
var puyo    = [];
var map     = new ArrayMulti(6, 13);
var mapCopy = null;

/* Move hovering */
var puyoMouseOver = new ArrayMulti(6, 13);

// Fever Chains
var FeverChains;

// Chain Image Skins
var ChainImageSkins;

/* Settings for puyo chaining */
var targetPoints = 120;
var puyoToChain  = 4;

/* Play Mode and Edit Mode. The chain is playing */
var editMode = true;
var playMode = false;

/* Current amount of colors, for fever chains */
var curColors = 1; // 4 Colors

/* Current Puyo Selected */
var curPuyo = PUYO.NONE;

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
	'pp4_chibi'
];

var puyoSkins_large = [
	'pp4',
	'ppf',
	'ppf_alt',
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
	'ppf_alt':      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_real':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_classic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_moji':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_beta':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_cube':    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_clear':   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	'pp15_chalk':   [1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1]
};

// Field Sizes
var fieldSizes = [
	{ // 6x12 Standard
		name: '(6x12) Standard',
		size: {width: 6, height: 12}
	}, { // 3x6 Giant Transformation
		name: '(3x6) Puyo 7 - Giant Transformation',
		size: {width: 3, height: 6}
	}, { // 10x20 Chibi Transformation
		name: '(10x20) Puyo 7 - Chibi Transformation',
		size: {width: 10, height: 20}
	}, { // 4x7 Small Field Puyo~n
		name: '4x7',
		size: {width: 4, height: 7}
	}, { // 10x16 Almost Largest Field Puyo~n
		name: '10x16',
		size: {width: 10, height: 16}
	}, { // 16x26 Largest Field Puyo~n
		name: '16x26',
		size: {width: 16, height: 26}
	}
];
var fieldWidth  = fieldSizes[0].size.width;
var fieldHeight = fieldSizes[0].size.height + 1;

// Speeds
var popSpeeds = [750, 500, 250];
var curPopSpeed = popSpeeds[1];

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

// Character Powers/Chain Values/Game Mode
var CharacterPowers;
var CharacterPowersDefault = // Default value to fall back on, if for some reason the powers aren't loaded.
	[   0,   8,  16,  32,  64,  96, 128, 160, 192, 224, 256, 288,
	  320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672];
var gameMode   = MODE.CLASSIC;
var chainValue = CharacterPowersDefault; // Set the default chain value to Puyo Puyo 2.

// URLs
var URL = {
	domain: 'http://www.puyonexus.net/chainsim/',
	chain:  document.URL.split('??')[1],
	cookie: (document.URL.search(/http(s){0,1}:\/\/(www.){0,1}puyonexus.net/) == 0 ? '.puyonexus.net' : ''),
	XML: {
		feverChains:     'xml/feverChains.xml',
		chainImageSkins: 'xml/skins.xml',
		options:         'xml/options.html',
		characterPowers: 'xml/characterPowers.xml'
	}
};

// Directories
var DIRECTORY = {
	IMAGES: 'images',
	CHAIN_IMAGE_SKINS: 'skins'
};

// Linking Codes
var linkingCodes = [
	{ // Link
		start: URL.domain + '??',
		end:   '',
		title: 'Link',
		id:    'linkingCodes_link',
		standardOnly: false
	}, { // Image
		start: URL.domain + 'chainimage.php/',
		end:   '.png',
		title: 'Image',
		id:    'linkingCodes_image',
		standardOnly: false
	}, { // BBCode
		start: '[puyochain]',
		end:   '[/puyochain]',
		title: 'BBCode for the Forum',
		id:    'linkingCodes_bbcode',
		standardOnly: false
	}, { // PPF Fever Editor
		start: '',
		end:   '',
		title: 'Code for the PPF Fever Editor',
		id:    'linkingCodes_feverEditor',
		standardOnly: true
	}
];