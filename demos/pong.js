/*
 * PONG demo with Action.JS
 *
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

(function(){
	// keypress variables
	var _w = false;
	var _s = false;
	
	var speed = 6;				// movement speed for player & computer
	var CPULevel = Math.floor(100*(0.5+Math.random()*0.5))/100;	// computer level, from 0 (it won't move) to 1 (it won't lose)
	var playerScore = 0;		// player's score
	var compScore = 0;			// computer's score
	
	// game objects
	var player;
	var computer;
	var ball;
	var score;

	action.main = function(){
		// setup
		action.createLog();
		action.createStage(0, 0, 800, 600, "#000000");
		action.title("Action.JS - PONG");
		
		// create game objects
		player = new action.Rectangle(16, 150, "#00CC00");
		action.display(player);
		
		computer = new action.Rectangle(16, 150, "#CC0000");
		computer.x = action.stageWidth - computer.width;
		action.display(computer);
		
		ball = new action.Rectangle(16, 16, "#FFFFFF");
		action.display(ball);
		
		// position everything initially
		reset();
		
		// create the scoreboard
		score = new action.Text("bold 20pt Courier New", "0 | 0", "#FFFFFF");
		score.x = (action.stageWidth - score.width)/2;
		score.y = 24;
		action.display(score);
		
		// add event listeners
		action.addEventListener(action.events.ENTER_FRAME, onEnterFrame);
		action.addEventListener(action.events.KEY_DOWN, onKeyDown);
		action.addEventListener(action.events.KEY_UP, onKeyUp);
		
		// set fps and go!
		action.fps = 60;
		
		// log some stuff
		action.log("Action.JS loaded in "+action.pageLoadTime+"ms");
		action.log("Running at "+action.fps+"fps");
		action.log("--------");
		action.log("PONG!");
		action.log("Use W/S or arrow keys to move up/down");
		action.log("Computer level: "+CPULevel);
	};

	function randomVelocity(s){
		var vx = s*(2*Math.round(Math.random())-1);
		var vy = s*(2*Math.round(Math.random())-1);
		return {x: vx, y: vy};
	}
	
	function setBall(speed){
		ball.x = (action.stageWidth - ball.width)/2;
		ball.y = (action.stageHeight - ball.height)/2;
		ball.vel = randomVelocity(speed);
	}
	
	function reset(){
		setBall(speed);
		player.y = (action.stageHeight - player.height)/2;
		computer.y = (action.stageHeight - computer.height)/2;
	}
	
	function addScore(forPlayer){
		if(forPlayer) playerScore++;
		else compScore++;
		score.text = playerScore+" | "+compScore;
		score.x = (action.stageWidth - score.width)/2;
	}

	function onKeyDown(ke){
		if(ke.which === action.keyboard.W || ke.which === action.keyboard.UP) _w = true;
		if(ke.which === action.keyboard.S || ke.which === action.keyboard.DOWN) _s = true;
	}

	function onKeyUp(ke){
		if(ke.which === action.keyboard.W || ke.which === action.keyboard.UP) _w = false;
		if(ke.which === action.keyboard.S || ke.which === action.keyboard.DOWN) _s = false;
	}
	
	function onEnterFrame(){
		// move the ball
		ball.x += ball.vel.x;
		ball.y += ball.vel.y;
		
		// handle collisions
		if(ball.y <= 0 || ball.y+ball.height >= action.stageHeight) ball.vel.y *= -1;
		if(action.calc.collisionRect(ball, player)) ball.vel.x = speed;
		if(action.calc.collisionRect(ball, computer)) ball.vel.x = -speed;
		
		// handle scoring
		if(ball.x < 0){
			// computer scored
			addScore(false);
			reset();
		} else if(ball.x+ball.width > action.stageWidth){
			// player scored
			addScore(true);
			reset();
		}
		
		// move player
		if(_w && player.y > 0) player.y -= speed;
		if(_s && player.y+player.height < action.stageHeight) player.y += speed;
		
		// move computer
		if(ball.y < computer.y+computer.height/2 && computer.y > 0 && Math.random() < CPULevel) computer.y -= speed;
		else if(ball.y > computer.y+computer.height/2 && computer.y+computer.height < action.stageHeight && Math.random() < CPULevel) computer.y += speed;
	}

})();