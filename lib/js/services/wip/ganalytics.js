import Service from '../../Service.js';
import Config from '../../Config.js';

Config.def('service.ganalytics.ua', '');
Config.def('service.ganalytics.uaCreate', {});
Config.def('service.ganalytics.enableCookies', false);
// Config.def('service.ganalytics.anonymizeIp', true);
// Config.def('service.ganalytics.prepare', function(){});
// Config.def('service.ganalytics.pageView', true);
// Config.def('service.ganalytics.more', function(){});

export default class GanalyticsService extends Service {
	constructor() {
		super('ganalytics', 'Google Analytics');

		this.uri = 'https://support.google.com/analytics/answer/6004245';
		this.type = 'analytic';

		this.setCookies([
			{ name: '_ga', duration: 365 * 24 * 60 * 60, secure: true },
			{ name: '_gat' },
			{ name: '_gid' },
			{ name: '__utma' },
			{ name: '__utmb' },
			{ name: '__utmc' },
			{ name: '__utmt' },
			{ name: '__utmz' }
		], true);

		// this.analyticsPrepare = function(){};
		// this.analyticsMore = function(){};
		this.gaLoaded = false;
	}

	js() {
		Config.set('gaEnableCookies', true);
		this._loadGa();
	}

	fallback() {
		this._loadGa();
	}

	_loadGa() {
		if (!this.gaLoaded) {
			this.gaLoaded = true;

			const uaCreate = {
				cookieFlags: 'SameSite=None; Secure',
				cookieExpires: 31536000,
				anonymizeIp: true,
				storeGac: false,
				...Config.get('service.ganalytics.uaCreate')
			};

			if (!Config.get('service.ganalytics.enableCookies')) {
				uaCreate.storage = 'none';
				uaCreate.clientId = localStorage.getItem('gaClientID');
			}

			this.addScript('https://www.google-analytics.com/analytics.js');

			window.GoogleAnalyticsObject = 'ga';
			window.ga = window.ga || function () {
				window.ga.q = window.ga.q || [];
				window.ga.q.push(arguments);
			};
			window.ga.l = new Date();
			window.ga('create', Config.get('service.ganalytics.ua'), uaCreate);

			if (withCookies) {
				window.ga(function (tracker) {
					localStorage.setItem('gaClientID', tracker.get('clientId'));
				});
			}
		}
	}

	getTranslations() {
		return {
			"fr": {
				"ganalytics.details": "Google Analytics est un service d'analyse d'audience fourni par Google.",
			},
			"en": {
				"ganalytics.details": "Google Analytics is an audience analysis service provided by Google.",
			},
			"it": {
				"ganalytics.details": "Google Analytics è un servizio di analisi del pubblico fornito da Google.",
			},
			"es": {
				"ganalytics.details": "Google Analytics es un servicio de análisis de audiencia proporcionado por Google.",
			}
		};
	}
};
