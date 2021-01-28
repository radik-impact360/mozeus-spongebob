ig.module('game.avoidx.entity-bg')
.requires(
	'impact.entity'
)
.defines(function() {
	EntityBG = ig.Entity.extend({

    	init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.marginBox = settings.marginBox;
            this.marginWidth = settings.marginWidth;
		},

		draw:function(){
            this.drawBGGUI();
        },
        
        marginBox:20,
        marginWidth:200,
		drawBGGUI:function(){
			var ctx = ig.system.context;
            ctx.save();
            
            var startX = this.marginBox;
            var startY = this.marginBox;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(startX, startY, this.marginWidth, 300);

			ctx.restore();
		},
		
	});
});
