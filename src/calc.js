/*
 * Action.JS
 * ActionScript-like library for JavaScript development
 *
 * Calc module
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

	// ---- MATH/PHYSICS-Y THINGS ----------------
	// called 'calc' because it's for calculating stuff; 'math' or 'physics' would have been to specific and I don't think Action.JS is going to get that specific
	// **TO DO: store mathematical constants here, handle different types of collisions (rectangular regions, circular regions, collisions with a point, etc)
	
	// Constants
	action.calc = {};
	action.calc.DEG2RAD = Math.PI/180;
	action.calc.RAD2DEG = 180/Math.PI;
	
	// Useful functions
	action.calc.inRange = function(val, lo, hi){
		return ((lo <= val) && (val <= hi));
	};
	
	// Collisions - only work on displayed objects
	action.calc.collisionPt = function(px, py, obj){
		return obj.displayed && (action.calc.inRange(px, obj.x, obj.x+obj.width*obj.scaleX) && action.calc.inRange(py, obj.y, obj.y+obj.height*obj.scaleY))
	};
	
	action.calc.collisionRect = function(obj1, obj2){
		return obj1.displayed && obj2.displayed && ((action.calc.inRange(obj1.x, obj2.x, obj2.x+obj2.width*obj2.scaleX) || action.calc.inRange(obj1.x+obj1.width*obj1.scaleX, obj2.x, obj2.x+obj2.width*obj2.scaleX)) && (action.calc.inRange(obj1.y, obj2.y, obj2.y+obj2.height*obj2.scaleY) || action.calc.inRange(obj1.y+obj1.height*obj1.scaleY, obj2.y, obj2.y+obj2.height*obj2.scaleY)));
	};
	
})(window, action);