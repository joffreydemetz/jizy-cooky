import Service from '../../Service.js';

export default class ReCaptchaService extends Service {
	constructor() {
		super('recaptcha', 'reCAPTCHA');

		this.type = 'api';
		this.uri = 'http://www.google.com/policies/privacy/';

		this.setClasses([
			{ classnames: ['g-recaptcha'], type: 'button' },
		], true);

		this.setCookies([
			{ name: 'NID', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: '1P_JAR', duration: 30 * 24 * 60 * 60, secure: true },
			{ name: 'GSP', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'G_ENABLED_IDPS', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'G_AUTHUSER_H', duration: 6 * 30 * 24 * 60 * 60, secure: true }
		], true);

	}

	js() {
		this.emptyHtml();
		this.addScript('https://www.google.com/recaptcha/api.js');
	}

	getTranslations() {
		return {
			"fr": {
				"recaptcha.details": "reCAPTCHA est un service de protection contre les robots fourni par Google.",
			},
			"en": {
				"recaptcha.details": "reCAPTCHA is a bot protection service provided by Google.",
			},
			"it": {
				"recaptcha.details": "reCAPTCHA è un servizio di protezione dai bot fornito da Google.",
			},
			"es": {
				"recaptcha.details": "reCAPTCHA es un servicio de protección contra bots proporcionado por Google.",
			}
		};
	}
};
