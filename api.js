// Leaderboard
var _GLOBALSCORE = 0; // assigned by game at gameover
var _DEVELOPMENT_MODE = false; // Change this to false, before deployment
var _GAME_ID, _API_URL;
var submit_on_login = true;
var leader_board_mode = 'all-time';

console.log('_DEVELOPMENT_MODE:', _DEVELOPMENT_MODE)
if (_DEVELOPMENT_MODE) {
    // Development mode game ids
    _GAME_ID = '5286159531900928' // Game1
    _API_URL = 'http://localhost:10010';
} else {
    // Production mode game ids
    _GAME_ID = '5286159531900928' // Recycle Everywhere School - Production
    _API_URL = 'https://marketjs-vas.appspot.com'; // Production
}

// Update all URLs appropriately (inject in appropriate divs)
function updateURLs() {
    console.log('updating URLs ...')

    $('#register-form').attr('action', _API_URL + '/api/user/register')
    $('#login-form').attr('action', _API_URL + '/api/user/login')
    $('#reset-password-form').attr('action', _API_URL + '/api/user/reset_password')

}

function updateGameIDs() {
    $('#reset-password-game-id').val(_GAME_ID);
    $('#login-game-id').val(_GAME_ID);
    $('#register-game-id1').val(_GAME_ID);
}

$(document).ready(function () {
    // Enable True/False mechanism, for Terms of Service checkbox
    console.log('Document Ready');
    $("[id^=register-tos-agree]").each(function () {
        console.log('init .. ', $(this).attr('id'))
        $(this).click(function () {
            if ($(this).prop('checked')) {
                $(this).val('True');
                console.log('checked');
            } else {
                $(this).val('False');
                console.log('unchecked');
            }
        });
    });

    // Very important
    updateURLs();
    updateGameIDs();
});

