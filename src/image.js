/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Image class
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

	// Image 'class'
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