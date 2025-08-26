import Service from '../Service.js';

export default class GoogleFontsService extends Service {
	constructor() {
		super('googlefonts', 'Google Fonts');

		this.uri = 'https://policies.google.com/privacy';
		this.details = 'googlefonts.details';
		this.type = 'technical';

		this.required = true;
		this.js = false;
		this.fallback = false;

		this.setCookies([
			{ name: '1P_JAR', duration: 24 * 60 * 60, secure: true },
			{ name: 'CONSENT', duration: 365 * 24 * 60 * 60 }
		], true);
	}

	getTranslations() {
		return {
			fr: {
				"googlefonts.details": "Il s'agit de cookies techniques dont l'usage est propre à Google fonts (optimisation de l'affichage de fontes web). Ces cookies ont peu de chance d'être déposés."
			},
			en: {
				"googlefonts.details": "These are technical cookies, the use of which is specific to Google fonts."
			},
			it: {
				"googlefonts.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per Google Fonts."
			},
			es: {
				"googlefonts.details": "Son cookies técnicas cuyo uso es específico de las fuentes de Google (optimización de la visualización de fuentes web). Estas cookies tienen pocas posibilidades de ser depositadas."
			}
		}
	}
};