var MarketJSPlatformLeaderboardAPI = {
    windowIDs: [
        'contest-rule',
		'leaderboard',
		'login',
		'popup',
		'register',
        'reset-password',
        'overlay-loading'
	],
    navigationTabs: [
	     'leaderboard-navigation-tab-alltime',
	     'leaderboard-navigation-tab-weekly',
	     'leaderboard-navigation-tab-daily',
	],
    leaderboardEntryHeight: null,
    initialize: function () {
        this.hideAll();

        this.getAllTimeHTML(function () {
            MarketJSPlatformLeaderboardAPI.show();
        });
    },

    submitScore: function (game_id, score, callback) {
        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                session_id: session_id,
                game_id: game_id,
                score: score,
            },
            success: callback,
            url: _API_URL + '/api/leaderboard_entry/submit',

            beforeSend: function () {
                //$('#overlay-loading').show();
            },
            complete: function () {
                //$('#overlay-loading').hide();
            },
        })
    },

    adjustPopupSizePos: function (popup) {
        var box = $(popup);
        box.css('height', 'auto');
        var h = box.height();

        if (popup == '#box-contest-rule') {
            if (h > 0.9 * window.innerHeight) {
                box.css('height', window.innerHeight * 0.8);
            }
        } else {
            if (h > 0.9 * window.innerHeight) {
                box.css('height', window.innerHeight * 0.9);
            }
            this.centerPopupVertically(box);
        }
    },

    centerPopupVertically: function (div) {
        var h = div.height();

        if (window.innerHeight >= 800) {
            var m = (window.innerHeight - h) / 2;
            div.css('margin-top', m);
        } else {
            var m = (window.innerHeight - h) * 1.2 / 2;
            div.css('margin-top', m / 2);
        }
    },

    adjustLeaderboardHeight: function () {
        var box = $('#box-leaderboard');
        var header = $('#box-leaderboard-header');
        var height = window.innerHeight - header.height() - 120;
        if (window.innerWidth > window.innerHeight) height = window.innerHeight - header.height() - 100;
        box.css('height', 'auto');
        if (box.height() > height) box.css('height', height);

        return;
        if (window.innerHeight < window.innerWidth) { // landscape
            if (window.innerHeight < 768) {
                box.css('height', window.innerHeight * 0.8)
            } else {
                box.css('height', window.innerHeight * 0.6)
            }
        } else { // portrait
            if (window.innerHeight < 768) {
                box.css('height', window.innerHeight * 0.8)
            } else {
                box.css('height', window.innerHeight * 0.8)
            }
        }
    },

    centerDivVertically: function (div) {
        var h = div.height();
        var m = (window.innerHeight - h) / 2;
        if (window.innerHeight >= 800) {
            div.css('margin-top', m);
        } else {
            div.css('margin-top', m / 2);
        }
    },
    show: function () {
        this.hideAll();

        fixOrientationDirect();
        $('#leaderboard').show();
        if (ig.game && ig.game.loginResponse && ig.game.loginResponse.status.code == 200) {
            $('#box-leaderboard-footer').hide();
        }

        this.getAllTimeHTML(MarketJSPlatformLeaderboardAPI.adjustLeaderboardHeight())
    },
    hide: function () {
        this.hideAll();
        $('#leaderboard').hide();
    },
    hideAll: function () {
        $(".overlay-container-basic").css('display', '-webkit-box');
        $(".overlay-container-basic").css('display', '-moz-box');
        $(".overlay-container-basic").css('display', '-ms-flexbox');
        $(".overlay-container-basic").css('display', '-webkit-flex');
        $(".overlay-container-basic").css('display', 'flex');
        $(".overlay-container-basic").css('justify-content', 'center');
        for (i = 0; i < this.windowIDs.length; i++) {
            $('#' + this.windowIDs[i]).hide();
        }
    },
    removeAllHighlightedNavigationTabs: function () {
        // for (i = 0; i < this.navigationTabs.length; i++) {
        //     $('#' + this.navigationTabs[i]).removeClass('box-leaderboard-navigation-item-highlighted');
        // }
    },
    highlightNavigationTab: function (div) {
        // this.removeAllHighlightedNavigationTabs();
        // div.addClass('box-leaderboard-navigation-item-highlighted');
    },
    updateButton:function(){
        if (leader_board_mode == 'all-time') {
            $("#leaderboard-navigation-tab-alltime").attr("class", "box-all-time");
            $("#leaderboard-navigation-tab-weekly").attr("class", "box-this-week-disabled");
        } else {
            $("#leaderboard-navigation-tab-alltime").attr("class", "box-all-time-disabled");
            $("#leaderboard-navigation-tab-weekly").attr("class", "box-this-week");
        }
    },
    getAllTimeHTML: function (game_id, callback) {
        leader_board_mode = 'all-time';
        this.updateButton();
        this.getAllTime('json', game_id, callback);
    },
    getWeeklyHTML: function (game_id, callback) {
        leader_board_mode = 'this-week';
        this.updateButton();
        this.getWeekly('json', game_id, callback);
    },
    getDailyHTML: function (game_id, callback) {
        this.getDaily('json', game_id, callback);
    },
    getAllTime: function (output_type, game_id, callback) {
        this.highlightNavigationTab($('#leaderboard-navigation-tab-alltime'))

        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];

        if (game_id === undefined) {
            console.log('game_id not defined, defaulting to ', _GAME_ID)
            game_id = _GAME_ID; // select default GAME_ID from beginning of this JS file.
        } else {
            console.log('game_id defined as', game_id)
            _GAME_ID = game_id;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                output_type: output_type, // 'json', or 'html'
                session_id: session_id,
                game_id: game_id,
                interval: 'alltime',
            },
            success: callback,
            url: _API_URL + '/api/leaderboard_entry/read',

            beforeSend: function () {
                $('#overlay-loading').show();
            },

            complete: function (response) {
                responseJSON(response, output_type);
            },

        })
    },

    getDaily: function (output_type, game_id, callback) {
        this.highlightNavigationTab($('#leaderboard-navigation-tab-daily'))

        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];

        if (game_id === undefined) {
            console.log('game_id not defined, defaulting to ', _GAME_ID)
            game_id = _GAME_ID; // select default GAME_ID from beginning of this JS file.
        } else {
            console.log('game_id defined as', game_id)
            _GAME_ID = game_id;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                output_type: output_type, // 'json', or 'html'
                session_id: session_id,
                interval: 'daily',
                game_id: game_id,
            },
            success: callback,
            url: _API_URL + '/api/leaderboard_entry/read',

            beforeSend: function () {
                $('#overlay-loading').show();
            },

            complete: function (response) {
                responseJSON(response, output_type);
            },
        })
    },

    getWeekly: function (output_type, game_id, callback) {
        this.highlightNavigationTab($('#leaderboard-navigation-tab-weekly'))

        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];

        if (game_id === undefined) {
            console.log('game_id not defined, defaulting to ', _GAME_ID)
            game_id = _GAME_ID; // select default GAME_ID from beginning of this JS file.
        } else {
            console.log('game_id defined as', game_id)
            _GAME_ID = game_id;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                output_type: output_type, // 'json', or 'html'
                session_id: session_id,
                interval: 'weekly',
                game_id: game_id,
            },
            success: callback,
            url: _API_URL + '/api/leaderboard_entry/read',

            beforeSend: function () {
                $('#overlay-loading').show();

                console.log('we are here')
            },

            complete: function (response) {
                responseJSON(response, output_type);
            },
        })
    },
}

