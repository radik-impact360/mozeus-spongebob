ig.module('game.entities.game.result')
.requires(
	'impact.entity'
)
.defines(function() {
	Result = ig.Entity.extend({
        
        bg:new ig.Image('asset/bg.png'),
        title:new ig.Image('asset/title.png'),
        
        zIndex:1000,
        visible:true,
        index:0,
        control:null,

        posTitle:null,
        scaleTitle:0,
        
		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.control = settings.control;
            
			this.posTitle = {
				x:ig.system.width* 0.5 - 25,
				y:350
            };
            
            this.tween( {scaleTitle:1 }, 0.7, { easing : ig.Tween.Easing.Back.EaseOut }).start();
            
            window.setTimeout(function () {
                ig.game.director.loadLevel(5);
            }.bind(this), 3000);
        },

        draw:function(){
            if (!this.visible) return;
            this.parent();
            
            this.drawBG();
            this.drawTitle();
        },

        drawBG:function(){
            var context = ig.system.context;
            context.save();
            this.bg.draw(this.pos.x, this.pos.y);
            context.restore();

            var ctx = ig.system.context;
            ctx.save();
            
            var startX = 100;
            var startY = 750;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(startX, startY, ig.system.width - startX * 2, 350);

            startY += 150;
            var fontSize = 120;
            ctx.textAlign = "center";
            ctx.fillStyle = "#fc5000";
            ctx.font = fontSize + "px spongeboy";
            ctx.fillText('YOU ARE A', ig.system.width * 0.5, startY);
            ctx.fillText('STARFISH!', ig.system.width * 0.5, startY + 150);

            var startX = 100;
            var startY = 1200;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(startX, startY, ig.system.width - startX * 2, 200);

            startY += 125;
            var fontSize = 60;
            ctx.textAlign = "center";
            ctx.fillStyle = "#fc5000";
            ctx.font = fontSize + "px spongeboy";
            ctx.fillText('SCORE: ' + ig.game.currentScore, ig.system.width * 0.5, startY);

            ctx.restore();
        },

		drawTitle:function(){
			var context = ig.system.context;
			context.save();
			context.translate(this.posTitle.x, this.posTitle.y);
			context.scale(this.scaleTitle, this.scaleTitle);
            this.title.draw(this.title.width * -0.5, this.title.height * -0.5);
            context.restore();
		},


	});
});