ig.module('game.avoidx.entity-heart')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityHeart = ig.Entity.extend({

		gravityFactor:0,
		image:null,
        zIndex:100,
        image:new ig.Image('heart.png'),
        visible:true,

    	init: function( x, y, settings ) {
            this.parent( x, y, settings );
		},

		draw:function(){
            if (!this.visible) return;
            this.parent();
            var context = ig.system.context;
            context.save();
            context.translate(this.pos.x, this.pos.y);
            this.image.draw(this.image.width * -0.5, this.image.height * -0.5);
            context.restore();
        },
        
	});
});
