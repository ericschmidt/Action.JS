/*
 * test.js
 *
 * testing Action.JS
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

action.main = function(){
	
	action.title("Action.JS Test");
	action.setLog("log");
	action.log("Action.JS loaded in "+action.pageLoadTime+"ms");
	action.log("Starting!");
	
	var _w = false, _a = false, _s = false, _d = false;
	
	action.setStage("stage", "#00CC00");
	
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
	
	action.addEventListener(action.events.ENTER_FRAME, function(){
		if(_a) s.x -= 2;
		if(_d) s.x += 2;
		if(_w) s.y -= 2;
		if(_s) s.y += 2;
	});
	
	action.addEventListener(action.events.KEY_DOWN, function(e){
		if(e.which == 87) _w = true;
		if(e.which == 65) _a = true;
		if(e.which == 83) _s = true;
		if(e.which == 68) _d = true;
	});
	
	action.addEventListener(action.events.KEY_UP, function(e){
		if(e.which == 87) _w = false;
		if(e.which == 65) _a = false;
		if(e.which == 83) _s = false;
		if(e.which == 68) _d = false;
	});
	
	setTimeout(function(){
		action.undisplay(r);
		action.title("It's gone!");
		t.text = "Still text.";
	}, 4000);
};