function responseJSON(response, output_type){
    
    response = JSON.parse(response.responseText);
    var data = response.data;
    var length = 10;
    var result = "";
    if (!data) length = 0;
    if (data && data.length < length) length = data.length;
    for (var index = 0; index < length; index++) {
        // var school = '-';
        // if (data[index].json_info) {
        //     var input = data[index].json_info;
        //     input = input.replace("'", '"');
        //     input = input.replace("'", '"');
        //     input = input.replace("'", '"');
        //     input = input.replace("'", '"');
        //     school = JSON.parse(input).school;
        // }
        var group = "<div class='group next'>";
        if (index == 0) group = "<div class='group first'>";
        var formatHTML = 
        group +
            "<div class='col span_2_of_10_leaderboard'>" +
                "<div class='box-leaderboard-score' id='box-leaderboard-index-" + index +"'>"+ (index + 1) +"</div>" +
            "</div>" +
            "<div class='col span_6_of_10_leaderboard'>" +
                "<div class='box-leaderboard-username' id='box-leaderboard-username-" + index +"'>"+ 
                    "<div class='box-leaderboard-first'>" + data[index].username + "</div>" +
                    // "<div class='box-leaderboard-second'>" + school + "</div>" +
                "</div>" +
            "</div>" +
            "<div class='col span_2_of_10_leaderboard'>" +
                "<div class='box-leaderboard-score' id='box-leaderboard-score-" + index +"'>"+ data[index].score +"</div>" +
            "</div>" +
        "</div>"
        ;
        result += formatHTML;
    }
    output_type = 'html';
    if (output_type == 'html') {
        console.log('html output detected, filling in template')
        $('#leaderboard-entry').html(result);
        $("#leaderboard-entry .group:first-child .box-leaderboard-col-header").each(function (index) {
            $(this).text($(this).text().toUpperCase());
        });

        MarketJSPlatformLeaderboardAPI.adjustLeaderboardHeight();
    }

    for (var index = 0; index < length; index++) {
        var margin = ($('#box-leaderboard-username-' + index).height() - $('#box-leaderboard-index-' + index).height()) * 0.5;
        $('#box-leaderboard-index-' + index).css('margin-top', margin + 'px');
        $('#box-leaderboard-score-' + index).css('margin-top', margin + 'px');
    }

    $('#overlay-loading').hide();
}

$(window).bind('resize', function (e) {
    fixOrientation();
});

