/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Keyboard/mouse I/O modules
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
	
	// mouse object
	action.mouse = {};
	action.mouse.x = 0;
	action.mouse.y = 0;
	
	// update mouse position when mouse moves
	action.addEventListener(action.events.MOUSE_MOVE, function(e){
		action.mouse.x = e.pageX - action.stageX;
		action.mouse.y = e.pageY - action.stageY;
	});
	
	// **TO DO: add functions hide() and show() for mouse
	
	// keyboard object to hold key code constants
	action.keyboard = {};
	action.keyboard.ENTER = 13;
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