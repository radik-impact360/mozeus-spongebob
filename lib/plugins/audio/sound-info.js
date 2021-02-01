/**
 *  SoundHandler
 *
 *  Created by Justin Ng on 2014-08-19.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('plugins.audio.sound-info')
.requires(
)
.defines(function () {

    SoundInfo = ig.Class.extend({
		FORMATS:{
			OGG:".ogg",
			MP3:".mp3",
		},
        
		/**
		* Define your sounds here
		* 
        */
		sfx:{
			kittyopeningSound:{path:"kittyopening"}
			,staticSound:{path:"static"}
			,openingSound:{path:"opening"}
			,winSound:{path:"win"}
			,loseSound:{path:"lose"}
		},
		
        /**
        * Define your BGM here
        */
		bgm:{
			background:{path:'bgm',startOgg:0,endOgg:76,startMp3:0,endMp3:77}
		}
        
		
    });

});
