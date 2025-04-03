(function(){
	
	// Cooky.setConfig('user.analyticsUa', '');
	// Cooky.setConfig('user.analyticsUaCreate', {});
	// Cooky.setConfig('user.analyticsAnonymizeIp', true);
	// Cooky.setConfig('user.analyticsPrepare', function(){});
	// Cooky.setConfig('user.analyticsPageView', true);
	// Cooky.setConfig('user.analyticsMore', function(){});
	
	// var gaService = Cooky.getService('ganalytics');
	// gaService.analyticsPrepare = function(){};
	// gaService.analyticsMore = function(){};
	
	Cooky.addService('ganalytics', {
		gaLoaded: false,
		type: "analytic",
		name: "Google Analytics",
		uri: "https://support.google.com/analytics/answer/6004245",
		cookies: [ 
			{ name: '_ga', duration: 365*24*60*60, secure: true }, 
			{ name: '_gat' }, 
			{ name: '_gid' }, 
			{ name: '__utma' }, 
			{ name: '__utmb' }, 
			{ name: '__utmc' }, 
			{ name: '__utmt' }, 
			{ name: '__utmz' }
		],
		mandatory: ['analyticsUa'],
		// analyticsPrepare: function(){},
		// analyticsMore: function(){},
		js: function(){
			Cooky.setConfig('gaEnableCookies', true);
			this._loadGa();
		},
		fallback: function(){
			this._loadGa();
		},
		_loadGa: function(){
			if ( false === this.gaLoaded ){
				var withCookies = true === Cooky.getConfig('gaEnableCookies', false);
				
				this.gaLoaded = true;
				
				var uaCreate = {};
				
				Cooky.extend(uaCreate, Cooky.getConfig('user.analyticsUaCreate', {}) || {});
				
				uaCreate.cookieFlags = 'SameSite=None; Secure';
				uaCreate.cookieExpires = 31536000;
				uaCreate.anonymizeIp = true;
				uaCreate.storeGac = false;
				
				if ( false === withCookies ){
					uaCreate.storage = 'none';
					uaCreate.clientId = localStorage.getItem('gaClientID');
				}
				
				this.addScript('https://www.google-analytics.com/analytics.js');
				
				// var prepare = Cooky.getConfig('user.analyticsPrepare');
				// if ( typeof S[prepare] === 'function' ){
					// Cooky.execFunction(S[prepare]);
				// }
				
				// if ( true === Cooky.getConfig('user.analyticsPageView', false) ){
					// ga('send', 'pageview', true);
				// } 
				// else {
					// ga('send', 'pageview');
				// }
				
				// var more = Cooky.getConfig('user.analyticsMore');
				// if ( typeof S[more] === 'function' ){
					// Cooky.execFunction(S[more]);
				// }
				
				window.GoogleAnalyticsObject = 'ga';
				window.ga = window.ga || function(){
					window.ga.q = window.ga.q || [];
					window.ga.q.push(arguments);
				};
				window.ga.l = new Date();
				window.ga('create', Cooky.getConfig('user.analyticsUa'), uaCreate);
				
				if ( true === withCookies ){
					window.ga(function(tracker){
						localStorage.setItem('gaClientID', tracker.get('clientId'));
					});
				}
				
				// window._paq = window._paq || [];
				// window._paq.push(["setTrackerUrl", 'https://'+Cooky.getConfig('user.matomoHost') + "/piwik.php"]);
				// window._paq.push(["setSiteId", Cooky.getConfig('user.matomoId')]);
				// window._paq.push(["setDoNotTrack", true]);
				// window._paq.push(["setDownloadClasses", ["downloadable","download-icon"]]);
				// window._paq.push(["setDownloadExtensions", ["pdf"]]);
				// window._paq.push(["enableLinkTracking"]);
				// window._paq.push(["enableHeartBeatTimer", 15]);
				// window._paq.push(["trackPageView"]);
			}
		}
	});
		
})();
