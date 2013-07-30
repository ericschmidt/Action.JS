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

(function(window, document, action){
	
	// event type constants
	action.events = {};
	action.events.READY = "ready";
	action.events.LOAD = "load";
	action.events.RESIZE = "resize";
	action.events.ENTER_FRAME = "enterframe";
	action.events.CLICK = "click";
	action.events.MOUSE_MOVE = "mousemove";
	action.events.MOUSE_DOWN = "mousedown";
	action.events.MOUSE_UP = "mouseup";
	action.events.MOUSE_WHEEL = "mouse_wheel"; // not just 'mousewheel' because it's already used by some browsers; this is an alias
	action.events.KEY_DOWN = "keydown";
	action.events.KEY_UP = "keyup";
	action.events.TOUCH_START = "touch_start"; // these touch events are also aliases
	action.events.TOUCH_MOVE = "touch_move";
	action.events.TOUCH_END = "touch_end";
	action.events.DEVICE_MOTION = "devicemotion";
	action.events.DEVICE_ORIENTATION = "deviceorientation";
	
	// bind & unbind functions to add event listeners to specific display objects (best suited for mouse/touch events)
	// this array holds the currently bound events.
	var _events = [];
	action.events.bind = function(obj, type, handler){
		var _handler = function(){
			if(action.calc.ptCollisionRect(action.mouse.x, action.mouse.y, obj)) handler(obj);
		};
		action.addEventListener(type, _handler);
		_events.push({obj: obj, type: type, handler: handler, realHandler: _handler});
	};
	action.events.unbind = function(obj, type, handler){
		for(var i=0;i<_events.length;i++){
			var event = _events[i];
			if(event.obj === obj && event.type === type && event.handler === handler){
				action.removeEventListener(type, event.realHandler);
				_events.splice(i, 1);
				break;
			}
		}
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
	action.util.addEventHandler(window, action.util.browser.name === "firefox" ? "DOMMouseScroll" : "mousewheel", function(e){
		var _delta = e.detail ? -1*e.detail : e.wheelDelta/120;
		action.dispatchEvent(action.events.MOUSE_WHEEL, {delta: _delta});
	});
	
	// these handle dispatching touch events because they occur on the document instead of the window
	if(window.TouchEvent){
		action.util.addEventHandler(document, "touchstart", function(e){
			action.dispatchEvent(action.events.TOUCH_START, e);
		});
		action.util.addEventHandler(document, "touchmove", function(e){
			action.dispatchEvent(action.events.TOUCH_MOVE, e);
		});
		action.util.addEventHandler(document, "touchend", function(e){
			action.dispatchEvent(action.events.TOUCH_END, e);
		});
	}
	
})(window, document, action);