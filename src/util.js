/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Utility functions
 *
 * Conventions:
 * lowercase package names, UpperCamelCase class names, ALLCAPS constants, _preUnderscored private members, lowerCamelCase public members
 *
 * Search '**' for to-do/issues
 *
 * Eric Schmidt 2013
 * eschmidt@mit.edu | eschmidt.co
 */

(function(window, action){
	
	action.util = {};
	
	// generic event-listening functions
	action.util.addEventHandler = function(elt, type, handler){
		if(elt.addEventListener) elt.addEventListener(type, handler);
		else if(elt.attachEvent) elt.attachEvent("on"+type, handler);
	};
	
	action.util.removeEventHandler = function(elt, type, handler){
		if(elt.removeEventListener) elt.removeEventListener(type, handler);
		else if(elt.detachEvent) elt.detachEvent("on"+type, handler);
	};
	
	// function to get the position of a DOM element on the page
	action.util.elementPosition = function(elt){
		var _left = 0;
		var _top = 0;
		
		if(elt.offsetParent){
			var parent = elt;
			do {
				_left += parent.offsetLeft;
				_top += parent.offsetTop;
			} while(parent = parent.offsetParent);
		}
		
		return {left: _left, top: _top};
	};
	
})(window, action);