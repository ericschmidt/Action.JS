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
	
	// rotate (px, py) about (cx, cy) by theta radians
	action.calc.rotate = function(px, py, cx, cy, theta){
		var _diff = {x: px-cx, y: py-cy};
		var _x = _diff.x*Math.cos(theta) - _diff.y*Math.sin(theta) + cx;
		var _y = _diff.x*Math.sin(theta) + _diff.y*Math.cos(theta) + cy;
		return {x: _x, y: _y};
	}
	
	// COLLISIONS - only work on displayed objects
	
	// bounding box calculator
	action.calc.boundingBox = function(obj){
		if(obj.rotation % 360 === 0){
			// return obvious box
			return {x: obj.x-obj.center.x*obj.scaleX, y: obj.y-obj.center.y*obj.scaleY, width: obj.width*obj.scaleX, height: obj.height*obj.scaleY};
		} else {
			var _corners = [{x: 0, y: 0},{x: obj.width*obj.scaleX, y: 0},{x: obj.width*obj.scaleX, y: obj.height*obj.scaleY},{x: 0, y: obj.height*obj.scaleY}];
			var _rotated = [];
			var _current;
			for(var i=0;i<4;i++){
				_current = _corners[i];
				_rotated.push(action.calc.rotate(_current.x, _current.y, obj.center.x, obj.center.y, obj.rotation*action.calc.DEG2RAD));
			}
			var _minX = _rotated[0].x;
			var _minY = _rotated[0].y;
			var _maxX = _rotated[2].x;
			var _maxY = _rotated[2].y;
			for(i=0;i<4;i++){
				_current = _rotated[i];
				if(_current.x < _minX) _minX = _current.x;
				if(_current.x > _maxX) _maxX = _current.x;
				if(_current.y < _minY) _minY = _current.y;
				if(_current.y > _maxY) _maxY = _current.y;
			}
			var _offsetX = obj.x-obj.center.x*obj.scaleX;
			var _offsetY = obj.y-obj.center.y*obj.scaleY;
			_minX += _offsetX;
			_maxX += _offsetX;
			_minY += _offsetY;
			_maxY += _offsetY;
			return {x: _minX, y: _minY, width: _maxX-_minX, height: _maxY-_minY};
		}
	};
	
	action.calc.ptCollisionRect = function(px, py, obj){
		if(!obj.displayed){
			return false;
		} else {
			var _bounds = action.calc.boundingBox(obj);
			return action.calc.inRange(px, _bounds.x, _bounds.x+_bounds.width) && action.calc.inRange(py, _bounds.y, _bounds.y+_bounds.height);
		}
	};
	
	action.calc.ptCollisionCirc = function(px, py, obj){
		var r = obj.width>obj.height ? obj.width : obj.height;
		var cx = obj.x + obj.width/2;
		var cy = obj.y + obj.height/2;
		var dist = action.calc.distance(px, py, cx, cy);
		return obj.displayed && dist <= r;
	};
	
	action.calc.collisionRect = function(obj1, obj2){
		if(!obj1.displayed || !obj2.displayed){
			return false;
		} else {
			var _bounds1 = action.calc.boundingBox(obj1);
			var _bounds2 = action.calc.boundingBox(obj2);
			return (action.calc.inRange(_bounds1.x, _bounds2.x, _bounds2.x+_bounds2.width) || action.calc.inRange(_bounds1.x+_bounds1.width, _bounds2.x, _bounds2.x+_bounds2.width)) && (action.calc.inRange(_bounds1.y, _bounds2.y, _bounds2.y+_bounds2.height) || action.calc.inRange(_bounds1.y+_bounds1.height, _bounds2.y, _bounds2.y+_bounds2.height));
		}
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