function fixOrientationDirect() {
    if(!ig.ua.mobile) {
        $(".overlay_span_middle").width($('#canvas').width() * 0.95);
    } else {
        if (window.innerHeight > window.innerWidth) {
            $(".overlay_span_middle").width($('#canvas').width() * 0.95);
        } else {
            $(".overlay_span_middle").css("width", "100%");
        }
    }
    $('#box-leaderboard-footer').width($(".overlay_span_middle").width());
    $('.box-leaderboard').css('padding', '0px');
    $('#leaderboard-entry').children().css('padding', '5px');
    MarketJSPlatformLeaderboardAPI.adjustLeaderboardHeight();
    MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-register');
    MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-contest-rule');
    MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-reset-password');
    MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-login');
}

function fixOrientation() {

    setTimeout(function () {
        if(!ig.ua.mobile) {
            $(".overlay_span_middle").width($('#canvas').width() * 0.95);
        } else {
            if (window.innerHeight > window.innerWidth) {
                $(".overlay_span_middle").width($('#canvas').width() * 0.95);
            } else {
                $(".overlay_span_middle").css("width", "100%");
            }
        }
        $('#box-leaderboard-footer').width($(".overlay_span_middle").width());
        MarketJSPlatformLeaderboardAPI.adjustLeaderboardHeight();
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-register');
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-contest-rule');
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-reset-password');
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-login');
    }, 150);
}

