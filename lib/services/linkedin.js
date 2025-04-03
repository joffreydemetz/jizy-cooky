(function(){
	
	Cooky.addService('linkedin', {
		type: 'social',
		name: 'Linkedin',
		uri: 'https://www.linkedin.com/legal/cookie_policy',
		icon: 'linked-in',
		cookies: [ 
			{ name: 'bcookie' }, 
			{ name: 'lidc' } 
		],
		classes: [
			{ classnames: ['linkedin-share'], type: 'button' },
			{ classnames: ['linkedin-follow-company'], type: 'button' },
			{ classnames: ['linkedin-member-profile'], type: 'box' }
		],
		js: function(){
			this.addScript('//platform.linkedin.com/in.js');
			
			this.html(function($el, service){
				var elem = $el.getElement();
				
				var html = '';
				
				for(var i=0, n=service.classes.length; i<n; i++){
					if ( $el.hasAllClasses(service.classes[i].classnames) ){
						if ( service.classes[i].classnames.indexOf('linkedin-share') ){
							html += '<script type="IN/Share"';
							for(var key in elem.dataset){
								html += ' data-'+key+'="'+elem.dataset[key]+'"';
							}
							html += '></script>';
						}
						else if ( service.classes[i].classnames.indexOf('linkedin-follow-company') ){
							html += '<script type="IN/FollowCompany"';
							for(var key in elem.dataset){
								html += ' data-'+key+'="'+elem.dataset[key]+'"';
							}
							html += '></script>';
						}
						else if ( service.classes[i].classnames.indexOf('linkedin-member-profile') ){
							html += '<script type="IN/MemberProfile"';
							for(var key in elem.dataset){
								html += ' data-'+key+'="'+elem.dataset[key]+'"';
							}
							html += '></script>';
						}
						else {
							return '';
						}
						
						break;
					}
				}
				
				setTimeout(function(){
					if ( typeof IN !== "undefined" ){
						IN.parse();
					}
				}, 1000);
				
				return html;
			});
		}
	});
	
})();
