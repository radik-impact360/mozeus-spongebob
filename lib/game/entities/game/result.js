ig.module('game.entities.game.result')
.requires(
	'impact.entity'
)
.defines(function() {
	Result = ig.Entity.extend({
        
        bg:new ig.Image('media/graphics/game/bg-panel.jpg'),
        
        zIndex:1000,
        visible:true,
        index:0,
        control:null,

		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.control = settings.control;
            this.analyticObject();
            if (ig.game.loginResponse && ig.game.loginResponse.status.code == 200) {
				// if (_LEADERBOARDAPI) {
				// 	MarketJSPlatformLeaderboardAPI.submitScore(_GAME_ID, _GLOBALSCORE, function(response) {
                //         ig.game.director.loadLevel(5);
				// 	});
                // }
                ig.game.director.loadLevel(5);
			} else {
				// if (_LEADERBOARDAPI) {
				// 	MarketJSPlatformLoginAPI.showRegister();
				// }
			}
        },

        analyticObject:function(){
            var array = ig.game.collectedObject;
            ga('send', 'event', 'Game', 'GameCompleted');
            for (var index = 0; index < array.length; index++) {
                if (array[index]['amount'] > 0) {
                    // console.log(array[index]['title'], array[index]['amount']);
                    ga('send', 'event', 'Game', 'SpecialEvent', array[index]['title'], array[index]['amount']);
                }
            }
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