import Service from '../../Service.js';

export default class YoutubeSubscribe extends Service {
	constructor() {
		super('youtubesubscribe', 'YouTube');

		this.uri = 'https://www.google.fr/intl/fr/policies/privacy/';
		this.icon = 'youtube';
		this.type = 'social';
		this.mandatory = ['youtube.channel'];

		this.setClasses([
			{ classnames: ['g-ytsubscribe'], type: 'button' }
		], true);

		this.setCookies([
			{ name: 'VISITOR_INFO1_LIVE', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'YSC', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'PREF', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'GEUP', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			// { name: 'HSID' },
			// { name: 'LOGIN_INFO' },
			// { name: 'SID' },
			// { name: 'SSID' },
			// { name: 'APISID' },
			// { name: 'PREF' }
		], true);
	}

	js() {
		// Clear existing HTML and load the YouTube subscription script
		this.emptyHtml();
		this.addScript('https://apis.google.com/js/platform.js');
	}
};

