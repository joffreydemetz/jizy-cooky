(function(){
	
	Cooky.addService('dailymotion', {
		type: 'video',
		name: 'Dailymotion',
		uri: 'https://www.dailymotion.com/legal/cookiemanagement',
		cookies: [ 
			{ name: 'ts' }, 
			{ name: 'dmvk' }, 
			{ name: 'hist' }, 
			{ name: 'v1st' }, 
			{ name: 's_vi' }
		],
		classes: [
			{ classnames: ['jizy-player','dailymotion'], type: 'box' }
		],
		js: function(){
			this.html(function($el, service){
				if ( $el.data("videoId") ){
					var videoUrl = '//www.dailymotion.com/embed/video/'+$el.data("videoId")+'?';
					
					['showinfo','autoplay'].forEach(function(k){
						var v = $el.data(k);
						if ( k === 'autoplay' ){
							k = 'autoPlay';
						}
						if ( v !== undefined ){
							videoUrl += '&'+k+'='+v;
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
