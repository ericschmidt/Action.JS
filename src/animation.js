/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Animation class
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

	// Animation class - stores a spritesheet internally and shifts it horizontally to animate
	action.Animation = function(spritesheet, spriteWidth, spriteHeight){
		// usual variables
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = spriteWidth;
		this.height = spriteHeight;
		this.center = {x: 0, y: 0};
		this.scaleX = 1;
		this.scaleY = 1;
		this.rotation = 0;
		// frame variables
		var _numFrames = 0;
		this.__defineGetter__("numFrames", function(){
			return _numFrames;
		});
		var _currentFrame = 0;
		// the location of the spritesheet
		var _src = spritesheet;
		this.__defineGetter__("src", function(){
			return _src;
		});
		this.__defineSetter__("src", function(src){
			_src = src;
			_sheet.src = _src;
		});
		// the image object containing the spritesheet
		var _sheet = new Image();
		// set stuff up when spritesheet is loaded
		action.util.addEventHandler(_sheet, "load", function(){
			_numFrames = Math.round(_sheet.width/_this.width);
			_this.play(true);
		});
		if(_src) _sheet.src = _src;
		
		// load event handler so you can do stuff when the image is loaded
		this.load = function(handler){
			action.util.addEventHandler(_sheet, "load", handler);
		};
		
		// play status variables
		var _playing = false;
		this.__defineGetter__("playing", function(){
			return _playing;
		});
		var _loop;
		// enterframe event handler
		var _onEnterFrame = function(){
			_currentFrame++;
			if(!_loop && _currentFrame >= _numFrames){
				_this.stop();
			} else {
				_currentFrame %= _numFrames;
			}
		};
		// playback control functions
		this.play = function(loop){
			_loop = loop || false;
			action.addEventListener(action.events.ENTER_FRAME, _onEnterFrame);
			_playing = true;
		};
		this.stop = function(){
			action.removeEventListener(action.events.ENTER_FRAME, _onEnterFrame);
			_currentFrame = 0;
			_playing = false;
		};
		
		// the mighty draw function
		this.draw = function(stage){
			stage.save();
			stage.translate(_this.x, _this.y);
			stage.rotate(_this.rotation*action.calc.DEG2RAD);
			stage.drawImage(_sheet, _currentFrame*_this.width, 0, _this.width, _this.height, -_this.center.x*_this.scaleX, -_this.center.y*_this.scaleY, _this.width*_this.scaleX, _this.height*_this.scaleY);
			stage.restore();
		};
	};
	
})(window, action);