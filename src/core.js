/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Core module
 *
 * Conventions:
 * lowercase package names, UpperCamelCase class names, ALLCAPS constants, _preUnderscored private members, lowerCamelCase public members
 *
 * Search '**' for to-do/issues
 *
 * Eric Schmidt 2013
 * eschmidt@mit.edu | eschmidt.co
 */

(function(window){
	
	window.action = new function(){
		// private variables
		var _this = this;
		var _startLoadTime = +new Date();	// set when the page is first open, used to calculate page load time
		var _pageLoadTime = 0;				// the time it takes to load the page
		var _log;							// the HTML element to which log text will be printed
		var _stage;							// the stage, which in JS is actually the drawing context
		var _width;							// width of the stage
		var _height;						// height of the stage
		var _bgColor;						// the default background color of the stage as a CSS-style color
		var _display = [];					// the display list
		var _fps = 24;						// framerate, default is 24
		var _frameInterval;					// frame interval for when the application is playing
		
		// getter for pageLoadTime, we want it read-only
		this.__defineGetter__("pageLoadTime", function(){
			return _pageLoadTime;
		});
		
		// sets the log (for text output)
		this.setLog = function(id){
			_log = document.getElementById(id);
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.innerHTML = "Action.JS Output<br><br>";
		};
		
		// sets the stage (for graphics) ** find way to make stage unselectable ?
		this.setStage = function(id, bgColor){
			var canvas = document.getElementById(id);
			_width = canvas.width;
			_height = canvas.height;
			_stage = canvas.getContext("2d");
			_bgColor = bgColor || "#FFFFFF";
			_this.clearStage();
		};
		
		// getter for the stage object, though it shouldn't be used directly too often
		this.__defineGetter__("stage", function(){
			return _stage;
		});
		
		// getters for width and height, they're read-only
		this.__defineGetter__("stageWidth", function(){
			return _width;
		});
		
		this.__defineGetter__("stageHeight", function(){
			return _height;
		});
		
		// getter for the number of objects in the display list
		this.__defineGetter__("numDisplayed", function(){
			return _display.length;
		});
		
		// getter and setter for fps; setting fps auto-starts animation
		this.__defineGetter__("fps", function(){
			return _fps;
		});
		
		this.__defineSetter__("fps", function(fps){
			_stopLoop();
			_fps = fps;
			_startLoop();
		});
		
		// STARTUP ----
		// loading interval, calls _init() when page is ready
		var _checkLoadInterval = setInterval(function(){
			if(document.readyState === "complete"){
				_init();
				clearInterval(_checkLoadInterval);
			}
		}, 10);
		
		// private init function, gets page load time and calls user-defined main function if it exists
		var _init = function(){
			_pageLoadTime = +new Date() - _startLoadTime;
			if(window.main) window.main();
			else console.log("Action.JS Warning: no function main() found");
		};
		// ------------
		
		// private startLoop function, starts the main loop at the current FPS
		var _startLoop = function(){
			_frameInterval = setInterval(function(){
				_this.dispatchEvent(new CustomEvent(_this.events.ENTER_FRAME));
				_this.clearStage();
				_this.drawAll();
			}, Math.floor(1000/_fps));
		};
		
		// private stopLoop function, stops the main loop from running by clearing the frame interval
		var _stopLoop = function(){
			clearInterval(_frameInterval);
		};
		
		// public kill function, just an emergency public cover for stopLoop
		this.kill = function(){
			_stopLoop();
		};
		
		// public log function, write info to the log
		this.log = function(info){
			_log.innerHTML += ">"+String(info)+"<br>";
			_log.scrollTop = _log.scrollHeight;
		};
		
		// public title function, sets the title of the document (utility/ease function)
		this.title = function(text){
			document.title = text;
		};
		
		// CORE DISPLAY FUNCTIONS
		
		this.clearStage = function(){
			_stage.fillStyle = _bgColor;
			_stage.fillRect(0, 0, _width, _height);
		};
		
		this.drawAll = function(){
			for(var i=0;i<_display.length;i++){
				_display[i].draw(_stage);
			}
		};
		
		// add an object to the display list; undisplays it first to ensure there's only one of each object
		this.display = function(obj){
			_this.undisplay(obj);
			_display.push(obj);
			obj.displayed = true;
		};
		
		// remove an object from the display list
		this.undisplay = function(obj){
			for(var i=0;i<_display.length;i++){
				if(_display[i] === obj){
					_display.splice(i, 1);
					obj.displayed = false;
					break;
				}
			}
		};
	};
	
})(window);