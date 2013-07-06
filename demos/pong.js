/*
 * PONG demo with Action.JS
 *
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

function main(){
	// setup
	action.setLog("log");
	action.setStage("stage", "#000000");
	action.title("Action.JS PONG");
	
	// keypress variables
	action.input = {};
	action.input._w = false;
	action.input._s = false;
	
	// 'physical' variables
	var speed = 5;												// movement speed for player & computer
	var CPULevel = Math.floor(100*(0.5+Math.random()*0.5))/100;	// computer level, from 0 (it won't move) to 1 (it won't lose)
	
	// game objects
	var player = new action.Rectangle(16, 150, "#00CC00");
	action.display(player);
	
	var computer = new action.Rectangle(16, 150, "#CC0000");
	computer.x = action.stageWidth - computer.width;
	action.display(computer);
	
	var ball = new action.Rectangle(16, 16, "#FFFFFF");
	setBall(ball, speed);
	action.display(ball);
	
	// the scoreboard
	var score = new action.Text("bold 20pt Courier New", "0 | 0", "#FFFFFF");
	score.x = (action.stageWidth - score.width)/2;
	score.y = 24;
	action.display(score);
	
	// the actual scores
	var p = 0;	// player
	var c = 0;	// computer
	
	// set fps and go!
	action.fps = 60;
	
	// add event listeners
	action.addEventListener(action.events.ENTER_FRAME, function(){
		// move the ball
		ball.x += ball.vel.x;
		ball.y += ball.vel.y;
		
		// handle collisions
		if(ball.y <= 0 || ball.y+ball.height >= action.stageHeight) ball.vel.y *= -1;
		if(action.calc.collisionRect(ball, player)) ball.vel.x = speed;
		if(action.calc.collisionRect(ball, computer)) ball.vel.x = -speed;
		
		// handle scoring
		if(ball.x < 0){
			c++;
			score.text = p+" | "+c;
			score.x = (action.stageWidth - score.width)/2;
			setBall(ball, speed);
		} else if(ball.x > action.stageWidth){
			p++;
			score.text = p+" | "+c;
			score.x = (action.stageWidth - score.width)/2;
			setBall(ball, speed);
		}
		
		// move player
		if(action.input._w && player.y > 0) player.y -= speed;
		if(action.input._s && player.y+player.height < action.stageHeight) player.y += speed;
		
		// move computer
		if(ball.y < computer.y+computer.height/2 && computer.y > 0 && Math.random() < CPULevel) computer.y -= speed;
		if(ball.y > computer.y+computer.height/2 && computer.y+computer.height < action.stageHeight && Math.random() < CPULevel) computer.y += speed;
	});
	
	action.addEventListener(action.events.KEY_DOWN, onKeyDown);
	action.addEventListener(action.events.KEY_UP, onKeyUp);
	
	// log some stuff
	action.log("Action.JS loaded in "+action.pageLoadTime+"ms");
	action.log("Running at "+action.fps+"fps");
	action.log("--------");
	action.log("PONG!");
	action.log("Computer level: "+CPULevel);
}

function randomVelocity(s){
	var vx = s*(2*Math.round(Math.random())-1);
	var vy = s*(2*Math.round(Math.random())-1);
	return {x: vx, y: vy};
}

function onKeyDown(ke){
	if(ke.which == 87) action.input._w = true;
	if(ke.which == 83) action.input._s = true;
}

function onKeyUp(ke){
	if(ke.which == 87) action.input._w = false;
	if(ke.which == 83) action.input._s = false;
}

function setBall(ball, speed){
	ball.x = (action.stageWidth - ball.width)/2;
	ball.y = (action.stageHeight - ball.height)/2;
	ball.vel = randomVelocity(speed);
}