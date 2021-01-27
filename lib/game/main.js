ig.module(
    'game.main'
)
.requires(
    'impact.game',
    // 'impact.debug.debug',
    //Patches
    'plugins.patches.webkit-image-smoothing-patch',
    'plugins.patches.windowfocus-onMouseDown-patch',
    'plugins.patches.input-patch',
    // PLUGINS
    'plugins.font.font-loader',
    'plugins.handlers.dom-handler',
    'plugins.handlers.size-handler',
    'plugins.handlers.api-handler',
    'plugins.audio.sound-handler',
    'plugins.io.io-manager',
    'plugins.io.storage-manager',
    'plugins.splash-loader',
    'plugins.tween',
    'plugins.tweens-handler',
    'plugins.url-parameters',
    'plugins.director',
    'plugins.impact-storage',
    'plugins.fullscreen',
    // Data types
    'plugins.data.vector',
    'plugins.data.color-rgb',
    // BRANDING SPLASH
    'plugins.branding.splash',
    // BRANDING ENTITIES
    'game.entities.branding-logo-placeholder',
    // MORE GAMES
    'game.entities.buttons.button-more-games',
    // ENTITIES
    'game.entities.opening-shield',
    'game.entities.opening-kitty',
    'game.entities.pointer',
    'game.entities.pointer-selector',
    'game.entities.select',
    // LEVELS
    'game.levels.opening',
    'game.levels.home',
    'game.levels.avoidx',
    'game.levels.tutorial',
    'game.levels.result',
    'game.levels.leaderboard'
)
.defines(function(){
    this.START_OBFUSCATION;
    this.FRAMEBREAKER;
    MyGame = ig.Game.extend({
        name: "MJS-Game-Mozeus-Spongebob",
        version: "1.0",
        frameworkVersion: "1.0.0",
        sessionData: {},
        io: null,
        paused: false,
        tweens: null,
        margin: 25,
        pointer:null,
        hasBeenContaminated:false,

        isTutorialShown:false,
        loginResponse:null,
        highScore:0,
        currentScore:0,

        maxSecond:60,
        maxSpeed:5,
        
        init: function() {
            this.tweens = new ig.TweensHandler();
            // SERVER-SIDE INTEGRATIONS
            this.setupMarketJsGameCenter();
            //The io manager so you can access ig.game.io.mouse
            this.io = new IoManager();
            this.setupUrlParams = new ig.UrlParameters();
            this.removeLoadingWheel();
            this.setupStorageManager(); // Uncomment to use Storage Manager
            this.loadData();
            this.finalize();

            if (_LEADERBOARDAPI) {
                // MarketJSPlatformAPI.initialize(ig.game.callbackFromInitialization);
                // MarketJSPlatformLoginAPI.showRegister();
            }
        },
        loadData:function (){
            if (ig.game.load('bgmVolume') == null) {
                ig.game.save('bgmVolume', 0.5);
            }
            if (ig.game.load('sfxVolume') == null) {
                ig.game.save('sfxVolume', 0.5);
            }
            if (ig.game.load('highScore') == null) {
                ig.game.save('highScore', 0);
            }
            _GLOBALSCORE = ig.game.highScore = ig.game.load('highScore');
        },
        initData: function(){
            // Properties of ig.game to save & load
            return this.sessionData = {
                sound: 0.5,
                music: 0.5,
                level: 1,
                score: 0
            };
        },
        setupMarketJsGameCenter: function() {
            if(_SETTINGS) {
                if(_SETTINGS['MarketJSGameCenter']) {
                    var el = ig.domHandler.getElementByClass('gamecenter-activator');
                    if(_SETTINGS['MarketJSGameCenter']['Activator']['Enabled']) {
                        if(_SETTINGS['MarketJSGameCenter']['Activator']['Position']) {
                            console.log('MarketJSGameCenter activator settings present ....')
                            ig.domHandler.css(el, {
                                position: "absolute",
                                left: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Left'],
                                top: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Top'],
                                "z-index": 3
                            });
                        }
                    }
                    ig.domHandler.show(el);
                } else {
                    console.log('MarketJSGameCenter settings not defined in game settings')
                }
            }
        },

        callbackFromInitialization:function(response){
            console.log('response:',response)
            // Initialze the Login API
            // MarketJSPlatformLoginAPI.initialize(ig.game.callbackFromLogin);
            switch(response.status.code){
                case 200:
                    // LOGGED IN.... DO SOMETHING
                    console.log('200: success');
                    ig.game.loginResponse = response;
                    break;
                case 404:
                    // NOT LOGGED IN ... DO SOMETHING
                    console.log('404: not logged in');
                    // MarketJSPlatformLoginAPI.showRegister();
                    break;
                default:
                    console.log('404: not logged in');
                    // MarketJSPlatformLoginAPI.showRegister();
            }
        },

        /* MarketJS VAS Login/Registration APIs */
        callbackFromLogin:function(response){
            console.log('response:',response)
            switch(response.status.code){
                case 200:
                    // LOGIN SUCCESSFUL
                    console.log('200: success');
                    ig.game.loginResponse = response;
                    ig.game.director.loadLevel(5);
                    break;
                case 404:
                    // LOGIN FAILED
                    console.log('404: login failed');
                    break;
                default:
                    console.log('unknown error');
            }
        },

        finalize: function() {
            this.start();

            ig.sizeHandler.reorient();
        },
        removeLoadingWheel: function() {
            // Remove the loading wheel
            try {
                $('#ajaxbar').css('background', 'none');
            } catch(err) {
                console.log(err)
            }
        },
        showDebugMenu: function() {
            console.log('showing debug menu ...');
            // SHOW DEBUG LINES
            ig.Entity._debugShowBoxes = true;
            // SHOW DEBUG PANELS
            $('.ig_debug').show();
        },
        start: function() {
            this.resetPlayerStats();
            this.director = new ig.Director(this, [
                /* 0 */ LevelOpening,
                /* 1 */ LevelHome,
                /* 2 */ LevelAvoidX,
                /* 3 */ LevelTutorial,
                /* 4 */ LevelResult,
                /* 5 */ LevelLeaderBoard
            ]);

            // CALL LOAD LEVELS
            // if(_SETTINGS['Branding']['Splash']['Enabled']) {
            //     try {
            //         this.branding = new ig.BrandingSplash();
            //     } catch(err) {
            //         console.log(err)
            //         console.log('Loading original levels ...')
            //         this.director.loadLevel(this.director.currentLevel);
            //     }
            // } else {
            //     this.director.loadLevel(this.director.currentLevel);
            // }
            // if(_SETTINGS['Branding']['Splash']['Enabled'] || _SETTINGS['DeveloperBranding']['Splash']['Enabled']) {
            //     this.spawnEntity(EntityPointerSelector, 50, 50);
            // }

            // if (_ENDDIRECTLY) this.director.loadLevel(4);
            // else this.director.loadLevel(0);

            this.director.loadLevel(2);
            // this.director.loadLevel(5);

            this.pointer = this.spawnEntity(EntityPointerSelector, 50, 50);

            // MUSIC // Changed to use ig.soundHandler
            ig.soundHandler.bgmPlayer.volume(ig.game.load('bgmVolume'));
            ig.soundHandler.sfxPlayer.volume(ig.game.load('sfxVolume'));

            ga('send', 'event', 'Game', 'TapToStartButtonClicked');

            if (!_ENDDIRECTLY) ig.soundHandler.bgmPlayer.play(ig.soundHandler.bgmPlayer.soundList.background);
        },

        save:function(key, value){
            ig.game.storage.set(key, value);
        },

        load:function(key){
            return ig.game.storage.get(key);
        },

        fpsCount: function() {
            if(!this.fpsTimer) {
                this.fpsTimer = new ig.Timer(1);
            }
            if(this.fpsTimer && this.fpsTimer.delta() < 0) {
                if(this.fpsCounter != null) {
                    this.fpsCounter++;
                } else {
                    this.fpsCounter = 0;
                }
            } else {
                ig.game.fps = this.fpsCounter;
                this.fpsCounter = 0;
                this.fpsTimer.reset();
            }
        },
        endGame: function() {
            console.log('End game')
            // IMPORTANT
            ig.soundHandler.bgmPlayer.stop();
            // SUBMIT STATISTICS - USE ONLY WHEN MARKETJS API IS CONFIGURED
            // this.submitStats();
            ig.apiHandler.run("MJSEnd");
        },
        resetPlayerStats: function() {
            ig.log('resetting player stats ...');
            this.playerStats = {
                // EG: coins,score,lives, etc
                id: this.playerStats ? this.playerStats.id : null, // FOR FACEBOOK LOGIN IDS
            }
        },
        pauseGame: function() {
            ig.system.stopRunLoop.call(ig.system);
            ig.game.tweens.onSystemPause();
            console.log('Game Paused');
        },
        resumeGame: function() {
            ig.system.startRunLoop.call(ig.system);
            ig.game.tweens.onSystemResume();
            console.log('Game Resumed');
        },
        showOverlay: function(divList) {
            for(i = 0; i < divList.length; i++) {
                if($('#' + divList[i])) $('#' + divList[i]).show();
                if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "visible";
            }
            // OPTIONAL
            //this.pauseGame();
        },
        hideOverlay: function(divList) {
            for(i = 0; i < divList.length; i++) {
                if($('#' + divList[i])) $('#' + divList[i]).hide();
                if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "hidden";
            }
            // OPTIONAL
            //this.resumeGame();
        },
        popupClose:function(){
            MarketJSPlatformPopupAPI.hide();
            ig.game.director.loadLevel(5);
        },
        leaderBoardClose:function(){
            MarketJSPlatformLeaderboardAPI.hide();
            ig.game.director.loadLevel(1);
        },
        loginClose:function(){
            if (ig.game.director.currentLevel == 4) {
                if (ig.game.loginResponse && ig.game.loginResponse.status.code == 200) {
                    MarketJSPlatformLoginAPI.hideAll();
                    ig.game.director.loadLevel(1);
                } else {
                    MarketJSPlatformLoginAPI.showRegister();
                }
            } else {
                MarketJSPlatformLoginAPI.hideLogin();
                ig.game.director.loadLevel(1);
            }
        },
        resetPasswordClose:function(){
            if (ig.game.director.currentLevel == 4) {
                if (ig.game.loginResponse && ig.game.loginResponse.status.code == 200) {
                    MarketJSPlatformLoginAPI.hideAll();
                    ig.game.director.loadLevel(1);
                } else {
                    MarketJSPlatformLoginAPI.showRegister();
                }
            } else {
                MarketJSPlatformLoginAPI.hideResetPassword();
                ig.game.director.loadLevel(1);
            }
        },
        playAgain:function(){
            MarketJSPlatformLoginAPI.hideAll();
            ig.game.director.loadLevel(2);
        },
        goHome:function(){
            MarketJSPlatformLoginAPI.hideAll();
            ig.game.director.loadLevel(1);
        },
        currentBGMVolume: 1,
        addition: 0.1,
        // MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
        update: function() {
            //Optional - to use
            //this.fpsCount();
            if(this.paused) {
                // only update some of the entities when paused:
                this.updateWhilePaused();
                this.checkWhilePaused();
            } else {
                // call update() as normal when not paused
                this.parent();
                /** Update tween time.
                 * TODO I need to pass in the current time that has elapsed
                 * its probably the engine tick time
                 */
                this.tweens.update(this.tweens.now());
                //BGM looping fix for mobile
                if(ig.ua.mobile && ig.soundHandler) // A win phone fix by yew meng added into ig.soundHandler
                {
                    ig.soundHandler.forceLoopBGM();
                }
            }

            if (ig.game.getEntitiesByType(EntityPointerSelector).length < 1)
            {
                this.pointer = ig.game.spawnEntity(EntityPointerSelector, 50, 50);
            }
        },
        updateWhilePaused: function() {
            for(var i = 0; i < this.entities.length; i++) {
                if(this.entities[i].ignorePause) {
                    this.entities[i].update();
                }
            }
        },
        checkWhilePaused: function(){
            var hash = {};
            for(var e = 0; e < this.entities.length; e++) {
                var entity = this.entities[e];
                if(entity.ignorePause){
                    if(entity.type == ig.Entity.TYPE.NONE && entity.checkAgainst == ig.Entity.TYPE.NONE && entity.collides == ig.Entity.COLLIDES.NEVER) {
                        continue;
                    }
                    var checked = {},
                        xmin = Math.floor(entity.pos.x / this.cellSize),
                        ymin = Math.floor(entity.pos.y / this.cellSize),
                        xmax = Math.floor((entity.pos.x + entity.size.x) / this.cellSize) + 1,
                        ymax = Math.floor((entity.pos.y + entity.size.y) / this.cellSize) + 1;
                    for(var x = xmin; x < xmax; x++) {
                        for(var y = ymin; y < ymax; y++) {
                            if(!hash[x]) {
                                hash[x] = {};
                                hash[x][y] = [entity];
                            } else if(!hash[x][y]) {
                                hash[x][y] = [entity];
                            } else {
                                var cell = hash[x][y];
                                for(var c = 0; c < cell.length; c++) {
                                    if(entity.touches(cell[c]) && !checked[cell[c].id]) {
                                        checked[cell[c].id] = true;
                                        ig.Entity.checkPair(entity, cell[c]);
                                    }
                                }
                                cell.push(entity);
                            }
                        }
                    }
                }
            }
        },
        draw: function() {
            this.parent();
            //Optional - to use , debug console , e.g : ig.game.debugCL("debug something");
            //hold click on screen for 2s to enable debug console
            //this.drawDebug();

            // COPYRIGHT
            // this.dctf();
        },

        dctf: function() {
            this.COPYRIGHT;
        },

        /**
         * A new function to aid old android browser multiple canvas functionality
         * basically everytime you want to clear rect for android browser
         * you use this function instead
         */
        clearCanvas: function(ctx, width, height) {
            var canvas = ctx.canvas;
            ctx.clearRect(0, 0, width, height);
            /*
            var w=canvas.width;
            canvas.width=1;
            canvas.width=w;
            */
            /*
            canvas.style.visibility = "hidden"; // Force a change in DOM
            canvas.offsetHeight; // Cause a repaint to take play
            canvas.style.visibility = "inherit"; // Make visible again
            */
            canvas.style.display = "none"; // Detach from DOM
            canvas.offsetHeight; // Force the detach
            canvas.style.display = "inherit"; // Reattach to DOM
        },
        drawDebug: function() { //-----draw debug-----
            if(!ig.global.wm) {
                // enable console
                this.debugEnable();
                //debug postion set to top left
                if(this.viewDebug) {
                    //draw debug bg
                    ig.system.context.fillStyle = '#000000';
                    ig.system.context.globalAlpha = 0.35;
                    ig.system.context.fillRect(0, 0, ig.system.width / 4, ig.system.height);
                    ig.system.context.globalAlpha = 1;
                    if(this.debug && this.debug.length > 0) {
                        //draw debug console log
                        for(i = 0; i < this.debug.length; i++) {
                            ig.system.context.font = "10px Arial";
                            ig.system.context.fillStyle = '#ffffff';
                            ig.system.context.fillText(this.debugLine - this.debug.length + i + ": " + this.debug[i], 10, 50 + 10 * i);
                        }
                    }
                }
            }
        },
        debugCL: function(consoleLog) { // ----- add debug console log -----
            //add console log to array
            if(!this.debug) {
                this.debug = [];
                this.debugLine = 1;
                this.debug.push(consoleLog);
            } else {
                if(this.debug.length < 50) {
                    this.debug.push(consoleLog);
                } else {
                    this.debug.splice(0, 1);
                    this.debug.push(consoleLog);
                }
                this.debugLine++;
            }
            console.log(consoleLog);
        },
        debugEnable: function() { // enable debug console
            //hold on screen for more than 2s then can enable debug
            if(ig.input.pressed('click')) {
                this.debugEnableTimer = new ig.Timer(2);
            }
            if(this.debugEnableTimer && this.debugEnableTimer.delta() < 0) {
                if(ig.input.released('click')) {
                    this.debugEnableTimer = null;
                }
            } else if(this.debugEnableTimer && this.debugEnableTimer.delta() > 0) {
                this.debugEnableTimer = null;
                if(this.viewDebug) {
                    this.viewDebug = false;
                } else {
                    this.viewDebug = true;
                }
            }
        },
    });
    ig.domHandler = null;
    ig.domHandler = new ig.DomHandler();
    ig.domHandler.forcedDeviceDetection();
    ig.domHandler.forcedDeviceRotation();
    //API handler
    ig.apiHandler = new ig.ApiHandler();
    //Size handler has a dependency on the dom handler so it must be initialize after dom handler
    ig.sizeHandler = new ig.SizeHandler(ig.domHandler);
    //Setup the canvas
    var fps = 60;
    if(ig.ua.mobile) {
        ig.Sound.enabled = false;
        ig.main('#canvas', MyGame, fps, ig.sizeHandler.mobile.actualResolution.x, ig.sizeHandler.mobile.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
        ig.sizeHandler.resize();
    } else {
        ig.main('#canvas', MyGame, fps, ig.sizeHandler.desktop.actualResolution.x, ig.sizeHandler.desktop.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
    }
    //Added sound handler with the tag ig.soundHandler
    ig.soundHandler = null;
    ig.soundHandler = new ig.SoundHandler();
    ig.sizeHandler.reorient();

    document.addEventListener('deviceready', function () {
        console.log('cordova deviceready event fired');
        ig.cordovaDeviceReady = true;

        document.addEventListener("pause", function(){
            if(ig && ig.soundHandler) ig.soundHandler.forceMuteAll();
        }, false);
        document.addEventListener("resume", function(){
            if(ig && ig.soundHandler) ig.soundHandler.forceUnMuteAll();
            if(ig && ig.sizeHandler) ig.sizeHandler.reorient();
            window.scrollTo(0, 1);
        }, false);

        window.setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1000);

        if (!window.device) {
            window.device = { platform: 'Browser' };
        }

        // Handle click events for all external URLs
        if (device.platform.toUpperCase() === 'ANDROID') {
            $(document).on('click', 'a[href^="http"]', function (e) {
                var url = $(this).attr('href');
                navigator.app.loadUrl(url, { openExternal: true });
                e.preventDefault();
            });
        }
        else if (device.platform.toUpperCase() === 'IOS') {
            $(document).on('click', 'a[href^="http"]', function (e) {
                var url = $(this).attr('href');
                window.open(url, '_system');
                e.preventDefault();
            });
        }
        else {
            // Leave standard behaviour
        }
    });

    window.analytics = function(){

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','lib/analytics.js','ga');

        if(window.localStorage) {
            ga('create', 'UA-32390429-1', {
              'storage': 'none'
              , 'clientId': window.localStorage.getItem('ga_clientId')  /*The tracker id obtained from local storage*/
            });
            ga(function(tracker) {
              window.localStorage.setItem('ga_clientId', tracker.get('clientId'));
             /*The tracker id for each device is different and stored in local storage*/
            });
        }
        else {

            ga('create', 'UA-32390429-1', 'auto');
        }

    };

    this.DOMAINLOCK_BREAKOUT_ATTEMPT;
    this.END_OBFUSCATION;
});

var _ENDDIRECTLY = false;
var _LEADERBOARDAPI = true;
