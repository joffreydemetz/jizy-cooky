(function(){
	
	Cooky.addService('trustpilot', {
		type: 'technical',
		name: 'Trustpilot',
		details: 'trustpilot.details',
		cookies: [
			{ name: '1P_JAR', duration: 365*24*60*60, secure: true },
			{ name: 'TP.uuid', duration: 365*24*60*60, secure: true },
			{ name: '_csrf', duration: 365*24*60*60, secure: true }
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
		"cook.trustpilot.details": "Nous affichons les avis associés déposés par nos clients."
	});
	
	Cooky.addTranslations('en', {
		"cook.trustpilot.details": "We display the associated comments posted by our clients."
	});
	
	Cooky.addTranslations('it', {
		"cook.trustpilot.details": "Visualizziamo le opinioni associate pubblicate dai nostri clienti."
	});
	
	Cooky.addTranslations('es', {
		"cook.trustpilot.details": "Mostramos reseñas relacionadas publicadas por nuestros clientes."
	});
	
})();
