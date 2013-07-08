(function(window){
	window.action = new (function(){
		var _this = this;
		var _startLoadTime = +new Date();	// set when the page is first open, used to calculate page load time
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
		this.__defineGetter__("pageLoadTime", function(){
			return _pageLoadTime;
		});
		this.createLog = function(size, horiz){
			size = size || 300;
			horiz = horiz || false;
			_log = document.createElement("div");
			_log.style.position = "absolute";
			if(horiz){
				_log.style.bottom = "0px";
				_log.style.left = "0px";
				_log.style.width = "100%";
				_log.style.height = String(size)+"px";
			} else {
				_log.style.top = "0px";
				_log.style.right = "0px";
				_log.style.width = String(size)+"px";
				_log.style.height = "100%";
			}
			_log.style.backgroundColor = "#CCCCCC";
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.style.fontSize = "14px";
			_log.style.overflowX = "auto";
			_log.style.overflowY = "scroll";
			_log.innerHTML = "Action.JS Output<br><br>";
			document.body.appendChild(_log);
		};
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
		this.setLog = function(id){
			_log = document.getElementById(id);
			_log.style.fontFamily = "Consolas, monaco, monospace";
			_log.style.fontSize = "14px";
			_log.innerHTML = "Action.JS Output<br><br>";
		};
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
		this.__defineGetter__("canvas", function(){
			return _canvas;
		});
		this.__defineGetter__("stage", function(){
			return _stage;
		});
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
			if(_this.main) _this.main();
			else console.log("Action.JS Warning: no function action.main() found");
		};
		var _startLoop = function(){
			_frameInterval = setInterval(function(){
				_this.dispatchEvent(_this.events.ENTER_FRAME);
				_this.clearStage();
				_this.drawAll();
			}, Math.ceil(1000/_fps));
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
			_stage.fillRect(0, 0, _stageWidth, _stageHeight);
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
	})();
})(window);
(function(window, action){
	action.calc = {};
	action.calc.DEG2RAD = Math.PI/180;
	action.calc.RAD2DEG = 180/Math.PI;
	action.calc.inRange = function(val, lo, hi){
		return ((lo <= val) && (val <= hi));
	};
	action.calc.distance = function(p1x, p1y, p2x, p2y){
		var dx = p2x - p1x;
		var dy = p2y - p1y;
		return Math.sqrt(dx*dx + dy*dy);
	};
	action.calc.ptCollisionRect = function(px, py, obj){
		return obj.displayed && (action.calc.inRange(px, obj.x, obj.x+obj.width*obj.scaleX) && action.calc.inRange(py, obj.y, obj.y+obj.height*obj.scaleY));
	};
	action.calc.ptCollisionCirc = function(px, py, obj){
		var r = obj.width>obj.height ? obj.width : obj.height;
		var cx = obj.x + obj.width/2;
		var cy = obj.y + obj.height/2;
		var dist = action.calc.distance(px, py, cx, cy);
		return obj.displayed && dist <= r;
	};
	action.calc.collisionRect = function(obj1, obj2){
		return obj1.displayed && obj2.displayed && ((action.calc.inRange(obj1.x, obj2.x, obj2.x+obj2.width*obj2.scaleX) || action.calc.inRange(obj1.x+obj1.width*obj1.scaleX, obj2.x, obj2.x+obj2.width*obj2.scaleX)) && (action.calc.inRange(obj1.y, obj2.y, obj2.y+obj2.height*obj2.scaleY) || action.calc.inRange(obj1.y+obj1.height*obj1.scaleY, obj2.y, obj2.y+obj2.height*obj2.scaleY)));
	};
	action.calc.collisionCirc = function(obj1, obj2){
		var r1 = obj1.width>obj1.height ? obj1.width : obj1.height;
		var r2 = obj2.width>obj2.height ? obj2.width : obj2.height;
		var c1x = obj1.x + obj1.width/2;
		var c1y = obj1.y + obj1.height/2;
		var c2x = obj2.x + obj2.width/2;
		var c2y = obj2.y + obj2.height/2;
		var dist = action.calc.distance(c1x, c1y, c2x, c2y);
		return obj1.displayed && obj2.displayed && dist <= r1+r2;
	};
})(window, action);
(function(window, action){
	action.util = {};
	action.util.addEventHandler = function(elt, type, handler){
		if(elt.addEventListener) elt.addEventListener(type, handler);
		else if(elt.attachEvent) elt.attachEvent("on"+type, handler);
	};
	action.util.removeEventHandler = function(elt, type, handler){
		if(elt.removeEventListener) elt.removeEventListener(type, handler);
		else if(elt.detachEvent) elt.detachEvent("on"+type, handler);
	};
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
(function(window, action){
	action.events = {};
	action.events.READY = "ready";
	action.events.LOAD = "load";
	action.events.ENTER_FRAME = "enterframe";
	action.events.CLICK = "click";
	action.events.MOUSE_MOVE = "mousemove";
	action.events.MOUSE_DOWN = "mousedown";
	action.events.MOUSE_UP = "mouseup";
	action.events.KEY_DOWN = "keydown";
	action.events.KEY_UP = "keyup";
	action.events.click = function(obj, handler){
		action.addEventListener(action.events.CLICK, function(){
			if(action.calc.ptCollisionRect(action.mouse.x, action.mouse.y, obj)) handler();
		});
	};
	action.addEventListener = function(type, handler){
		action.util.addEventHandler(window, type, handler);
	};
	action.removeEventListener = function(type, handler){
		action.util.removeEventHandler(window, type, handler);
	};
	action.dispatchEvent = function(type, data){
		data = data || {};
		window.dispatchEvent(new CustomEvent(type, data));
	};
})(window, action);
(function(window, action){
	action.mouse = {};
	action.mouse.x = 0;
	action.mouse.y = 0;
	action.addEventListener(action.events.MOUSE_MOVE, function(e){
		action.mouse.x = e.pageX - action.stageX;
		action.mouse.y = e.pageY - action.stageY;
	});
	action.keyboard = {};
	action.keyboard.SPACEBAR = 32;
	action.keyboard.LEFT = 37;
	action.keyboard.UP = 38;
	action.keyboard.RIGHT = 39;
	action.keyboard.DOWN = 40;
	action.keyboard.A = 65;
	action.keyboard.B = 66;
	action.keyboard.C = 67;
	action.keyboard.D = 68;
	action.keyboard.E = 69;
	action.keyboard.F = 70;
	action.keyboard.G = 71;
	action.keyboard.H = 72;
	action.keyboard.I = 73;
	action.keyboard.J = 74;
	action.keyboard.K = 75;
	action.keyboard.L = 76;
	action.keyboard.M = 77;
	action.keyboard.N = 78;
	action.keyboard.O = 79;
	action.keyboard.P = 80;
	action.keyboard.Q = 81;
	action.keyboard.R = 82;
	action.keyboard.S = 83;
	action.keyboard.T = 84;
	action.keyboard.U = 85;
	action.keyboard.V = 86;
	action.keyboard.W = 87;
	action.keyboard.X = 88;
	action.keyboard.Y = 89;
	action.keyboard.Z = 90;
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
		action.util.addEventHandler(_img, "load", function(){
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
		action.util.addEventHandler(_sheet, "load", function(){
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
