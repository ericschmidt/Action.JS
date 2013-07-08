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
	// called 'calc' because it's for calculating stuff; 'math' or 'physics' would have been too specific
	// store mathematical constants here, handle different types of collisions (rectangular regions, circular regions, collisions with a point, etc)
	
	// Constants
	action.calc = {};
	action.calc.DEG2RAD = Math.PI/180;
	action.calc.RAD2DEG = 180/Math.PI;
	
	// Useful functions
	action.calc.inRange = function(val, lo, hi){
		return ((lo <= val) && (val <= hi));
	};
	
	action.calc.distance = function(p1x, p1y, p2x, p2y){
		var dx = p2x - p1x;
		var dy = p2y - p1y;
		return Math.sqrt(dx*dx + dy*dy);
	};
	
	// Collisions - only work on displayed objects
	action.calc.ptCollisionRect = function(px, py, obj){
		return obj.displayed && (action.calc.inRange(px, obj.x, obj.x+obj.width*obj.scaleX) && action.calc.inRange(py, obj.y, obj.y+obj.height*obj.scaleY));
	};
	
	action.calc.ptCollisionCirc = function(px, py, obj){
		var r = obj.width>obj.height ? obj.width : obj.height;
		var cx = obj.x + obj.width/2;
		var cy = obj.y + obj.height/2;
		var dist = action.calc.distance(px, py, cx, cy);
		return obj.displayed && dist <= r;
	};
	
	action.calc.collisionRect = function(obj1, obj2){
		return obj1.displayed && obj2.displayed && ((action.calc.inRange(obj1.x, obj2.x, obj2.x+obj2.width*obj2.scaleX) || action.calc.inRange(obj1.x+obj1.width*obj1.scaleX, obj2.x, obj2.x+obj2.width*obj2.scaleX)) && (action.calc.inRange(obj1.y, obj2.y, obj2.y+obj2.height*obj2.scaleY) || action.calc.inRange(obj1.y+obj1.height*obj1.scaleY, obj2.y, obj2.y+obj2.height*obj2.scaleY)));
	};
	
	action.calc.collisionCirc = function(obj1, obj2){
		var r1 = obj1.width>obj1.height ? obj1.width : obj1.height;
		var r2 = obj2.width>obj2.height ? obj2.width : obj2.height;
		var c1x = obj1.x + obj1.width/2;
		var c1y = obj1.y + obj1.height/2;
		var c2x = obj2.x + obj2.width/2;
		var c2y = obj2.y + obj2.height/2;
		var dist = action.calc.distance(c1x, c1y, c2x, c2y);
		return obj1.displayed && obj2.displayed && dist <= r1+r2;
	};
	
})(window, action);