(function(){
	
	Cooky.addService('youtubesubscribe', {
		type: 'social',
		name: 'YouTube',
		uri: 'https://www.google.fr/intl/fr/policies/privacy/',
		icon: 'youtube',
		cookies: [ 
			{ name: 'VISITOR_INFO1_LIVE' }, 
			{ name: 'YSC' },
			{ name: 'PREF' },
			{ name: 'GEUP' },
			{ name: 'HSID' },
			{ name: 'LOGIN_INFO' },
			{ name: 'SID' },
			{ name: 'SSID' },
			{ name: 'APISID' },
			{ name: 'PREF' }
		],
		classes: [
			{ classnames: ['g-ytsubscribe'], type: 'button' }
		],
		mandatory: ['youtubeChannel'],
		js: function(){
			this.emptyHtml();
			this.addScript('https://apis.google.com/js/platform.js');
		}
	});
	
})();
