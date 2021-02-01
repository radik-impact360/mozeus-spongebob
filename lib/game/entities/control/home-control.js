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
		mascott:new ig.Image('asset/tutorial.png'),

		buttonStartImage:new ig.Image('asset/click-to-play.png'),
		buttonBGMOnImage:new ig.Image('media/graphics/game/gui/bgm-on.png'),
		buttonBGMOffImage:new ig.Image('media/graphics/game/gui/bgm-off.png'),
		buttonSFXOnImage:new ig.Image('media/graphics/game/gui/sfx-on.png'),
		buttonSFXOffImage:new ig.Image('media/graphics/game/gui/sfx-off.png'),
		
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
			var bgmStatus = this.buttonBGMOnImage;
			var sfxStatus = this.buttonSFXOnImage;
			if (ig.game.load('bgmVolume') == 0) bgmStatus = this.buttonBGMOffImage;
			if (ig.game.load('sfxVolume') == 0) sfxStatus = this.buttonSFXOffImage;

			this.posTitle = {
				x:ig.system.width* 0.5 - 25,
				y:350
			};
			this.posMascott = {
				x:ig.system.width + this.mascott.width,
				y:ig.system.height * 0.75
			};
			this.buttonStart = ig.game.spawnEntity(
				EntityButton,
				-this.buttonStartImage.width, ig.system.height - this.buttonStartImage.height - 20,
				{
					bg:this.buttonStartImage,
					cbClicked:this.startButtonClicked.bind(this),
					isBlinking:true
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
			this.tween( {scaleTitle:1 }, 0.7, { easing : ig.Tween.Easing.Back.EaseOut }).start();
			this.tween( {posMascott:{x:ig.system.width} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
			this.tween( {buttonStart:{pos:{x:buttonStartX}} }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut, delay:0.5 }).start();
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
							ig.soundHandler.sfxPlayer.volume(ig.game.load('sfxVolume') * 0.75);
						} else {
							this.buttonSFX.bg = this.buttonSFXOnImage;
							ig.game.save('sfxVolume', 0.5);
							ig.soundHandler.sfxPlayer.volume(ig.game.load('sfxVolume') * 0.75);
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
			this.drawTitle();
			this.drawMascott();
		},

		drawBG:function(){
			this.bg.draw(0, 0);
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

	});
});