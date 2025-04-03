(function(){
	
	// Cooky.setConfig('user.matomoId', '');
	// Cooky.setConfig('user.matomoHost', '');
	// Cooky.setConfig('user.bgColor', 'ffffff');
	// Cooky.setConfig('user.fgColor', '000000');
	// Cooky.setConfig('user.fontSize', '11px');
	// Cooky.setConfig('user.fontFamily', 'Montserrat');
	
	Cooky.addService('matomo', {
		matomoLoaded: false,
		type: "analytic",
		name: "Matomo",
		details: 'matomo.details',
		uri: "https://matomo.org/faq/general/faq_146/",
		cookies: [ 
			{ name: '_pk_id', duration: 400*24*60*60 },
			{ name: '_pk_ref', duration: 183*24*60*60 }, 
			{ name: '_pk_ses', duration: 30*60 }, 
			{ name: '_pk_cvar', duration: 30*60 }, 
			{ name: '_pk_hsr', duration: 30*60 }, 
			{ name: 'matomo_ignore', duration: 30*365*24*60*60, details: 'matomo.ignore' },
			{ name: 'mtm_consent', duration: 30*365*24*60*60, details: 'matomo.consent' },
			{ name: 'mtm_consent_removed', duration: 30*365*24*60*60, details: 'matomo.noconsent' },
			{ name: 'mtm_cookie_consent', duration: 30*365*24*60*60, details: 'matomo.consentcookie' },
			{ name: 'MATOMO_SESSID', duration: 14*24*60*60, secure: true }
		],
		classes: [
			{ classnames: ['matomo-opt-out'], type: 'box' }
		],
		mandatory: ['matomoId','matomoHost','matomoCDN'],
		js: function(){
			this._loadMatomo();
		},
		fallback: function(){
			Cooky.setConfig('matomoDisableCookies', true);
			this._loadMatomo();
		},
		_loadMatomo: function(){
			if ( false === this.matomoLoaded ){
				this.matomoLoaded = true;
				
				this.addScript('https://'+Cooky.getConfig('user.matomoHost')+'/matomo.js');
				
				var _paq = window._paq = window._paq || [];
				
				if ( Cooky.getConfig('user.matomoDomain') ){
					_paq.push(['setDomains', [ Cooky.getConfig('user.matomoDomain') ]]);
				}
				
				if ( Cooky.getConfig('user.trackPrefix') ){
					_paq.push(['setCustomUrl', window.location.protocol+'//'+window.location.hostname+'/'+Cooky.getConfig('user.trackPrefix')+'/'+window.location.pathname ]);
				}
				
				_paq.push(["setDoNotTrack", true]);
				_paq.push(["disableCookies"]);
				// _paq.push(["setSecureCookie", true]);
				
				// if ( Cooky.getConfig('user.matomoCookieDomain') ){
					// _paq.push(["setCookieDomain", Cooky.getConfig('user.matomoCookieDomain')]);
					// _paq.push(['setDomains', Cooky.getConfig('user.matomoCookieDomain')]);
				// }
				
				_paq.push(["setDownloadClasses", ["downloadable","download-icon"]]);
				_paq.push(["setDownloadExtensions", ["pdf"]]);
				_paq.push(["enableHeartBeatTimer", 15]);
				// _paq.push(['enableCrossDomainLinking']);		
				
				_paq.push(["setTrackerUrl", 'https://'+Cooky.getConfig('user.matomoHost')+'/matomo.php']);
				_paq.push(["setSiteId", Cooky.getConfig('user.matomoId')]);
				
				_paq.push(["trackPageView"]);
				_paq.push(["enableLinkTracking"]);

			}
			
			/* this.html(function($el, service){
				if ( $el.data("matomo-loaded") ){
					console.log('loaded');
					return $el.html();
				}
				
				$el.data("matomo-loaded", true);
				
				var url = 'https://'+Cooky.getConfig('user.matomoHost')+'/index.php?module=CoreAdminHome&action=optOutJS'
					+ '&div='+$el.prop('id')
					+ '&showIntro='+Cooky.getConfig('showIntro', '0')
					+ '&language='+Cooky.getConfig('language', 'fr')
					+ '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
					+ '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
					+ '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
					+ '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
				console.log(url);
				$el.after('<script src="'+url+'"></script>');
				// this.addScript(url);
				return 'OK';
			}); */
			/* this.html(function($el, service){
				function setOptOutText(element) {
					console.log(element);
					_paq.push([function(){
						element.checked = !this.isUserOptedOut();
						
						if ( this.isUserOptedOut() ){
							element.querySelector("label").innerText = Cooky.lang.get('cook.matomo.optin');
							// service.changeStatus(false);
						}
						else {
							element.querySelector("label").innerText = Cooky.lang.get('cook.matomo.optout');
							// service.changeStatus(true);
						}
					}]);
				}
				
				var uniqId = ''; //'-' + Math.random().toString(36).substr(2, 9);
				
				var optOut = document.getElementById("matomo-opt-out"+uniqId);
				console.log(optOut);
				if ( optOut ){
					optOut.addEventListener("click", function(){
						try {
							this.checked ? _paq.push(['forgetUserOptOut']) : _paq.push(['optUserOut']);
						} catch(e){}
						
						setOptOutText(optOut);
					});
					
					setOptOutText(optOut);
				}
				
				var html = '<p>'+Cooky.lang.get('cook.matomo.message')+'</p>';
				html += '<form class="wide"><input type="checkbox" id="matomo-opt-out'+uniqId+'"> <label for="matomo-opt-out'+uniqId+'"></label></form>';
				return html;
			}); */
			/* this.html(function($el, service){
				// console.log(service);
				var frameUrl = 'https://'+Cooky.getConfig('user.matomoCDN')+'/index.php?module=CoreAdminHome&action=optOut'
					+ '&div=matomo-opt-out'
					+ '&showIntro='+Cooky.getConfig('showIntro', '0')
					+ '&language='+Cooky.getConfig('language', 'fr')
					+ '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
					+ '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
					+ '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
					+ '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
				
				$el.data("frameUrl", frameUrl);
				return service.frameHtml($el);
			}); */
			/* this.html(function($el, service){
				var url = 'https://'+Cooky.getConfig('user.matomoCDN')+'/index.php?module=CoreAdminHome&action=optOutJS'
					+ '&div=matomo-opt-out'
					+ '&showIntro='+Cooky.getConfig('showIntro', '0')
					+ '&language='+Cooky.getConfig('language', 'fr')
					+ '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
					+ '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
					+ '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
					+ '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
				
				console.log($el);
				console.log(url);
				
				$el.after('<script src="'+url+'"></script>');
				
				return 'OK';
			}); */
		}
	});
	
	Cooky.addTranslations('fr', {
		"cook.matomo.details": "Matomo est l’alternative à Google Analytics qui protège les données et la vie privée des visiteurs.",
		"cook.matomo.consent": "Ce cookie est utilisé pour stocker votre consentement.",
		"cook.matomo.consentcookie": "Ce cookie peut être utilisé pour stocker votre consentement.",
		"cook.matomo.noconsent": "Stocke votre refus de participer à l’amélioration de notre site.",
		"cook.matomo.ignore": "Stocke votre refus de suivi",
		"cook.matomo.message": "Vous pouvez vous opposer au suivi de votre navigation sur ce site web. Cela protégera votre vie privée, mais empêchera également le propriétaire d'apprendre de vos actions et de créer une meilleure expérience pour vous et les autres utilisateurs.",
		"cook.matomo.optout": "Vous n'êtes pas exclu(e). Décochez cette case pour être exclu(e).",
		"cook.matomo.optin": "Vous êtes exclu(e). Cochez cette case pour ne plus être exclu(e)."
	});
	
	Cooky.addTranslations('en', {
		"cook.matomo.details": "Matomo is the Google Analytics alternative that protects the data and visitors' privacy.",
		"cook.matomo.consent": "This cookie can be used to store your consent.",
		"cook.matomo.consentcookie": "This cookie can be used to store your consent.",
		"cook.matomo.noconsent": "Stores the info in case you don’t want to be tracked to improve this website.",
		"cook.matomo.ignore": "Stored if you ask to not be tracked.",
		"cook.matomo.message": "You may choose not to have a unique web analytics cookie identification number assigned to your computer to avoid the aggregation and analysis of data collected on this website. To make that choice, please click below to receive an opt-out cookie.",
		"cook.matomo.optout": "Vous n'êtes pas exclu(e). Décochez cette case pour être exclu(e).",
		"cook.matomo.optin": "Vous êtes exclu(e). Cochez cette case pour ne plus être exclu(e)."
	});
	
	Cooky.addTranslations('it', {
		"cook.matomo.details": "Matomo is the Google Analytics alternative that protects the data and visitors' privacy.",
		"cook.matomo.consent": "This cookie can be used to store your consent.",
		"cook.matomo.consentcookie": "This cookie can be used to store your consent.",
		"cook.matomo.noconsent": "Stores the info in case you don’t want to be tracked to improve this website.",
		"cook.matomo.ignore": "Stored if you ask to not be tracked.",
		"cook.matomo.message": "Vous pouvez vous opposer au suivi de votre navigation sur ce site web. Cela protégera votre vie privée, mais empêchera également le propriétaire d'apprendre de vos actions et de créer une meilleure expérience pour vous et les autres utilisateurs.",
		"cook.matomo.optout": "Vous n'êtes pas exclu(e). Décochez cette case pour être exclu(e).",
		"cook.matomo.optin": "Vous êtes exclu(e). Cochez cette case pour ne plus être exclu(e)."
	});
	
	Cooky.addTranslations('es', {
		"cook.matomo.details": "Matomo es la alternativa a Google Analytics que protege los datos y la privacidad de los visitantes.",
		"cook.matomo.consent": "Esta cookie se puede utilizar para almacenar su consentimiento.",
		"cook.matomo.consentcookie": "Esta cookie se puede utilizar para almacenar su consentimiento.",
		"cook.matomo.noconsent": "Almacena su negativa a participar en la mejora de nuestro sitio.",
		"cook.matomo.ignore": "Stored if you ask to not be tracked.",
		"cook.matomo.message": "Puede oponerse al seguimiento de su navegación en este sitio web. Esto protegerá su privacidad, pero también evitará que el propietario aprenda de sus acciones y cree una mejor experiencia para usted y otros usuarios.",
		"cook.matomo.optout": "No estás excluido. Desmarque esta casilla para ser excluido.",
		"cook.matomo.optin": "Estás excluido. Marque esta casilla para dejar de ser excluido."
	});
	
})();
