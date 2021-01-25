ig.module('game.entities.game.tutorial')
.requires(
	'impact.entity'
)
.defines(function() {
	Tutorial = ig.Entity.extend({
        
        zIndex:1000,
        bg:null,
		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.bg = settings.bg;
        },

        draw:function(){
            this.parent();
            this.bg.draw(this.pos.x, this.pos.y);
        },

	});
});