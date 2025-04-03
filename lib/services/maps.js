(function(){
	
	Cooky.addService('maps', {
		type: 'api',
		name: 'Maps',
		uri: 'http://www.google.com/ads/preferences/',
		icon: 'youtube',
		// cookies: [ 
			// { name: 'nid' }
		// ],
		classes: [
			{ classnames: ['jizy-maps'], type: 'box' }
		],
		js: function(){
			this.html(function($el, service){
				if ( $el.data("pb") ){
					var mapUrl = 'https://www.google.com/maps/embed?pb='+$el.data("pb");
					$el.data("frameUrl", mapUrl);
					return service.responsiveHtml($el);
				}
				
				return '';
			});
		}
	});
	
})();