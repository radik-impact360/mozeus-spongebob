ig.module('game.avoidx.game-avoidx')
.requires(
	'impact.entity'
	,'game.avoidx.entity-player'
	,'game.avoidx.entity-enemy'
	,'game.avoidx.emitter'
	,'game.avoidx.entity-heart'
	,'game.avoidx.entity-blank'
	,'game.entities.buttons.button'
	,'game.entities.game.tips'
)
.defines(function() {
	EntityGameAvoidX = ig.Entity.extend({
		
		heart:new ig.Image('media/graphics/game/heart.png'),
		buttonHomeImage:new ig.Image('media/graphics/game/gui/button-home.png'),
		buttonLeaderboardImage:new ig.Image('media/graphics/game/gui/button-leaderboard.png'),
		
		arrayHeart:[],
		arrayBlank:[],
		status:'tutorial',
		player:null,
		enemyMax:60,
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
		contaminationDuration:100,
		alphaContamination:0,
		isEnd:false,
		isAnimating:false,
		buttonHome:null,
		buttonLeaderboard:null,
		tips:null,
		endCounter:10,

		before:{
			x:-1,
			y:-1,
		},
		
    	init: function( x, y, settings ) {
			ig.game.currentScore = 0;
			this.parent( x, y, settings );
			this.bg = ig.game.spawnEntity(Background, 0, 0);
			this.resetTimer();
			this.player = ig.game.spawnEntity(
				EntityPlayer, 
				ig.system.width * 0.5, ig.system.height + 200,
				{
					control:this
				}
			);
			this.buttonLeaderboard = ig.game.spawnEntity(
				EntityButton,
				ig.game.margin, ig.system.height,
				{
					bg:this.buttonLeaderboardImage,
					cbClicked:this.leaderBoardButtonClicked.bind(this)
				}
			);
			this.buttonHome = ig.game.spawnEntity(
				EntityButton,
				ig.game.margin * 2 + this.buttonLeaderboardImage.width, ig.system.height,
				{
					bg:this.buttonHomeImage,
					cbClicked:this.homeButtonClicked.bind(this)
				}
			);
			this.tips = ig.game.spawnEntity(Tips, 0, 0,
				{
					control:this
				}
			);
			this.tween( {player:{pos:{y:ig.system.height - 50}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			this.initHeart();
			this.initObject();
		},

		initObject:function(){
			var array = ig.game.collectedObject;
			ga('send', 'event', 'Game', 'GameLoaded');
			for (var index = 0; index < array.length; index++) {
				array[index]['amount'] = 0;
			}
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
						// if (_LEADERBOARDAPI) {
						// 	MarketJSPlatformLeaderboardAPI.show();
						// }
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
			var startY = ig.game.margin + 50;
			ig.soundHandler.sfxPlayer.play("winSound");
			for (var index = 1; index <= this.healthMax; index++) {
				var heart = ig.game.spawnEntity(EntityHeart, 0, 0);
				if (!startX) startX = heart.image.width * 0.5 + 50;
				heart.pos.x = startX;
				heart.pos.y = startY;
				heart.zIndex = 300;
				heart.visible = false;
				this.arrayHeart.push(heart);
				this.alphaHeartCounter.push(0);
				this.alphaHeartMax.push(0);

				var heart = ig.game.spawnEntity(EntityBlank, 0, 0);
				if (!startX) startX = heart.image.width * 0.5 + ig.game.margin;
				heart.pos.x = startX;
				heart.pos.y = startY;
				heart.zIndex = 290;
				this.arrayBlank.push(heart);

				startX += (this.heart.width + 10);
			}
		},

		reduceHP:function(isContaminated, index){
			if (this.status != 'running') return;
			if (this.player.blinkingCounter > 0) return;
			
			this.healthCounter--;
			this.arrayHeart[2 - this.healthCounter].visible = true;
			this.tips.index = index;
			ig.game.collectedObject[index]['amount']++;

			if (this.healthCounter <= 0 || isContaminated) {
				this.status = 'contaminated';
				this.contaminationDuration = 100;
				this.resetTimer();
				this.killEnemyAll();
			}

			if (this.healthCounter > 0) return;

			this.isEnd = true;
			this.player.visible = false;

			//REV PART 2
			// this.tween( {buttonLeaderboard:{pos:{y:(ig.system.height - this.buttonHomeImage.height - ig.game.margin)}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			// this.tween( {buttonHome:{pos:{y:(ig.system.height - this.buttonHomeImage.height - ig.game.margin)}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			
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
			this.updateHeart();
			switch (this.status) {
				case 'contaminated':
					this.contaminationDuration--;
					if (this.alphaContamination < 1) { this.alphaContamination += this.alphaFactor; if (this.alphaContamination > 1) this.alphaContamination = 1; }
					if (ig.game.pointer.isPressed && this.contaminationDuration <= 0) {
						if (this.isEnd) {
							ig.game.director.loadLevel(4);
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
			this.updatePlayer();
			this.detectKeyDown();
		},

		detectKeyDown:function(){
			if (ig.game.pointer.isPressed) {
				console.log('pressed');
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
					Math.random() * (ig.system.width - 100) + 50, 0,
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

		drawAvoided:function(){
			var context = ig.system.context;
			var startX = ig.system.width - 240;
			var staryY = 75;
			context.save();
			context.font = 50 + "px spongeboy";
			context.textAlign = 'right';
			context.fillStyle = '#FFFFFF';
			context.fillText(ig.game.currentScore, startX - 20, staryY);
			context.textAlign = 'left';
			context.fillText("Badges", startX, staryY);
			// context.fillText("Collected", startX, staryY + 40);
			context.restore();
		},

	});
});