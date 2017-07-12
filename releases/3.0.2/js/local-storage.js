/*
 * Half-assed DOM localStorage wrapper for chainsim v3
 * Written by: Nick Woronekin
 *
 * Wraps getItem, setItem, and removeItem by using cookies.
 */

if (!this.localStorage)
{
	(function(window) {
		var expiration = 10 * (60 * 60 * 24 * 365); // Expiration date (Expires in 10 years)

		window.localStorage = {
			length : 0, // Length (not implimented)
			
			getItem : function(key) { // Gets the value for the key (null if it doesn't exist)
				var results = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
				return (results !== null ? decodeURIComponent(results[2]) : null);
			},
			
			setItem : function(key, value) { // Sets the value of a key
				var date = new Date();
				date.setTime(date.getDate() + expiration); // Set expiration date
				
				document.cookie = 
					key + '=' + encodeURIComponent(value) +
					'; max-age=' + expiration +
					'; expires=' + date.toUTCString() +
					'; path=/';
			},
			
			removeItem : function(key) { // Removes a key
				document.cookie =
					key + '=' +
					'; max-age=0' +
					'; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
					'; path=/';
			},
			
			clear : function() { // Clear all keys (not implimented)
				return false; // Did nothing
			}
		};
	})(this);
}