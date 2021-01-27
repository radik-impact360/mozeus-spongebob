ig.module('game.entities.control.home-control')
.requires(
	'impact.entity'
	,'game.entities.game.background'
	,'game.entities.buttons.button'
)
.defines(function() {
	HomeControl = ig.Entity.extend({
        
		zIndex:1,
		bg:new ig.Image('asset/bg.png'),
		title:new ig.Image('asset/title.png'),
		star:new ig.Image('media/graphics/game/star.png'),
		confetti:new ig.Image('media/graphics/game/confetti.png'),
		mascott:new ig.Image('asset/tutorial.png'),
		logo:new ig.Image('media/graphics/game/logo.png'),
		shine:new ig.Image('media/graphics/game/shine.png'),

		buttonStartImage:new ig.Image('asset/click-to-play.png'),
		buttonTutorialImage:new ig.Image('media/graphics/game/tutorial-button.png'),
		buttonBGMOnImage:new ig.Image('media/graphics/game/gui/bgm-on.png'),
		buttonBGMOffImage:new ig.Image('media/graphics/game/gui/bgm-off.png'),
		buttonSFXOnImage:new ig.Image('media/graphics/game/gui/sfx-on.png'),
		buttonSFXOffImage:new ig.Image('media/graphics/game/gui/sfx-off.png'),
		buttonLeaderBoardImage:new ig.Image('media/graphics/game/gui/button-leader-board.png'),
		buttonLoginImage:new ig.Image('media/graphics/game/gui/button-login.png'),
		
		posTitle:null,
		posStar:null,
		posConfetti:null,
		posMascott:null,
		posLogo:null,
		posShine:null,

		buttonStart:null,
		buttonTutorial:null,
		buttonBGM:null,
		buttonSFX:null,
		buttonLeaderboard:null,
		buttonLogin:null,

		scaleTitle:0,
		scaleStar:0,
		scaleConfetti:0,

		init:function(x,y,settings){
			this.parent(x,y,settings);

			var buttonStartX = (ig.system.width - this.buttonStartImage.width) * 0.5;
			var buttonTutorialX = 45;
			var bgmStatus = this.buttonBGMOnImage;
			var sfxStatus = this.buttonSFXOnImage;
			if (ig.game.load('bgmVolume') == 0) bgmStatus = this.buttonBGMOffImage;
			if (ig.game.load('sfxVolume') == 0) sfxStatus = this.buttonSFXOffImage;

			this.posTitle = {
				x:ig.system.width* 0.5 - 25,
				y:250
			};
			this.posStar = {
				x:ig.system.width* 0.5,
				y:250
			};
			this.posConfetti = {
				x:ig.system.width* 0.5,
				y:250
			};
			this.posShine = {
				x:ig.system.width* 0.5,
				y:250
			};
			this.posMascott = {
				x:ig.system.width + this.mascott.width,
				y:ig.system.height * 0.75
			};
			this.posLogo = {
				x:-this.logo.width,
				y:ig.system.height - 175
			};
			this.buttonStart = ig.game.spawnEntity(
				EntityButton,
				-this.buttonStartImage.width, ig.system.height - this.buttonStartImage.height,
				{
					bg:this.buttonStartImage,
					cbClicked:this.startButtonClicked.bind(this),
					isBlinking:true
				}
			);
			this.buttonTutorial = ig.game.spawnEntity(
				EntityButton,
				-this.buttonTutorialImage.width, ig.system.height - this.buttonTutorialImage.height,
				{
					bg:this.buttonTutorialImage,
					cbClicked:this.tutorialButtonClicked.bind(this)
				}
			);
			this.buttonBGM = ig.game.spawnEntity(
				EntityButton,
				ig.system.width - this.buttonBGMOnImage.width - ig.game.margin, -150,
				{
					bg:bgmStatus,
					cbClicked:this.bgmButtonClicked.bind(this)
				}
			);
			// this.buttonSFX = ig.game.spawnEntity(
			// 	EntityButton,
			// 	ig.system.width - this.buttonBGMOnImage.width - ig.game.margin, -150,
			// 	{
			// 		bg:sfxStatus,
			// 		cbClicked:this.sfxButtonClicked.bind(this)
			// 	}
			// );
			this.buttonLeaderboard = ig.game.spawnEntity(
				EntityButton,
				ig.game.margin, -150,
				{
					bg:this.buttonLeaderBoardImage,
					cbClicked:this.leaderBoardButtonClicked.bind(this)
				}
			);
			// this.buttonLogin = ig.game.spawnEntity(
			// 	EntityButton,
			// 	ig.game.margin * 2 + this.buttonLeaderBoardImage.width, -150,
			// 	{
			// 		bg:this.buttonLoginImage,
			// 		cbClicked:this.loginButtonClicked.bind(this)
			// 	}
			// );
			this.tween( {scaleStar:1 }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut }).start();
			this.tween( {scaleConfetti:1 }, 0.6, { easing : ig.Tween.Easing.Back.EaseOut }).start()
			this.tween( {scaleTitle:1 }, 0.7, { easing : ig.Tween.Easing.Back.EaseOut }).start();
			this.tween( {posMascott:{x:ig.system.width} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			this.tween( {posLogo:{x:50} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			this.tween( {buttonStart:{pos:{x:buttonStartX}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			// this.tween( {buttonTutorial:{pos:{x:buttonTutorialX}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			// this.tween( {buttonBGM:{pos:{y:ig.game.margin}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			// this.tween( {buttonLeaderboard:{pos:{y:ig.game.margin}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();

			// this.tween( {buttonSFX:{pos:{y:ig.game.margin}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			// this.tween( {buttonLogin:{pos:{y:ig.game.margin}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
		},

		isAnimating:false,
		startButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{
					onComplete:function(){
						// if (!ig.game.isTutorialShown) {
						// 	ig.game.director.loadLevel(3);
						// } else {
						// 	ig.game.director.loadLevel(2);
						// }
						ig.game.director.loadLevel(2);
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},

		tutorialButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						ig.game.director.loadLevel(3);
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},
		
		bgmButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						if (ig.soundHandler.bgmPlayer.getVolume() > 0) {
							this.buttonBGM.bg = this.buttonBGMOffImage;
							ig.game.save('bgmVolume', 0);
							ig.soundHandler.bgmPlayer.volume(ig.game.load('bgmVolume'));
						} else {
							this.buttonBGM.bg = this.buttonBGMOnImage;
							ig.game.save('bgmVolume', 0.5);
							ig.soundHandler.bgmPlayer.volume(ig.game.load('bgmVolume'));
						}
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},
		
		sfxButtonClicked:function(){
			if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						if (ig.soundHandler.sfxPlayer.getVolume() > 0) {
							this.buttonSFX.bg = this.buttonSFXOffImage;
							ig.game.save('sfxVolume', 0);
							ig.soundHandler.sfxPlayer.volume(ig.game.load('sfxVolume'));
						} else {
							this.buttonSFX.bg = this.buttonSFXOnImage;
							ig.game.save('sfxVolume', 0.5);
							ig.soundHandler.sfxPlayer.volume(ig.game.load('sfxVolume'));
						}
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
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

		loginButtonClicked:function(){
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
						// 	MarketJSPlatformLoginAPI.showRegister();
						// }
						this.isAnimating = false;
					}.bind(this)
				})
				.start()
				;
		},
		
		draw:function(){
			this.parent();
			this.drawBG();
			// this.drawShine();
			// this.drawStar();
			// this.drawConfetti();
			this.drawTitle();
			this.drawMascott();
			// this.drawLogo();
			// this.drawHighScore();
		},

		drawHighScore:function(){
			var context = ig.system.context;
			context.save();
			context.font = 100 + "px neue";
			context.textAlign = 'left';
			context.fillStyle = '#FFFFFF';
			context.fillText(ig.game.highScore, 110, this.buttonLeaderboard.pos.y + 60);
			context.restore();
		},

		drawBG:function(){
			this.bg.draw(0, 0);
		},

		drawStar:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posStar.x, this.posStar.y);
			context.scale(this.scaleStar, this.scaleStar);
			this.star.draw(this.star.width * -0.5, this.star.height * -0.5);
			context.restore();
		},

		drawConfetti:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posConfetti.x, this.posConfetti.y);
			context.scale(this.scaleConfetti, this.scaleConfetti);
			this.confetti.draw(this.confetti.width * -0.5, this.confetti.height * -0.5);
			context.restore();
		},

		drawTitle:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posTitle.x, this.posTitle.y);
			context.scale(this.scaleTitle, this.scaleTitle);
			this.title.draw(this.title.width * -0.5, this.title.height * -0.5);
			context.restore();
		},

		drawMascott:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posMascott.x, this.posMascott.y);
			this.mascott.draw(-this.mascott.width, -this.mascott.height);
			context.restore();
		},

		drawLogo:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posLogo.x, this.posLogo.y);
			// this.logo.draw(0, -this.logo.height);
			context.restore();
		},

		rotationCounter:0,
		drawShine:function(){
			var context = ig.system.context;
			// this.rotationCounter += 0.01;
			context.save();
			context.translate(this.posShine.x, this.posShine.y);
			context.rotate(this.rotationCounter);
			this.shine.draw(this.shine.width * -0.5, this.shine.height * -0.5);
			context.restore();
		},
        
	});
});