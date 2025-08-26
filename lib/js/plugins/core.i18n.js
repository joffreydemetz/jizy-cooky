import Plugin from "../Plugin.js";

export default class CoreI18nPlugin extends Plugin {
	getData() {
		return {
			"cookies": [
				{
					"name": "language",
					"duration": 365 * 24 * 60 * 60,
					"details": "core.language"
				}
			]
		};
	}

	getTranslations() {
		return {
			"fr": {
				"core.language": "Contient la langue de l'utilisateur."
			},
			"en": {
				"core.language": "Contains the user's language."
			},
			"it": {
				"core.language": "Contiene la lingua dell'utente."
			},
			"es": {
				"core.language": "Contiene el idioma del usuario."
			}
		};
	}
};
