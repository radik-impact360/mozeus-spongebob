// GENERATED BY SERVER CODE

/* API USE CASE
   For games with no levels, use Endgame (inject add score code, etc)
   For games with levels use Level events (Begin,End,Win,Lose,Draw)
*/
var _SETTINGS = {
	'API':{
		'Enabled':false,
		'Log':{
			'Events':{
				'InitializeGame':false,
				'EndGame':false,
				'Level':{
					'Begin':false,
					'End':false,
					'Win':false,
					'Lose':false,
					'Draw':false,
				},
			},
		},
	},
	'Ad':{
		'Mobile':{
			'Preroll':{
				'Enabled':false,	
				'Duration':5,
				'Width':300,
				'Height':250,
				'Rotation':{
					'Enabled':false,
					'Weight':{
						'MobileAdInGamePreroll':40,
						'MobileAdInGamePreroll2':40,
						'MobileAdInGamePreroll3':20,
					},
				},			
			},
			'Header':{
				'Enabled':false,	
				'Duration':5,
				'Width':320,
				'Height':50,	
				'Rotation':{
					'Enabled':false,
					'Weight':{
						'MobileAdInGameHeader':40,
						'MobileAdInGameHeader2':40,
						'MobileAdInGameHeader3':20,
					},
				},							
			},	
			'Footer':{
				'Enabled':false,	
				'Duration':5,
				'Width':320,
				'Height':50,
				'Rotation':{
					'Enabled':false,
					'Weight':{
						'MobileAdInGameFooter':40,
						'MobileAdInGameFooter2':40,
						'MobileAdInGameFooter3':20,
					},
				},								
			},	
			'End':{
				'Enabled':false,	
				'Duration':1,
				'Width':300,
				'Height':250,	
				'Rotation':{
					'Enabled':false,
					'Weight':{
						'MobileAdInGameEnd':40,
						'MobileAdInGameEnd2':40,
						'MobileAdInGameEnd3':20,
					},
				},							
			},								
		},		
	},

	'Language':{
		'Default':'en',		
	},

	'DeveloperBranding':{ // MarketJS Branding
		'Splash':{
			'Enabled':false,
		},
		'Logo':{
			'Enabled':false,
			'Link':'http://marketjs.com',
			'LinkEnabled':false,
			'NewWindow': false,	// open link in new window, although this behavior can be override by browsers preference
			'Width':166,
			'Height':61,
		}
	},
			
	'Branding':{
		'Splash':{
			'Enabled':false,
		},
		'Logo':{
			'Enabled':false,
			'Link':'http://google.com',
			'LinkEnabled':false, // Makes the logo clickable or not (ie activate/deactivate link)
			'NewWindow': false,	// open link in new window, although this behavior can be override by browsers preference
			'Width':280,
			'Height':34,
		}
	},	

	'MoreGames':{
		'Enabled':false,
		'Link':'http://www.marketjs.com/game/links/mobile',
		'NewWindow': false,	// open link in new window, although this behavior can be override by browsers preference
	},
		
	'Gamecenter':{
		'Enabled':false,
	},
	
	'TapToStartAudioUnlock': {
		'Enabled':false
	}
};
