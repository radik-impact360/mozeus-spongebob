ig.module('game.avoidx.game-avoidx')
.requires(
	'impact.entity'
	,'game.avoidx.entity-player'
	,'game.avoidx.entity-enemy'
	,'game.avoidx.emitter'
	,'game.avoidx.entity-heart'
	,'game.avoidx.entity-blank'
	,'game.avoidx.entity-bg'
	,'game.entities.buttons.button'
	,'game.entities.game.tips'
)
.defines(function() {
	EntityGameAvoidX = ig.Entity.extend({
		
		heart:new ig.Image('heart.png'),
		
		arrayHeart:[],
		arrayBlank:[],
		status:'tutorial',
		player:null,
		enemyMax:120,
		enemyCounter:1,
		secondCounter:5,
		secondMax:5,
		healthCounter:3,
		healthMax:3,
		
		alphaTutorial:0,
		alphaCounter:0,
		alphaHeartCounter:[],
		alphaHeartMax:[],
		alphaFactor:0.1,
		arrayEnemy:[],
		zIndex: 10000,

		tutorial321:3,
		contaminationDuration:30,
		alphaContamination:0,
		isEnd:false,
		isAnimating:false,
		tips:null,
		endCounter:10,

		before:{
			x:-1,
			y:-1,
		},
		
		timeRemaining:0,
    	init: function( x, y, settings ) {
			ig.game.currentScore = 0;
			this.parent( x, y, settings );

			this.timeRemaining = gameSetting.time;
			this.bg = ig.game.spawnEntity(Background, 0, 0);
			this.resetTimer();

			this.player = ig.game.spawnEntity(
				EntityPlayer, 
				ig.system.width * 0.5, ig.system.height + 200,
				{
					control:this
				}
			);
			this.tips = ig.game.spawnEntity(Tips, 0, 0,
				{
					control:this
				}
			);
			this.tween( {player:{pos:{y:ig.system.height - 50}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			this.initHeart();
		},

		resetTimer:function(){
			this.secondCounter = this.secondMax = ig.game.maxSecond;
		},

		leaderBoardButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						ig.game.director.loadLevel(5);
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},

		homeButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						ig.game.director.loadLevel(1);
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},

		initHeart:function(){
			this.arrayHeart = [];
			this.arrayBlank = [];
			var startX = null;
			var startY = 400;
			ig.soundHandler.sfxPlayer.play("winSound");
			var bg = ig.game.spawnEntity(EntityBG, 0, 0, {
				marginBox:this.marginBox,
				marginWidth:this.marginWidth
			});
			bg.zIndex = 280;
			for (var index = 1; index <= this.healthMax; index++) {
				var heart = ig.game.spawnEntity(EntityHeart, 0, 0);
				if (!startX) startX = heart.image.width * 0.5 + 625;
				heart.pos.x = startX;
				heart.pos.y = startY;
				heart.zIndex = 290;
				heart.visible = false;
				this.arrayHeart.push(heart);
				this.alphaHeartCounter.push(0);
				this.alphaHeartMax.push(0);

				var heart = ig.game.spawnEntity(EntityBlank, 0, 0);
				if (!startX) startX = heart.image.width * 0.5 + ig.game.margin;
				heart.pos.x = startX;
				heart.pos.y = startY;
				heart.zIndex = 300;
				this.arrayBlank.push(heart);

				startX += (this.heart.width + 10);
			}
			ig.game.sortEntitiesDeferred();
		},

		hasBeenContaminated:false,
		reduceHP:function(isContaminated, index){
			if (this.status != 'running') return;
			// if (this.player.blinkingCounter > 0) return;
			
			this.healthCounter--;
			if (this.healthCounter <= 0) {
				this.resetTimer();
				this.killEnemyAll();
				ig.game.director.loadLevel(3);
			}

			this.arrayHeart[2 - this.healthCounter].visible = true;
			this.tips.index = 0;

			if (this.healthCounter <= 0 || isContaminated) {
				if (!this.hasBeenContaminated) {
					this.hasBeenContaminated = true;
					this.status = 'contaminated';
					this.contaminationDuration = 30;
					// this.resetTimer();
					this.killEnemyAll();
				}
			}

			if (this.healthCounter > 0) return;

			this.isEnd = true;
			this.player.visible = false;

			if (ig.game.currentScore > ig.game.highScore) {
				_GLOBALSCORE = ig.game.highScore = ig.game.currentScore;
				ig.game.save('highScore', ig.game.highScore);
			}
			
			ig.soundHandler.sfxPlayer.play("loseSound");
		},

		updateHeart:function(){
			for (var index = 0; index < this.healthMax; index++) {
				if (this.alphaHeartCounter[index] < this.alphaHeartMax[index]) {
					this.alphaHeartCounter[index] += this.alphaFactor;
					if (this.alphaHeartCounter[index] > this.alphaHeartMax[index]) {
						this.alphaHeartCounter[index] = this.alphaHeartMax[index];
					}
				} else if (this.alphaHeartCounter[index] > this.alphaHeartMax[index]){
					this.alphaHeartCounter[index] -= this.alphaFactor;
					if (this.alphaHeartCounter[index] < this.alphaHeartMax[index]) {
						this.alphaHeartCounter[index] = this.alphaHeartMax[index];
					}
				}
			}
		},

		update:function(){
			this.parent();
			this.updateTimeRemaining();
			this.updateHeart();
			this.detectUpdate();
			this.updatePlayer();
			this.detectKeyDown();
		},

		updateTimeRemaining:function(){
			if (this.status != 'running') return;
			this.timeRemaining -= ig.system.tick;
			if (this.timeRemaining <= 0) {
				this.resetTimer();
				this.killEnemyAll();
				ig.game.director.loadLevel(3);
			}
		},

		detectUpdate:function(){
			switch (this.status) {
				case 'contaminated':
					this.contaminationDuration--;
					if (this.alphaContamination < 1) { this.alphaContamination += this.alphaFactor; if (this.alphaContamination > 1) this.alphaContamination = 1; }
					if (ig.game.pointer.isPressed && this.contaminationDuration <= 0) {
						if (this.isEnd) {
							ig.game.director.loadLevel(3);
						} else {
							this.status = 'running';
						}
					}
					break;
				case 'tutorial':
					if (this.alphaTutorial < 1) { this.alphaTutorial += this.alphaFactor; if (this.alphaTutorial > 1) this.alphaTutorial = 1; }
					break;
				case 'running':
					if (this.alphaContamination > 0) { this.alphaContamination -= this.alphaFactor; if (this.alphaContamination <= 0) this.alphaContamination = 0; }
					if (this.alphaTutorial > 0) { this.alphaTutorial -= this.alphaFactor; if (this.alphaTutorial <= 0) this.alphaTutorial = 0; }
					if (this.alphaCounter < 1) { this.alphaCounter += this.alphaFactor; if (this.alphaCounter > 1) this.alphaCounter = 1; }
					this.updateEnemy();
					this.updateTimer();
					break;
			}
		},

		isReady:true,
		detectKeyDown:function(){
			if (ig.game.pointer.isReleased) {
				this.isReady = true;
			}
			if (!ig.game.pointer.isPressed) return;

			for (var index = 0; index < this.arrayEnemy.length; index++) {
				var enemy = this.arrayEnemy[index];
				if (enemy.status == 'hit') continue;

				var size = 50;
				var p1 = {
					x: ig.game.pointer.pos.x - size * 0.5,
					y: ig.game.pointer.pos.y - size * 0.5,
					width: size,
					height: size
				}
				var p2 = {
					x: enemy.pos.x - enemy.sizeRect.x * 0.5,
					y: enemy.pos.y - enemy.sizeRect.y * 0.5,
					width: enemy.sizeRect.x,
					height: enemy.sizeRect.y
				}
				
				var isCollide = this.aabb(p1, p2);
				var distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
				var limit = enemy.image.width * enemy.sizeScale;
				if (enemy.image.height * enemy.sizeScale > limit) limit = enemy.image.height * enemy.sizeScale;

				// if (distance < limit){
				if (isCollide && this.isReady){
					enemy.status = 'hit';
					this.isReady = false;
					if (enemy.isContaminator) {
						this.reduceHP(true, 10);
						ig.soundHandler.sfxPlayer.play("loseSound");
					} else {
						ig.game.currentScore++;
						ig.soundHandler.sfxPlayer.play("winSound");
					}
					return;
				}
			}
		},

		updateTimer:function(){
			if (this.secondCounter > 0) {
				this.secondCounter -= ig.system.tick;
				if (this.secondCounter <= 0) {
					this.secondCounter = 0;
				}
			}
		},

		updateEnemy:function(){
			if (this.enemyCounter <= 0) return;
			this.enemyCounter--;
			if (this.enemyCounter <= 0) {
				this.enemyCounter = (this.enemyMax - (this.secondMax - this.secondCounter)) * 0.5;
				var enemy = ig.game.spawnEntity(EntityEnemy, 
					Math.random() * (ig.system.width - 100) + 50, -100,
					{
						control:this,
						speedY:gameSetting.basicSpeed + (this.secondMax - this.secondCounter) * gameSetting.accelerationFactor
					}
				);
				this.arrayEnemy.push(enemy);
				ig.game.sortEntitiesDeferred();
			}
		},

		updatePlayer:function(){
			if (this.status == 'contaminated') return;
			if (ig.game.pointer.pos.x < 50) return;
			if (ig.game.pointer.pos.y < 50) return;
			if (ig.game.pointer.pos.x > ig.system.width - 50) return;
			if (ig.game.pointer.pos.y > ig.system.height - 50) return;
			this.player.pos.x = ig.game.pointer.pos.x;
		},

		draw:function(){
			this.parent();
			this.drawAvoided();
			this.drawTutorial();
		},

		drawTutorial:function(){
			if (this.status != 'tutorial') return;
			var context = ig.system.context;
			context.save();
			context.globalAlpha = this.alphaTutorial;
			this.tutorial321 -= ig.system.tick;
			if (this.tutorial321 <= 0) {
				this.status = 'running';
				return;
			}
			var text = Math.ceil(this.tutorial321);
			context.font = 300 + "px spongeboy";
			context.textAlign = 'center';
			context.fillStyle = '#FFFFFF';
			context.fillText(text, ig.system.width * 0.5, ig.system.height * 0.5);
			context.restore();
		},

		killEnemyAll:function(){
			for (var index = 0; index < this.arrayEnemy.length; index++) {
				this.arrayEnemy[index].status = 'hit';
			}
		},

		marginBox:20,
		marginWidth:500,
		drawAvoided:function(){
			var context = ig.system.context;
			var startX = ig.system.width - this.marginWidth * 0.5 - 20;
			var staryY = 80;
			context.save();
			context.font = 50 + "px spongeboy";
			context.fillStyle = '#FFFFFF';
			context.textAlign = 'center';
			context.fillText("Badges " + ig.game.currentScore, startX, staryY);
			context.restore();

			var context = ig.system.context;
			var startX = this.marginBox + this.marginWidth * 0.5 + 550;
			var staryY = 185;

			var minutes = Math.floor(this.timeRemaining / 60);
			var seconds = Math.floor(this.timeRemaining) % 60;
			if ((minutes+"").length < 2) minutes = '0' + minutes;
			if ((seconds+"").length < 2) seconds = '0' + seconds;
			if (minutes == 0) minutes = '00';
			if (seconds == 0) seconds = '00';
			var string = minutes + ":" + seconds;

			context.save();
			context.font = 40 + "px spongeboy";
			context.textAlign = 'center';
			context.fillStyle = '#fc5000';
			context.fillText("Time Remaining", startX, staryY);
			context.font = 80 + "px spongeboy";
			context.fillText(string, startX, staryY + 110);
			context.restore();
		},

		aabb:function(rect1, rect2){
			if (rect1.x < rect2.x + rect2.width &&
				rect1.x + rect1.width > rect2.x &&
				rect1.y < rect2.y + rect2.height &&
				rect1.y + rect1.height > rect2.y) {
				return true;
			 }
			return false;
		},

	});
});
