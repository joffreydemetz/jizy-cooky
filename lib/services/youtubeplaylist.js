(function(){
	
	Cooky.addService('youtubeplaylist', {
		type: 'video',
		name: "YouTube (playlist)",
		uri: "https://www.google.fr/intl/fr/policies/privacy/",
		cookies: [ 
			{ name: 'VISITOR_INFO1_LIVE' }, 
			{ name: 'YSC' },
			{ name: 'PREF' },
			{ name: 'GEUP' }
		],
		classes: [
			{ classnames: ['youtube_playlist_player'], type: 'box' }
		],
		js: function(){
			this.html(function($el, service){
				if ( $el.data("playlistId") ){
					var videoUrl = '//www.youtube-nocookie.com/embed/videoseries?list='+$el.data("playlistID");
					
					['list','rel','controls','showinfo','autoplay'].forEach(function(k){
						var v = $el.data(k);
						if ( v !== undefined ){
							videoUrl += '&'+k+'='+v;
						}
					});
					
					$el.data("frameUrl", videoUrl);
					$el.data("fullscreen", true);
					$el.data("transparency", true);
					return service.responsiveHtml($el);
				}
				
				return '';
			});
		}
	});
		
})();
