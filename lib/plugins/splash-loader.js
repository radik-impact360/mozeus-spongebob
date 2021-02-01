ig.module('plugins.splash-loader')
.requires(
    'impact.loader',
    'impact.animation'
)
.defines(function() {
    ig.SplashLoader = ig.Loader.extend({
        tapToStartDivId: "tap-to-start", 
        
        splashDesktop: new ig.Image('bg.png'),
        splashMobile: new ig.Image('bg.png'),
        
        init:function(gameClass,resources){

            this.parent(gameClass,resources);
        },

        end:function(){
            this.parent();
            this._drawStatus = 1;
            this.draw();

            ig.system.setGame(MyGame);
            return;
            
            if (_ENDDIRECTLY) ig.system.setGame(MyGame);
            else this.tapToStartDiv();

            // CLEAR CUSTOM ANIMATION TIMER
            // window.clearInterval(ig.loadingScreen.animationTimer);
        },
        
        tapToStartDiv:function( onClickCallbackFunction ){
            this.desktopCoverDIV = document.getElementById(this.tapToStartDivId);
            
            // singleton pattern
            if ( this.desktopCoverDIV ) {
                return;
            }
            
            /* create DIV */
            this.desktopCoverDIV = document.createElement("div");
            this.desktopCoverDIV.id = this.tapToStartDivId;
            this.desktopCoverDIV.setAttribute("class", "play");
            this.desktopCoverDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
            this.desktopCoverDIV.innerHTML = "<div style='color:white;background-color: rgba(255, 255, 255, 0.3); border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: spongeboy;'>" + _STRINGS["Splash"]["TapToStart"] + "</div></div>";
            
            /* inject DIV */
            var parentDIV = document.getElementById("play").parentNode || document.getElementById("ajaxbar");
            parentDIV.appendChild(this.desktopCoverDIV);
            
            /* reize DIV */
            try {
                if ( typeof (ig.sizeHandler) !== "undefined" ) {
                    if ( typeof (ig.sizeHandler.coreDivsToResize) !== "undefined" ) {
                        ig.sizeHandler.coreDivsToResize.push( ("#"+this.tapToStartDivId) );
                        if ( typeof (ig.sizeHandler.reorient) === "function" ) {
                            ig.sizeHandler.reorient();
                        }
                    }
                }
                else if ( typeof (coreDivsToResize) !== "undefined" ) {
                    coreDivsToResize.push(this.tapToStartDivId);
                    if ( typeof (sizeHandler) === "function" ) {
                        sizeHandler();
                    }
                }
            } catch (error) {
                console.log(error);
            }
            
            
            /* click DIV */
            this.desktopCoverDIV.addEventListener("click", function(){
            
                /* play audio */
                try {
                    
                    if ( typeof (ig.soundHandler) !== "undefined" ) {
                        
                        /* resume audio context */
                        if ( typeof ( ig.soundHandler.bgmPlayer ) !== "undefined" ) {
                            if ( typeof ( ig.soundHandler.bgmPlayer.webaudio ) !== "undefined" ) {
                                if ( typeof ( ig.soundHandler.bgmPlayer.webaudio.context ) !== "undefined" ) {
                                    ig.soundHandler.bgmPlayer.webaudio.context.resume();
                                }
                            }
                        }
                        else {
                            /* re-instantiate sound handler */
                            ig.soundHandler = null;
                            if ( typeof (ig.soundList) !== "undefined" ) {
                                ig.soundHandler = new ig.SoundHandler( ig.soundList );
                            }
                            else {
                                ig.soundHandler = new ig.SoundHandler();
                            }
                        }
                        
                        /* play static audio */
                        if ( typeof ( ig.soundHandler.sfxPlayer ) !== "undefined" ) {
                            if ( typeof ( ig.soundHandler.sfxPlayer.play ) === "function" ) {
                                ig.soundHandler.sfxPlayer.play("staticSound");
                            }
                        }
                
                        else if ( typeof ( ig.soundHandler.staticSound ) !== "undefined" ) {
                            if ( typeof ( ig.soundHandler.staticSound.play ) === "function" ) {
                                ig.soundHandler.staticSound.play();
                            }
                        }
            
                        else if ( typeof ( ig.soundHandler.playSound ) === "function" ) {
                            ig.soundHandler.playSound("staticSound");
                        }
                    }
            
                    else if ( typeof (Howl) !== "undefined" ) {
                        ig.global.staticSound = new Howl({src:['media/audio/play/static.ogg','media/audio/play/static.mp3']});
                        ig.global.staticSound.play();
                    }
            
                    else if ( typeof ( createjs ) !== "undefined" ) {
                        if ( typeof ( createjs.Sound ) !== "undefined" && typeof ( createjs.Sound.play ) === "function" ) {
                            createjs.Sound.play('opening');
                        }
                    }
            
                } catch (error) {
                    console.log(error);
                }
            
                /* hide DIV */
                this.setAttribute("style", "visibility: hidden;");
            
                /* end function */
                if ( typeof (onClickCallbackFunction) === "function" ) {
                    onClickCallbackFunction();
                }
            
                /* play game */
                ig.system.setGame(MyGame);
            });
        },
        
        drawCheck: 0,
        draw: function() {

            this._drawStatus += (this.status - this._drawStatus)/5;
            
            //Check the game screen. see if the font are loaded first. Removing the two lines below is safe :)
            if(this.drawCheck === 1) console.log('Font should be loaded before loader draw loop');
            if(this.drawCheck < 2) this.drawCheck ++;
            

            // CLEAR RECTANGLE
            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect( 0, 0, ig.system.width, ig.system.height );

            var s = ig.system.scale;

            // DIMENSIONS OF LOADING BAR
            var w,h,x,y;
            if(ig.ua.mobile){
                // CUSTOM POSITIONS (TRIAL & ERROR)
                w = ig.system.width * 0.75;
                h = 50;
                x = ig.system.width * 0.5-w/2;
                y = ig.system.height * 0.67;
                this.splashMobile.draw(0,0);
            }else{
                // CUSTOM POSITIONS (TRIAL & ERROR)
                w = ig.system.width * 0.75;
                h = 50;
                x = ig.system.width * 0.5-w/2;
                y = ig.system.height * 0.67;
                this.splashDesktop.draw(0,0);
            }

            var barY = 225;
            var textY = 275;

            // DRAW LOADING BAR
            ig.system.context.fillStyle = '#fff';
            ig.system.context.fillRect( x*s, y*s - barY, w*s, h*s );

            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect( x*s+s, y*s+s - barY, w*s-s-s, h*s-s-s );

            ig.system.context.fillStyle = '#FFFFFF'; // COLOR
            ig.system.context.fillRect( x*s, y*s - barY, w*s*this._drawStatus, h*s );
            
            // // DRAW LOADING TEXT
            var text = _STRINGS.Splash["Loading"];
            var xpos,ypos;

            if(ig.ua.mobile){    // MOBILE
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
                ypos = y*s+18 - textY;
            }else{                // DESKTOP
                xpos = ig.system.width/2 - ig.system.context.measureText(text).width/2;
                ypos = y*s+18 - textY;
            }

            ig.system.context.font = "bold 100px spongeboy";
            ig.system.context.fillStyle = '#FFFFFF';
            ig.system.context.fillText(text, xpos, ypos - 50 );
        }
    });
});
