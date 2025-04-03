(function(){
	
	Cooky.addService('avisverifies', {
		type: 'technical',
		name: 'Avis vérifiés',
		details: 'avisverifies.details',
		cookies: [
			// { name: '1P_JAR', duration: 365*24*60*60, secure: true },
			// { name: 'TP.uuid', duration: 365*24*60*60, secure: true },
			// { name: '_csrf', duration: 365*24*60*60, secure: true }
			// { name: '__RequestVerificationToken', duration: 365*24*60*60, secure: true }
		],
		required: true,
		js: false,
		fallback: false
		// js: function(){
			// this.addScript('//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js');
		// }
	});
	
	Cooky.addTranslations('fr', {
		"cook.avisverifies.details": "Nous affichons les avis associés déposés par nos étudiants."
	});
	
	Cooky.addTranslations('en', {
		"cook.avisverifies.details": "We display the associated comments posted by our students."
	});
	
	Cooky.addTranslations('it', {
		"cook.avisverifies.details": "Visualizziamo le opinioni associate pubblicate dai nostri studenti."
	});
	
	Cooky.addTranslations('es', {
		"cook.avisverifies.details": "Mostramos reseñas relacionadas enviadas por nuestros estudiantes."
	});
	
})();
