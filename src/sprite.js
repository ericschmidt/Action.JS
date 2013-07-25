/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Sprite class
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

	// Sprite class - a display object which can have multiple states, each of which are basic display objects (Rectangle, Image, Animation, etc)
	action.Sprite = function(){
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
		var _states = {};
		var _currentState;
		this.addState = function(name, obj){
			_states[name] = obj;
		};
		this.removeState = function(name){
			delete _states[name];
		};
		this.showState = function(name){
			_currentState = _states[name];
			_this.width = _currentState.width;
			_this.height = _currentState.height;
		};
		
		this.draw = function(stage){
			_currentState.x = _this.x;
			_currentState.y = _this.y;
			_currentState.center = _this.center;
			_currentState.scaleX = _this.scaleX;
			_currentState.scaleY = _this.scaleY;
			_currentState.rotation = _this.rotation;
			_currentState.draw(stage);
		};
	};
	
})(window, action);