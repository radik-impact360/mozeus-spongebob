ig.module('game.entities.buttons.button')
.requires(
	'impact.entity',
	'plugins.data.vector'
)
.defines(function() {
	EntityButton = ig.Entity.extend({

		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		size:new Vector2(48,48),
		fillColor:null,
		zIndex:95000,
		bg:null,
		cbClicked:null,
		cbClicking:null,
		cbReleased:null,
		isBlinking:false,
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.bg = settings.bg;
			this.cbClicked = settings.cbClicked;
			this.cbClicking = settings.cbClicking;
			this.cbReleased = settings.cbReleased;
			this.isBlinking = settings.isBlinking;

			this.size = new Vector2(this.bg.width, this.bg.height);
			
			if(!ig.global.wm)
			{
				if(!isNaN(settings.zIndex))
				{
					this.zIndex=settings.zIndex;
				}
			}

			//Pick a random color
			var r=Math.floor(Math.random()*256);
			var g=Math.floor(Math.random()*256);
			var b=Math.floor(Math.random()*256);
			var a=1;
			this.fillColor = "rgba("+r+","+b+","+g+","+a+")";
		},
		
		update:function(){
			this.parent();
			if (this.scaleCounter < 1) {
				this.scaleCounter += this.scaleFactor;
				if (this.scaleCounter > 1) this.scaleCounter = 1;
			}
			if (this.isBlinking) {
				this.alphaCounter += this.alphaFactor;
				if(this.alphaCounter > 1){
					this.alphaCounter = 1;
					this.alphaFactor = Math.abs(this.alphaFactor) * -1;
				} else if(this.alphaCounter < 0){
					this.alphaCounter = 0;
					this.alphaFactor = Math.abs(this.alphaFactor) * 1;
				}
			}
		},

		scaleCounter:1,
		scaleFactor:0.01,
		alphaCounter:1,
		alphaFactor:-0.05,
        draw:function(){
            this.parent();
            var context = ig.system.context;
			context.save();
			context.globalAlpha = this.alphaCounter;
			context.translate(this.pos.x + this.bg.width * 0.5, this.pos.y + this.bg.height * 0.5);
			context.scale(this.scaleCounter, this.scaleCounter);
            this.bg.draw(this.bg.width * -0.5, this.bg.height * -0.5);
            context.restore();
		},
		
		clicked:function(){
			this.scaleCounter = 0.9;
			// console.log('Clicked');
			ig.soundHandler.sfxPlayer.play("winSound");
			if (this.cbClicked) this.cbClicked();
		},
		clicking:function(){
			// console.log('Clicking');
			if (this.cbClicking) this.cbClicking();
		},
		released:function(){
			// console.log('Released');
			if (this.cbReleased) this.cbReleased();
		},
		
		
		
	});
});