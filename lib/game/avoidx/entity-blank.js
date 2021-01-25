ig.module('game.avoidx.entity-blank')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityBlank = ig.Entity.extend({

		gravityFactor:0,
		image:null,
        zIndex:100,
        image:new ig.Image('media/graphics/game/life-off.png'),
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
