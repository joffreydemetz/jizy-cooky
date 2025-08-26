import Plugin from "../Plugin.js";

export default class CoreRememberPlugin extends Plugin {
	getData() {
		return {
			"cookies": [
				{
					"name": "*** (32 chars)",
					"duration": 30 * 24 * 60 * 60,
					"secure": true,
					"details": "core.remember"
				}
			]
		};
	}

	getTranslations() {
		return {
			"fr": {
				"core.remember": "Contient vos informations de connexion lorsque vous cochez la case \"Rester connecté\" dans le formulaire de connexion. Les données y sont cryptées."
			},
			"en": {
				"core.remember": "Contains your user information if you check the \"Stay logged\" box when logging in. The data is encrypted there."
			},
			"it": {
				"core.remember": "Contiene le informazioni di login quando si seleziona la box \"Essere connessi\" nel form di login. I dati sono crittografati lì."
			},
			"es": {
				"core.remember": "Contiene su información de inicio de sesión cuando marca la casilla \"Permanecer conectado\" en el formulario de inicio de sesión. Los datos están encriptados allí."
			}
		}
	}
};
