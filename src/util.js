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

(function(window, document, action){
	
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
	
	// include function to import other JS files - 'last' parameter specifies whether to add this file last or first relative to other scripts on the page
	action.util.include = function(src, callback, last){
		last = last || false;
		callback = callback || function(){};
		var scripts = document.getElementsByTagName("script");
		var loaded;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src+"?"+Date.now();
		// load handler
		function ready(){
			if(!loaded && (!script.readyState || script.readyState === "complete")){
				loaded = true;
				callback();
				action.util.removeEventHandler(script, "load", ready);
				action.util.removeEventHandler(script, "readystatechange", ready);
			}
		}
		action.util.addEventHandler(script, "load", ready);
		action.util.addEventHandler(script, "readystatechange", ready);
		// add new script to document
		if(last) scripts[scripts.length-1].parentNode.appendChild(script);
		else scripts[0].parentNode.insertBefore(script, scripts[0]);
	};
	
	// function for extending classes
	action.util.extend = function(baseClass, childConstructor){
		childConstructor = childConstructor || function(){};
		function Child(){
			baseClass.apply(this);
			childConstructor.apply(this, arguments);
		}
		Child.prototype = baseClass.prototype;
		return Child;
	};
	
	// function to remove a specified element from an array
	action.util.arrayRemove = function(arr, obj){
		for(var i=0;i<arr.length;i++){
			if(arr[i] === obj){
				arr.splice(i, 1);
			}
		}
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
	action.util.browser.os = (function(){
		var plat = navigator.platform.toLowerCase();
		if(plat.indexOf("win") != -1) return "windows";
		else if(plat.indexOf("mac") != -1) return "mac";
		else if(plat.indexOf("iphone") != -1 || plat.indexOf("ipod") != -1 || plat.indexOf("ipad") != -1) return "iOS";
		else if(plat.indexOf("linux") != -1) return "linux";
		else return "unknown";
	})();
	action.util.browser.hasJava = navigator.javaEnabled();
	action.util.browser.agent = navigator.userAgent;
	
})(window, document, action);