// Login Script Template here
var MarketJSPlatformLoginAPI = {
    windowIDs: [
        'contest-rule',
		'leaderboard',
		'login',
		'popup',
		'register',
        'reset-password',
        'overlay-loading'
	],
    initialize: function (callback) {
        this.prepareForm(callback);

        // Show registration form immediately
        //this.showRegister();
    },
    setupSession: function (session_id) {
        //        console.log('Saving session_id in localStorage ...')
        localStorage.setItem('session_id_recycle_everywhere_extra_life', session_id);
    },
    centerDivVectically: function (div) {
        var h = div.height();
        //        console.log('window.innerHeight', window.innerHeight)

        // DUNNO WHY THIS WORKS WELL FOR IPHONE
        if (window.innerHeight < 400) {
            var m = (window.innerHeight - h) / 2;
        } else {
            var m = (window.innerHeight - h) / 2 - h / 4;
        }

        //console.log(h,m)
        div.css('margin-top', m);
    },
    // MINOR BUG: Build a function to correct the margin-left issue. Non critical. Or fix the base template API
    centerDivHorizontally: function (div) {

        if (window.innerWidth > 1440) { // somehow this is the point where the box goes out of alignment
            //            console.log('bigger than 1440, adjusting margin-left')
            var width = div.width();
            var left = (window.innerWidth - width) / 2

            // DOING THIS MAKES NO EFFECT
            div.css('left', left);
        }

    },

    showLogin: function () {
        this.hideAll();
        $('#login').show();
        //		this.centerDivVectically($('#box-login'));	
        //		this.centerDivHorizontally($('#box-login'));	
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-login');
    },
    hideLogin: function () {
        var box = $('#login');
        box.css('height', 'auto');
        box.hide();
    },
    showResetPassword: function () {
        this.hideAll();
        $('#reset-password').show();
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-reset-password');
    },
    hideResetPassword: function () {
        var box = $('#reset-password');
        box.css('height', 'auto');
        box.hide();
    },
    showRegister: function () {
        this.hideAll();
        fixOrientationDirect();
        $('#register').show();
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-register');
    },
    hideRegister: function () {
        var box = $('#register');
        box.css('height', 'auto');
        box.hide();
    },
    showContestRule: function () {
        this.hideAll();
        fixOrientationDirect();
        $('#contest-rule').show();
        MarketJSPlatformLeaderboardAPI.adjustPopupSizePos('#box-contest-rule');
    },
    hideContestRule: function () {
        var box = $('#contest-rule');
        box.css('height', 'auto');
        box.hide();
        this.showRegister();
    },
    hideAll: function () {
        $(".overlay-container-basic").css('display', '-webkit-box');
        $(".overlay-container-basic").css('display', '-moz-box');
        $(".overlay-container-basic").css('display', '-ms-flexbox');
        $(".overlay-container-basic").css('display', '-webkit-flex');
        $(".overlay-container-basic").css('display', 'flex');
        $(".overlay-container-basic").css('justify-content', 'center');
        for (i = 0; i < this.windowIDs.length; i++) {
            $('#' + this.windowIDs[i]).hide();
        }
    },
    prepareForm: function (callback) {
        $('#login-form').ajaxForm({
            beforeSubmit: function () {
                return $('#login-form').valid();
            },
            beforeSend: function () {
                // console.log('Attempting to log in ...');
                MarketJSPlatformLoginAPI.hideLogin();
                $('#overlay-loading').show();
            },
            dataType: 'json',
            success: callback,
            complete: function (response) {
                $('#overlay-loading').hide()

                // SETUP SESSION
                response = JSON.parse(response.responseText);
                if (response.status.code == 200) {
                    MarketJSPlatformLoginAPI.setupSession(response.data.session_id);
                    MarketJSPlatformPopupAPI.show('Logged in', response.status.message);

                    // Submit score when LOGIN is successful
                    if (_GLOBALSCORE > 0 && submit_on_login == true) {
                        submit_on_login = false;
                        console.log('submitting _GLOBALSCORE:', _GLOBALSCORE);
                        MarketJSPlatformLeaderboardAPI.submitScore(_GAME_ID, _GLOBALSCORE, function (response) {
                            MarketJSPlatformLeaderboardAPI.show();
                        });
                    }

                } else {
                    $('#login-notification').text(response.status.message);
                    $('#login-notification').addClass('alert-error');
                    $('#login-notification').show();
                    MarketJSPlatformLoginAPI.showLogin();
                }


            }
        });

        $('#login-form').validate({
            rules: {
                "login-username": {
                    required: true,
                    alphanumeric: true,
                    minlength: 3,
                    maxlength: 15,
                },
                "login-password": {
                    required: true,
                    alphanumeric: true,
                    minlength: 5,
                },
                "login-email": {
                    required: true,
                    email: true,
                    isEmail: "0"
                },
                "login-first-name": {
                    required: true,
                    accept: "[a-zA-Z]+"
                },
                "login-last-name": {
                    accept: "[a-zA-Z]+"
                },
            },

            highlight: function (label) {
                $(label).removeClass('success');
                $(label).addClass('error');
            },
            success: function (label) {
                $(label).removeClass('error');
                $(label).addClass('success');
            }
        });

        $('#register-form').ajaxForm({
            beforeSubmit: function () {
                fbq('track', 'CompleteRegistration');
                return $('#register-form').valid();
            },
            beforeSend: function () {
                console.log('Attempting to register ...');
                MarketJSPlatformLoginAPI.hideRegister();
                $('#overlay-loading').show()
            },
            dataType: 'json',
            success: callback,
            complete: function (response) {
                $('#overlay-loading').hide();

                // SETUP SESSION
                response = JSON.parse(response.responseText);
                if (response.status.code == 200) {
                    MarketJSPlatformLoginAPI.setupSession(response.data.session_id);
                    MarketJSPlatformPopupAPI.show('Registered', response.status.message);

                    //GA
                    ga('send', 'event', 'Game', 'FormSubmitted');

                    // Submit score when REGISTRATION is successful					   
                    if (_GLOBALSCORE > 0 && submit_on_login == true) {
                        submit_on_login = false;
                        console.log('submitting _GLOBALSCORE:', _GLOBALSCORE);
                        MarketJSPlatformLeaderboardAPI.submitScore(_GAME_ID, _GLOBALSCORE, function (response) {
                            MarketJSPlatformLeaderboardAPI.show();
                        });
                    }

                } else {
                    $('#register-notification').text(response.status.message);
                    $('#register-notification').addClass('alert-error');
                    $('#register-notification').show();
                    MarketJSPlatformLoginAPI.showRegister();
                }
            }
        });

        // $.validator.addMethod("valueNotEquals", function(value, element, arg){
        //     return arg !== value;
        // }, "Select school");

        $.validator.addMethod("checkboxChecked", function(value, element, arg){
            $('#checkbox-status').text('You must agree to enter the contest.');
            return value == 'True';
        }, "");

        $.validator.addMethod("isEmail", function(value, element, arg){
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var result = regex.test(value);
            return result;
        }, "Invalid email");
          
        $('#register-form').validate({
            rules: {
                "register-username": {
                    required: true,
                    alphanumeric: true,
                    minlength: 3,
                    maxlength: 15,
                },
                "register-password": {
                    required: true,
                    alphanumeric: true,
                    minlength: 5,
                },
                "register-email": {
                    required: true,
                    email: true,
                    isEmail: "0"
                },
                "register-first-name": {
                    required: true,
                    accept: "[a-zA-Z]+"
                },
                "register-last-name": {
                    accept: "[a-zA-Z]+"
                },
                "register-json-info": {
                    required: true,
                    valueNotEquals: "0"
                },
                "register-tos-agree": {
                    checkboxChecked: "0"
                },
            },

            highlight: function (label) {
                $(label).removeClass('success');
                $(label).addClass('error');
            },
            success: function (label) {
                $(label).removeClass('error');
                $(label).addClass('success');
            }
        });


        $('#reset-password-form').ajaxForm({
            beforeSubmit: function () {
                return $('#reset-password-form').valid()
            },
            beforeSend: function () {
                console.log('Attempting to reset password ...')
                MarketJSPlatformLoginAPI.hideResetPassword();
                $('#overlay-loading').show()
            },
            dataType: 'json',
            success: callback,
            complete: function (response) {
                $('#overlay-loading').hide()

                // SETUP SESSION
                response = JSON.parse(response.responseText);
                if (response.status.code == 200) {

                    $('#login-notification').text(response.status.message);
                    $('#login-notification').removeClass('alert-error');
                    $('#login-notification').addClass('alert-success');
                    $('#login-notification').show();

                    MarketJSPlatformLoginAPI.showLogin();
                } else {
                    $('#reset-password-notification').text(response.status.message);
                    $('#reset-password-notification').addClass('alert-error');
                    $('#reset-password-notification').show();
                    MarketJSPlatformLoginAPI.showResetPassword();
                }

            }
        });

        $('#reset-password-form').validate({
            rules: {
                "reset-password-email": {
                    required: true,
                    email: true
                },
            },

            highlight: function (label) {
                $(label).removeClass('success');
                $(label).addClass('error');
            },
            success: function (label) {
                $(label).removeClass('error');
                $(label).addClass('success');
            }
        });


    },


}

