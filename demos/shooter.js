/*
 * shooter.js
 *
 * Action.JS demo
 *
 * Eric Schmidt 2013
 * www.eschmidt.co
 */

(function(action){
	
	// keypress variables
	var _up = false;
	var _down = false;
	var _shoot = false;
	
	// the background & HUD
	var bg;
	var hudText;
	var scoreText;
	
	// game objects
	var player;
	var playerBullets = [];
	var enemies = [];
	var enemyBullets = [];
	
	// numerical variables
	var deathTimeout = 3000;
	var speed = 4;
	var bulletSpeed = 7;
	var reloadTime = 16;
	var reloadCounter = reloadTime;
	var shootTimeout = 3000;
	var waveMultiplier = 3;
	var currentWave = 0;
	var kills = 0;
	var missed = 0;
	var health = 100;
	var lives = 4;
	var score = 0;
	
	// create the player (I could wrap the functions in a class, but there's only one instance so I'll put them right on the player object)
	player = new action.Animation("assets/shooter/player_sprite.png", 76, 59);
	player.dead = false;
	player.load(function(){ player.stop(); });
	player.destroy = function(){
		player.play(true);
		player.dead = true;
		setTimeout(function(){ player.stop(); player.dead = false; }, deathTimeout);
		lives--;
		health = 100;
	};
	player.hit = function(){
		player.play(false);
		health -= 2+Math.round(waveMultiplier*waveMultiplier*waveMultiplier/currentWave);
	};
	player.center = {x: 76, y: 30};
	
	// create the 'Bullet' class, a sub-class of Rectangle
	var Bullet = action.util.extend(action.Rectangle, function(speed, type){
		var _this = this;
		this.width = 5;
		this.height = 5;
		this.center = {x: 5, y: 5};
		this.fill = type == "player" ? "#FFFF00" : "#AA0000";
		this.speed = speed;
		this.destroy = function(){
			action.undisplay(_this);
			if(type === "player"){
				action.util.arrayRemove(playerBullets, _this);
			} else if(type === "enemy"){
				action.util.arrayRemove(enemyBullets, _this);
			}
			action.removeEventListener(action.events.ENTER_FRAME, _onEnterFrame);
		};
		function _onEnterFrame(){
			_this.x = type === "player" ? _this.x+_this.speed : _this.x-_this.speed;
			if(_this.x > action.stageWidth || _this.x < 0) _this.destroy();
		}
		action.addEventListener(action.events.ENTER_FRAME, _onEnterFrame);
	});
	
	// create the 'Enemy' class
	var Enemy = action.util.extend(action.Image, function(speed){
		var _this = this;
		this.src = "assets/shooter/enemy_ship.png";
		this.center.y = 30;
		this.speed = speed;
		var _dead = false;
		this.destroy = function(){
			action.undisplay(_this);
			action.util.arrayRemove(enemies, _this);
			action.removeEventListener(action.events.ENTER_FRAME, _onEnterFrame);
			_dead = true;
		};
		function _shoot(){
			var b = new Bullet(bulletSpeed, "enemy");
			b.x = _this.x;
			b.y = _this.y;
			enemyBullets.push(b);
			action.display(b);
		}
		function _repeatShoot(){
			setTimeout(function(){
				if(!_dead){
					_shoot();
					_repeatShoot();
				}
			}, shootTimeout+Math.ceil(Math.random()*2000));
		}
		_repeatShoot();
		function _onEnterFrame(){
			_this.x -= _this.speed;
			if(!player.dead && action.calc.collisionRect(_this, player)){
				explosion(_this.x, _this.y);
				_this.destroy();
				player.destroy();
				kills++;
			}
			for(var i=0;i<playerBullets.length;i++){
				if(action.calc.collisionRect(_this, playerBullets[i])){
					explosion(_this.x, _this.y);
					_this.destroy();
					playerBullets[i].destroy();
					kills++;
				}
			}
			if(_this.x+_this.width < 0){
				_this.destroy();
				missed++;
			}
		}
		action.addEventListener(action.events.ENTER_FRAME, _onEnterFrame);
	});
	
	// the 'Explosion' class
	var Explosion = action.util.extend(action.Animation, function(x, y){
		var _this = this;
		this.width = 64;
		this.height = 64;
		this.center = {x: 32, y: 32};
		this.x = x;
		this.y = y;
		this.src = "assets/shooter/explosion.png";
		this.load(function(){ _this.play(false); });
		this.destroy = function(){
			action.undisplay(_this);
			action.removeEventListener(action.events.ENTER_FRAME, _onEnterFrame);
		};
		function _onEnterFrame(){
			if(!_this.playing) _this.destroy();
		}
		action.addEventListener(action.events.ENTER_FRAME, _onEnterFrame);
	});
	
	// the main function
	action.main = function(){
		
		// create log and stage, set title
		action.createLog();
		action.createStage(0, 0, 1024, 768);
		action.title("Shooter Demo | Action.JS");
		
		// create the background image
		bg = new action.Image("assets/shooter/space_bg.jpg");
		action.display(bg);
		
		// set up & display the player
		player.x = 85;
		player.y = action.stageHeight/2;
		action.display(player);
		
		// create the HUD text
		hudText = new action.Text("16pt Arial", "HUD", "#FFFFFF");
		hudText.x = 4;
		hudText.y = 20;
		action.display(hudText);
		
		// create the text box for the overall score
		scoreText = new action.Text("bold 24pt Arial", "SCORE", "#AAAA00");
		scoreText.x = action.stageWidth - scoreText.width - 4;
		scoreText.y = 28;
		action.display(scoreText);
		
		// add event listeners
		action.addEventListener(action.events.KEY_DOWN, onKeyDown);
		action.addEventListener(action.events.KEY_UP, onKeyUp);
		action.addEventListener(action.events.ENTER_FRAME, onEnterFrame);
		
		// set fps and go!
		action.fps = 40;
		
		action.log("Running!");
		
	};
	
	function onEnterFrame(){
		if(reloadCounter < reloadTime) reloadCounter++;
		if(_up && player.y-player.height/2 > 0) player.y -= speed;
		if(_down && player.y+player.height/2 < action.stageHeight) player.y += speed;
		if(_shoot) shoot();
		for(var i=0;i<enemyBullets.length;i++){
			if(!player.dead && action.calc.collisionRect(player, enemyBullets[i])){
				explosion(player.x, player.y);
				player.hit();
				enemyBullets[i].destroy();
			}
		}
		if(health <= 0) player.destroy();
		displayHUD(currentWave, kills, missed, health, lives, score);
		if(kills + missed === waveMultiplier*currentWave){
			// add to score
			score += Math.max(0, kills - missed);
			// generate a new wave
			currentWave++;
			wave(currentWave);
		}
		if(lives <= 0) gameOver();
	}
	
	function onKeyDown(e){
		if(e.which === action.keyboard.W || e.which === action.keyboard.UP) _up = true;
		if(e.which === action.keyboard.S || e.which === action.keyboard.DOWN) _down = true;
		if(e.which === action.keyboard.M || e.which === action.keyboard.SPACEBAR) _shoot = true;
	}
	
	function onKeyUp(e){
		if(e.which === action.keyboard.W || e.which === action.keyboard.UP) _up = false;
		if(e.which === action.keyboard.S || e.which === action.keyboard.DOWN) _down = false;
		if(e.which === action.keyboard.M || e.which === action.keyboard.SPACEBAR) _shoot = false;
	}
	
	function displayHUD(wave, kills, missed, health, lives, score){
		hudText.text = "Wave: "+wave+" | Kills: "+kills+" | Missed: "+missed+" | Health: "+health+" | Lives: "+lives;
		scoreText.text = "SCORE: "+score;
		scoreText.x = action.stageWidth - scoreText.width - 4;
	}
	
	function shoot(){
		if(reloadCounter === reloadTime){
			reloadCounter = 0;
			var b = new Bullet(bulletSpeed, "player");
			b.x = player.x;
			b.y = player.y;
			playerBullets.push(b);
			action.display(b);
		}
	}
	
	function explosion(x, y){
		action.display(new Explosion(x, y));
	}
	
	// generates the nth wave (which contains waveMultiplier*n enemies)
	function wave(n){
		action.log("Generating wave "+n);
		kills = 0;
		missed = 0;
		n *= waveMultiplier;
		for(var i=0;i<n;i++){
			var e = new Enemy(speed/2-1+Math.random()*2);
			e.x = action.stageWidth + Math.random()*action.stageWidth*n/32;
			e.y = 30 + Math.random()*(action.stageHeight-60);
			enemies.push(e);
			action.display(e);
		}
	}
	
	function gameOver(){
		var text = new action.Text("bold 64pt Arial", "GAME OVER", "#770000");
		text.center = {x: text.width/2, y:32};
		text.x = action.stageWidth/2;
		text.y = action.stageHeight/2;
		action.display(text);
		// remove main event listeners
		action.removeEventListener(action.events.KEY_DOWN, onKeyDown);
		action.removeEventListener(action.events.KEY_UP, onKeyUp);
		action.removeEventListener(action.events.ENTER_FRAME, onEnterFrame);
	}
	
})(action);