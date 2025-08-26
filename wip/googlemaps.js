import Service from '../../Service.js';
import Config from '../../Config.js';

Config.def('service.googlemaps.callback', 'tac_googlemaps_callback');
Config.def('service.googlemaps.libraries', '');
Config.def('service.googlemaps.key', null);

export default class GoogleMapsService extends Service {
	constructor() {
		super('googlemaps', 'Google Maps');

		this.uri = 'http://www.google.com/ads/preferences/';
		this.type = 'api';
		this.mandatory = ['googlemaps.key'];

		this.setClasses([
			{ classnames: ['googlemaps-canvas'], type: 'button' }
		], true);
	}

	js() {
		const uniqIds = [];
		const mapsCb = Config.get('service.googlemaps.callback', 'tac_googlemaps_callback');

		// Add Google Maps libraries if any
		const googleMapsLibraries = Config.get('service.googlemaps.libraries')
			? `&libraries=${Config.get('service.googlemaps.libraries')}`
			: '';

		this.addScript(
			`//maps.googleapis.com/maps/api/js?v=3.exp&key=${Config.get('googlemaps.key')}&callback=${mapsCb}${googleMapsLibraries}`
		);

		window[mapsCb] = () => {
			this.html((el) => {
				const uniqId = `_${Math.random().toString(36).substr(2, 9)}`;
				uniqIds.push(uniqId);

				return `
                    <div id="${uniqId}" 
                         zoom="${el.getAttribute('zoom')}" 
                         latitude="${el.getAttribute('latitude')}" 
                         longitude="${el.getAttribute('longitude')}" 
                         style="width:${el.offsetWidth}px;height:${el.offsetHeight}px">
                    </div>`;
			});

			uniqIds.forEach((uniqId) => {
				const element = document.getElementById(uniqId);
				const mapOptions = {
					zoom: parseInt(element.getAttribute('zoom'), 10),
					center: new google.maps.LatLng(
						parseFloat(element.getAttribute('latitude')),
						parseFloat(element.getAttribute('longitude'))
					)
				};
				new google.maps.Map(element, mapOptions);
			});
		};
	}

	getTranslations() {
		return {
			fr: {
				"googlemaps.details": "Google Maps est un service de cartographie fourni par Google."
			},
			en: {
				"googlemaps.details": "Google Maps is a mapping service provided by Google."
			},
			it: {
				"googlemaps.details": "Google Maps è un servizio di mappatura fornito da Google."
			},
			es: {
				"googlemaps.details": "Google Maps es un servicio de mapas proporcionado por Google."
			}
		};
	}
};
