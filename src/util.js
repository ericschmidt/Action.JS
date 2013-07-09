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
	
	// user-agent stats so we know about the user's browser & capabilities
	// first function thanks to kennebec on StackOverflow: http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
	action.util.browser = (function(){
		var N = navigator.appName, ua = navigator.userAgent, tem;
		var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
		M = M ? [M[1], M[2]] : [N, navigator.appVersion,'-?'];
		return {name: M[0].toLowerCase(), version: M[1]};
	})();
	action.util.browser.hasJava = navigator.javaEnabled();
	action.util.browser.agent = navigator.userAgent;
	
})(window, action);