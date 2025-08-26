import Service from "../Service.js";

export default class AvisVerifiesService extends Service {
	constructor() {
		super('avisverifies', 'Avis vérifiés');

		this.details = 'avisverifies.details';
		this.required = true;
		this.js = false;
		this.fallback = false;
		this.type = 'technical';
	}

	getTranslations() {
		return {
			fr: {
				"avisverifies.details": "Nous affichons les avis associés."
			},
			en: {
				"avisverifies.details": "We display the associated comments."
			},
			it: {
				"avisverifies.details": "Visualizziamo le opinioni associate."
			},
			es: {
				"avisverifies.details": "Mostramos reseñas relacionadas."
			}
		}
	}
}
