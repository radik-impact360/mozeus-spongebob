ig.module('game.entities.game.background')
.requires(
	'impact.entity'
)
.defines(function() {
	Background = ig.Entity.extend({
        
        zIndex:1,
        
        bg:new ig.Image('asset/bg-gameplay.png'),
        arrayCloudImage:[
            {image:new ig.Image('media/graphics/game/cloud/cloud-0.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-1.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-2.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-3.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-4.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-5.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-6.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-7.png')},
            {image:new ig.Image('media/graphics/game/cloud/cloud-8.png')}
        ],
		
		init:function(x,y,settings){
            this.parent(x,y,settings);
            this.arrayCloud = [];
            for (var index = 0; index < this.arrayCloudImage.length; index++) {
                var cloud = this.arrayCloudImage[index];
                cloud['x'] = Math.random() * ig.system.width;
                cloud['y'] = Math.random() * (ig.system.height * 0.5 - 100) + 30;
                cloud['speed'] = Math.random() + 0.5;
            }
        },

        draw:function(){
            this.parent();
            this.drawBG();
            // this.drawCloud();
        },

        drawCloud:function(){
            for (var index = 0; index < this.arrayCloudImage.length; index++) {
                var cloud = this.arrayCloudImage[index];
                cloud.image.draw(cloud.x, cloud.y);
                cloud.x += cloud.speed;
                if (cloud.x > ig.system.width) cloud.x = -cloud.image.width;
            }
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