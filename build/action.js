(function(window){
	window.action = new function(){
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
		this.__defineGetter__("pageLoadTime", function(){
			return _pageLoadTime;
		});
		this.setLog = function(id){
			_log = document.getElementById(id);
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.innerHTML = "Action.JS Output<br><br>";
		};
		this.setStage = function(id, bgColor){
			var canvas = document.getElementById(id);
			_width = canvas.width;
			_height = canvas.height;
			_stage = canvas.getContext("2d");
			_bgColor = bgColor || "#FFFFFF";
			_this.clearStage();
		};
		this.__defineGetter__("stage", function(){
			return _stage;
		});
		this.__defineGetter__("stageWidth", function(){
			return _width;
		});
		this.__defineGetter__("stageHeight", function(){
			return _height;
		});
		this.__defineGetter__("numDisplayed", function(){
			return _display.length;
		});
		this.__defineGetter__("fps", function(){
			return _fps;
		});
		this.__defineSetter__("fps", function(fps){
			_stopLoop();
			_fps = fps;
			_startLoop();
		});
		var _checkLoadInterval = setInterval(function(){
			if(document.readyState === "complete"){
				_init();
				clearInterval(_checkLoadInterval);
			}
		}, 10);
		var _init = function(){
			_pageLoadTime = +new Date() - _startLoadTime;
			if(window.main) window.main();
			else console.log("Action.JS Warning: no function main() found");
		};
		var _startLoop = function(){
			_frameInterval = setInterval(function(){
				_this.dispatchEvent(new CustomEvent(_this.events.ENTER_FRAME));
				_this.clearStage();
				_this.drawAll();
			}, Math.floor(1000/_fps));
		};
		var _stopLoop = function(){
			clearInterval(_frameInterval);
		};
		this.kill = function(){
			_stopLoop();
		};
		this.log = function(info){
			_log.innerHTML += ">"+String(info)+"<br>";
			_log.scrollTop = _log.scrollHeight;
		};
		this.title = function(text){
			document.title = text;
		};
		this.clearStage = function(){
			_stage.fillStyle = _bgColor;
			_stage.fillRect(0, 0, _width, _height);
		};
		this.drawAll = function(){
			for(var i=0;i<_display.length;i++){
				_display[i].draw(_stage);
			}
		};
		this.display = function(obj){
			_this.undisplay(obj);
			_display.push(obj);
			obj.displayed = true;
		};
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
(function(window, action){
	action.events = {};
	action.events.READY = "ready";
	action.events.LOAD = "load";
	action.events.ENTER_FRAME = "enterframe";
	action.events.CLICK = "click";
	action.events.MOUSE_MOVE = "mousemove";
	action.events.KEY_DOWN = "keydown";
	action.events.KEY_UP = "keyup";
	action.events.click = function(obj, handler){
		action.addEventListener(action.events.CLICK, function(e){
			if(action.calc.collisionPt(e.pageX, e.pageY, obj)) handler();
		});
	};
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
(function(window, action){
	action.calc = {};
	action.calc.DEG2RAD = Math.PI/180;
	action.calc.RAD2DEG = 180/Math.PI;
	action.calc.inRange = function(val, lo, hi){
		return ((lo <= val) && (val <= hi));
	};
	action.calc.collisionPt = function(px, py, obj){
		return obj.displayed && (action.calc.inRange(px, obj.x, obj.x+obj.width*obj.scaleX) && action.calc.inRange(py, obj.y, obj.y+obj.height*obj.scaleY))
	};
	action.calc.collisionRect = function(obj1, obj2){
		return obj1.displayed && obj2.displayed && ((action.calc.inRange(obj1.x, obj2.x, obj2.x+obj2.width*obj2.scaleX) || action.calc.inRange(obj1.x+obj1.width*obj1.scaleX, obj2.x, obj2.x+obj2.width*obj2.scaleX)) && (action.calc.inRange(obj1.y, obj2.y, obj2.y+obj2.height*obj2.scaleY) || action.calc.inRange(obj1.y+obj1.height*obj1.scaleY, obj2.y, obj2.y+obj2.height*obj2.scaleY)));
	};
})(window, action);
(function(window, action){
	action.Rectangle = function(width, height, fillStyle){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.scaleX = 1;
		this.scaleY = 1;
		this.fill = fillStyle || "#000000";
		this.draw = function(stage){
			stage.fillStyle = _this.fill;
			stage.fillRect(_this.x, _this.y, _this.width*_this.scaleX, _this.height*_this.scaleY);
		};
	};
})(window, action);
(function(window, action){
	action.Image = function(src){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		var _img = new Image();
		_img.addEventListener("load", function(){
			_this.width = _img.width;
			_this.height = _img.height;
		});
		_img.src = src;
		this.draw = function(stage){
			stage.drawImage(_img, _this.x, _this.y, _this.width*_this.scaleX, _this.height*_this.scaleY);
		};
	};
})(window, action);
(function(window, action){
	action.Animation = function(spritesheet, spriteWidth, spriteHeight){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = spriteWidth;
		this.height = spriteHeight;
		this.scaleX = 1;
		this.scaleY = 1;
		var _numFrames = 0;
		var _currentFrame = 0;
		var _sheet = new Image();
		_sheet.addEventListener("load", function(){
			_numFrames = Math.round(_sheet.width/_this.width);
		});
		_sheet.src = spritesheet;
		action.addEventListener(action.events.ENTER_FRAME, function(){
			_currentFrame++;
			_currentFrame %= _numFrames;
		});
		this.draw = function(stage){
			stage.drawImage(_sheet, _currentFrame*_this.width, 0, _this.width, _this.height, _this.x, _this.y, _this.width*_this.scaleX, _this.height*_this.scaleY);
		};
	};
})(window, action);
(function(window, action){
	action.Sprite = function(){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		var _states = {};
		var _currentState;
		this.addState = function(name, obj){
			_states[name] = obj;
		};
		this.removeState = function(name){
			delete _states[name];
		};
		this.show = function(name){
			_currentState = _states[name];
			_this.width = _currentState.width;
			_this.height = _currentState.height;
		};
		this.draw = function(stage){
			_currentState.x = _this.x;
			_currentState.y = _this.y;
			_currentState.scaleX = _this.scaleX;
			_currentState.scaleY = _this.scaleY;
			_currentState.draw(stage);
		};
	};
})(window, action);
(function(window, action){
	action.Text = function(font, text, fillStyle){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.font = font || "16pt Arial";
		this.text = text || "";
		this.fill = fillStyle || "#000000";
		this.__defineGetter__("width", function(){
			action.stage.font = _this.font;
			return action.stage.measureText(_this.text).width;
		});
		this.draw = function(stage){
			stage.fillStyle = _this.fill;
			stage.font = _this.font;
			stage.fillText(_this.text, _this.x, _this.y);
		};
	};
})(window, action);