var MarketJSPlatformAPI = {
    initialize: function (callback) {
        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                session_id: session_id,
            },
            success: callback,
            url: _API_URL + '/api/user/check',

            beforeSend: function () {
                console.log('Initializing ...')
                $('#overlay-loading').show();
            },
            complete: function () {
                console.log('finished ...')
                $('#overlay-loading').hide();
            },
        })
    },
}

// LOGOUT API
var MarketJSPlatformLogoutAPI = {
    initialize: function (callback) {
        var session_id = localStorage['session_id_recycle_everywhere_extra_life'];
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                session_id: session_id,
            },
            success: callback,
            url: _API_URL + '/api/user/logout',

            beforeSend: function () {
                console.log('Initializing ...')
                $('#overlay-loading').show();
            },
            complete: function () {
                console.log('finished ...')
                localStorage.setItem('session_id_recycle_everywhere_extra_life', null);
                $('#overlay-loading').hide();
            },
        })
    },
}

var MarketJSPlatformPopupAPI = {
    windowIDs: [
        'contest-rule',
		'leaderboard',
		'login',
		'popup',
		'register',
        'reset-password',
        'overlay-loading'
	],
    centerDivVectically: function (div) {
        var h = div.height();
        //        console.log('window.innerHeight', window.innerHeight)

        // DUNNO WHY THIS WORKS WELL FOR IPHONE
        if (window.innerHeight < 400) {
            var m = (window.innerHeight - h) / 2;
        } else {
            var m = (window.innerHeight - h) / 2 - h / 4;
        }

        //console.log(h,m)
        div.css('margin-top', m);
    },
    show: function (title, content) {
        this.hideAll();
        $('#popup-title').html(title);
        $('#popup-content').html(content);
        $('#popup').show();

        this.centerDivVectically($('#box-popup'));
    },
    hide: function () {
        $('#popup').hide();
    },
    hideAll: function () {
        $(".overlay-container-basic").css('display', '-webkit-box');
        $(".overlay-container-basic").css('display', '-moz-box');
        $(".overlay-container-basic").css('display', '-ms-flexbox');
        $(".overlay-container-basic").css('display', '-webkit-flex');
        $(".overlay-container-basic").css('display', 'flex');
        $(".overlay-container-basic").css('justify-content', 'center');
        for (i = 0; i < this.windowIDs.length; i++) {
            $('#' + this.windowIDs[i]).hide();
        }
    },
}

