(function(){
	
	Cooky.addService('youtube', {
		type: 'video',
		name: 'YouTube',
		uri: 'https://www.google.fr/intl/fr/policies/privacy/',
		icon: 'youtube',
		cookies: [ 
			{ name: 'VISITOR_INFO1_LIVE' }, 
			{ name: 'YSC' },
			{ name: 'PREF' },
			{ name: 'GEUP' }
		],
		classes: [
			{ classnames: ['jizy-player','youtube'], type: 'box' }
		],
		js: function(){
			this.html(function($el, service){
				if ( $el.data("videoId") ){
					var videoUrl = '//www.youtube-nocookie.com/embed/'+$el.data("videoId")+'?';
					
					['rel','controls','showinfo','autoplay'].forEach(function(k, i){
						var v = $el.data(k);
						if ( v !== undefined ){
							videoUrl += (i>0?'&':'')+k+'='+v;
						}
					});
					
					$el.data("frameUrl", videoUrl);
					
					return service.responsiveHtml($el);
				}

				return '';
			});
		}
	});
	
})();
