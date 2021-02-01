ig.module('game.entities.game.tips')
.requires(
	'impact.entity'
)
.defines(function() {
	Tips = ig.Entity.extend({
        
        arrayImage:[
            new ig.Image('asset/lose-tip.png')
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
            
            image.draw(0, 0);
            context.restore();
        },

	});
});