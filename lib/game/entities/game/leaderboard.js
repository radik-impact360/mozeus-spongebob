ig.module('game.entities.game.leaderboard')
.requires(
	'impact.entity'
)
.defines(function() {
	LeaderBoard = ig.Entity.extend({
        
        bg:new ig.Image('media/graphics/game/bg-panel.jpg'),
        
        zIndex:1000,
        visible:true,
        index:0,
        control:null,

		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.control = settings.control;
            // if (_LEADERBOARDAPI) {
            //     MarketJSPlatformLeaderboardAPI.show();
            // }
        },

        draw:function(){
            if (!this.visible) return;
            this.parent();
            
            var context = ig.system.context;
            context.save();
            this.bg.draw(this.pos.x, this.pos.y);
            context.restore();
        },

	});
});