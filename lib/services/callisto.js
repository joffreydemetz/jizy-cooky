(function(){
	// console.log('CALLISTO');
	
	Cooky.addService('callisto', {
		type: 'technical',
		name: 'JiZy Platform',
		// uri: 'https://jizy-platform.com/politique-cookies/',
		details: 'callisto.details',
		cookies: [
			{ name: 'PHPSESSID', duration: 'browser', secure: true, details: 'callisto.phpsessid' },
			{ name: Cooky.name, duration: 365*24*60*60, details: 'callisto.cooky' }
		],
		required: true,
		js: false,
		fallback: false
	});
	
	Cooky.addTranslations('fr', {
		"cook.callisto.details": "Il s’agit de cookies techniques dont l’usage est propre à JiZy Platform.",
		"cook.callisto.phpsessid": "Cookie de session du site. Il permet la sauvegarde de votre identifiant de session.",
		"cook.callisto.cooky": "Ce cookie sert à stocker votre sélection des services ci-dessous."
	});
	
	Cooky.addTranslations('en', {
		"cook.callisto.details": "These are technical cookies, the use of which is specific to JiZy Platform.",
		"cook.callisto.phpsessid": "Site session cookie. It allows the saving of your session identifier.",
		"cook.callisto.cooky": "This cookie is used to store your selection of the services below."
	});
	
	Cooky.addTranslations('it', {
		"cook.callisto.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per JiZy Platform.",
		"cook.callisto.phpsessid": "Cookie di sessione del sito. Consente il salvataggio dell'identificatore di sessione.",
		"cook.callisto.cooky": "Questo cookie viene utilizzato per memorizzare la selezione dei servizi di seguito."
	});
	
	Cooky.addTranslations('es', {
		"cook.callisto.details": "Son cookies técnicas cuyo uso es específico de JiZy Platform.",
		"cook.callisto.phpsessid": "Cookie de sesión del sitio. Guarda su ID de sesión.",
		"cook.callisto.cooky": "Esta cookie se utiliza para almacenar su selección de los servicios a continuación."
	});
	
})();
