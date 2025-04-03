(function(){
	
	Cooky.addService('facebook', {
		type: 'social',
		name: 'Facebook',
		uri: 'https://www.facebook.com/policies/cookies/',
		icon: 'facebook',
		classes: [
			{ classnames: ['fb-like'], type: 'button' },
			{ classnames: ['fb-share-button'], type: 'button' },
			{ classnames: ['fb-post'], type: 'button' },
			{ classnames: ['fb-follow'], type: 'button' }, 
			{ classnames: ['fb-activity'], type: 'button' },
			{ classnames: ['fb-send'], type: 'button' },
			{ classnames: ['fb-video'], type: 'button' },
			{ classnames: ['fb-comment'], type: 'box' },
			{ classnames: ['fb-like-box'], type: 'box' },
			{ classnames: ['fb-page'], type: 'box' }
		],
		js: function(){
			this.emptyHtml();
			
			this.addScript('//connect.facebook.net/' + Cooky.lang.getLocale() + '/sdk.js#xfbml=1&version=v3.0', 'facebook-jssdk');
			
			if ( true === Cooky.isAjax ){
				if ( typeof FB !== 'undefined' ){
					FB.XFBML.parse();
				}
			}
		}
	});
	
})();
