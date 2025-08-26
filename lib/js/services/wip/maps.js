import Service from '../../Service.js';

export default class MapsService extends Service {
	constructor() {
		super('maps', 'Google Maps');

		this.uri = 'http://www.google.com/ads/preferences/';
		this.icon = 'youtube';
		this.type = 'api';

		this.setCookies([
			{ name: 'NID', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: '1P_JAR', duration: 30 * 24 * 60 * 60, secure: true },
			{ name: 'APISID', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'SAPISID', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'SID', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'HSID', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'SSID', duration: 2 * 30 * 24 * 60 * 60, secure: true }
		], true);

		this.setClasses([
			{ classnames: ['jizy-maps'], type: 'box' }
		], true);
	}

	js() {
		this.html((el) => {
			if (el.dataset.pb) {
				const mapUrl = `https://www.google.com/maps/embed?pb=${el.dataset.pb}`;
				el.dataset.frameUrl = mapUrl;
				return this.responsiveHtml(el);
			}

			return '';
		});
	}

	getTranslations() {
		return {
			fr: {
				"maps.details": "Google Maps est un service de cartographie fourni par Google.",
			},
			en: {
				"maps.details": "Google Maps is a mapping service provided by Google.",
			},
			it: {
				"maps.details": "Google Maps è un servizio di mappatura fornito da Google.",
			},
			es: {
				"maps.details": "Google Maps es un servicio de mapas proporcionado por Google.",
			}
		};
	}
};
