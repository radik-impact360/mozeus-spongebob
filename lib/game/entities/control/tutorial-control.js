ig.module('game.entities.control.tutorial-control')
.requires(
    'impact.entity'
    ,'game.entities.game.background'
    ,'game.entities.game.tutorial'
)
.defines(function() {
	TutorialControl = ig.Entity.extend({
        
		zIndex:1,
		bg:new ig.Image('asset/bg.png'),
		title:new ig.Image('media/graphics/game/gui/tutorial-title.png'),
		star:new ig.Image('media/graphics/game/star.png'),
		confetti:new ig.Image('media/graphics/game/confetti.png'),
        shine:new ig.Image('media/graphics/game/shine.png'),

        pageOnImage:new ig.Image('media/graphics/game/gui/page-on.png'),
        pageOffImage:new ig.Image('media/graphics/game/gui/page-off.png'),
        
        arrayTutorialImage:[
            {image:new ig.Image('media/graphics/game/tutorial-0.png')},
            {image:new ig.Image('media/graphics/game/tutorial-1.png')},
            {image:new ig.Image('media/graphics/game/tutorial-2.png')}
        ],

        buttonBackImage:new ig.Image('media/graphics/game/gui/back-button.png'),
        buttonPlayImage:new ig.Image('media/graphics/game/gui/play-button.png'),
        buttonNextImage:new ig.Image('media/graphics/game/gui/right-button.png'),
        buttonPrevImage:new ig.Image('media/graphics/game/gui/left-button.png'),

        arrayTutorial:[],
        arrayPageOn:[],
        arrayPageOff:[],

		posTitle:null,
		posStar:null,
		posConfetti:null,
		posShine:null,

		scaleTitle:0,
		scaleStar:0,
        scaleConfetti:0,
        
        buttonBack:null,
        buttonPlay:null,
        buttonNext:null,
		buttonPrev:null,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			ig.game.isTutorialShown = true;
			this.posTitle = {
				x:ig.system.width* 0.5,
				y:350
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
			this.tween( {scaleStar:1 }, 0.5, { easing : ig.Tween.Easing.Back.EaseOut }).start();
			this.tween( {scaleConfetti:1 }, 0.6, { easing : ig.Tween.Easing.Back.EaseOut }).start()
            this.tween( {scaleTitle:1 }, 0.7, { easing : ig.Tween.Easing.Back.EaseOut }).start();
            this.buttonBack = ig.game.spawnEntity(
				EntityButton,
				ig.game.margin, ig.game.margin,
				{
					bg:this.buttonBackImage,
					cbClicked:this.backButtonClicked.bind(this)
				}
			);
			this.buttonPlay = ig.game.spawnEntity(
				EntityButton,
				ig.system.width - ig.game.margin - this.buttonPlayImage.width, ig.game.margin,
				{
					bg:this.buttonPlayImage,
					cbClicked:this.playButtonClicked.bind(this)
				}
            );
            this.buttonNext = ig.game.spawnEntity(
				EntityButton,
				ig.system.width - ig.game.margin - this.buttonPrevImage.width, (ig.system.height - this.buttonPrevImage.height) * 0.5,
				{
					bg:this.buttonNextImage,
					cbClicked:this.nextButtonClicked.bind(this)
				}
            );
            this.buttonPrev = ig.game.spawnEntity(
                EntityButton,
                ig.game.margin, (ig.system.height - this.buttonNextImage.height) * 0.5,
				{
					bg:this.buttonPrevImage,
					cbClicked:this.prevButtonClicked.bind(this)
				}
            );
            this.initTutorial();
            this.initPaging();
            ig.game.sortEntitiesDeferred();
        },

        initTutorial:function(){
            var array = this.arrayTutorialImage;
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                var tutorial = ig.game.spawnEntity(Tutorial, index * ig.system.width, 0, {
                    bg:element.image
                });
                this.arrayTutorial.push(tutorial);
            }
        },
        
		isAnimating:false,
        backButtonClicked:function(){
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
		playButtonClicked:function(){
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
        nextButtonClicked:function(){
            if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						this.nextPage();
					}.bind(this)
				})
				.start()
				;
        },
        prevButtonClicked:function(){
            if (this.isAnimating) return;
			this.isAnimating = true;
			this.tween(
				{
					alpha:1
				},
				0.1,
				{ 
					onComplete:function(){
						this.prevPage();
					}.bind(this)
				})
				.start()
				;
        },

        currentTutorial:null,
        nextTutorial:null,
        nextPage:function(){
            var index = (this.currentPage + 1) % this.arrayTutorial.length;
            this.currentTutorial = this.arrayTutorial[this.currentPage];
            this.nextTutorial = this.arrayTutorial[index];
            this.currentTutorial.tween({pos:{x:-ig.system.width}}, 0.2, {
                easing : ig.Tween.Easing.Back.EaseInOut,
                onComplete:function(){
                    this.currentTutorial.pos.x = ig.system.width;
                    this.isAnimating = false;
                    this.currentPage = (this.currentPage + 1) % this.arrayTutorial.length;
                }.bind(this)
            }).start();
            this.nextTutorial.tween({pos:{x:0}}, 0.2, {
                easing : ig.Tween.Easing.Back.EaseInOut
            }).start();
        },

        prevPage:function(){
			var index = ((this.currentPage - 1) + this.arrayTutorial.length) % this.arrayTutorial.length;
            this.currentTutorial = this.arrayTutorial[this.currentPage];
            this.nextTutorial = this.arrayTutorial[index];
            this.currentTutorial.tween({pos:{x:ig.system.width}}, 0.2, {
                easing : ig.Tween.Easing.Back.EaseInOut,
                onComplete:function(){
                    this.currentTutorial.pos.x = -ig.system.width;
                    this.isAnimating = false;
                    this.currentPage = ((this.currentPage - 1) + this.arrayTutorial.length) % this.arrayTutorial.length;
                }.bind(this)
            }).start();
            this.nextTutorial.tween({pos:{x:0}}, 0.2, {
                easing : ig.Tween.Easing.Back.EaseInOut
            }).start();
        },

        currentPage:0,
        initPaging:function(){
            var array = this.arrayTutorialImage;
            var spaceX = 30;
            var startX = (ig.system.width - (array.length * this.pageOnImage.width) - ((array.length - 1) * spaceX)) * 0.5;
            this.arrayPageOff = [];
            this.arrayPageOn = [];
            for (var index = 0; index < array.length; index++) {
                this.arrayPageOff.push({
                    image:new ig.Image('media/graphics/game/gui/page-off.png'),
                    posX:startX + index * this.pageOnImage.width + index * spaceX,
                    posY:ig.system.height - 50
                });
                this.arrayPageOn.push({
                    image:new ig.Image('media/graphics/game/gui/page-on.png'),
                    posX:startX + index * this.pageOnImage.width + index * spaceX,
                    posY:ig.system.height - 50
                });
            }
        },

		draw:function(){
			this.parent();
			this.drawBG();
			this.drawShine();
			this.drawStar();
			this.drawConfetti();
            this.drawTitle();
            this.drawPaging();
        },
        
        drawPaging:function(){
            var array = this.arrayPageOff;
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                element.image.draw(element.posX, element.posY);
            }

            var array = this.arrayPageOn;
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                if (index == this.currentPage) element.image.draw(element.posX, element.posY);
            }
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

		drawShine:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posShine.x, this.posShine.y);
			this.shine.draw(this.shine.width * -0.5, this.shine.height * -0.5);
			context.restore();
		},
        
	});
});