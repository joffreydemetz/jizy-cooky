import Plugin from '../Plugin.js';

export default class CorePhpSessionPlugin extends Plugin {
	getData() {
		return {
			"cookies": [
				{
					"name": "PHPSESSID",
					"duration": "browser",
					"secure": true,
					"details": "phpsessid.details"
				}
			]
		};
	}

	getTranslations() {
		return {
			"fr": {
				"phpsessid.details": "Cookie de session du site. Il permet la sauvegarde de votre identifiant de session."
			},
			"en": {
				"phpsessid.details": "Site session cookie. It allows the saving of your session identifier."
			},
			"it": {
				"phpsessid.details": "Cookie di sessione del sito. Consente il salvataggio dell'identificatore di sessione."
			},
			"es": {
				"phpsessid.details": "Cookie de sesión del sitio. Guarda su ID de sesión."
			}
		};
	}
};
