/*
 * Puyo Class
 */

var Puyo = Class.extend({

	puyo : undefined, // Initial Puyo
	DOM  : undefined, // DOMElement that corresponds to this puyo

	init: function(puyo) {
		if (this.isValidPuyo(puyo))
			this.puyo = puyo;
		else
			this.puyo = Puyo.None;
	},
	
	isValidPuyo: function(puyo) { // Returns if the puyo is a valid one that can be set
		return (
			puyo == Puyo.Red    ||
			puyo == Puyo.Green  ||
			puyo == Puyo.Blue   ||
			puyo == Puyo.Yellow ||
			puyo == Puyo.Purple ||
			
			puyo == Puyo.Nuisance ||
			puyo == Puyo.Point    ||
			puyo == Puyo.Hard     ||
			puyo == Puyo.Iron     ||
			puyo == Puyo.Wall
		);
	},
		
	isColoredPuyo: function() { // Returns if the puyo is a colored one (red, green, blue, yellow, purple)
		return (
			this.puyo == Puyo.Red    ||
			this.puyo == Puyo.Green  ||
			this.puyo == Puyo.Blue   ||
			this.puyo == Puyo.Yellow ||
			this.puyo == Puyo.Purple
		);
	},
	
	isNuisancePuyo: function() { // Returns if the puyo is a nuisance puyo (nuisance, point, hard)
		return (
			this.puyo == Puyo.Nuisance ||
			this.puyo == Puyo.Point    ||
			this.puyo == Puyo.Hard
		);
	},
	
	isPopped: function() { // Returns if the puyo has been popped
		return (
			this.puyo == Puyo.Popped.Red    ||
			this.puyo == Puyo.Popped.Green  ||
			this.puyo == Puyo.Popped.Blue   ||
			this.puyo == Puyo.Popped.Yellow ||
			this.puyo == Puyo.Popped.Purple ||
			
			this.puyo == Puyo.Popped.Nuisance ||
			this.puyo == Puyo.Popped.Point
		);
	},
	
	getUrlId: function() { // Gets the URL id for the puyo (none if puyo is invalid)
		switch (this.puyo)
		{
			case Puyo.None:     return Puyo.URL.None;
			case Puyo.Red:      return Puyo.URL.Red;
			case Puyo.Green:    return Puyo.URL.Green;
			case Puyo.Blue:     return Puyo.URL.Blue;
			case Puyo.Yellow:   return Puyo.URL.Yellow;
			case Puyo.Purple:   return Puyo.URL.Purple;
			case Puyo.Nuisance: return Puyo.URL.Nuisance;
			case Puyo.Point:    return Puyo.URL.Point;
			case Puyo.Hard:     return Puyo.URL.Hard;
			case Puyo.Iron:     return Puyo.URL.Iron;
			case Puyo.Wall:     return Puyo.URL.Wall;
		}
		
		return Puyo.URL.None;
	},
	setFromUrlId: function(puyo) { // Sets the puyo from a URL id (none if URL id is invalid)
		this.puyo = (function() {
			switch (puyo)
			{
				case Puyo.URL.None:     return Puyo.None;
				case Puyo.URL.Red:      return Puyo.Red;
				case Puyo.URL.Green:    return Puyo.Green;
				case Puyo.URL.Blue:     return Puyo.Blue;
				case Puyo.URL.Yellow:   return Puyo.Yellow;
				case Puyo.URL.Purple:   return Puyo.Purple;
				case Puyo.URL.Nuisance: return Puyo.Nuisance;
				case Puyo.URL.Point:    return Puyo.Point;
				case Puyo.URL.Hard:     return Puyo.Hard;
				case Puyo.URL.Iron:     return Puyo.Iron;
				case Puyo.URL.Wall:     return Puyo.Wall;
			}
		
			return Puyo.None;
		})();
	}
});

/*
 * Puyo Constants
 */
 
Puyo.None   = 0;
Puyo.Red    = 1;
Puyo.Green  = 2;
Puyo.Blue   = 3;
Puyo.Yellow = 4;
Puyo.Purple = 5;

Puyo.Nuisance = 6;
Puyo.Point    = 7;
Puyo.Hard     = 8;
Puyo.Iron     = 9;
Puyo.Wall     = 10;

Puyo.Delete   = 11;

Puyo.Popped = {
	Red    : 11,
	Green  : 12,
	Blue   : 13,
	Yellow : 14,
	Purple : 15,
	
	Nuisance : 16,
	Point    : 17
};

Puyo.URL = {
	None   : '0',
	Red    : '4',
	Green  : '7',
	Blue   : '5',
	Yellow : '6',
	Purple : '8',
		
	Nuisance : '1',
	Point    : 'B',
	Hard     : 'A',
	Iron     : '3',
	Wall     : '2'
};

Puyo.Skin = [
	{ id : 'classic',   image : 'classic.png'   },
	{ id : 'puyo4',     image : 'puyo4.png'     },
	{ id : 'fever',     image : 'fever.png'     },
	{ id : 'fever-alt', image : 'fever-alt.png' },
	{ id : 'real',      image : 'real.png'      },
	{ id : 'moji',      image : 'moji.png'      },
	{ id : 'beta',      image : 'beta.png'      },
	{ id : 'cube',      image : 'cube.png'      },
	{ id : 'clear',     image : 'clear.png'     },
	{ id : 'chalk',     image : 'chalk.png', animated : true, frames : 4 },
	{ id : 'aqua',      image : 'aqua.png'      },
	{ id : 'degi',      image : 'degi.png'      },
	{ id : 'shiki',     image : 'shiki.png'     }
];