(function(){
	
	Cooky.getService('callisto').setCookies([
		{ name: 'cart', duration: 7*24*60*60, details: 'callisto.cart' }
	]);
	
	Cooky.addTranslations('fr', {
		"cook.callisto.cart": "Ce cookie sert à stocker l'identifiant unique de votre panier."
	});
	
	Cooky.addTranslations('en', {
		"cook.callisto.cart": "This cookie is used to store the unique identifier of your cart."
	});
	
	Cooky.addTranslations('it', {
		"cook.callisto.cart": "Questo cookie viene utilizzato per memorizzare l'identificatore univoco del carrello."
	});
	
	Cooky.addTranslations('es', {
		"cook.callisto.cart": "Esta cookie se utiliza para almacenar el identificador único de su carrito de compras."
	});
	
})();
