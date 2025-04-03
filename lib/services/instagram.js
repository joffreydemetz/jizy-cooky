(function(){
	
	Cooky.addService('instagram', {
		type: 'social',
		name: 'Instagram',
		uri: 'https://help.instagram.com/155833707900388',
		icon: 'instagram',
		cookies: [ 
			// { name: 'csrftoken' }, 
			// { name: 'datr' },
			{ name: 'rur', duration: 'browser', secure: true },
			{ name: 'urlgen', duration: 'browser', secure: true },
			{ name: 'fsbr_***', duration: 'browser', secure: true },
			{ name: 'ig_cb', duration: 360*24*60*60 },
			{ name: 'mid', duration: 360*24*60*60, secure: true },
			{ name: 'sessionid', duration: 360*24*60*60, secure: true },
			{ name: 'ds_user_id', duration: 28*24*60*60, secure: true },
			{ name: 'shbid', duration: 4*24*60*60, secure: true },
			{ name: 'shbts', duration: 4*24*60*60, secure: true },
			{ name: 'ig_did', secure: true }
		],
		classes: [
			{ classnames: ['instagram-feed'], type: 'box' }
		],
		js: function(){
			this.emptyHtml();
			this.addScript('//www.instagram.com/embed.js');
		}
	});
	
})();
