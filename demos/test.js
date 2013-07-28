/*
 * test.js
 *
 * testing Action.JS - I add something random here whenever I update the library
 *
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

action.main = function(){
	
	// set title, make stage & log, log some stuff
	action.title("Action.JS Test");
	action.createStage(0, 0, 800, 600, "#00CC00");
	action.createLog(300, true);
	action.log("Action.JS loaded in "+action.pageLoadTime+"ms");
	action.log("You're using "+action.util.browser.name+", version "+action.util.browser.version);
	action.log("Starting!");
	
	// keypress variables
	var _w = false, _a = false, _s = false, _d = false;
	
	// this'll show the bounding box of 'r'
	var b = new action.Rectangle(100, 100, "#CCCCCC");
	action.display(b);
	
	// just a rectangle.
	var r = new action.Rectangle(100, 100, "#007700");
	r.center = {x: 50, y: 50};
	r.x = 400;
	r.y = 300;
	action.display(r);
	
	// a test sprite
	var s = new action.Animation("assets/test_sprite.png", 100, 100);
	s.center = {x: 50, y: 50};
	s.x = 50;
	s.y = 50;
	action.display(s);
	
	// some text, obligatory "Hello, world!"
	var t = new action.Text("16pt Arial", "Hello, world!");
	t.x = 100;
	t.y = 160;
	action.display(t);
	
	action.fps = 24;
	
	action.events.click(r, function(){
		action.log("clicked on r");
	});
	
	// testing the mousewheel event
	action.addEventListener(action.events.MOUSE_WHEEL, function(e){
		if(e.detail.delta > 0) action.log("Mouse scrolled up!");
		else action.log("Mouse scrolled down!");
	});
	
	action.addEventListener(action.events.ENTER_FRAME, function(){
		r.rotation++;
		var _box = action.calc.boundingBox(r);
		b.x = _box.x;
		b.y = _box.y;
		b.width = _box.width;
		b.height = _box.height;
		s.rotation++;
		if(_a) s.x -= 2;
		if(_d) s.x += 2;
		if(_w) s.y -= 2;
		if(_s) s.y += 2;
	});
	
	action.addEventListener(action.events.KEY_DOWN, function(e){
		if(e.which === action.keyboard.W) _w = true;
		if(e.which === action.keyboard.A) _a = true;
		if(e.which === action.keyboard.S) _s = true;
		if(e.which === action.keyboard.D) _d = true;
	});
	
	action.addEventListener(action.events.KEY_UP, function(e){
		if(e.which === action.keyboard.W) _w = false;
		if(e.which === action.keyboard.A) _a = false;
		if(e.which === action.keyboard.S) _s = false;
		if(e.which === action.keyboard.D) _d = false;
	});
	
	setTimeout(function(){
		action.undisplay(r);
		action.title("What title?");
		t.text = "BOOM";
		s.stop();
	}, 7000);
};