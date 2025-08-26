import Service from '../Service.js';

export default class OvhService extends Service {
	constructor() {
		super('ovh', 'OVH');

		this.uri = 'https://www.ovh.com/fr/support/documents_legaux/politique_cookies_ovh.xml';
		this.details = 'ovh.details';
		this.type = 'technical';

		this.required = true;
		this.js = false;
		this.fallback = false;

		this.setCookies([
			{ name: '90planD', duration: 60 * 60 },
			{ name: '90planBAK', duration: 60 * 60 },
			{ name: '300gp', duration: 60 * 60 },
			{ name: '300gpBAK', duration: 60 * 60 },
			{ name: '720planD', duration: 60 * 60 },
			{ name: '720planBAK', duration: 60 * 60 }
		]);
	}

	getTranslations() {
		return {
			"fr": {
				"ovh.details": "Il s'agit de cookies techniques dont l'usage est propre à l'hébergeur OVH à Roubaix (FR) et qui permet, entre autres, d'assurer la répartition de la charge sur les serveurs."
			},
			"en": {
				"ovh.details": "These are technical cookies, the use of which is specific to our provider OVH."
			},
			"it": {
				"ovh.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per OVH."
			},
			"es": {
				"ovh.details": "Se trata de cookies técnicas cuyo uso es específico del host OVH en Roubaix (FR) y que permite, entre otras cosas, asegurar la distribución de la carga en los servidores."
			}
		};
	}
};
