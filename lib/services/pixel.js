(function(){
	
	Cooky.addService('pixel', {
		type: 'ads',
		name: 'Facebook Pixel',
		uri: 'https://fr-fr.facebook.com/business/help/www/651294705016616',
		icon: 'facebook',
		mandatory: ['pixelId'],
		cookies: [
			{ name: '_fbp', duration: 60*24*60*60 },
			{ name: 'act', duration: 'browser', secure: true },
			{ name: 'c_user', duration: 365*24*60*60, secure: true },
			{ name: 'datr', duration: 547*24*60*60, secure: true },
			{ name: 'fr', duration: 60*24*60*60, secure: true },
			{ name: 'sb', duration: 24*60*60, secure: true },
			{ name: 'spin', duration: 60*60, secure: true },
			{ name: 'wd', duration: 60*60, secure: true },
			{ name: 'xs', duration: 365*24*60*60, secure: true },
			{ name: 'x-src' },
			{ name: 'reg_ext_ref' },
			{ name: 'reg_fb_gate' },
			{ name: 'reg_fb_ref' }
		],
		js: function(){
			"use strict";
			var n;
			if(window.fbq)return;
			n=window.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)} ;
			if(!window._fbq)window._fbq=n;
			n.push=n;
			n.loaded=!0;
			n.version='2.0';
			n.queue=[];
			this.addScript('https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', Cooky.getConfig('user.pixelId'));
			fbq('track', 'PageView');
		}
	});
	
})();
