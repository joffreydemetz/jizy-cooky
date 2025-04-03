(function(){
	
	Cooky.addService('recaptcha', {
		type: "api",
		name: "reCAPTCHA",
		uri: "http://www.google.com/policies/privacy/",
		cookies: [ 
			{ name: 'nid' } 
		],
		classes: [
			{ classnames: ['g-recaptcha'], type: 'button' }
		],
		js: function(){
			this.emptyHtml();
			this.addScript('https://www.google.com/recaptcha/api.js');
		}
	});
	
})();
