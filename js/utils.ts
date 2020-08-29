/*
 * Utils
 *
 * Useful utility functions
 */

import $ from 'jquery';

const escapeMap = new Map([
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', '&quot;'],
    ["'", '&#39;']
]);

export const Utils = {
	stringFormat: function (format: string) {
    	let args = Array.prototype.slice.call(arguments, 1);
    	return format.replace(/{(\d+)}/g, function(match, number) { 
     		return typeof args[number] != 'undefined'
        		? args[number] 
        		: match;
    		});
	},

	escape: function (s: string) {
		return s.replace(/&(?!\w+;)|[<>"']/g, s => escapeMap.get(s) ?? s);
	},

	createDropDownListOptions: function (items: Array<any>|Object) {
		let html = '';

		if (Array.isArray(items)) {
			for (var i = 0; i < items.length; i++) {
				html += $("<option>")
					.val(items[i])
					.text(items[i])[0]
					.outerHTML;
			}
		} else { // Assume it's an object contains keys & values
			$.each(items, function (key, value) {
				html += $("<option>")
					.val(key)
					.text(value as any)[0]
					.outerHTML;
			});
		}

		return html;
	},

	range: function (start: number, end: number, step: number) {
		if (step === undefined) {
			step = 1;
		}

		var array = [];
		var totalSteps = Math.floor((end - start) / step);
		for (var i = 0; i <= totalSteps; i++) {
			array.push(start + (i * step));
		}

		return array;
	}
};
