(function(){
	
	Cooky.getService('callisto').setCookies([
		{ name: '*** (32 chars)', duration: 365*24*60*60, secure: true, details: 'callisto.remember' },
	]);
	
	Cooky.addTranslations('fr', {
		"cook.callisto.remember": "Contient vos informations de connexion lorsque vous cochez la case \"Rester connecté\" dans le formulaire de connexion. Les données y sont cryptées."
	});
	
	Cooky.addTranslations('en', {
		"cook.callisto.remember": "Contains your user informations if you check the \"Stay logged\" box when logging in. The data is encrypted there."
	});
	
	Cooky.addTranslations('it', {
		"cook.callisto.remember": "Contiene le informazioni di login quando si seleziona la box \"Essere connessi\" nel form di login. I dati sono crittografati lì."
	});
	
	Cooky.addTranslations('es', {
		"cook.callisto.remember": "Contiene su información de inicio de sesión cuando marca la casilla \"Permanecer conectado\" en el formulario de inicio de sesión. Los datos están encriptados allí."
	});
	
})();
