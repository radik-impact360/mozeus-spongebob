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
            
            var startX = this.marginBox + 550;
            var startY = 10;
            ctx.fillStyle = "#fc5000";
            ctx.fillRect(startX, startY, this.marginWidth, 350);

            var startX = this.marginBox + 550;
            var startY = this.marginBox + 100;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(startX, startY, this.marginWidth, 350);

			ctx.restore();
		},
		
	});
});
