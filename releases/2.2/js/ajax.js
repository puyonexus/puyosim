// Ajax Class
function Ajax()
{
	var request = null;

	function initalize() // Initalize
	{
		if (!window.XMLHttpRequest || (location.protocol == 'file:' && window.ActiveXObject))
		{
			XMLHttpRequest = function()
			{
				try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {};
				try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {};
				try { return new ActiveXObject("Msxml2.XMLHTTP");     } catch(e) {};
				try { return new ActiveXObject("Microsoft.XMLHTTP");  } catch(e) {return null;};
			}
		}
	}
	
	this.loadSync = function(file) // Loads a file synchronously
	{
		request = new XMLHttpRequest();
		request.open('GET', file, false);
		request.send(null);
	}
	
	this.loadAsync = function(file) // Loads a file asynchronously
	{
		request = new XMLHttpRequest();
		request.open('GET', file, true);
		request.send(null);
	}
	
	// Return the data
	this.getResponseText   = function() { return request.responseText; }
	this.getResponseXML    = function() { return request.responseXML;  }
	this.getResponseStatus = function() { return request.status;       }
	
	initalize();
}