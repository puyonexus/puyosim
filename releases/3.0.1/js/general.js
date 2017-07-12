/*
 * General Functions, Variables, and Constants (not specific to any class)
 */
 
// Clamp a value
function clamp(value, min, max)
{
	if (value < min) return min;
	if (value > max) return max;
	
	return value;
}

/*
 * String Prototype Functions
 */

 // Pad a string on the left side
String.prototype.padLeft = function(n, pad)
{
	var t = '';
	if (this.length < n)
	{
		for (var i = 0; i < n - this.length; i++)
			t += pad;
	}

	return t + this;
};

// Pad a string on the right side
String.prototype.padRight = function(n, pad)
{
	var t = '';
	if (this.length < n)
	{
		for (var i = 0; i < n - this.length; i++)
			t += pad;
	}

	return this + t;
};

/*
 * Easter Eggs
 */

(function() {
	function easteregg(keys, surprise)
	{
		var key = 0;
		
		$(document).keydown(function(e) {
			if (e.which === keys[key])
			{
				key++;
				if (key == keys.length)
				{
					surprise.call();
					key = 0;
				}
			}
			else
				key = 0;
		});
	}
	
	// List of easter eggs

	easteregg([38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13], function() { // Konami Code
		simulator.field.setChain(16, 26, // Set to the 108 chain from Puyo~n
			'674747776576475547454744667667744745654475574457467675' +
			'676576475564766565774566777654565744564447467547655745' +
			'567665647574756475476656475747564754556475747564754764' +
			'647574756475474756475647564766756475647564755647564756' +
			'475647544756475647564746656475647564756466564756475647' +
			'567564756475647564456475647564756474564756475647567456' +
			'475647564756456475647564754674564756475647547564756475' +
			'647564475647564756475647564756475647564756475647564756'
		);
		simulator.field.eraseAmount = 4;
		$('#puyo-to-clear').val(simulator.field.eraseAmount);
	});
})();