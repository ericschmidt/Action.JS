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
	
	window.action = new (function(){
		// private variables
		var _this = this;
		var _startLoadTime = Date.now();	// set when the page is first open, used to calculate page load time
		var _pageLoadTime = 0;				// the time it takes to load the page
		var _log;							// the HTML element to which log text will be printed
		var _canvas;						// the canvas element used for the stage
		var _stage;							// the stage, which in JS is actually the drawing context
		var _stageX;						// x position of the stage on the page
		var _stageY;						// y position of the stage on the page
		var _stageWidth;					// width of the stage
		var _stageHeight;					// height of the stage
		var _bgColor;						// the default background color of the stage as a CSS-style color
		var _display = [];					// the display list
		var _fps = 24;						// framerate, default is 24
		var _frameInterval;					// frame interval for when the application is playing
		
		// getter for pageLoadTime, we want it read-only
		this.__defineGetter__("pageLoadTime", function(){
			return _pageLoadTime;
		});
		
		// LOG/STAGE SETUP
		
		// create a div for the log from scratch; setLog needn't be called after this
		this.createLog = function(size, horiz){
			size = size || 300;
			horiz = horiz || false;
			_log = document.createElement("div");
			_log.style.position = "absolute";
			if(horiz){
				// make horizontal log (goes on bottom of window)
				_log.style.bottom = "0px";
				_log.style.left = "0px";
				_log.style.width = "100%";
				_log.style.height = String(size)+"px";
			} else {
				// make vertical log (goes on right side of window)
				_log.style.top = "0px";
				_log.style.right = "0px";
				_log.style.width = String(size)+"px";
				_log.style.height = "100%";
			}
			// set bg color, font, overflow and initialize
			_log.style.backgroundColor = "#CCCCCC";
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.style.fontSize = "14px";
			_log.style.overflowX = "auto";
			_log.style.overflowY = "scroll";
			_log.innerHTML = "Action.JS Output<br><br>";
			document.body.appendChild(_log);
		};
		
		// create a canvas element for the stage from scratch; setStage needn't be called after this
		this.createStage = function(x, y, width, height, bgColor, border){
			_stageX = x || 0;
			_stageY = y || 0;
			_stageWidth = width || 800;
			_stageHeight = height || 600;
			_bgColor = bgColor || "#FFFFFF";
			_canvas = document.createElement("canvas");
			_canvas.width = _stageWidth;
			_canvas.height = _stageHeight;
			_canvas.style.position = "absolute";
			_canvas.style.top = String(_stageY)+"px";
			_canvas.style.left = String(_stageX)+"px";
			_canvas.style.border = border || "1px solid #000000";
			_stage = _canvas.getContext("2d");
			_this.clearStage();
			document.body.appendChild(_canvas);
		};
		
		// sets the log (for text output)
		this.setLog = function(id){
			_log = document.getElementById(id);
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.style.fontSize = "14px";
			_log.innerHTML = "Action.JS Output<br><br>";
		};
		
		// sets the stage (for graphics) ** find way to make stage unselectable ?
		this.setStage = function(id, bgColor){
			_canvas = document.getElementById(id);
			_stageX = _this.util.elementPosition(_canvas).left;
			_stageY = _this.util.elementPosition(_canvas).top;
			_stageWidth = _canvas.width;
			_stageHeight = _canvas.height;
			_stage = _canvas.getContext("2d");
			_bgColor = bgColor || "#FFFFFF";
			_this.clearStage();
		};
		
		// getter for the canvas element, though it shouldn't be used directly at all
		this.__defineGetter__("canvas", function(){
			return _canvas;
		});
		
		// getter for the stage object, though it shouldn't be used directly too often
		this.__defineGetter__("stage", function(){
			return _stage;
		});
		
		// getters for stageX, stageY, stageWidth, stageHeight; they're read-only
		this.__defineGetter__("stageX", function(){
			return _stageX;
		});
		
		this.__defineGetter__("stageY", function(){
			return _stageY;
		});
		
		this.__defineGetter__("stageWidth", function(){
			return _stageWidth;
		});
		
		this.__defineGetter__("stageHeight", function(){
			return _stageHeight;
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
		
		// private init function, gets page load time and calls user-defined action.main function if it exists
		var _init = function(){
			_pageLoadTime = Date.now() - _startLoadTime;
			if(_this.main) _this.main();
			else console.log("Action.JS Warning: no function action.main() found");
		};
		// ------------
		
		// private startLoop function, starts the main loop at the current FPS
		var _startLoop = function(){
			_frameInterval = setInterval(function(){
				_this.dispatchEvent(_this.events.ENTER_FRAME);
				_this.clearStage();
				_this.drawAll();
			}, Math.ceil(1000/_fps));
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
			_stage.fillRect(0, 0, _stageWidth, _stageHeight);
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
		
		// empties the display list
		this.emptyDisplay = function(){
			_display = [];
		};
		
	})();
	
})(window);