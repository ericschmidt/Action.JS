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

	// Image class
	action.Image = function(src){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.center = {x: 0, y: 0};
		this.scaleX = 1;
		this.scaleY = 1;
		this.rotation = 0;
		var _src = src;
		this.__defineGetter__("src", function(){
			return _src;
		});
		this.__defineSetter__("src", function(src){
			_src = src;
			_img.src = _src;
		});
		var _img = new Image();
		action.util.addEventHandler(_img, "load", function(){
			_this.width = _img.width;
			_this.height = _img.height;
		});
		_img.src = _src;
		
		this.draw = function(stage){
			stage.save();
			stage.translate(_this.x, _this.y);
			stage.rotate(_this.rotation*action.calc.DEG2RAD);
			stage.drawImage(_img, -_this.center.x*_this.scaleX, -_this.center.y*_this.scaleY, _this.width*_this.scaleX, _this.height*_this.scaleY);
			stage.restore();
		};
	};
	
})(window, action);