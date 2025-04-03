(function(){
	
	// Cooky.setConfig('user.mapscallback', 'tac_googlemaps_callback');
	// Cooky.setConfig('user.googlemapsLibraries', '');
	// Cooky.setConfig('user.googlemapsKey', '');
	
	Cooky.addService('googlemaps', {
		type: "api",
		name: "Google Maps",
		uri: "http://www.google.com/ads/preferences/",
		classes: [
			{ classnames: ['googlemaps-canvas'], type: 'button' }
		],
		mandatory: ['googlemapsKey'],
		js: function(){
			var mapOptions,
				map,
				uniqIds = [];
			
			var mapsCb = Cooky.getConfig('user.mapscallback', 'tac_googlemaps_callback');
			
			// Add Google Maps libraries if any (https://developers.google.com/maps/documentation/javascript/libraries)
			var googleMapsLibraries = '';
			if ( Cooky.getConfig('user.googlemapsLibraries') ){
				googleMapsLibraries = '&libraries=' + Cooky.getConfig('user.googlemapsLibraries');
			}

			this.addScript('//maps.googleapis.com/maps/api/js?v=3.exp&key=' + Cooky.getConfig('user.googlemapsKey') + '&callback='+mapsCb + googleMapsLibraries);
			
			window[mapsCb] = function(){
				this.html(function($el, service){
					var elem = $el.getElement();
					var uniqId = '_' + Math.random().toString(36).substr(2, 9);
					uniqIds.push(uniqId);
					return '<div id="' + uniqId + '" zoom="' + elem.getAttribute('zoom') + '" latitude="' + elem.getAttribute('latitude') + '" longitude="' + elem.getAttribute('longitude') + '" style="width:' + elem.offsetWidth + 'px;height:' + elem.offsetHeight + 'px"></div>';
				});

				for(var i=0, n=uniqIds.length; i<n; i++){
					mapOptions = {
						zoom: parseInt(document.getElementById(uniqIds[i]).getAttribute('zoom'), 10),
						center: new google.maps.LatLng(parseFloat(document.getElementById(uniqIds[i]).getAttribute('latitude'), 10), parseFloat(document.getElementById(uniqIds[i]).getAttribute('longitude'), 10))
					};
					map = new google.maps.Map(document.getElementById(uniqIds[i]), mapOptions);
				}
			};
		}
	});
	
})();