_FB_APP_ID = '1754105808034733';

window.fbAsyncInit = function() {
FB.init({
  appId      : _FB_APP_ID,
  cookie     : true,
  xfbml      : true,
  version    : 'v2.8'
});
};

// Load the SDK asynchronously
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var MarketJSPlatformFBLoginAPI = {
    loginOnFBLogin: function() {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                var game_id = $('#login-game-id').val();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "login-fb-app-id": _FB_APP_ID,
                        "login-fb-access-token": accessToken,
                        "login-game-id": game_id,
                    },
                    url: _API_URL + '/api/user/login',

                    beforeSend: function () {
                        MarketJSPlatformLoginAPI.hideLogin();
                        $('#overlay-loading').show();
                    },

                    complete: function (response) {
                        $('#overlay-loading').hide()

                        // SETUP SESSION
                        response = JSON.parse(response.responseText);
                        if (response.status.code == 200) {
                            MarketJSPlatformLoginAPI.setupSession(response.data.session_id);
                            MarketJSPlatformPopupAPI.show('Logged in', response.status.message);

                            if (_GLOBALSCORE > 0 && submit_on_login == true) {
                                submit_on_login = false;
                                MarketJSPlatformLeaderboardAPI.submitScore(_GAME_ID, _GLOBALSCORE, function (response) {
                                    MarketJSPlatformLeaderboardAPI.show();
                                });
                            }
                        } else {
                            $('#login-notification').text(response.status.message);
                            $('#login-notification').addClass('alert-error');
                            $('#login-notification').show();
                            MarketJSPlatformLoginAPI.showLogin();
                        }
                    },
                })
            }
        });
    },

    registerOnFBLogin: function() {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                var game_id =  $('#register-game-id1').val();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        "register-fb-app-id": _FB_APP_ID,
                        "register-fb-access-token": accessToken,
                        "register-game-id": game_id,
                    },
                    url: _API_URL + '/api/user/register',

                    beforeSend: function () {
                        MarketJSPlatformLoginAPI.hideRegister();
                        $('#overlay-loading').show();
                    },

                    complete: function (response) {
                        $('#overlay-loading').hide()

                        // SETUP SESSION
                        response = JSON.parse(response.responseText);
                        if (response.status.code == 200) {
                            MarketJSPlatformLoginAPI.setupSession(response.data.session_id);
                            MarketJSPlatformPopupAPI.show('Registered', response.status.message);

                            if (_GLOBALSCORE > 0 && submit_on_login == true) {
                                submit_on_login = false;
                                MarketJSPlatformLeaderboardAPI.submitScore(_GAME_ID, _GLOBALSCORE, function (response) {
                                    MarketJSPlatformLeaderboardAPI.show();
                                });
                            }
                        } else {
                            $('#register-notification').text(response.status.message);
                            $('#register-notification').addClass('alert-error');
                            $('#register-notification').show();
                            MarketJSPlatformLoginAPI.showRegister();
                        }
                    },
                })
            }
        });
    },
}
