ig.module('game.avoidx.entity-player')
.requires(
	'impact.entity',
	'game.avoidx.emitter'
)
.defines(function() {
	EntityPlayer = ig.Entity.extend({

		gravityFactor:0,
		image:new ig.Image('media/graphics/game/avoidx-player.png'),
		zIndex:100,

		emitterMax:10,
		emitterCounter:10,
		speedY:5,
		blinkingCounter:0,
		alphaFactor:0.1,
		alphaCounter:1,
		control:null,
		visible:true,
		
    	init: function( x, y, settings ) {
			this.parent( x, y, settings );
			if (settings.control) this.control = settings.control;
		},

		update:function(){
			this.parent();
			// this.emitterPlayer();
			this.updateBlinking();
			this.updateCollision();
		},

		updateCollision:function(){
			for (var index = 0; index < this.control.arrayEnemy.length; index++) {
				var enemy = this.control.arrayEnemy[index];
				if (enemy.status == 'hit') continue;
				if (enemy.pos.y < this.pos.y
					&& (Math.abs(this.pos.x - enemy.pos.x) < 75)
					&& (Math.abs((this.pos.y - this.image.height * 0.5 + 75) - enemy.pos.y) < 50)
					){
					this.doCollision(enemy);
					enemy.status = 'hit';
					return;
				}

			}
		},

		doCollision:function(enemy){
			if (enemy.isContaminator) {
				if (this.blinkingCounter > 0) return;
				this.control.reduceHP(true, enemy.index);
				this.blinkingCounter = 100;
				ig.soundHandler.sfxPlayer.play("loseSound");
			} else {
				ig.game.currentScore++;
				ig.game.collectedObject[enemy.index]['amount']++;
				ig.soundHandler.sfxPlayer.play("winSound");
			}
		},

		alphaMin:0.1,
		alphaMax:1,
		updateBlinking:function(){
			if (this.blinkingCounter <= 0) return;
			this.blinkingCounter--;
			this.alphaCounter += this.alphaFactor;
			if (this.alphaCounter > this.alphaMax) {
				this.alphaCounter = this.alphaMax;
				this.alphaFactor = Math.abs(this.alphaFactor) * -1;
			} else if (this.alphaCounter < this.alphaMin) {
				this.alphaCounter = this.alphaMin;
				this.alphaFactor = Math.abs(this.alphaFactor) * 1;
			}
		},

		emitterPlayer:function(){
			if (this.emitterCounter > 0) {
				this.emitterCounter--;
				if (this.emitterCounter == 0) {
					this.emitterCounter = this.emitterMax;
					ig.game.spawnEntity(EntityEmitter, 
						this.pos.x, this.pos.y, 
						{
							image:this.image,
							speedY:this.speedY
						}
					);
				}
			}
		},

		draw:function(){
			if (!this.visible) return;
			this.parent();
			var context = ig.system.context;
			context.save();
			context.globalAlpha = this.alphaCounter;
			context.translate(this.pos.x, this.pos.y);
			this.image.draw(-this.image.width * 0.5, -this.image.height * 0.5);
			context.restore();
        },
        
	});
});
