ig.module('game.avoidx.emitter')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityEmitter = ig.Entity.extend({

		gravityFactor:0,
		image:null,
        zIndex:10,
        control:null,

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
		
    	init: function( x, y, settings ) {
            this.parent( x, y, settings );
            if (settings.speedY) this.speedY = settings.speedY;
            if (settings.control) this.control = settings.control;
            if (settings.index) this.image = this.arrayImage[settings.index];
		},

        counterRotation:0,
        counterAlpha:1,
        counterScale:1,

        speedY:5,
        speedRotation:5,
        speedAlpha:0.025,
        speedScale:0,
        update:function(){
            this.parent();
            this.pos.y += this.speedY;
            this.counterRotation += this.speedRotation;
            this.counterScale -= this.speedScale;
            this.counterAlpha -= this.speedAlpha;
            if (this.counterAlpha <= 0
                || this.control.status == 'hit'
                ) {
                this.counterAlpha = 0;
                this.kill();
                return;
            }
        },

		draw:function(){
            this.parent();
			var context = ig.system.context;
            context.save();
            context.globalAlpha = this.counterAlpha;
            context.translate(this.pos.x, this.pos.y);
            context.scale(this.counterScale, this.counterScale);
            // context.rotate(this.counterRotation * Math.PI / 180);
			this.image.draw(-this.image.width * 0.5, -this.image.height);
			context.restore();
        },
        
	});
});
