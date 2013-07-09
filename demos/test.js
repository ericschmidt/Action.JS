/*
 * test.js
 *
 * testing Action.JS
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

action.main = function(){
	
	action.title("Action.JS Test");
	action.createStage(0, 0, 800, 600, "#00CC00");
	action.createLog(300, true);
	action.log("Action.JS loaded in "+action.pageLoadTime+"ms");
	action.log("You're using "+action.util.browser.name+", version "+action.util.browser.version);
	action.log("Starting!");
	
	var _w = false, _a = false, _s = false, _d = false;
	
	var r = new action.Rectangle(100,100,"#007700");
	action.display(r);
	
	var s = new action.Animation("assets/test_sprite.png", 100, 100);
	action.display(s);
	
	var t = new action.Text("16pt Arial", "HEY, THIS IS TEXT!");
	t.x = 100;
	t.y = 160;
	action.display(t);
	
	action.fps = 24;
	
	action.events.click(r, function(){
		action.log("clicked on r");
	});
	
	action.addEventListener(action.events.MOUSE_WHEEL, function(e){
		if(e.detail.delta > 0) action.log("Mouse scrolled up!");
		else action.log("Mouse scrolled down!");
	});
	
	action.addEventListener(action.events.ENTER_FRAME, function(){
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
		action.title("It's gone!");
		t.text = "Still text.";
	}, 4000);
};