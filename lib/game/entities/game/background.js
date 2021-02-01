ig.module('game.entities.game.background')
.requires(
	'impact.entity'
)
.defines(function() {
	Background = ig.Entity.extend({
        
        zIndex:1,
        
        bg:new ig.Image('bg-gameplay.png'),
        
		init:function(x,y,settings){
            this.parent(x,y,settings);
        },

        draw:function(){
            this.parent();
            this.drawBG();
        },
        
        drawBG:function(){
            var ctx = ig.system.context;
            var scale = 720/540;
            ctx.save();
            ctx.scale(scale, scale);
            this.bg.draw(0, 0);
            ctx.restore();
        }
        
	});
});