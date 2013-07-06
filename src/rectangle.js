/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Rectangle class
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

	// Rectangle class
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