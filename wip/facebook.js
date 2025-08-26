import Service from '../../Service.js';
import Config from '../../Config.js';

export default class FacebookService extends Service {
	constructor() {
		super('facebook', 'Facebook');

		this.uri = 'https://www.facebook.com/policies/cookies/';
		this.icon = 'facebook';
		this.type = 'social';

		this.setClasses([
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
		], true);
	}

	js() {
		this.emptyHtml();

		this.addScript(
			`//connect.facebook.net/${Config.get('locale')}/sdk.js#xfbml=1&version=v3.0`,
			'facebook-jssdk'
		);

		if (typeof FB !== 'undefined') {
			FB.XFBML.parse();
		}
	}

	getTranslations() {
		return {
			fr: {
				"facebook.details": "Facebook est un réseau social permettant de partager des contenus."
			},
			en: {
				"facebook.details": "Facebook is a social network for sharing content."
			},
			it: {
				"facebook.details": "Facebook è un social network per condividere contenuti."
			},
			es: {
				"facebook.details": "Facebook es una red social para compartir contenido."
			}
		}
	}
};