/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Events module
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
	
	// **TO DO: add hover/mouseOver event handling function like 'click' ?
	// event type constants
	action.events = {};
	action.events.READY = "ready";
	action.events.LOAD = "load";
	action.events.ENTER_FRAME = "enterframe";
	action.events.CLICK = "click";
	action.events.MOUSE_MOVE = "mousemove";
	action.events.KEY_DOWN = "keydown";
	action.events.KEY_UP = "keyup";
	
	// a 'click' event handling function for display objects
	action.events.click = function(obj, handler){
		action.addEventListener(action.events.CLICK, function(e){
			if(action.calc.collisionPt(e.pageX, e.pageY, obj)) handler();
		});
	};
	
	// to add/remove event listeners and dispatch events
	// not in the 'events' object but it makes sense to put them in this file
	action.addEventListener = function(type, handler){
		if(window.addEventListener) window.addEventListener(type, handler);
		else if(window.attachEvent) window.attachEvent("on"+type, handler);
	};
	
	action.removeEventListener = function(type, handler){
		if(window.removeEventListener) window.removeEventListener(type, handler);
		else if(window.detachEvent) window.detachEvent("on"+type, handler);
	};
	
	action.dispatchEvent = function(event){
		window.dispatchEvent(event);
	};
	
})(window, action);