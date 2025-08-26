import Plugin from "../Plugin.js";

export default class CoreCartPlugin extends Plugin {
	getData() {
		return {
			"cookies": [
				{
					"name": "cart",
					"duration": 7 * 24 * 60 * 60,
					"details": "core.cart"
				}
			]
		};
	}

	getTranslations() {
		return {
			"fr": {
				"core.cart": "Contient l'identifiant unique de votre panier."
			},
			"en": {
				"core.cart": "Contains the unique identifier of your cart."
			},
			"it": {
				"core.cart": "Contiene l'identificatore univoco del carrello."
			},
			"es": {
				"core.cart": "Contiene el identificador único de su carrito de compras."
			}
		};
	}
};
