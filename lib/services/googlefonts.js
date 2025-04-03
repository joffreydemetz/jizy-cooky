(function(){
	
	Cooky.addService('googlefonts', {
		type: 'technical',
		name: 'Google Fonts',
		uri: 'https://policies.google.com/privacy',
		details: 'googlefonts.details',
		cookies: [
			{ name: '1P_JAR', duration: 24*60*60, secure: true },
			{ name: 'CONSENT', duration: 365*24*60*60 }
		],
		required: true,
		js: false,
		fallback: false
	});
	
	Cooky.addTranslations('fr', {
		"cook.googlefonts.details": "Il s’agit de cookies techniques dont l’usage est propre à Google fonts (optimisation de l’affichage de fontes web). Ces cookies ont peu de chance d’être déposés."
	});
	
	Cooky.addTranslations('en', {
		"cook.googlefonts.details": "These are technical cookies, the use of which is specific to Google fonts."
	});
	
	Cooky.addTranslations('it', {
		"cook.googlefonts.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per Google Fonts."
	});
	
	Cooky.addTranslations('es', {
		"cook.googlefonts.details": "Son cookies técnicas cuyo uso es específico de las fuentes de Google (optimización de la visualización de fuentes web). Estas cookies tienen pocas posibilidades de ser depositadas."
	});
	
})();
