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
	action.events.MOUSE_DOWN = "mousedown";
	action.events.MOUSE_UP = "mouseup";
	action.events.MOUSE_WHEEL = "mouse_wheel"; // not just 'mousewheel' because it's already used by some browsers; this is an alias
	action.events.KEY_DOWN = "keydown";
	action.events.KEY_UP = "keyup";
	
	// a 'click' event handling function for display objects
	action.events.click = function(obj, handler){
		action.addEventListener(action.events.CLICK, function(){
			if(action.calc.ptCollisionRect(action.mouse.x, action.mouse.y, obj)) handler();
		});
	};
	
	// to add/remove event listeners and dispatch events
	// not in the 'events' object but it makes sense to put them in this file
	action.addEventListener = function(type, handler){
		action.util.addEventHandler(window, type, handler);
	};
	
	action.removeEventListener = function(type, handler){
		action.util.removeEventHandler(window, type, handler);
	};
	
	action.dispatchEvent = function(type, data){
		data = data || {};
		window.dispatchEvent(new CustomEvent(type, {detail: data}));
	};
	
	// this handles dispatching the MOUSE_WHEEL event because it's not consistent across browsers
	action.addEventListener(action.util.browser.name === "firefox" ? "DOMMouseScroll" : "mousewheel", function(e){
		var _delta = e.detail ? -1*e.detail : e.wheelDelta/120;
		action.dispatchEvent(action.events.MOUSE_WHEEL, {delta: _delta});
	});
	
})(window, action);