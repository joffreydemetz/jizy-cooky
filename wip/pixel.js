import Service from '../../Service.js';
import Config from '../../Config.js';

Config.def('service.pixel.id', '');

export default class PixelService extends Service {
	constructor() {
		super('pixel', 'Facebook Pixel');

		this.uri = 'https://facebook.com/business/help/www/651294705016616';
		this.icon = 'facebook';
		this.type = 'ads';

		this.mandatory = ['pixel.id'];

		this.setCookies([
			{ name: '_fbp', duration: 60 * 24 * 60 * 60, secure: true },
			{ name: 'act', duration: 'browser', secure: true },
			{ name: 'c_user', duration: 365 * 24 * 60 * 60, secure: true },
			{ name: 'datr', duration: 547 * 24 * 60 * 60, secure: true },
			{ name: 'fr', duration: 60 * 24 * 60 * 60, secure: true },
			{ name: 'sb', duration: 24 * 60 * 60, secure: true },
			{ name: 'spin', duration: 60 * 60, secure: true },
			{ name: 'wd', duration: 60 * 60, secure: true },
			{ name: 'xs', duration: 365 * 24 * 60 * 60, secure: true },
			{ name: 'x-src' },
			{ name: 'reg_ext_ref' },
			{ name: 'reg_fb_gate' },
			{ name: 'reg_fb_ref' }
		], true);
	}

	js() {
		if (window.fbq) return;

		const fbq = (window.fbq = function () {
			fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
		});

		if (!window._fbq) window._fbq = fbq;

		fbq.push = fbq;
		fbq.loaded = true;
		fbq.version = '2.0';
		fbq.queue = [];


		this.addScript(
			`//connect.facebook.net/${Config.get('locale')}/fbevents.js`,
			'facebook-jssdk'
		);
		fbq('init', Config.get('service.pixel.id'));
		fbq('track', 'PageView');
	}

	getTranslations() {
		return {
			"fr": {
				"pixel.details": "Facebook Pixel est un outil d'analyse publicitaire permettant de mesurer l'efficacité des publicités.",
			},
			"en": {
				"pixel.details": "Facebook Pixel is an advertising analytics tool to measure ad effectiveness.",
			},
			"it": {
				"pixel.details": "Facebook Pixel è uno strumento di analisi pubblicitaria per misurare l'efficacia degli annunci.",
			},
			"es": {
				"pixel.details": "Facebook Pixel es una herramienta de análisis publicitario para medir la efectividad de los anuncios.",
			}
		};
	}
};
