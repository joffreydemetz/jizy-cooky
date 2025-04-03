(function(){
	
	Cooky.addService('ovh', {
		type: 'technical',
		name: 'OVH',
		uri: 'https://www.ovh.com/fr/support/documents_legaux/politique_cookies_ovh.xml',
		details: 'ovh.details',
		cookies: [
			{ name: '90planD', duration: 60*60 },
			{ name: '90planBAK', duration: 60*60 },
			{ name: '300gp', duration: 60*60 },
			{ name: '300gpBAK', duration: 60*60 },
			{ name: '720planD', duration: 60*60 },
			{ name: '720planBAK', duration: 60*60 }
		],
		required: true,
		js: false,
		fallback: false
	});
	
	Cooky.addTranslations('fr', {
		"cook.ovh.details": "Il s’agit de cookies techniques dont l’usage est propre à l'hébergeur OVH à Roubaix (FR) et qui permet, entre autres, d’assurer la répartition de la charge sur les serveurs."
	});
	
	Cooky.addTranslations('en', {
		"cook.ovh.details": "These are technical cookies, the use of which is specific to our provider OVH."
	});
	
	Cooky.addTranslations('it', {
		"cook.ovh.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per OVH."
	});
	
	Cooky.addTranslations('es', {
		"cook.ovh.details": "Se trata de cookies técnicas cuyo uso es específico del host OVH en Roubaix (FR) y que permite, entre otras cosas, asegurar la distribución de la carga en los servidores."
	});
	
})();
