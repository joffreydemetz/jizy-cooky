import Service from '../Service.js';

export default class TrustpilotService extends Service {
	constructor() {
		super('trustpilot', 'Trustpilot');

		this.type = 'technical';
		this.details = 'trustpilot.details';
		this.uri = 'https://support.trustpilot.com/hc/en-us/articles/360001200088-Trustpilot-Cookies-and-Tracking-Technologies';
		this.required = true;
		this.js = false;
		this.fallback = false;

		this.setCookies([
			{ name: '1P_JAR', duration: 365 * 24 * 60 * 60, secure: true },
			{ name: 'UID', duration: 365 * 24 * 60 * 60, secure: true },
			{ name: '_csrf', duration: 365 * 24 * 60 * 60, secure: true }
			// { name: '__RequestVerificationToken', duration: 365 * 24 * 60 * 60, secure: true }
		], true);
	}

	getTranslations() {
		return {
			"fr": {
				"trustpilot.details": "Nous affichons les avis associés déposés par nos clients."
			},
			"en": {
				"trustpilot.details": "We display the associated comments posted by our clients."
			},
			"it": {
				"trustpilot.details": "Visualizziamo le opinioni associate pubblicate dai nostri clienti."
			},
			"es": {
				"trustpilot.details": "Mostramos reseñas relacionadas publicadas por nuestros clientes."
			}
		};
	}
};
