(function(){
	
	Cooky.addService('twitter', {
		type: 'social',
		name: 'Twitter',
		uri: 'https://support.twitter.com/articles/20170514',
		icon: 'twitter',
		classes: [
			{ classnames: ['twitter-share'], type: 'button' }
		],
		js: function(){
			this.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
			
			this.html(function($el, service){
				var elem = $el.getElement();
				
				for(var i=0, n=service.classes.length; i<n; i++){
					if ( $el.hasAllClasses(service.classes[i].classnames) ){
						if ( service.classes[i].classnames.indexOf('twitter-share') ){
							var html = '<a href="https://twitter.com/share" class="twitter-share-button"';
							for(var key in elem.dataset){
								html += ' data-'+key+'="'+elem.dataset[key]+'"';
							}
							html += '</a>';
							return html;
						}
						
						break;
					}
				}
				
				return '';
			});
		}
	});
	
})();
