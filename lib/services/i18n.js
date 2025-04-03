(function(){
	
	Cooky.getService('callisto').setCookies([
		{ name: 'language', duration: 365*24*60*60, details: 'callisto.language' }
	]);
	
	Cooky.addTranslations('fr', {
		"cook.callisto.language": "Ce cookie sert à stocker votre préférences de language."
	});
	
	Cooky.addTranslations('en', {
		"cook.callisto.language": "This cookie is used to store your language preferences."
	});
	
	Cooky.addTranslations('it', {
		"cook.callisto.language": "Questo cookie viene utilizzato per memorizzare i vostri prefrences lingua."
	});
	
	Cooky.addTranslations('es', {
		"cook.callisto.language": "Esta cookie se utiliza para almacenar sus preferencias de idioma."
	});
	
})();
