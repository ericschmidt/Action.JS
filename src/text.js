/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Text module
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
	
	action.Text = function(font, text, fillStyle){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.font = font || "16pt Arial";
		this.text = text || "";
		this.fill = fillStyle || "#000000";
		// returns width in px of the current text
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