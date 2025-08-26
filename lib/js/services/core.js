import Service from '../Service.js';
import { COOKY_NAME } from "../Constants.js";

/**
 * Default service for Cooky.
 * It is a technical service and does not require user consent.
 */
export default class CoreService extends Service {
	constructor() {
		super('core', 'Core');

		this.details = 'core.details';
		this.required = true;
		this.js = false;
		this.fallback = false;
		this.type = 'technical';

		this.setCookies([
			{ name: COOKY_NAME, duration: 365 * 24 * 60 * 60, details: 'core.cooky' }
		], true);
	}

	getTranslations() {
		return {
			fr: {
				"core.details": "Il s'agit de cookies techniques dont l'usage est propre à JiZy Platform.",
				"core.cooky": "Ce cookie sert à stocker votre sélection des services ci-dessous."
			},
			en: {
				"core.details": "These are technical cookies, the use of which is specific to JiZy Platform.",
				"core.cooky": "This cookie is used to store your selection of the services below."
			},
			it: {
				"core.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per JiZy Platform.",
				"core.cooky": "Questo cookie viene utilizzato per memorizzare la selezione dei servizi di seguito."
			},
			es: {
				"core.details": "Son cookies técnicas cuyo uso es específico de JiZy Platform.",
				"core.cooky": "Esta cookie se utiliza para almacenar su selección de los servicios a continuación."
			}
		}
	}
};
