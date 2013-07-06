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
	// **TO DO: change addEventListener for cross-browser support?
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