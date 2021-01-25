ig.module('game.entities.game.tips')
.requires(
	'impact.entity'
)
.defines(function() {
	Tips = ig.Entity.extend({
        
        bg:new ig.Image('media/graphics/game/tips.png'),
        arrayImage:[
            new ig.Image('media/graphics/game/tip/object-0.png'),
            new ig.Image('media/graphics/game/tip/object-1.png'),
            new ig.Image('media/graphics/game/tip/object-2.png'),
            new ig.Image('media/graphics/game/tip/object-3.png'),
            new ig.Image('media/graphics/game/tip/object-4.png'),
            new ig.Image('media/graphics/game/tip/object-5.png'),
            new ig.Image('media/graphics/game/tip/object-6.png'),
            new ig.Image('media/graphics/game/tip/object-7.png'),
            new ig.Image('media/graphics/game/tip/object-8.png'),
            new ig.Image('media/graphics/game/tip/object-9.png'),
            new ig.Image('media/graphics/game/lose-tip.png')
        ],
        
        zIndex:1000,
        visible:true,
        index:0,
        control:null,

		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.control = settings.control;
        },

        draw:function(){
            if (!this.visible) return;
            this.parent();
            
            var context = ig.system.context;
            var image = this.arrayImage[this.index];

            context.save();
            context.globalAlpha = this.control.alphaContamination;
            
            // if (!this.control.isEnd) this.bg.draw(this.pos.x, this.pos.y);
            // this.bg.draw(this.pos.x, this.pos.y);

            image.draw(0, 0);
            context.restore();
        },

	});
});