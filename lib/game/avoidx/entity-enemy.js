ig.module('game.avoidx.entity-enemy')
.requires(
    'impact.entity',
    'game.avoidx.emitter'
)
.defines(function() {
	EntityEnemy = ig.Entity.extend({

        gravityFactor:0,
        image:null,
        zIndex:100,
        index:0,

        counterRotation:0,
        counterAlpha:1,
        counterScale:1,

        speedY:5,
        speedRotation:5,
        speedAlpha:0.1,
        speedScale:-0.1,
        
		emitterMax:10,
        emitterCounter:10,
        control:null,
        status:'running',
        
        arrayImage:[
            new ig.Image('asset/badges/good-0.png'),
            new ig.Image('asset/badges/good-1.png'),
            new ig.Image('asset/badges/good-2.png'),
            new ig.Image('asset/badges/good-3.png'),
            new ig.Image('asset/badges/good-4.png'),
            new ig.Image('asset/badges/good-5.png'),
            new ig.Image('asset/badges/good-6.png'),
            new ig.Image('asset/badges/good-7.png'),
            new ig.Image('asset/badges/good-8.png'),
            new ig.Image('asset/badges/good-9.png'),
            new ig.Image('asset/badges/good-10.png'),
            new ig.Image('asset/badges/good-11.png'),
            new ig.Image('asset/badges/good-12.png'),
            new ig.Image('asset/badges/good-13.png'),
            new ig.Image('asset/badges/good-14.png'),
            new ig.Image('asset/badges/good-15.png'),
            new ig.Image('asset/badges/good-16.png')
        ],
        
        isContaminator:false,
    	init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.index = Math.floor(Math.random() * this.arrayImage.length);
            this.image = this.arrayImage[this.index];
            this.control = settings.control;
            if (settings.speedY) this.speedY = settings.speedY;
            if(this.index == 0
                || this.index == 3
                || this.index == 5
                || this.index == 7
                || this.index == 9
                ){
                this.isContaminator = true;
            }
        },
        
        update:function(){
            this.parent();
            switch (this.status) {
                case 'running':
                    this.speedY += 0.1;
                    this.pos.y += this.speedY;
                    // this.counterRotation += this.speedRotation;
                    if (this.pos.y > ig.system.height + 150) {
                        var index = this.control.arrayEnemy.indexOf(this);
                        this.control.arrayEnemy.splice(index, 1);
                        if (this.control.status == 'running'
                            && !this.isContaminator
                            ) {
                            // this.control.reduceHP(false, 10);
                        }
                        this.kill();
                        return;
                    }
                    this.spawnEmitter();
                    break;
                case 'hit':
                    this.counterScale += this.speedScale;
                    this.counterAlpha -= this.speedAlpha;
                    if (this.counterAlpha <= 0) {
                        var index = this.control.arrayEnemy.indexOf(this);
                        this.control.arrayEnemy.splice(index, 1);
                        this.kill();
                    }
                    break;
            }
        },

		spawnEmitter:function(){
			if (this.emitterCounter > 0) {
				this.emitterCounter--;
				if (this.emitterCounter == 0) {
					this.emitterCounter = this.emitterMax;
					ig.game.spawnEntity(EntityEmitter, 
						this.pos.x, this.pos.y, 
						{
                            image:this.arrayImage[this.index],
                            speedY:this.speedY,
                            index:this.index,
                            control:this
						}
                    );
                    ig.game.sortEntitiesDeferred();
				}
			}
		},

		draw:function(){
            this.parent();
			var context = ig.system.context;
            context.save();
            context.translate(this.pos.x, this.pos.y);
            context.globalAlpha = this.counterAlpha;
            context.scale(this.counterScale, this.counterScale);
            context.rotate(this.counterRotation * Math.PI / 180);
			this.image.draw(-this.image.width * 0.5, -this.image.height);
			context.restore();
        },
        
	});
});
