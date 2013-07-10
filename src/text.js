/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Text class
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
	
	// Text class - only fill text for now
	// **TO DO: add stroke text?
	action.Text = function(font, text, fillStyle){
		var _this = this;
		this.displayed = false;
		this.x = 0;
		this.y = 0;
		this.center = {x: 0, y: 0};
		this.rotation = 0;
		this.font = font || "16pt Arial";
		this.text = text || "";
		this.fill = fillStyle || "#000000";
		// returns width in px of the current text
		this.__defineGetter__("width", function(){
			action.stage.font = _this.font;
			return action.stage.measureText(_this.text).width;
		});
		
		this.draw = function(stage){
			stage.save();
			stage.translate(_this.x, _this.y);
			stage.rotate(_this.rotation*action.calc.DEG2RAD);
			stage.fillStyle = _this.fill;
			stage.font = _this.font;
			stage.fillText(_this.text, -_this.center.x, -_this.center.y);
			stage.restore();
		};
	};
	
})(window, action);