(function(){
	
	Cooky.addService('vimeo', {
		type: 'video',
		name: 'Vimeo',
		uri: 'http://vimeo.com/privacy',
		icon: 'vimeo',
		cookies: [ 
			{ name: '__utmt_player' }, 
			{ name: '__utma' },
			{ name: '__utmb' },
			{ name: '__utmc' },
			{ name: '__utmv' },
			{ name: 'vuid' },
			{ name: '__utmz' },
			{ name: 'player' } 
		],
		classes: [
			{ classnames: ['jizy-player','vimeo'], type: 'box' }
		],
		js: function(){
			this.html(function($el, service){
				if ( $el.data("videoId") ){
					$el.data("frameUrl", '//player.vimeo.com/video/'+$el.data("videoId"));
					return service.responsiveHtml($el);
				}
				
				return '';
			});
		}
	});
	
})();
