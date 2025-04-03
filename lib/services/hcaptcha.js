(function(){
	
	Cooky.addService('hcaptcha', {
		type: "technical",
		name: "HCaptcha",
		uri: "https://hcaptcha.com/privacy",
		details: 'hcaptcha.details',
		cookies: [ 
			{ name: 'hmt_id', duration: 5*60*60, secure: true, details: 'hcaptcha.hmt' }
		],
		required: true,
		js: false,
		fallback: false
	});
	
	Cooky.addTranslations('fr', {
		"cook.hcaptcha.details": "Il s’agit de cookies techniques dont l’usage est propre à Hcaptcha (anti robot).",
		"cook.hcaptcha.hmt": "Ces cookies a peu de chance d’être déposé."
	});
	
	Cooky.addTranslations('en', {
		"cook.hcaptcha.details": "These are technical cookies, the use of which is specific to Hcaptcha.",
		"cook.hcaptcha.hmt": "This cookie is not likely to be used."
	});
	
	Cooky.addTranslations('it', {
		"cook.hcaptcha.details": "Si tratta di cookie tecnici, il cui utilizzo è specifico per Hcaptcha.",
		"cook.hcaptcha.hmt": "This cookie is not likely to be used."
	});
	
	Cooky.addTranslations('es', {
		"cook.hcaptcha.details": "Son cookies técnicas cuyo uso es específico de Hcaptcha (anti robot).",
		"cook.hcaptcha.hmt": "Estas cookies tienen pocas posibilidades de ser depositadas."
	});
	
})();
