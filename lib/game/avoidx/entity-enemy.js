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
        sizeScale:1.5,
        sizeRect:null,
        
        arrayImage:[
            new ig.Image('asset/good-0.png'), // 0
            new ig.Image('asset/good-1.png'), // 1
            new ig.Image('asset/good-2.png'), // 2
            new ig.Image('asset/good-3.png'), // 3
            new ig.Image('asset/good-4.png'), // 4
            new ig.Image('asset/good-5.png'), // 5
            new ig.Image('asset/good-6.png'), // 6
            new ig.Image('asset/good-15.png') // 7
        ],
        
        isContaminator:false,
    	init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.index = Math.floor(Math.random() * this.arrayImage.length);
            this.image = this.arrayImage[this.index];
            this.control = settings.control;
            this.sizeRect = { x:this.image.width * this.sizeScale, y:this.image.height * this.sizeScale };


            if (this.index == 7) this.sizeRect = { x:this.image.width * this.sizeScale * 0.75, y:this.image.height * this.sizeScale * 0.6 };

            if (settings.speedY) this.speedY = settings.speedY;
            if(this.index == 7){
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
                            //
                        }
                        this.kill();
                        return;
                    }
                    // this.spawnEmitter();
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
                case 'static':
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
			var ctx = ig.system.context;
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.globalAlpha = this.counterAlpha;
            ctx.scale(this.counterScale * this.sizeScale, this.counterScale * this.sizeScale);
            ctx.rotate(this.counterRotation * Math.PI / 180);
            this.image.draw(-this.image.width * 0.5, -this.image.height * 0.5);
            ctx.restore();

            // ctx.save();
            // ctx.translate(this.pos.x, this.pos.y);
            // ctx.scale(1,1);
            // ctx.fillStyle = "#FFFFFF";
            // ctx.globalAlpha = 0.5;
            // ctx.fillRect(-this.sizeRect.x * 0.5, -this.sizeRect.y * 0.5, this.sizeRect.x, this.sizeRect.y);
			// ctx.restore();
        },
        
	});
});
