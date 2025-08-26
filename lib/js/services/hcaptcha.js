import Service from '../Service.js';

export default class HCaptchaService extends Service {
	constructor() {
		super('hcaptcha', 'HCaptcha');

		this.uri = 'https://hcaptcha.com/privacy';
		this.details = 'hcaptcha.details';
		this.type = 'technical';

		this.required = true;
		this.js = false;
		this.fallback = false;

		this.setCookies([
			{ name: 'hmt_id', duration: 5 * 60 * 60, secure: true }
		], true);
	}

	getTranslations() {
		return {
			fr: {
				"hcaptcha.details": "Il s'agit de cookies techniques dont l'usage est propre à Hcaptcha (anti robot).",
				"hcaptcha.hmt": "Ces cookies a peu de chance d'être déposé."
			},
			en: {
				"hcaptcha.details": "These are technical cookies, the use of which is specific to Hcaptcha.",
				"hcaptcha.hmt": "This cookie is not likely to be used."
			},
			it: {
				"hcaptcha.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per Hcaptcha.",
				"hcaptcha.hmt": "This cookie is not likely to be used."
			},
			es: {
				"hcaptcha.details": "Son cookies técnicas cuyo uso es específico de Hcaptcha (anti robot).",
				"hcaptcha.hmt": "Estas cookies tienen pocas posibilidades de ser depositadas."
			}
		};
	}
};
